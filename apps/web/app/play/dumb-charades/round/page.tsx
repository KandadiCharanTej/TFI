"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import {
  loadCharadesRecent,
  pickNextCharadesCard,
  pointsForDifficulty,
  saveCharadesRecent,
  type CharadesTeam,
  type CharadesTeamScore,
  type CharadesTurnSummary,
  type DifficultyMix,
  type GameCard,
} from "@tfi/game-core";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { Badge, Sticker, WallButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

const C = TRANSLATIONS.charades;
const CONFIG_KEY = "tfi.charades.config";
const RESULTS_KEY = "tfi.charades.results";
const HIDE_HOWTO_KEY = "tfi.charades.hideHowTo";

interface CharadesConfig {
  teams: CharadesTeam[];
  roundsPerTeam: number;
  duration: number;
  difficultyMix: DifficultyMix;
}

type Phase = "passingPhone" | "acting" | "paused" | "turnEnd" | "results";

interface State {
  phase: Phase;
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

type Action =
  | { type: "SKIP_FILM" }
  | { type: "START_ACTING" }
  | { type: "TICK" }
  | { type: "GOT_IT" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NEXT_TURN" };

function buildInitialState(deck: GameCard[], cfg: CharadesConfig): State {
  const recentIds = loadCharadesRecent();
  const firstCard = pickNextCharadesCard(deck, [], recentIds, cfg.difficultyMix);
  return {
    phase: "passingPhone",
    teams: cfg.teams,
    roundsPerTeam: cfg.roundsPerTeam,
    duration: cfg.duration,
    difficultyMix: cfg.difficultyMix,
    currentTeamIndex: 0,
    currentTurn: 1,
    totalTurns: cfg.teams.length * cfg.roundsPerTeam,
    deck,
    recentIds,
    usedCardIds: firstCard ? [firstCard.id] : [],
    currentCard: firstCard,
    skipUsedInTurn: false,
    secondsLeft: cfg.duration,
    turnSummaries: [],
  };
}

function reducer(state: State, action: Action): State {
  const team = state.teams[state.currentTeamIndex] ?? state.teams[0]!;
  switch (action.type) {
    case "SKIP_FILM": {
      if (state.skipUsedInTurn || !state.currentCard || state.phase !== "passingPhone") return state;
      const nextCard = pickNextCharadesCard(
        state.deck,
        state.usedCardIds,
        state.recentIds,
        state.difficultyMix,
        state.currentCard.difficulty,
      );
      return {
        ...state,
        currentCard: nextCard,
        usedCardIds: nextCard ? [...state.usedCardIds, nextCard.id] : state.usedCardIds,
        skipUsedInTurn: true,
      };
    }
    case "START_ACTING":
      return { ...state, phase: "acting", secondsLeft: state.duration };
    case "TICK": {
      if (state.phase !== "acting") return state;
      if (state.secondsLeft <= 1) {
        const diff = state.currentCard?.difficulty ?? 1;
        const summary: CharadesTurnSummary = {
          teamId: team.id,
          teamName: team.name,
          turnNumber: state.currentTurn,
          cardId: state.currentCard?.id ?? "",
          cardEn: state.currentCard?.en ?? "",
          cardTe: state.currentCard?.te ?? "",
          difficulty: diff,
          guessed: false,
          points: 0,
          skippedBeforeActing: state.skipUsedInTurn,
        };
        saveCharadesRecent([...state.recentIds, ...state.usedCardIds]);
        return {
          ...state,
          phase: "turnEnd",
          secondsLeft: 0,
          turnSummaries: [...state.turnSummaries, summary],
        };
      }
      return { ...state, secondsLeft: state.secondsLeft - 1 };
    }
    case "GOT_IT": {
      if (state.phase !== "acting") return state;
      const diff = state.currentCard?.difficulty ?? 1;
      const summary: CharadesTurnSummary = {
        teamId: team.id,
        teamName: team.name,
        turnNumber: state.currentTurn,
        cardId: state.currentCard?.id ?? "",
        cardEn: state.currentCard?.en ?? "",
        cardTe: state.currentCard?.te ?? "",
        difficulty: diff,
        guessed: true,
        points: pointsForDifficulty(diff),
        skippedBeforeActing: state.skipUsedInTurn,
      };
      saveCharadesRecent([...state.recentIds, ...state.usedCardIds]);
      return {
        ...state,
        phase: "turnEnd",
        turnSummaries: [...state.turnSummaries, summary],
      };
    }
    case "PAUSE":
      return state.phase === "acting" ? { ...state, phase: "paused" } : state;
    case "RESUME":
      return state.phase === "paused" ? { ...state, phase: "acting" } : state;
    case "NEXT_TURN": {
      if (state.currentTurn >= state.totalTurns) {
        return { ...state, phase: "results" };
      }
      const nextTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
      const nextCard = pickNextCharadesCard(
        state.deck,
        state.usedCardIds,
        state.recentIds,
        state.difficultyMix,
      );
      return {
        ...state,
        phase: "passingPhone",
        currentTurn: state.currentTurn + 1,
        currentTeamIndex: nextTeamIndex,
        currentCard: nextCard,
        usedCardIds: nextCard ? [...state.usedCardIds, nextCard.id] : state.usedCardIds,
        skipUsedInTurn: false,
        secondsLeft: state.duration,
      };
    }
  }
}

function playClack(muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = "triangle";
    osc2.type = "square";
    osc1.frequency.setValueAtTime(1400, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.055);
    osc2.frequency.setValueAtTime(720, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.055);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.06);
    osc2.stop(ctx.currentTime + 0.06);
  } catch {
    /* ignore audio errors */
  }
}

function playBeep(freq: number, ms: number, muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + ms / 1000);
  } catch {
    /* ignore audio errors */
  }
}

