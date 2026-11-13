import { describe, it, expect, beforeEach } from "vitest";
import { createActor } from "xstate";
import { hsgMachine } from "./hsg-machine.js";
import {
  judgeMachine,
  computeJudgeScores,
  getJudgeWinners,
  loadJudgeRecent,
  saveJudgeRecent,
  shuffleDeckCards,
} from "./judge-machine.js";
import {
  GAME_REGISTRY,
  getGameById,
  getGamesByStatus,
  getGamesByCategory,
  getGameRoute,
} from "./registry.js";
import { isValidRoomCode } from "./index.js";
import type { GameCard } from "./index.js";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeCard(id: string, difficulty: 1 | 2 | 3 = 1): GameCard {
  return {
    id,
    game: "head-set-go",
    deck: "movies",
    en: id,
    te: `తె-${id}`,
    difficulty,
    tags: [],
    verified: false,
  };
}

const DECK_5 = [1, 2, 3, 4, 5].map((n) => makeCard(`card-${n}`));
const DECK_2 = [1, 2].map((n) => makeCard(`card-${n}`));

function startActor(deck = DECK_5, duration = 60) {
  const actor = createActor(hsgMachine, { input: { deck, duration } });
  actor.start();
  return actor;
}

// ─── Room Code Tests ──────────────────────────────────────────────────────────

describe("isValidRoomCode", () => {
  it("validates 4-character allowed codes", () => {
    expect(isValidRoomCode("ABCD")).toBe(true);
    expect(isValidRoomCode("WXYZ")).toBe(true);
    expect(isValidRoomCode("2345")).toBe(true);
  });

  it("rejects invalid lengths or forbidden characters", () => {
    expect(isValidRoomCode("ABC")).toBe(false);
    expect(isValidRoomCode("ABCDE")).toBe(false);
    expect(isValidRoomCode("AB10")).toBe(false); // 0 and 1 are excluded from alphabet
    expect(isValidRoomCode("ab cd")).toBe(false);
  });
});

// ─── Registry Tests ───────────────────────────────────────────────────────────

describe("GAME_REGISTRY", () => {
  it("contains exactly 10 games", () => {
    expect(GAME_REGISTRY).toHaveLength(10);
  });

  it("every game has valid id, category, template, and route", () => {
    for (const g of GAME_REGISTRY) {
      expect(g.id).toBeTruthy();
      expect(g.nameKey).toBeTruthy();
      expect(g.ruleKey).toBeTruthy();
      expect(g.deckIds.length).toBeGreaterThan(0);
      expect(g.playerMin).toBeGreaterThan(0);
      expect(g.playerMax).toBeGreaterThanOrEqual(g.playerMin);
      expect(g.defaultTimerSec).toBeGreaterThan(0);
      const route = getGameRoute(g.id);
      expect(route).toBe(`/play/${g.id}`);
    }
  });

  it("filters correctly by id, status, and category", () => {
    expect(getGameById("transify")?.template).toBe("Judge");
    expect(getGameById("head-set-go")?.template).toBe("Forehead");
    expect(getGameById("nonexistent")).toBeUndefined();

    const readyGames = getGamesByStatus("ready");
    expect(readyGames.length).toBe(5); // Head Set Go + Transify + Emoji Cinema + Rapid Fire + Cricket IQ

    const cinemaGames = getGamesByCategory("Cinema");
    expect(cinemaGames.length).toBeGreaterThan(0);
  });
});

// ─── HSG Machine Tests ────────────────────────────────────────────────────────

