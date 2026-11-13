/**
 * Charades Template — XState v5 Machine.
 * Used for: Dumb Charades.
 * Flow: setup → passingPhone (shutter hold + 1 skip) → acting → turnEnd → (passingPhone or results)
 */
import { setup, assign, fromCallback } from "xstate";
import type { GameCard } from "./index.js";

export type DifficultyMix = "easy" | "medium" | "hard" | "mixed";

export interface CharadesTeam {
  id: string;
  name: string;
}

export interface CharadesTurnSummary {
  teamId: string;
  teamName: string;
  turnNumber: number;
  cardId: string;
  cardEn: string;
  cardTe: string;
  difficulty: 1 | 2 | 3;
  guessed: boolean;
  points: number;
  skippedBeforeActing: boolean;
}

export interface CharadesTeamScore {
  team: CharadesTeam;
  score: number;
  guessedCount: number;
}

export interface CharadesContext {
  gameId: string;
  teams: CharadesTeam[];
  roundsPerTeam: number;
  duration: number;
  difficultyMix: DifficultyMix;
  currentTeamIndex: number;
  currentTurn: number;
  totalTurns: number;
  deck: GameCard[];
  recentIds: string[];
  usedCardIds: string[];
  currentCard: GameCard | null;
  skipUsedInTurn: boolean;
  secondsLeft: number;
  turnSummaries: CharadesTurnSummary[];
}