export default function DumbCharadesRoundPage() {
  const router = useRouter();
  const { lang } = useLang();
  const t = useT();

  const [deck, setDeck] = useState<GameCard[] | null>(null);
  const [config, setConfig] = useState<CharadesConfig | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    document.title = `Dumb Charades | TFI & Pitch`;
    let cfg: CharadesConfig = {
      teams: [
        { id: "t1", name: "Team A" },
        { id: "t2", name: "Team B" },
      ],
      roundsPerTeam: 3,
      duration: 90,
      difficultyMix: "mixed",
    };
    try {
      const raw = sessionStorage.getItem(CONFIG_KEY);
      if (raw) cfg = JSON.parse(raw) as CharadesConfig;
    } catch {
      /* fallback */
    }
    setConfig(cfg);

    fetch("/cards/dumb-charades-movies.json")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((cards: GameCard[]) => setDeck(cards))
      .catch(() => setLoadError(true));
  }, []);

  if (loadError) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-concrete p-4">
        <Sticker className="max-w-[400px] space-y-4 p-6 text-center">
          <p className="m-0 text-lg font-black text-ink">Could not load movie deck.</p>
          <WallButton variant="yellow" onClick={() => router.push("/play/dumb-charades")}>
            ← <Tx v={TRANSLATIONS.common.back} />
          </WallButton>
        </Sticker>
      </main>
    );
  }

  if (!deck || !config) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-concrete p-4">
        <Sticker className="w-full max-w-[400px] animate-pulse space-y-4 p-6">
          <div className="h-6 w-1/2 rounded bg-card" />
          <div className="h-24 w-full rounded bg-card" />
          <div className="h-12 w-full rounded bg-card" />
        </Sticker>
      </main>
    );
  }

  return <CharadesRoundRunner deck={deck} config={config} lang={lang} t={t} />;
}

