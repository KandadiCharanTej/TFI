/**
 * Generic Judge Template — XState v5 Machine.
 * Used for: Transify, Emoji Cinema, Rapid Fire, Cricket IQ.
 * Flow: setup → getReady → turn → turnEnd → (passingPhone → getReady or results)
 */
import { setup, assign, fromCallback } from "xstate";
import type { GameCard } from "./index.js";

export interface JudgePlayer {
  id: string;
  name: string;
}

export interface PlayerScore {
  player: JudgePlayer;
  correct: number;
  skipped: number;
  score: number;
}

export interface JudgeTurnSummary {
  playerId: string;
  playerName: string;
  turnNumber: number;
  correct: number;
  skipped: number;
}

export interface JudgeContext {
  gameId: string;
  players: JudgePlayer[];
  currentPlayerIndex: number;
  currentTurn: number;
  totalTurns: number;
  deck: GameCard[];
  shuffledOrder: number[];
  currentCardIndex: number;
  usedCardIds: string[];
  currentTurnCorrect: number;
  currentTurnSkipped: number;
  secondsLeft: number;
  duration: number;
  countdown: number;
  turnSummaries: JudgeTurnSummary[];
}

export type JudgeEvent =
  | { type: "START" }
  | { type: "CORRECT" }
  | { type: "SKIP" }
  | { type: "TIME_UP" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NEXT_TURN" }
  | { type: "PHONE_PASSED" }
  | { type: "PLAY_AGAIN" }
  | { type: "TICK" }
  | { type: "COUNTDOWN_TICK" };

const memoryStorage: Record<string, string> = {};

export function loadJudgeRecent(gameId: string): string[] {
  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(`tfi.judge.${gameId}.recent`)
        : memoryStorage[`tfi.judge.${gameId}.recent`];
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveJudgeRecent(gameId: string, ids: string[]): void {
  try {
    const value = JSON.stringify(ids.slice(-100));
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(`tfi.judge.${gameId}.recent`, value);
    } else {
      memoryStorage[`tfi.judge.${gameId}.recent`] = value;
    }
  } catch {
    /* ignore storage quota */
  }
}

export function shuffleDeckCards(deck: GameCard[], recent: string[]): number[] {
  const indices = deck.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }
  const fresh = indices.filter((i) => !recent.includes(deck[i]!.id));
  const stale = indices.filter((i) => recent.includes(deck[i]!.id));
  return [...fresh, ...stale];
}

export function computeJudgeScores(context: JudgeContext): PlayerScore[] {
  return context.players.map((player) => {
    const playerSummaries = context.turnSummaries.filter((s) => s.playerId === player.id);
    const correct = playerSummaries.reduce((acc, cur) => acc + cur.correct, 0);
    const skipped = playerSummaries.reduce((acc, cur) => acc + cur.skipped, 0);
    return {
      player,
      correct,
      skipped,
      score: correct, // 1 point per correct in beta
    };
  });
}

export function getJudgeWinners(scores: PlayerScore[]): PlayerScore[] {
  if (scores.length === 0) return [];
  const maxScore = Math.max(...scores.map((s) => s.score));
  return scores.filter((s) => s.score === maxScore);
}