export type CharadesEvent =
  | { type: "START" }
  | { type: "SKIP_FILM" }
  | { type: "START_ACTING" }
  | { type: "GOT_IT" }
  | { type: "TIME_UP" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NEXT_TURN" }
  | { type: "PLAY_AGAIN" }
  | { type: "TICK" };

const CHARADES_RECENT_KEY = "tfi.charades.recent";
const memoryStorage: Record<string, string> = {};

export function loadCharadesRecent(): string[] {
  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(CHARADES_RECENT_KEY)
        : memoryStorage[CHARADES_RECENT_KEY];
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveCharadesRecent(ids: string[]): void {
  try {
    const value = JSON.stringify(ids.slice(-120));
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(CHARADES_RECENT_KEY, value);
    } else {
      memoryStorage[CHARADES_RECENT_KEY] = value;
    }
  } catch {
    /* ignore storage quota */
  }
}

export function pointsForDifficulty(difficulty: 1 | 2 | 3): number {
  return difficulty;
}

function targetDifficultyFromMix(mix: DifficultyMix): 1 | 2 | 3 | null {
  if (mix === "easy") return 1;
  if (mix === "medium") return 2;
  if (mix === "hard") return 3;
  return null;
}

export function pickNextCharadesCard(
  deck: GameCard[],
  usedCardIds: string[],
  recentIds: string[],
  mix: DifficultyMix,
  exactDifficulty?: 1 | 2 | 3,
): GameCard | null {
  if (deck.length === 0) return null;
  const usedSet = new Set(usedCardIds);
  const recentSet = new Set(recentIds);
  const wantedDiff = exactDifficulty ?? targetDifficultyFromMix(mix);

  const unused = deck.filter((c) => !usedSet.has(c.id));
  const pool = unused.length > 0 ? unused : deck;

  const matchingDiff = wantedDiff ? pool.filter((c) => c.difficulty === wantedDiff) : pool;
  const candidates = matchingDiff.length > 0 ? matchingDiff : pool;

  const fresh = candidates.filter((c) => !recentSet.has(c.id));
  const finalPool = fresh.length > 0 ? fresh : candidates;

  const idx = Math.floor(Math.random() * finalPool.length);
  return finalPool[idx] ?? null;
}

export function computeCharadesScores(context: CharadesContext): CharadesTeamScore[] {
  return context.teams.map((team) => {
    const teamSummaries = context.turnSummaries.filter((s) => s.teamId === team.id);
    const score = teamSummaries.reduce((acc, cur) => acc + cur.points, 0);
    const guessedCount = teamSummaries.filter((s) => s.guessed).length;
    return { team, score, guessedCount };
  });
}

export function getCharadesWinners(scores: CharadesTeamScore[]): CharadesTeamScore[] {
  if (scores.length === 0) return [];
  const maxScore = Math.max(...scores.map((s) => s.score));
  return scores.filter((s) => s.score === maxScore);
}

export const charadesMachine = setup({
  types: {
    context: {} as CharadesContext,
    events: {} as CharadesEvent,
    input: {} as {
      gameId?: string;
      teams: CharadesTeam[];
      roundsPerTeam: number;
      duration: number;
      difficultyMix: DifficultyMix;
      deck: GameCard[];
      recentlyPlayed?: string[];
    },
  },
  actors: {
    ticker: fromCallback(({ sendBack }) => {
      const id = setInterval(() => sendBack({ type: "TICK" }), 1000);
      return () => clearInterval(id);
    }),
  },
  guards: {
    canSkipFilm: ({ context }) => !context.skipUsedInTurn && context.currentCard !== null,
    isTimeUp: ({ context }) => context.secondsLeft <= 0,
    hasMoreTurns: ({ context }) => context.currentTurn < context.totalTurns,
  },
  actions: {
    pickInitialTurnCard: assign(({ context }) => {
      const card = pickNextCharadesCard(
        context.deck,
        context.usedCardIds,
        context.recentIds,
        context.difficultyMix,
      );
      return {
        currentCard: card,
        usedCardIds: card ? [...context.usedCardIds, card.id] : context.usedCardIds,
        skipUsedInTurn: false,
        secondsLeft: context.duration,
      };
    }),
    skipCurrentFilm: assign(({ context }) => {
      const sameDiff = context.currentCard?.difficulty;
      const nextCard = pickNextCharadesCard(
        context.deck,
        context.usedCardIds,
        context.recentIds,
        context.difficultyMix,
        sameDiff,
      );
      return {
        currentCard: nextCard,
        usedCardIds: nextCard ? [...context.usedCardIds, nextCard.id] : context.usedCardIds,
        skipUsedInTurn: true,
      };
    }),
    resetTimer: assign({
      secondsLeft: ({ context }) => context.duration,
    }),
    decrementTimer: assign({
      secondsLeft: ({ context }) => Math.max(0, context.secondsLeft - 1),
    }),
    recordGuessed: assign({
      turnSummaries: ({ context }) => {
        const team = context.teams[context.currentTeamIndex] ?? {
          id: `t${context.currentTeamIndex}`,
          name: `Team ${context.currentTeamIndex + 1}`,
        };
        const diff = context.currentCard?.difficulty ?? 1;
        const summary: CharadesTurnSummary = {
          teamId: team.id,
          teamName: team.name,
          turnNumber: context.currentTurn,
          cardId: context.currentCard?.id ?? "",
          cardEn: context.currentCard?.en ?? "",
          cardTe: context.currentCard?.te ?? "",
          difficulty: diff,
          guessed: true,
          points: pointsForDifficulty(diff),
          skippedBeforeActing: context.skipUsedInTurn,
        };
        return [...context.turnSummaries, summary];
      },
    }),
    recordMissed: assign({
      turnSummaries: ({ context }) => {
        const team = context.teams[context.currentTeamIndex] ?? {
          id: `t${context.currentTeamIndex}`,
          name: `Team ${context.currentTeamIndex + 1}`,
        };
        const diff = context.currentCard?.difficulty ?? 1;
        const summary: CharadesTurnSummary = {
          teamId: team.id,
          teamName: team.name,
          turnNumber: context.currentTurn,
          cardId: context.currentCard?.id ?? "",
          cardEn: context.currentCard?.en ?? "",
          cardTe: context.currentCard?.te ?? "",
          difficulty: diff,
          guessed: false,
          points: 0,
          skippedBeforeActing: context.skipUsedInTurn,
        };
        return [...context.turnSummaries, summary];
      },
    }),
    persistRecent: ({ context }) => {
      const merged = [...context.recentIds, ...context.usedCardIds];
      saveCharadesRecent(merged);
    },
    advanceTurn: assign(({ context }) => {
      const nextTeamIdx = (context.currentTeamIndex + 1) % Math.max(1, context.teams.length);
      const nextCard = pickNextCharadesCard(
        context.deck,
        context.usedCardIds,
        context.recentIds,
        context.difficultyMix,
      );
      return {
        currentTurn: context.currentTurn + 1,
        currentTeamIndex: nextTeamIdx,
        currentCard: nextCard,
        usedCardIds: nextCard ? [...context.usedCardIds, nextCard.id] : context.usedCardIds,
        skipUsedInTurn: false,
        secondsLeft: context.duration,
      };
    }),
    resetGame: assign(({ context }) => {
      const recentIds = loadCharadesRecent();
      return {
        currentTeamIndex: 0,
        currentTurn: 1,
        recentIds,
        usedCardIds: [],
        currentCard: null,
        skipUsedInTurn: false,
        secondsLeft: context.duration,
        turnSummaries: [],
      };
    }),
  },
}).createMachine({
  id: "charades",
  initial: "setup",
  context: ({ input }) => {
    const teams =
      input.teams.length >= 2
        ? input.teams
        : [
            { id: "t1", name: "Team 1" },
            { id: "t2", name: "Team 2" },
          ];
    const recentIds = input.recentlyPlayed ?? loadCharadesRecent();
    return {
      gameId: input.gameId ?? "dumb-charades",
      teams,
      roundsPerTeam: input.roundsPerTeam,
      duration: input.duration,
      difficultyMix: input.difficultyMix,
      currentTeamIndex: 0,
      currentTurn: 1,
      totalTurns: teams.length * input.roundsPerTeam,
      deck: input.deck,
      recentIds,
      usedCardIds: [],
      currentCard: null,
      skipUsedInTurn: false,
      secondsLeft: input.duration,
      turnSummaries: [],
    };
  },
  states: {
    setup: {
      on: {
        START: {
          target: "passingPhone",
          actions: "pickInitialTurnCard",
        },
      },
    },
    passingPhone: {
      on: {
        SKIP_FILM: {
          guard: "canSkipFilm",
          actions: "skipCurrentFilm",
        },
        START_ACTING: {
          target: "acting",
          actions: "resetTimer",
        },
      },
    },
    acting: {
      invoke: {
        src: "ticker",
      },
      on: {
        GOT_IT: {
          target: "turnEnd",
          actions: ["recordGuessed", "persistRecent"],
        },
        TICK: [
          {
            guard: "isTimeUp",
            target: "turnEnd",
            actions: ["recordMissed", "persistRecent"],
          },
          {
            actions: "decrementTimer",
          },
        ],
        TIME_UP: {
          target: "turnEnd",
          actions: ["recordMissed", "persistRecent"],
        },
        PAUSE: "paused",
      },
    },
    paused: {
      on: {
        RESUME: "acting",
      },
    },
    turnEnd: {
      on: {
        NEXT_TURN: [
          {
            guard: "hasMoreTurns",
            target: "passingPhone",
            actions: "advanceTurn",
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
