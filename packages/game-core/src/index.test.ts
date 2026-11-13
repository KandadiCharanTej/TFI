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
    expect(readyGames.length).toBe(7); // Head Set Go + Transify + Emoji Cinema + Rapid Fire + Cricket IQ (MVP) + Dumb Charades + Most Likely

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


import {
  charadesMachine,
  computeCharadesScores,
  getCharadesWinners,
  loadCharadesRecent,
  saveCharadesRecent,
  pointsForDifficulty,
} from "./charades-machine";

const CHARADES_DECK = [
  { id: "c1", game: "dumb-charades", deck: "dumb-charades-movies", en: "Pokiri", te: "పోకిరి", difficulty: 1 as const, tags: [], verified: false },
  { id: "c2", game: "dumb-charades", deck: "dumb-charades-movies", en: "Eega", te: "ఈగ", difficulty: 1 as const, tags: [], verified: false },
  { id: "c3", game: "dumb-charades", deck: "dumb-charades-movies", en: "Khaleja", te: "ఖలేజా", difficulty: 2 as const, tags: [], verified: false },
  { id: "c4", game: "dumb-charades", deck: "dumb-charades-movies", en: "Dhruva", te: "ధ్రువ", difficulty: 2 as const, tags: [], verified: false },
  { id: "c5", game: "dumb-charades", deck: "dumb-charades-movies", en: "Mayabazar", te: "మాయాబజార్", difficulty: 3 as const, tags: [], verified: false },
  { id: "c6", game: "dumb-charades", deck: "dumb-charades-movies", en: "Sankarabharanam", te: "శంకరాభరణం", difficulty: 3 as const, tags: [], verified: false },
];

describe("charadesMachine", () => {
  it("runs turn order across 2 teams and scores by difficulty", () => {
    const actor = createActor(charadesMachine, {
      input: {
        teams: [{ id: "t1", name: "Team A" }, { id: "t2", name: "Team B" }],
        roundsPerTeam: 1,
        duration: 90,
        difficultyMix: "hard",
        deck: CHARADES_DECK,
        recentlyPlayed: [],
      },
    });
    actor.start();
    expect(actor.getSnapshot().value).toBe("setup");
    actor.send({ type: "START" });
    expect(actor.getSnapshot().value).toBe("passingPhone");
    expect(actor.getSnapshot().context.currentCard?.difficulty).toBe(3);

    actor.send({ type: "START_ACTING" });
    expect(actor.getSnapshot().value).toBe("acting");
    actor.send({ type: "GOT_IT" });
    expect(actor.getSnapshot().value).toBe("turnEnd");
    expect(actor.getSnapshot().context.turnSummaries[0]?.points).toBe(3);

    actor.send({ type: "NEXT_TURN" });
    expect(actor.getSnapshot().value).toBe("passingPhone");
    expect(actor.getSnapshot().context.currentTeamIndex).toBe(1);

    actor.send({ type: "START_ACTING" });
    actor.send({ type: "TIME_UP" });
    expect(actor.getSnapshot().value).toBe("turnEnd");
    expect(actor.getSnapshot().context.turnSummaries[1]?.points).toBe(0);

    actor.send({ type: "NEXT_TURN" });
    expect(actor.getSnapshot().value).toBe("results");

    const scores = computeCharadesScores(actor.getSnapshot().context);
    expect(scores.find((s) => s.team.id === "t1")?.score).toBe(3);
    expect(scores.find((s) => s.team.id === "t2")?.score).toBe(0);
    expect(getCharadesWinners(scores).map((w) => w.team.id)).toEqual(["t1"]);
    actor.stop();
  });

  it("allows only one skip per turn with same difficulty and no repeats", () => {
    const actor = createActor(charadesMachine, {
      input: {
        teams: [{ id: "t1", name: "Alpha" }, { id: "t2", name: "Beta" }],
        roundsPerTeam: 1,
        duration: 60,
        difficultyMix: "easy",
        deck: CHARADES_DECK,
      },
    });
    actor.start();
    actor.send({ type: "START" });
    const firstCard = actor.getSnapshot().context.currentCard!;
    expect(firstCard.difficulty).toBe(1);

    actor.send({ type: "SKIP_FILM" });
    const skippedCard = actor.getSnapshot().context.currentCard!;
    expect(skippedCard.id).not.toBe(firstCard.id);
    expect(skippedCard.difficulty).toBe(1);
    expect(actor.getSnapshot().context.skipUsedInTurn).toBe(true);

    // Second skip must be ignored
    actor.send({ type: "SKIP_FILM" });
    expect(actor.getSnapshot().context.currentCard?.id).toBe(skippedCard.id);
    expect(new Set(actor.getSnapshot().context.usedCardIds).size).toBe(2);
    actor.stop();
  });

  it("handles timer ticks, pause/resume, time up, and honest ties", () => {
    const actor = createActor(charadesMachine, {
      input: {
        teams: [{ id: "t1", name: "T1" }, { id: "t2", name: "T2" }],
        roundsPerTeam: 1,
        duration: 2,
        difficultyMix: "medium",
        deck: CHARADES_DECK,
      },
    });
    actor.start();
    actor.send({ type: "START" });
    actor.send({ type: "START_ACTING" });
    actor.send({ type: "PAUSE" });
    expect(actor.getSnapshot().value).toBe("paused");
    actor.send({ type: "RESUME" });
    expect(actor.getSnapshot().value).toBe("acting");
    actor.send({ type: "TICK" }); // 1s left
    expect(actor.getSnapshot().context.secondsLeft).toBe(1);
    actor.send({ type: "TICK" }); // 0s left
    actor.send({ type: "TICK" }); // time up
    expect(actor.getSnapshot().value).toBe("turnEnd");
    actor.send({ type: "NEXT_TURN" });
    actor.send({ type: "START_ACTING" });
    actor.send({ type: "TIME_UP" });
    actor.send({ type: "NEXT_TURN" });
    expect(actor.getSnapshot().value).toBe("results");

    const scores = computeCharadesScores(actor.getSnapshot().context);
    const winners = getCharadesWinners(scores);
    expect(winners).toHaveLength(2);
    actor.send({ type: "PLAY_AGAIN" });
    expect(actor.getSnapshot().value).toBe("setup");
    actor.stop();
  });

  it("exposes difficulty points and recent storage helpers", () => {
    expect(pointsForDifficulty(1)).toBe(1);
    expect(pointsForDifficulty(2)).toBe(2);
    expect(pointsForDifficulty(3)).toBe(3);
    saveCharadesRecent(["c1", "c2"]);
    expect(loadCharadesRecent()).toContain("c1");
    expect(getCharadesWinners([])).toEqual([]);
  });
});