function CharadesRoundRunner({
  deck,
  config,
  lang,
  t,
}: {
  deck: GameCard[];
  config: CharadesConfig;
  lang: "en" | "te";
  t: (v: { en: string; te: string }, values?: Record<string, string | number>) => string;
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, { deck, cfg: config }, ({ deck: d, cfg }) =>
    buildInitialState(d, cfg),
  );

  const [shutterOpen, setShutterOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(HIDE_HOWTO_KEY) !== "1") {
        setShowHowTo(true);
      }
    } catch {
      setShowHowTo(true);
    }
  }, []);

  useEffect(() => {
    if (state.phase !== "acting") return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.phase]);

  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    if (state.phase === "acting" && "wakeLock" in navigator) {
      navigator.wakeLock
        .request("screen")
        .then((s) => {
          lock = s;
        })
        .catch(() => {});
    }
    return () => {
      lock?.release().catch(() => {});
    };
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "acting" && state.secondsLeft <= 5 && state.secondsLeft > 0) {
      playBeep(700, 90, muted);
    }
  }, [state.secondsLeft, state.phase, muted]);

  useEffect(() => {
    if (state.phase === "results") {
      const scores: CharadesTeamScore[] = state.teams.map((team) => {
        const list = state.turnSummaries.filter((s) => s.teamId === team.id);
        return {
          team,
          score: list.reduce((a, b) => a + b.points, 0),
          guessedCount: list.filter((s) => s.guessed).length,
        };
      });
      try {
        sessionStorage.setItem(
          RESULTS_KEY,
          JSON.stringify({ scores, summaries: state.turnSummaries }),
        );
      } catch {
        /* ignore */
      }
      router.push("/play/dumb-charades/results");
    }
  }, [state.phase, state.teams, state.turnSummaries, router]);

  const currentTeam = state.teams[state.currentTeamIndex] ?? state.teams[0]!;
  const currentCard = state.currentCard;
  const diffLabel =
    currentCard?.difficulty === 3
      ? C.hard
      : currentCard?.difficulty === 2
        ? C.medium
        : C.easy;

  const dismissHowTo = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(HIDE_HOWTO_KEY, "1");
      } catch {
        /* ignore */
      }
    }
    setShowHowTo(false);
  };

  const handleGotIt = () => {
    playBeep(1040, 140, muted);
    dispatch({ type: "GOT_IT" });
  };

  const scores: CharadesTeamScore[] = state.teams.map((team) => {
    const list = state.turnSummaries.filter((s) => s.teamId === team.id);
    return {
      team,
      score: list.reduce((a, b) => a + b.points, 0),
      guessedCount: list.filter((s) => s.guessed).length,
    };
  });
  const lastSummary = state.turnSummaries[state.turnSummaries.length - 1];

  return (
    <main
      className="wall-tap-safe flex min-h-[100dvh] flex-col justify-between bg-concrete px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))]"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
    >
      <header className="mx-auto flex w-full max-w-[520px] items-center justify-between gap-2">
        <Badge tone="white" mono>
          {t(C.turnOf, { n: state.currentTurn, total: state.totalTurns })}
        </Badge>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? t(TRANSLATIONS.judge.unmuteSound) : t(TRANSLATIONS.judge.muteSound)}
            className="flex h-11 min-w-[44px] items-center justify-center rounded-full border-2 border-ink bg-white px-3 text-sm font-black text-ink"
          >
            {muted ? "🔇" : "🔊"}
          </button>
          {state.phase === "acting" ? (
            <button
              type="button"
              onClick={() => dispatch({ type: "PAUSE" })}
              aria-label="Pause"
              data-testid="charades-pause-btn"
              className="flex h-11 min-w-[44px] items-center justify-center rounded-full border-2 border-ink bg-white px-3 text-sm font-black text-ink"
            >
              ⏸
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmQuit(true)}
              aria-label={t(TRANSLATIONS.judge.quit)}
              className="flex h-11 min-w-[44px] items-center justify-center rounded-full border-2 border-ink bg-white px-3 text-sm font-black text-ink"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <section className="mx-auto my-auto w-full max-w-[520px] py-4">
        {state.phase === "passingPhone" && currentCard ? (
          <Sticker className="space-y-5 p-6 text-center" data-testid="charades-passing-screen">
            <Badge tone="yellow">{currentTeam.name}</Badge>
            <h1 className="h2-title m-0 text-ink">
              {t(C.passToActor, { team: currentTeam.name })}
            </h1>

            <div className="flex justify-center">
              <Badge tone="white">
                <Tx v={diffLabel} />
              </Badge>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                data-testid="charades-shutter-btn"
                onPointerDown={() => setShutterOpen(true)}
                onPointerUp={() => setShutterOpen(false)}
                onPointerLeave={() => setShutterOpen(false)}
                onPointerCancel={() => setShutterOpen(false)}
                onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setShutterOpen(true);
                  }
                }}
                onKeyUp={() => setShutterOpen(false)}
                style={{ touchAction: "none", WebkitTouchCallout: "none" }}
                className={`flex min-h-[140px] w-full flex-col items-center justify-center rounded-[18px] border-[3px] border-ink p-4 transition-colors ${
                  shutterOpen ? "bg-yellow text-ink" : "bg-ink text-sticker"
                }`}
              >
                {shutterOpen ? (
                  <div data-testid="charades-revealed-title" className="space-y-1">
                    <span className="block text-[32px] font-black leading-tight text-ink">
                      {lang === "te" ? currentCard.te : currentCard.en}
                    </span>
                    {lang === "te" ? (
                      <span className="block text-[16px] font-bold text-ink/75">{currentCard.en}</span>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-[20px] font-black uppercase tracking-wide">
                    👁 <Tx v={C.holdToSee} />
                  </span>
                )}
              </button>
              <p className="m-0 text-[12px] font-bold text-ink/75">
                <Tx v={C.releaseToHide} />
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <WallButton
                type="button"
                variant="magenta"
                disabled={state.skipUsedInTurn}
                onClick={() => dispatch({ type: "SKIP_FILM" })}
                data-testid="charades-skip-btn"
                className="flex-1 disabled:opacity-45"
              >
                <Tx v={state.skipUsedInTurn ? C.skipUsed : C.skipFilm} />
              </WallButton>
              <WallButton
                type="button"
                variant="yellow"
                onClick={() => {
                  setShutterOpen(false);
                  playClack(muted);
                  dispatch({ type: "START_ACTING" });
                }}
                data-testid="charades-start-acting-btn"
                className="flex-1"
              >
                <Tx v={C.startActing} />
              </WallButton>
            </div>
          </Sticker>
        ) : null}

        {state.phase === "acting" ? (
          <Sticker
            className="space-y-6 overflow-hidden p-6 text-center"
            data-testid="charades-acting-screen"
          >
            {/* Timer bar: ink on white, warning turns magenta at 10s */}
            <div className="h-3 w-full overflow-hidden rounded-full border-2 border-ink bg-white">
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${Math.max(0, Math.min(100, Math.round((state.secondsLeft / state.duration) * 100)))}%`,
                  backgroundColor: state.secondsLeft <= 10 ? "#EC1276" : "#141313",
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Badge tone="white">{currentTeam.name}</Badge>
              <Badge tone={state.secondsLeft <= 10 ? "magenta" : "yellow"}>
                <Tx v={diffLabel} />
              </Badge>
            </div>

            <p className="wall-label m-0 text-ink/80">
              <Tx v={C.actingNow} />
            </p>

            <div
              data-testid="charades-timer"
              className={`mono-num mx-auto inline-block rounded-[20px] border-[3px] border-ink px-8 py-4 text-[clamp(56px,16vw,88px)] font-bold leading-none ${
                state.secondsLeft <= 10 ? "bg-magenta text-white" : "bg-card text-ink"
              }`}
            >
              {String(Math.floor(state.secondsLeft / 60))}:
              {String(state.secondsLeft % 60).padStart(2, "0")}
            </div>

            <div className="pt-2">
              <WallButton
                type="button"
                variant="green"
                onClick={handleGotIt}
                data-testid="charades-got-it-btn"
                className="min-h-[68px] w-full text-[22px]"
                style={{ touchAction: "manipulation" }}
              >
                ✓ <Tx v={C.gotItBtn} />
              </WallButton>
            </div>
          </Sticker>
        ) : null}

        {state.phase === "turnEnd" && lastSummary ? (
          <Sticker className="space-y-5 p-6 text-center" data-testid="charades-turn-end">
            <Badge tone={lastSummary.guessed ? "green" : "magenta"}>
              {lastSummary.guessed
                ? t(C.pointsEarned, { pts: pointsForDifficulty(lastSummary.difficulty) })
                : t(C.zeroPoints)}
            </Badge>

            <div className="rounded-[14px] border-2 border-ink bg-card p-4">
              <p className="m-0 text-[12px] font-black uppercase tracking-wider text-ink/70">
                {lastSummary.teamName}
              </p>
              <p className="m-0 mt-1 text-[26px] font-black text-ink">
                {lang === "te" ? lastSummary.cardTe : lastSummary.cardEn}
              </p>
              {lang === "te" ? (
                <p className="m-0 text-[14px] font-bold text-ink/75">{lastSummary.cardEn}</p>
              ) : null}
            </div>

            <div className="space-y-2 text-left">
              <p className="m-0 text-xs font-black uppercase tracking-wider text-ink/70">
                <Tx v={C.scoreboard} />
              </p>
              {scores.map((sc) => (
                <div
                  key={sc.team.id}
                  className="flex items-center justify-between rounded-[12px] border-2 border-ink bg-white px-4 py-2.5"
                >
                  <span className="font-extrabold text-ink">{sc.team.name}</span>
                  <span className="mono-num text-lg font-black text-ink">{sc.score} pts</span>
                </div>
              ))}
            </div>

            <WallButton
              type="button"
              variant="yellow"
              onClick={() => dispatch({ type: "NEXT_TURN" })}
              data-testid="charades-next-turn-btn"
              className="w-full"
            >
              <Tx v={TRANSLATIONS.judge.nextTurn} />
            </WallButton>
          </Sticker>
        ) : null}
      </section>

      <div className="h-4" />

      {showHowTo ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(C.howToTitle)}
          data-testid="charades-howto-dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
        >
          <Sticker className="w-full max-w-[420px] space-y-4 p-6">
            <h2 className="h2-title m-0 text-ink">
              <Tx v={C.howToTitle} />
            </h2>
            <div className="space-y-2.5">
              {[
                { title: C.step1Title, body: C.step1Body },
                { title: C.step2Title, body: C.step2Body },
                { title: C.step3Title, body: C.step3Body },
              ].map((s, idx) => (
                <div key={idx} className="rounded-[12px] border-2 border-ink bg-card p-3">
                  <p className="m-0 text-[14px] font-black text-ink"><Tx v={s.title} /></p>
                  <p className="m-0 mt-0.5 text-[13px] font-semibold text-ink/80"><Tx v={s.body} /></p>
                </div>
              ))}
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-ink">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-5 w-5 accent-ink"
              />
              <Tx v={C.dontShowAgain} />
            </label>
            <WallButton
              type="button"
              variant="yellow"
              className="w-full"
              onClick={dismissHowTo}
              data-testid="charades-howto-ok"
            >
              <Tx v={C.gotItStart} />
            </WallButton>
          </Sticker>
        </div>
      ) : null}

      {state.phase === "paused" || confirmQuit ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(TRANSLATIONS.judge.paused)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
        >
          <Sticker className="w-full max-w-[360px] space-y-4 p-6 text-center">
            <h2 className="h2-title m-0 text-ink">
              <Tx v={TRANSLATIONS.judge.paused} />
            </h2>
            <div className="flex flex-col gap-3">
              <WallButton
                type="button"
                variant="yellow"
                onClick={() => {
                  setConfirmQuit(false);
                  if (state.phase === "paused") dispatch({ type: "RESUME" });
                }}
              >
                <Tx v={TRANSLATIONS.judge.resume} />
              </WallButton>
              <WallButton
                type="button"
                variant="white"
                onClick={() => router.push("/play/dumb-charades")}
              >
                <Tx v={TRANSLATIONS.judge.quit} />
              </WallButton>
            </div>
          </Sticker>
        </div>
      ) : null}
    </main>
  );
}
