/**
 * Head Set Go — XState v5 machine.
 * States: setup → getReady → playing → paused → roundEnd → results
 */
import { setup, assign, fromCallback } from "xstate";
import type { GameCard } from "./index.js";

// ─── Context & Events ────────────────────────────────────────────────────────

export interface HsgContext {
  deck: GameCard[];
  shuffledOrder: number[];
  currentIndex: number;
  correctIds: string[];
  passedIds: string[];
  secondsLeft: number;
  duration: number;
  recentlyPlayed: string[];
  countdown: number;
}

export type HsgEvent =
  | { type: "START" }
  | { type: "CORRECT" }
  | { type: "PASS" }
  | { type: "TIME_UP" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "PLAY_AGAIN" }
  | { type: "CHANGE_DECK" }
  | { type: "TICK" }
  | { type: "COUNTDOWN_TICK" };

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RECENT_KEY = "tfi.hsg.recentlyPlayed";

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[]; }
  catch { return []; }
}

function saveRecent(ids: string[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(ids)); }
  catch { /* quota */ }
}

function shuffleDeck(deck: GameCard[], recent: string[]): number[] {
  const indices = deck.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // non-null assertion: indices is always populated
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }
  const fresh = indices.filter((i) => !recent.includes(deck[i]!.id));
  const stale = indices.filter((i) => recent.includes(deck[i]!.id));
  return [...fresh, ...stale];
}

// ─── Machine ─────────────────────────────────────────────────────────────────

export const hsgMachine = setup({
  types: {
    context: {} as HsgContext,
    events: {} as HsgEvent,
    input: {} as { deck?: GameCard[]; duration?: number },
  },
  actors: {
    /** Fires TICK every second while playing. */
    timer: fromCallback(({ sendBack }) => {
      const id = setInterval(() => sendBack({ type: "TICK" }), 1000);
      return () => clearInterval(id);
    }),
    /** Fires COUNTDOWN_TICK every second during getReady. */
    countdown: fromCallback(({ sendBack }) => {
      const id = setInterval(() => sendBack({ type: "COUNTDOWN_TICK" }), 1000);
      return () => clearInterval(id);
    }),
  },
  guards: {
    roundOver: ({ context }) =>
      context.secondsLeft <= 0 || context.currentIndex >= context.shuffledOrder.length,
    countdownDone: ({ context }) => context.countdown <= 1,
    deckExhausted: ({ context }) => context.currentIndex + 1 >= context.shuffledOrder.length,
  },
  actions: {
    shuffleCards: assign(({ context }) => ({
      shuffledOrder: shuffleDeck(context.deck, context.recentlyPlayed),
      currentIndex: 0,
    })),
    scoreCorrect: assign(({ context }) => {
      const card = context.deck[context.shuffledOrder[context.currentIndex]!];
      return {
        correctIds: card ? [...context.correctIds, card.id] : context.correctIds,
        currentIndex: context.currentIndex + 1,
      };
    }),
    scorePass: assign(({ context }) => {
      const card = context.deck[context.shuffledOrder[context.currentIndex]!];
      return {
        passedIds: card ? [...context.passedIds, card.id] : context.passedIds,
        currentIndex: context.currentIndex + 1,
      };
    }),
    tick: assign(({ context }) => ({
      secondsLeft: Math.max(0, context.secondsLeft - 1),
    })),
    countdownTick: assign(({ context }) => ({
      countdown: context.countdown - 1,
    })),
    resetCountdown: assign({ countdown: 3 }),
    resetRound: assign(({ context }) => ({
      correctIds: [] as string[],
      passedIds: [] as string[],
      secondsLeft: context.duration,
      currentIndex: 0,
    })),
    persistRecent: ({ context }) => {
      saveRecent([...context.correctIds, ...context.passedIds].slice(0, 20));
    },
  },
}).createMachine({
  id: "head-set-go",
  initial: "setup",
  context: ({ input }) => ({
    deck: input?.deck ?? [],
    shuffledOrder: [],
    currentIndex: 0,
    correctIds: [],
    passedIds: [],
    secondsLeft: input?.duration ?? 60,
    duration: input?.duration ?? 60,
    recentlyPlayed: loadRecent(),
    countdown: 3,
  }),

  states: {
    setup: {
      on: {
        START: {
          target: "getReady",
          actions: ["shuffleCards", "resetRound", "resetCountdown"],
        },
      },
    },

    getReady: {
      invoke: { src: "countdown", id: "getReadyTimer" },
      on: {
        COUNTDOWN_TICK: [
          { guard: "countdownDone", target: "playing" },
          { actions: "countdownTick" },
        ],
        PAUSE: "paused",
      },
    },

    playing: {
      invoke: { src: "timer", id: "roundTimer" },
      on: {
        TICK: [
          { guard: "roundOver", target: "roundEnd", actions: ["tick", "persistRecent"] },
          { actions: "tick" },
        ],
        CORRECT: [
          { guard: "deckExhausted", target: "roundEnd", actions: ["scoreCorrect", "persistRecent"] },
          { actions: "scoreCorrect" },
        ],
        PASS: [
          { guard: "deckExhausted", target: "roundEnd", actions: ["scorePass", "persistRecent"] },
          { actions: "scorePass" },
        ],
        TIME_UP: { target: "roundEnd", actions: "persistRecent" },
        PAUSE: "paused",
      },
    },

    paused: {
      on: {
        RESUME: { target: "getReady", actions: "resetCountdown" },
        CHANGE_DECK: "setup",
      },
    },

    roundEnd: {
      // Auto-advance to results after a brief moment
      after: { 300: "results" },
    },

    results: {
      on: {
        PLAY_AGAIN: {
          target: "getReady",
          actions: ["resetRound", "shuffleCards", "resetCountdown"],
        },
        CHANGE_DECK: "setup",
      },
    },
  },
});

export type HsgMachine = typeof hsgMachine;
