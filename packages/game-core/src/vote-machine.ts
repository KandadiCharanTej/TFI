/**
 * Vote Template — XState v5 Machine.
 * Used for: Most Likely (movie edition).
 * Flow: setup → privacy → voting (self-vote blocked) → ... → reveal → (privacy or results)
 */
import { setup, assign } from "xstate";
import type { GameCard } from "./index.js";

export interface VotePlayer {
  id: string;
  name: string;
}

export interface PromptResult {
  card: GameCard;
  counts: Record<string, number>;
  winnerIds: string[];
  topVotes: number;
  isTie: boolean;
}

export interface CrownSummary {
  player: VotePlayer;
  crowns: number;
  totalVotes: number;
}

export interface VoteContext {
  gameId: string;
  players: VotePlayer[];
  totalPrompts: number;
  deck: GameCard[];
  recentIds: string[];
  selectedPrompts: GameCard[];
  currentPromptIndex: number;
  currentVoterIndex: number;
  votesForPrompt: Record<string, string>;
  promptResults: PromptResult[];
}

export type VoteEvent =
  | { type: "START" }
  | { type: "READY_TO_VOTE" }
  | { type: "CAST_VOTE"; targetId: string }
  | { type: "NEXT_PROMPT" }
  | { type: "PLAY_AGAIN" };

const VOTE_RECENT_KEY = "tfi.vote.recent";
const memoryStorage: Record<string, string> = {};

export function loadVoteRecent(): string[] {
  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(VOTE_RECENT_KEY)
        : memoryStorage[VOTE_RECENT_KEY];
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveVoteRecent(ids: string[]): void {
  try {
    const value = JSON.stringify(ids.slice(-100));
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(VOTE_RECENT_KEY, value);
    } else {
      memoryStorage[VOTE_RECENT_KEY] = value;
    }
  } catch {
    /* ignore storage quota */
  }
}

export function pickSessionPrompts(
  deck: GameCard[],
  count: number,
  recentIds: string[],
): GameCard[] {
  const recentSet = new Set(recentIds);
  const shuffle = (arr: GameCard[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j]!, copy[i]!];
    }
    return copy;
  };
  const fresh = shuffle(deck.filter((c) => !recentSet.has(c.id)));
  const stale = shuffle(deck.filter((c) => recentSet.has(c.id)));
  return [...fresh, ...stale].slice(0, Math.min(count, deck.length));
}

export function tallyPromptVotes(
  card: GameCard,
  players: VotePlayer[],
  votes: Record<string, string>,
): PromptResult {
  const counts: Record<string, number> = {};
  for (const p of players) counts[p.id] = 0;
  for (const targetId of Object.values(votes)) {
    if (targetId in counts) {
      counts[targetId] = (counts[targetId] ?? 0) + 1;
    }
  }
  const maxVotes = Math.max(0, ...Object.values(counts));
  const winnerIds = players.filter((p) => (counts[p.id] ?? 0) === maxVotes).map((p) => p.id);
  return {
    card,
    counts,
    winnerIds,
    topVotes: maxVotes,
    isTie: winnerIds.length > 1,
  };
}

export function computeCrownTitles(
  players: VotePlayer[],
  promptResults: PromptResult[],
): CrownSummary[] {
  return players.map((player) => {
    const crowns = promptResults.filter((r) => r.winnerIds.includes(player.id)).length;
    const totalVotes = promptResults.reduce((acc, r) => acc + (r.counts[player.id] ?? 0), 0);
    return { player, crowns, totalVotes };
  });
}

export function getMostCrownedWinners(summaries: CrownSummary[]): CrownSummary[] {
  if (summaries.length === 0) return [];
  const maxCrowns = Math.max(...summaries.map((s) => s.crowns));
  return summaries.filter((s) => s.crowns === maxCrowns);
}