import {
  voteMachine,
  computeCrownTitles,
  getMostCrownedWinners,
  tallyPromptVotes,
  loadVoteRecent,
  saveVoteRecent,
} from "./vote-machine";

const VOTE_DECK = [
  { id: "ml-1", game: "most-likely", deck: "most-likely-party", en: "Cry at sentiment", te: "ఏడవడం", difficulty: 1 as const, tags: [], verified: false },
  { id: "ml-2", game: "most-likely", deck: "most-likely-party", en: "Book FDFS", te: "ఎఫ్‌డిఎఫ్‌ఎస్", difficulty: 1 as const, tags: [], verified: false },
];

describe("voteMachine", () => {
  it("enforces privacy step, blocks self-vote, and tallies winner & ties", () => {
    const players = [
      { id: "p1", name: "Anu" },
      { id: "p2", name: "Bala" },
      { id: "p3", name: "Charan" },
    ];
    const actor = createActor(voteMachine, {
      input: {
        players,
        totalPrompts: 2,
        deck: VOTE_DECK,
        recentlyPlayed: [],
      },
    });
    actor.start();
    expect(actor.getSnapshot().value).toBe("setup");

    actor.send({ type: "START" });
    expect(actor.getSnapshot().value).toBe("privacy");
    expect(actor.getSnapshot().context.currentVoterIndex).toBe(0);

    actor.send({ type: "READY_TO_VOTE" });
    expect(actor.getSnapshot().value).toBe("voting");

    // Self-vote must be blocked
    actor.send({ type: "CAST_VOTE", targetId: "p1" });
    expect(actor.getSnapshot().value).toBe("voting");
    expect(actor.getSnapshot().context.currentVoterIndex).toBe(0);

    // Valid vote from p1 -> p2
    actor.send({ type: "CAST_VOTE", targetId: "p2" });
    expect(actor.getSnapshot().value).toBe("privacy");
    expect(actor.getSnapshot().context.currentVoterIndex).toBe(1);

    // p2 -> p3
    actor.send({ type: "READY_TO_VOTE" });
    actor.send({ type: "CAST_VOTE", targetId: "p3" });
    expect(actor.getSnapshot().value).toBe("privacy");

    // p3 -> p2 (so p2 wins 2-1)
    actor.send({ type: "READY_TO_VOTE" });
    actor.send({ type: "CAST_VOTE", targetId: "p2" });
    expect(actor.getSnapshot().value).toBe("reveal");
    expect(actor.getSnapshot().context.promptResults[0]?.winnerIds).toEqual(["p2"]);
    expect(actor.getSnapshot().context.promptResults[0]?.isTie).toBe(false);

    // Next prompt: 3-way tie (p1->p2, p2->p3, p3->p1)
    actor.send({ type: "NEXT_PROMPT" });
    expect(actor.getSnapshot().value).toBe("privacy");
    actor.send({ type: "READY_TO_VOTE" });
    actor.send({ type: "CAST_VOTE", targetId: "p2" });
    actor.send({ type: "READY_TO_VOTE" });
    actor.send({ type: "CAST_VOTE", targetId: "p3" });
    actor.send({ type: "READY_TO_VOTE" });
    actor.send({ type: "CAST_VOTE", targetId: "p1" });
    expect(actor.getSnapshot().value).toBe("reveal");
    expect(actor.getSnapshot().context.promptResults[1]?.isTie).toBe(true);

    actor.send({ type: "NEXT_PROMPT" });
    expect(actor.getSnapshot().value).toBe("results");

    const titles = computeCrownTitles(players, actor.getSnapshot().context.promptResults);
    const crowned = getMostCrownedWinners(titles);
    expect(crowned[0]?.player.id).toBe("p2");
    expect(crowned[0]?.crowns).toBe(2);

    actor.send({ type: "PLAY_AGAIN" });
    expect(actor.getSnapshot().value).toBe("setup");
    actor.stop();
  });

  it("handles recent vote storage and empty winners", () => {
    saveVoteRecent(["ml-1"]);
    expect(loadVoteRecent()).toContain("ml-1");
    expect(getMostCrownedWinners([])).toEqual([]);
    const res = tallyPromptVotes(
      VOTE_DECK[0]!,
      [{ id: "p1", name: "A" }, { id: "p2", name: "B" }],
      { p1: "p2", p2: "p1" },
    );
    expect(res.isTie).toBe(true);
    expect(res.topVotes).toBe(1);
  });
});