describe("hsgMachine", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") localStorage.clear();
  });

  it("starts in setup state", () => {
    const actor = startActor();
    expect(actor.getSnapshot().value).toBe("setup");
    actor.stop();
  });

  it("moves to getReady on START", () => {
    const actor = startActor();
    actor.send({ type: "START" });
    expect(actor.getSnapshot().value).toBe("getReady");
    actor.stop();
  });

  it("moves to playing after countdown ticks", () => {
    const actor = startActor();
    actor.send({ type: "START" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    expect(actor.getSnapshot().value).toBe("playing");
    actor.stop();
  });

  function getToPlaying(actor: ReturnType<typeof startActor>) {
    actor.send({ type: "START" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
  }

  it("increments correct score on CORRECT", () => {
    const actor = startActor();
    getToPlaying(actor);
    actor.send({ type: "CORRECT" });
    expect(actor.getSnapshot().context.correctIds).toHaveLength(1);
    actor.stop();
  });

  it("increments pass count on PASS", () => {
    const actor = startActor();
    getToPlaying(actor);
    actor.send({ type: "PASS" });
    expect(actor.getSnapshot().context.passedIds).toHaveLength(1);
    actor.stop();
  });

  it("goes to roundEnd after TIME_UP", () => {
    const actor = startActor();
    getToPlaying(actor);
    actor.send({ type: "TIME_UP" });
    expect(actor.getSnapshot().value).toBe("roundEnd");
    actor.stop();
  });

  it("goes to roundEnd when deck is exhausted via CORRECT", () => {
    const actor = startActor(DECK_2);
    getToPlaying(actor);
    actor.send({ type: "CORRECT" });
    actor.send({ type: "CORRECT" });
    expect(actor.getSnapshot().value).toBe("roundEnd");
    actor.stop();
  });

  it("pauses on PAUSE and resumes on RESUME → getReady", () => {
    const actor = startActor();
    getToPlaying(actor);
    actor.send({ type: "PAUSE" });
    expect(actor.getSnapshot().value).toBe("paused");
    actor.send({ type: "RESUME" });
    expect(actor.getSnapshot().value).toBe("getReady");
    actor.stop();
  });

  it("CHANGE_DECK from paused returns to setup", () => {
    const actor = startActor();
    getToPlaying(actor);
    actor.send({ type: "PAUSE" });
    actor.send({ type: "CHANGE_DECK" });
    expect(actor.getSnapshot().value).toBe("setup");
    actor.stop();
  });

  it("shuffled order covers all cards with no duplicates", () => {
    const actor = startActor();
    actor.send({ type: "START" });
    const ctx = actor.getSnapshot().context;
    expect(ctx.shuffledOrder).toHaveLength(DECK_5.length);
    expect(new Set(ctx.shuffledOrder).size).toBe(DECK_5.length);
    actor.stop();
  });

  it("secondsLeft decrements on TICK", () => {
    const actor = startActor(DECK_5, 10);
    getToPlaying(actor);
    actor.send({ type: "TICK" });
    expect(actor.getSnapshot().context.secondsLeft).toBe(9);
    actor.stop();
  });

  it("secondsLeft never goes below 0", () => {
    const actor = startActor(DECK_5, 1);
    getToPlaying(actor);
    actor.send({ type: "TICK" });
    const snap = actor.getSnapshot();
    expect(snap.context.secondsLeft).toBe(0);
    actor.stop();
  });
});

// ─── Judge Machine Tests ──────────────────────────────────────────────────────

describe("judgeMachine", () => {
  const players = [
    { id: "p1", name: "Raju" },
    { id: "p2", name: "Anu" },
    { id: "p3", name: "Suresh" },
  ];

  function startJudge(deck = DECK_5, duration = 30) {
    const actor = createActor(judgeMachine, {
      input: {
        gameId: "transify",
        players,
        deck,
        duration,
        totalRounds: 1,
        recentlyPlayed: [],
      },
    });
    actor.start();
    return actor;
  }

  function progressToTurn(actor: ReturnType<typeof startJudge>) {
    actor.send({ type: "START" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
  }

  it("starts in setup and transitions to getReady on START", () => {
    const actor = startJudge();
    expect(actor.getSnapshot().value).toBe("setup");
    actor.send({ type: "START" });
    expect(actor.getSnapshot().value).toBe("getReady");
    actor.stop();
  });

  it("transitions to turn after countdown ticks", () => {
    const actor = startJudge();
    progressToTurn(actor);
    expect(actor.getSnapshot().value).toBe("turn");
    actor.stop();
  });

  it("handles CORRECT and SKIP actions during turn", () => {
    const actor = startJudge();
    progressToTurn(actor);
    actor.send({ type: "CORRECT" });
    actor.send({ type: "CORRECT" });
    actor.send({ type: "SKIP" });
    const snap = actor.getSnapshot();
    expect(snap.context.currentTurnCorrect).toBe(2);
    expect(snap.context.currentTurnSkipped).toBe(1);
    expect(snap.context.usedCardIds).toHaveLength(3);
    actor.stop();
  });

  it("pauses and resumes turn cleanly", () => {
    const actor = startJudge();
    progressToTurn(actor);
    actor.send({ type: "PAUSE" });
    expect(actor.getSnapshot().value).toBe("paused");
    actor.send({ type: "RESUME" });
    expect(actor.getSnapshot().value).toBe("turn");
    actor.stop();
  });

  it("rotates through all players and records turn summaries", () => {
    const actor = startJudge();
    // Turn 1 (Raju)
    progressToTurn(actor);
    actor.send({ type: "CORRECT" });
    actor.send({ type: "TIME_UP" });
    expect(actor.getSnapshot().value).toBe("turnEnd");
    expect(actor.getSnapshot().context.turnSummaries).toHaveLength(1);
    expect(actor.getSnapshot().context.turnSummaries[0]!.playerName).toBe("Raju");

    // Pass phone to Anu (Player 2)
    actor.send({ type: "NEXT_TURN" });
    expect(actor.getSnapshot().value).toBe("passingPhone");
    expect(actor.getSnapshot().context.currentPlayerIndex).toBe(1);

    // Turn 2 (Anu)
    actor.send({ type: "PHONE_PASSED" });
    expect(actor.getSnapshot().value).toBe("getReady");
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    expect(actor.getSnapshot().value).toBe("turn");
    actor.send({ type: "CORRECT" });
    actor.send({ type: "CORRECT" });
    actor.send({ type: "TIME_UP" });

    // Pass phone to Suresh (Player 3)
    actor.send({ type: "NEXT_TURN" });
    expect(actor.getSnapshot().value).toBe("passingPhone");
    actor.send({ type: "PHONE_PASSED" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "TIME_UP" }); // Suresh gets 0

    // All 3 players finished 1 round -> Next turn transitions to results
    actor.send({ type: "NEXT_TURN" });
    expect(actor.getSnapshot().value).toBe("results");

    const scores = computeJudgeScores(actor.getSnapshot().context);
    expect(scores).toHaveLength(3);
    const winners = getJudgeWinners(scores);
    expect(winners).toHaveLength(1);
    expect(winners[0]!.player.name).toBe("Anu");
    expect(winners[0]!.score).toBe(2);

    // Play again restarts setup
    actor.send({ type: "PLAY_AGAIN" });
    expect(actor.getSnapshot().value).toBe("setup");
    actor.stop();
  });

  it("handles honest ties correctly", () => {
    const actor = startJudge();
    progressToTurn(actor);
    actor.send({ type: "CORRECT" });
    actor.send({ type: "TIME_UP" });

    actor.send({ type: "NEXT_TURN" });
    actor.send({ type: "PHONE_PASSED" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "CORRECT" });
    actor.send({ type: "TIME_UP" });

    actor.send({ type: "NEXT_TURN" });
    actor.send({ type: "PHONE_PASSED" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "COUNTDOWN_TICK" });
    actor.send({ type: "SKIP" });
    actor.send({ type: "TIME_UP" });

    actor.send({ type: "NEXT_TURN" });
    expect(actor.getSnapshot().value).toBe("results");

    const scores = computeJudgeScores(actor.getSnapshot().context);
    const winners = getJudgeWinners(scores);
    expect(winners).toHaveLength(2); // Raju and Anu tied with 1 point
    actor.stop();
  });

  it("helpers load and save recent cards without throwing", () => {
    saveJudgeRecent("transify", ["c1", "c2"]);
    const recent = loadJudgeRecent("transify");
    expect(recent).toEqual(["c1", "c2"]);

    const shuffled = shuffleDeckCards(DECK_5, ["card-1"]);
    expect(shuffled).toHaveLength(DECK_5.length);
  });
});


import { getVisibleGames, getGamesByRelease } from "./registry";

describe("registry release filtering", () => {
  it("shows exactly the 7 beta games by default", () => {
    const ids = getVisibleGames().map((g) => g.id).sort();
    expect(ids).toEqual(
      [
        "box-office-auction",
        "dumb-charades",
        "emoji-cinema",
        "head-set-go",
        "most-likely",
        "rapid-fire",
        "transify",
      ].sort(),
    );
  });
  it("hides every cricket and MVP game by default", () => {
    const ids = getVisibleGames().map((g) => g.id);
    expect(ids).not.toContain("cricket-iq");
    expect(ids).not.toContain("cricket-auction");
    expect(ids).not.toContain("dream-xi-challenge");
  });
  it("includes MVP games when the flag is on", () => {
    expect(getVisibleGames(true)).toHaveLength(10);
    expect(getGamesByRelease("mvp")).toHaveLength(3);
  });
});