export const voteMachine = setup({
  types: {
    context: {} as VoteContext,
    events: {} as VoteEvent,
    input: {} as {
      gameId?: string;
      players: VotePlayer[];
      totalPrompts: number;
      deck: GameCard[];
      recentlyPlayed?: string[];
    },
  },
  guards: {
    canVoteForTarget: ({ context, event }) => {
      if (event.type !== "CAST_VOTE") return false;
      const voter = context.players[context.currentVoterIndex];
      if (!voter) return false;
      if (event.targetId === voter.id) return false;
      return context.players.some((p) => p.id === event.targetId);
    },
    hasMoreVoters: ({ context }) => context.currentVoterIndex + 1 < context.players.length,
    hasMorePrompts: ({ context }) => context.currentPromptIndex + 1 < context.selectedPrompts.length,
  },
  actions: {
    recordVoteAndAdvanceVoter: assign(({ context, event }) => {
      if (event.type !== "CAST_VOTE") return {};
      const voter = context.players[context.currentVoterIndex];
      if (!voter) return {};
      return {
        votesForPrompt: { ...context.votesForPrompt, [voter.id]: event.targetId },
        currentVoterIndex: context.currentVoterIndex + 1,
      };
    }),
    recordLastVoteAndTally: assign(({ context, event }) => {
      if (event.type !== "CAST_VOTE") return {};
      const voter = context.players[context.currentVoterIndex];
      if (!voter) return {};
      const nextVotes = { ...context.votesForPrompt, [voter.id]: event.targetId };
      const card = context.selectedPrompts[context.currentPromptIndex];
      if (!card) return { votesForPrompt: nextVotes };
      const result = tallyPromptVotes(card, context.players, nextVotes);
      saveVoteRecent([...context.recentIds, card.id]);
      return {
        votesForPrompt: nextVotes,
        promptResults: [...context.promptResults, result],
      };
    }),
    advancePrompt: assign(({ context }) => ({
      currentPromptIndex: context.currentPromptIndex + 1,
      currentVoterIndex: 0,
      votesForPrompt: {},
    })),
    resetGame: assign(({ context }) => {
      const recentIds = loadVoteRecent();
      const selectedPrompts = pickSessionPrompts(context.deck, context.totalPrompts, recentIds);
      return {
        recentIds,
        selectedPrompts,
        currentPromptIndex: 0,
        currentVoterIndex: 0,
        votesForPrompt: {},
        promptResults: [],
      };
    }),
  },
}).createMachine({
  id: "vote",
  initial: "setup",
  context: ({ input }) => {
    const players =
      input.players.length >= 3
        ? input.players
        : [
            { id: "p1", name: "Player 1" },
            { id: "p2", name: "Player 2" },
            { id: "p3", name: "Player 3" },
          ];
    const recentIds = input.recentlyPlayed ?? loadVoteRecent();
    const selectedPrompts = pickSessionPrompts(input.deck, input.totalPrompts, recentIds);
    return {
      gameId: input.gameId ?? "most-likely",
      players,
      totalPrompts: input.totalPrompts,
      deck: input.deck,
      recentIds,
      selectedPrompts,
      currentPromptIndex: 0,
      currentVoterIndex: 0,
      votesForPrompt: {},
      promptResults: [],
    };
  },
  states: {
    setup: {
      on: {
        START: "privacy",
      },
    },
    privacy: {
      on: {
        READY_TO_VOTE: "voting",
      },
    },
    voting: {
      on: {
        CAST_VOTE: [
          {
            guard: ({ context, event }) => {
              const voter = context.players[context.currentVoterIndex];
              if (!voter || event.targetId === voter.id) return false;
              if (!context.players.some((p) => p.id === event.targetId)) return false;
              return context.currentVoterIndex + 1 < context.players.length;
            },
            target: "privacy",
            actions: "recordVoteAndAdvanceVoter",
          },
          {
            guard: "canVoteForTarget",
            target: "reveal",
            actions: "recordLastVoteAndTally",
          },
        ],
      },
    },
    reveal: {
      on: {
        NEXT_PROMPT: [
          {
            guard: "hasMorePrompts",
            target: "privacy",
            actions: "advancePrompt",
          },
          {
            target: "results",
          },
        ],
      },
    },
    results: {
      on: {
        PLAY_AGAIN: {
          target: "setup",
          actions: "resetGame",
        },
      },
    },
  },
});