export const judgeMachine = setup({
  types: {
    context: {} as JudgeContext,
    events: {} as JudgeEvent,
    input: {} as {
      gameId: string;
      players: JudgePlayer[];
      deck: GameCard[];
      duration: number;
      totalRounds?: number;
      recentlyPlayed?: string[];
    },
  },
  actors: {
    ticker: fromCallback(({ sendBack }) => {
      const id = setInterval(() => sendBack({ type: "TICK" }), 1000);
      return () => clearInterval(id);
    }),
    countdownTicker: fromCallback(({ sendBack }) => {
      const id = setInterval(() => sendBack({ type: "COUNTDOWN_TICK" }), 1000);
      return () => clearInterval(id);
    }),
  },
  guards: {
    isTimeUp: ({ context }) => context.secondsLeft <= 0,
    isCountdownDone: ({ context }) => context.countdown <= 1,
    hasMoreTurns: ({ context }) => context.currentTurn < context.totalTurns,
  },
  actions: {
    recordCorrect: assign({
      currentTurnCorrect: ({ context }) => context.currentTurnCorrect + 1,
      usedCardIds: ({ context }) => {
        const cardIndex = context.shuffledOrder[context.currentCardIndex];
        const card = cardIndex !== undefined ? context.deck[cardIndex] : undefined;
        return card ? [...context.usedCardIds, card.id] : context.usedCardIds;
      },
      currentCardIndex: ({ context }) => (context.currentCardIndex + 1) % Math.max(1, context.shuffledOrder.length),
    }),
    recordSkip: assign({
      currentTurnSkipped: ({ context }) => context.currentTurnSkipped + 1,
      usedCardIds: ({ context }) => {
        const cardIndex = context.shuffledOrder[context.currentCardIndex];
        const card = cardIndex !== undefined ? context.deck[cardIndex] : undefined;
        return card ? [...context.usedCardIds, card.id] : context.usedCardIds;
      },
      currentCardIndex: ({ context }) => (context.currentCardIndex + 1) % Math.max(1, context.shuffledOrder.length),
    }),
    decrementTimer: assign({
      secondsLeft: ({ context }) => Math.max(0, context.secondsLeft - 1),
    }),
    decrementCountdown: assign({
      countdown: ({ context }) => Math.max(0, context.countdown - 1),
    }),
    resetForTurn: assign({
      countdown: 3,
      secondsLeft: ({ context }) => context.duration,
      currentTurnCorrect: 0,
      currentTurnSkipped: 0,
    }),
    saveTurnSummary: assign({
      turnSummaries: ({ context }) => {
        const player = context.players[context.currentPlayerIndex] ?? {
          id: `p${context.currentPlayerIndex}`,
          name: `Player ${context.currentPlayerIndex + 1}`,
        };
        const summary: JudgeTurnSummary = {
          playerId: player.id,
          playerName: player.name,
          turnNumber: context.currentTurn,
          correct: context.currentTurnCorrect,
          skipped: context.currentTurnSkipped,
        };
        return [...context.turnSummaries, summary];
      },
    }),
    advanceToNextPlayer: assign({
      currentTurn: ({ context }) => context.currentTurn + 1,
      currentPlayerIndex: ({ context }) =>
        (context.currentPlayerIndex + 1) % Math.max(1, context.players.length),
    }),
    saveRecentCards: ({ context }) => {
      saveJudgeRecent(context.gameId, context.usedCardIds);
    },
    resetForNewGame: assign(({ context }) => {
      const recent = loadJudgeRecent(context.gameId);
      const shuffled = shuffleDeckCards(context.deck, recent);
      return {
        currentPlayerIndex: 0,
        currentTurn: 1,
        shuffledOrder: shuffled,
        currentCardIndex: 0,
        usedCardIds: [],
        currentTurnCorrect: 0,
        currentTurnSkipped: 0,
        secondsLeft: context.duration,
        countdown: 3,
        turnSummaries: [],
      };
    }),
  },
}).createMachine({
  id: "judge",
  initial: "setup",
  context: ({ input }) => {
    const recent = input.recentlyPlayed ?? loadJudgeRecent(input.gameId);
    const shuffled = shuffleDeckCards(input.deck, recent);
    const totalRounds = input.totalRounds ?? 1;
    return {
      gameId: input.gameId,
      players: input.players.length > 0 ? input.players : [{ id: "p1", name: "Player 1" }],
      currentPlayerIndex: 0,
      currentTurn: 1,
      totalTurns: Math.max(1, input.players.length * totalRounds),
      deck: input.deck,
      shuffledOrder: shuffled,
      currentCardIndex: 0,
      usedCardIds: [],
      currentTurnCorrect: 0,
      currentTurnSkipped: 0,
      secondsLeft: input.duration,
      duration: input.duration,
      countdown: 3,
      turnSummaries: [],
    };
  },
  states: {
    setup: {
      on: {
        START: "getReady",
      },
    },
    getReady: {
      entry: "resetForTurn",
      invoke: {
        src: "countdownTicker",
      },
      on: {
        COUNTDOWN_TICK: [
          {
            guard: "isCountdownDone",
            target: "turn",
          },
          {
            actions: "decrementCountdown",
          },
        ],
      },
    },
    turn: {
      invoke: {
        src: "ticker",
      },
      on: {
        CORRECT: {
          actions: "recordCorrect",
        },
        SKIP: {
          actions: "recordSkip",
        },
        TICK: [
          {
            guard: "isTimeUp",
            target: "turnEnd",
            actions: ["saveTurnSummary", "saveRecentCards"],
          },
          {
            actions: "decrementTimer",
          },
        ],
        TIME_UP: {
          target: "turnEnd",
          actions: ["saveTurnSummary", "saveRecentCards"],
        },
        PAUSE: "paused",
      },
    },
    paused: {
      on: {
        RESUME: "turn",
      },
    },
    turnEnd: {
      on: {
        NEXT_TURN: [
          {
            guard: "hasMoreTurns",
            target: "passingPhone",
            actions: "advanceToNextPlayer",
          },
          {
            target: "results",
          },
        ],
      },
    },
    passingPhone: {
      on: {
        PHONE_PASSED: "getReady",
      },
    },
    results: {
      on: {
        PLAY_AGAIN: {
          target: "setup",
          actions: "resetForNewGame",
        },
      },
    },
  },
});
