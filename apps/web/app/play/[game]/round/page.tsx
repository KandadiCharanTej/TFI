"use client";

import { useEffect, useRef, useCallback, useState, useReducer, use } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Tx, useLang } from "@/components/lang-provider";
import {
  ConfettiBurst,
  HowToPlayDialog,
  OfflineBanner,
  QuitRoundDialog,
} from "@/components/round-ui";
import { TRANSLATIONS } from "@/lib/i18n";
import type { GameCard } from "@tfi/game-core";

const J = TRANSLATIONS.judge;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Player {
  id: string;
  name: string;
}

interface TurnSummary {
  playerId: string;
  playerName: string;
  turnNumber: number;
  correct: number;
  skipped: number;
}

type Stamp = "correct" | "skip" | null;
type Phase = "loading" | "getReady" | "playing" | "paused" | "turnEnd" | "passingPhone" | "allDone";

interface State {
  gameId: string;
  deck: string;
  cards: GameCard[];
  currentIndex: number;
  players: Player[];
  currentPlayerIndex: number;
  currentTurn: number;
  totalTurns: number;
  currentTurnCorrect: number;
  currentTurnSkipped: number;
  secondsLeft: number;
  duration: number;
  phase: Phase;
  countdown: number;
  stamp: Stamp;
  muted: boolean;
  usedCardIds: string[];
  turnSummaries: TurnSummary[];
}

type Action =
  | {
      type: "INIT";
      gameId: string;
      deck: string;
      cards: GameCard[];
      duration: number;
      players: Player[];
    }
  | { type: "COUNTDOWN_TICK" }
  | { type: "TICK" }
  | { type: "CORRECT" }
  | { type: "SKIP" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "CLEAR_STAMP" }
  | { type: "TOGGLE_MUTE" }
  | { type: "NEXT_TURN" }
  | { type: "PHONE_PASSED" }
  | { type: "TIME_UP" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "INIT": {
      return {
        ...s,
        gameId: a.gameId,
        deck: a.deck,
        cards: a.cards,
        duration: a.duration,
        secondsLeft: a.duration,
        players: a.players,
        totalTurns: a.players.length,
        phase: "getReady",
        countdown: 3,
      };
    }
    case "COUNTDOWN_TICK": {
      if (s.countdown <= 1) {
        return { ...s, phase: "playing", countdown: 3 };
      }
      return { ...s, countdown: s.countdown - 1 };
    }
    case "TICK": {
      const left = Math.max(0, s.secondsLeft - 1);
      if (left <= 0) {
        // Turn ended due to timer
        const player = s.players[s.currentPlayerIndex] ?? { id: "p1", name: "Player 1" };
        const summary: TurnSummary = {
          playerId: player.id,
          playerName: player.name,
          turnNumber: s.currentTurn,
          correct: s.currentTurnCorrect,
          skipped: s.currentTurnSkipped,
        };
        return {
          ...s,
          secondsLeft: 0,
          phase: "turnEnd",
          turnSummaries: [...s.turnSummaries, summary],
        };
      }
      return { ...s, secondsLeft: left };
    }
    case "TIME_UP": {
      const player = s.players[s.currentPlayerIndex] ?? { id: "p1", name: "Player 1" };
      const summary: TurnSummary = {
        playerId: player.id,
        playerName: player.name,
        turnNumber: s.currentTurn,
        correct: s.currentTurnCorrect,
        skipped: s.currentTurnSkipped,
      };
      return {
        ...s,
        phase: "turnEnd",
        turnSummaries: [...s.turnSummaries, summary],
      };
    }
    case "CORRECT": {
      if (s.phase !== "playing") return s;
      const card = s.cards[s.currentIndex];
      const nextIdx = (s.currentIndex + 1) % Math.max(1, s.cards.length);
      return {
        ...s,
        currentTurnCorrect: s.currentTurnCorrect + 1,
        usedCardIds: card ? [...s.usedCardIds, card.id] : s.usedCardIds,
        currentIndex: nextIdx,
        stamp: "correct",
      };
    }
    case "SKIP": {
      if (s.phase !== "playing") return s;
      const card = s.cards[s.currentIndex];
      const nextIdx = (s.currentIndex + 1) % Math.max(1, s.cards.length);
      return {
        ...s,
        currentTurnSkipped: s.currentTurnSkipped + 1,
        usedCardIds: card ? [...s.usedCardIds, card.id] : s.usedCardIds,
        currentIndex: nextIdx,
        stamp: "skip",
      };
    }
    case "PAUSE": {
      return s.phase === "playing" ? { ...s, phase: "paused" } : s;
    }
    case "RESUME": {
      return { ...s, phase: "getReady", countdown: 3 };
    }
    case "CLEAR_STAMP": {
      return { ...s, stamp: null };
    }
    case "TOGGLE_MUTE": {
      return { ...s, muted: !s.muted };
    }
    case "NEXT_TURN": {
      if (s.currentTurn >= s.totalTurns) {
        return { ...s, phase: "allDone" };
      }
      return {
        ...s,
        currentTurn: s.currentTurn + 1,
        currentPlayerIndex: (s.currentPlayerIndex + 1) % s.players.length,
        phase: "passingPhone",
      };
    }
    case "PHONE_PASSED": {
      return {
        ...s,
        phase: "getReady",
        countdown: 3,
        secondsLeft: s.duration,
        currentTurnCorrect: 0,
        currentTurnSkipped: 0,
      };
    }
    default:
      return s;
  }
}

const INITIAL_STATE: State = {
  gameId: "",
  deck: "",
  cards: [],
  currentIndex: 0,
  players: [{ id: "p1", name: "Player 1" }],
  currentPlayerIndex: 0,
  currentTurn: 1,
  totalTurns: 1,
  currentTurnCorrect: 0,
  currentTurnSkipped: 0,
  secondsLeft: 60,
  duration: 60,
  phase: "loading",
  countdown: 3,
  stamp: null,
  muted: false,
  usedCardIds: [],
  turnSummaries: [],
};

// ─── Web Audio Beeps ─────────────────────────────────────────────────────────

function useAudio(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const beep = useCallback(
    (freq: number, dur: number, vol = 0.3) => {
      if (muted) return;
      try {
        ctxRef.current ??= new AudioContext();
        const ctx = ctxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.value = vol;
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch {
        /* silent on unsupported browsers */
      }
    },
    [muted],
  );

  return {
    correct: () => beep(880, 0.1),
    pass: () => beep(330, 0.1),
    countdown: () => beep(660, 0.07, 0.2),
    timeUp: () => beep(220, 0.35),
  };
}

// ─── Round Page Component ────────────────────────────────────────────────────

export default function JudgeRoundPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: slug } = use(params);
  const router = useRouter();
  const { lang } = useLang();
  const [s, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [dontShowHelp, setDontShowHelp] = useState(false);
  const [streak, setStreak] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [offline, setOffline] = useState(false);
  const audio = useAudio(s.muted);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    document.title = `${slug} Round | TFI & Pitch`;
  }, [slug]);

  // Initialize from sessionStorage or defaults
  useEffect(() => {
    async function loadGame() {
      let duration = 60;
      let players: Player[] = [
        { id: "p1", name: "Player 1" },
        { id: "p2", name: "Player 2" },
      ];
      let deckName = `${slug}-movies`;
      if (slug === "rapid-fire") deckName = "rapid-fire-party";
      else if (slug === "cricket-iq") deckName = "cricket-iq-trivia";

      try {
        const rawConfig = sessionStorage.getItem("judge.config");
        if (rawConfig) {
          const parsed = JSON.parse(rawConfig) as {
            deck: string;
            duration: number;
            players: Player[];
          };
          if (parsed.duration) duration = parsed.duration;
          if (parsed.deck) deckName = parsed.deck;
          if (parsed.players?.length) players = parsed.players;
        }
      } catch {
        /* ignore */
      }

      let cards: GameCard[] = [];
      try {
        const res = await fetch(`/cards/${deckName}.json`);
        if (res.ok) {
          cards = (await res.json()) as GameCard[];
        }
      } catch {
        /* fallback below */
      }

      if (!cards.length) {
        cards = [
          {
            id: `${slug}-fb-1`,
            game: slug,
            deck: deckName,
            en: "Pokiri",
            te: "పోకిరి",
            answerEn: "Pokiri",
            answerTe: "పోకిరి",
            difficulty: 1,
            tags: ["fallback"],
            verified: false,
          },
          {
            id: `${slug}-fb-2`,
            game: slug,
            deck: deckName,
            en: "Magadheera",
            te: "మగధీర",
            answerEn: "Magadheera",
            answerTe: "మగధీర",
            difficulty: 1,
            tags: ["fallback"],
            verified: false,
          },
          {
            id: `${slug}-fb-3`,
            game: slug,
            deck: deckName,
            en: "Eega",
            te: "ఈగ",
            answerEn: "Eega",
            answerTe: "ఈగ",
            difficulty: 1,
            tags: ["fallback"],
            verified: false,
          },
        ];
      }

      // Fisher-Yates shuffle
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [cards[i], cards[j]] = [cards[j]!, cards[i]!];
      }

      dispatch({
        type: "INIT",
        gameId: slug,
        deck: deckName,
        cards,
        duration,
        players,
      });
    }

    void loadGame();
  }, [slug]);

  // Countdown timer
  useEffect(() => {
    if (s.phase !== "getReady") return;
    const id = setInterval(() => {
      audio.countdown();
      dispatch({ type: "COUNTDOWN_TICK" });
    }, 1000);
    return () => clearInterval(id);
  }, [s.phase, audio]);

  // Round turn timer
  useEffect(() => {
    if (s.phase !== "playing") return;
    const id = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);
    return () => clearInterval(id);
  }, [s.phase]);

  // Support immediate time-up in test environments
  useEffect(() => {
    const handleTimeUp = () => dispatch({ type: "TIME_UP" });
    window.addEventListener("judge-time-up", handleTimeUp);
    return () => window.removeEventListener("judge-time-up", handleTimeUp);
  }, []);

  // Auto-pause on tab switch / background
  useEffect(() => {
    const handleVisChange = () => {
      if (document.hidden) {
        dispatch({ type: "PAUSE" });
      }
    };
    document.addEventListener("visibilitychange", handleVisChange);
    return () => document.removeEventListener("visibilitychange", handleVisChange);
  }, []);

  // Clear visual stamp
  useEffect(() => {
    if (!s.stamp) return;
    const id = setTimeout(() => dispatch({ type: "CLEAR_STAMP" }), 250);
    return () => clearTimeout(id);
  }, [s.stamp]);

  // Wake lock
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock
      .request("screen")
      .then((l) => {
        lock = l;
      })
      .catch(() => {});
    return () => {
      lock?.release().catch(() => {});
    };
  }, []);

  // When allDone, save results and navigate to results page
  useEffect(() => {
    if (s.phase === "allDone") {
      audio.timeUp();
      sessionStorage.setItem("judge.results", JSON.stringify(s.turnSummaries));
      sessionStorage.setItem("judge.players", JSON.stringify(s.players));
      sessionStorage.setItem("judge.gameId", slug);
      router.push(`/play/${slug}/results`);
    }
  }, [s.phase, s.turnSummaries, s.players, slug, router, audio]);

  // Handlers
  const handleCorrect = useCallback(() => {
    if (s.phase !== "playing") return;
    audio.correct();
    navigator.vibrate?.(50);
    setStreak((prev) => {
      const next = prev + 1;
      if (next >= 3) setConfettiTrigger((c) => c + 1);
      return next;
    });
    dispatch({ type: "CORRECT" });
  }, [s.phase, audio]);

  const handleSkip = useCallback(() => {
    if (s.phase !== "playing") return;
    audio.pass();
    navigator.vibrate?.(30);
    setStreak(0);
    dispatch({ type: "SKIP" });
  }, [s.phase, audio]);

  const currentPlayer = s.players[s.currentPlayerIndex] ?? {
    id: "p1",
    name: "Player 1",
  };
  const currentCard = s.cards[s.currentIndex];
  const pct = s.duration > 0 ? (s.secondsLeft / s.duration) * 100 : 0;
  const timerColor = pct > 40 ? "#00C853" : pct > 15 ? "#F6BE18" : "#EC1276";
  const bg = s.stamp === "correct" ? "#00C853" : s.stamp === "skip" ? "#EC1276" : "#EAE6DF";

  // 1. Loading State
  // 1. Passing Phone Screen between turns
  if (s.phase === "passingPhone") {
    return (
      <div className="wall-safe-round flex flex-col items-center justify-center bg-yellow text-center">
        <div className="text-6xl mb-4" aria-hidden>
          📱 🤝
        </div>
        <p className="text-lg font-black uppercase tracking-wider text-ink">
          <Tx v={J.passPhoneTo} />
        </p>
        <h2 className="anton-title mt-2 text-4xl font-black text-ink">
          {currentPlayer.name}
        </h2>
        <button
          type="button"
          onClick={() => dispatch({ type: "PHONE_PASSED" })}
          className="wall-btn mt-8 min-h-[56px] bg-white px-8 text-xl font-black text-ink shadow-[4px_4px_0_#141313]"
          data-testid="judge-ready-btn"
        >
          <Tx v={J.readyButton} />
        </button>
      </div>
    );
  }

  // 3. Turn End Screen (Summary of current player's score)
  if (s.phase === "turnEnd") {
    const isLastTurn = s.currentTurn >= s.totalTurns;
    return (
      <div className="wall-safe-round flex flex-col items-center justify-center bg-[#EAE6DF] text-center">
        <div className="wall-shake w-full max-w-sm rounded-[24px] border-[3px] border-ink bg-white p-6 shadow-[6px_6px_0_#141313]">
          <span className="rounded-full border-2 border-ink bg-yellow px-3 py-1 text-xs font-black uppercase">
            <Tx v={J.turnSummary} />
          </span>
          <h2 className="anton-title mt-3 text-3xl font-black text-ink">
            {currentPlayer.name}
          </h2>
          <div className="mt-4 rounded-[16px] border-[2.5px] border-ink bg-[#F4F1EA] p-4">
            <span className="text-xs font-black uppercase tracking-wider text-ink">
              <Tx v={J.score} />
            </span>
            <div className="mono-num mt-1 text-5xl font-black text-ink">
              {s.currentTurnCorrect}
            </div>
            <div className="mt-2 text-xs font-bold text-ink">
              {s.currentTurnCorrect} {lang === "te" ? "సరైనవి" : "correct"} · {s.currentTurnSkipped}{" "}
              {lang === "te" ? "వదిలేసినవి" : "skipped"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: "NEXT_TURN" })}
            className="wall-btn mt-6 w-full bg-yellow py-3 text-lg font-black text-ink"
            data-testid="judge-next-turn-btn"
          >
            {isLastTurn ? (
              <Tx v={J.resultsTitle} />
            ) : (
              <Tx v={J.nextTurn} />
            )}
          </button>
        </div>
      </div>
    );
  }

  // 4. Active Playing Screen (with getReady countdown overlay so card area paints immediately for LCP)
  const isRapidFire = slug === "rapid-fire";
  const clueText = currentCard ? (lang === "te" ? currentCard.te : currentCard.en) : "";
  const answerText = currentCard
    ? (lang === "te"
        ? currentCard.answerTe ?? currentCard.te
        : currentCard.answerEn ?? currentCard.en)
    : "";

  return (
    <div
      className="wall-safe-round relative flex flex-col overflow-hidden p-0 transition-colors duration-150"
      style={{ backgroundColor: bg }}
      data-testid="judge-round-screen"
    >
      {s.phase === "loading" || s.phase === "getReady" ? (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-yellow/95 p-6 text-center">
          <p className="text-xl font-black uppercase tracking-widest text-ink">
            <Tx v={J.getReady} />
          </p>
          <p className="mt-2 text-2xl font-black text-ink">{currentPlayer.name}</p>
          <p
            className="anton-title text-[130px] font-black leading-none text-ink"
            aria-live="assertive"
          >
            {s.countdown}
          </p>
        </div>
      ) : null}
      <ConfettiBurst trigger={confettiTrigger} />
      <QuitRoundDialog
        open={quitOpen}
        onOpenChange={setQuitOpen}
        onConfirm={() => router.push(`/play/${slug}`)}
      />
      <HowToPlayDialog
        open={helpOpen}
        onClose={() => {
          setHelpOpen(false);
          dispatch({ type: "RESUME" });
        }}
        title={lang === "te" ? "ఎలా ఆడాలి" : "How to play"}
        dontShow={dontShowHelp}
        onToggleDontShow={setDontShowHelp}
        steps={[
          {
            title: lang === "te" ? "1. జడ్జ్ కార్డు చదువుతారు" : "1. Judge reads the clue",
            body: lang === "te"
              ? "మిగిలిన వారు ఫోన్ చూడకుండా విని సమాధానం చెప్పాలి."
              : "Keep the screen to yourself and read or show the clue.",
          },
          {
            title: lang === "te" ? "2. సరి లేదా స్కిప్" : "2. Correct or Skip",
            body: lang === "te"
              ? "సరైన జవాబుకు ఆకుపచ్చ, వదిలేయడానికి స్కిప్ నొక్కండి."
              : "Tap Correct on a hit or Skip to jump to the next card.",
          },
          {
            title: lang === "te" ? "3. సమయం ముగిసేలోపు" : "3. Beat the timer",
            body: lang === "te"
              ? "అందరి వంతు అయిపోయాక విజేతను చూడండి!"
              : "Highest score across all turns wins!",
          },
        ]}
      />
      {/* Top Timer Progress Bar */}
      <div className="relative h-3 w-full border-b-2 border-ink bg-card">
        <div
          className="h-full transition-all duration-200"
          style={{ width: `${pct}%`, backgroundColor: timerColor }}
        />
      </div>
      <div className="pt-2">
        <OfflineBanner offline={offline} />
      </div>

      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-4 pt-3">
        {/* Score pill + Streak */}
        <div className="flex items-center gap-1.5">
          <div
            className="mono-num rounded-full border-2 border-ink bg-white px-3 py-1 text-base font-black text-ink shadow-[2px_2px_0_#141313]"
            aria-label="Score"
          >
            ✓ {s.currentTurnCorrect}
          </div>
          {streak >= 2 ? (
            <div className="mono-num rounded-full border-2 border-ink bg-magenta px-2.5 py-1 text-xs font-black text-white shadow-[2px_2px_0_#141313]">
              🔥 {streak}
            </div>
          ) : null}
        </div>

        {/* Current Judge Indicator */}
        <div className="rounded-full border-2 border-ink bg-yellow px-3 py-0.5 text-xs font-black uppercase text-ink">
          {currentPlayer.name}
        </div>

        {/* Actions: Help, Pause & Sound */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "PAUSE" });
              setHelpOpen(true);
            }}
            aria-label="How to play"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white text-sm font-black text-ink shadow-[2px_2px_0_#141313]"
          >
            ?
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
            aria-label={s.muted ? "Unmute" : "Mute"}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white text-sm font-black text-ink shadow-[2px_2px_0_#141313]"
          >
            {s.muted ? "🔇" : "🔊"}
          </button>

          {/* Pause Modal via Radix Dialog */}
          <Dialog.Root
            open={pauseOpen}
            onOpenChange={(o) => {
              setPauseOpen(o);
              if (o) dispatch({ type: "PAUSE" });
            }}
          >
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Pause"
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white text-sm font-black text-ink shadow-[2px_2px_0_#141313]"
                data-testid="judge-pause-btn"
              >
                ⏸
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-ink/60" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border-[3px] border-ink bg-white p-6 shadow-[6px_6px_0_#141313]">
                <Dialog.Title className="anton-title text-2xl text-ink">
                  <Tx v={J.paused} />
                </Dialog.Title>
                <div className="mt-5 flex flex-col gap-3">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "RESUME" })}
                      className="wall-btn bg-yellow text-ink"
                    >
                      <Tx v={J.resume} />
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={() => {
                      setPauseOpen(false);
                      setQuitOpen(true);
                    }}
                    className="wall-btn bg-card text-ink"
                  >
                    <Tx v={J.quit} />
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {/* Seconds Left Pill */}
          <div
            className="mono-num rounded-full border-2 border-ink bg-white px-3 py-1 text-base font-black text-ink shadow-[2px_2px_0_#141313]"
            data-testid="judge-seconds-left"
          >
            {s.secondsLeft}s
          </div>
        </div>
      </header>

      {/* Card View: Clue & Answer */}
      <div className="flex flex-1 flex-col justify-center px-4 py-3">
        <div className="mx-auto w-full max-w-sm rounded-[24px] border-[3px] border-ink bg-white p-5 shadow-[6px_6px_0_#141313]">
          {/* THE JUDGE READS Header */}
          <div className="text-center">
            <span className="rounded-full border border-ink/40 bg-card px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-ink">
              <Tx v={J.theJudgeReads} />
            </span>
          </div>

          {/* Clue Area */}
          <div className="my-5 flex min-h-[120px] items-center justify-center text-center">
            <div
              className={`font-black text-ink leading-[1.2] ${
                slug === "emoji-cinema"
                  ? "text-5xl"
                  : lang === "te"
                    ? "text-[32px]"
                    : "anton-title text-[36px]"
              }`}
              data-testid="judge-clue"
            >
              {clueText}
            </div>
          </div>

          {/* Yellow Answer Strip (Visible only to the Judge holding phone) */}
          <div className="rounded-[16px] border-[2.5px] border-ink bg-yellow p-3.5 text-center shadow-[3px_3px_0_#141313]">
            <div className="text-[10px] font-black uppercase tracking-widest text-ink opacity-70">
              <Tx v={isRapidFire ? J.acceptedAnswersLabel : J.answerLabel} />
            </div>
            <div
              className="mt-1 font-black text-ink leading-tight"
              style={{ fontSize: lang === "te" ? "22px" : "20px" }}
              data-testid="judge-answer"
            >
              {answerText}
            </div>
            {currentCard?.hint && (
              <div className="mt-1 text-[11px] font-bold text-ink/70">
                {currentCard.hint}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Thumb Action Buttons */}
      <footer className="grid grid-cols-2 gap-3 p-4">
        <button
          type="button"
          onClick={handleSkip}
          className="wall-btn min-h-[58px] bg-white text-lg font-black text-ink shadow-[4px_4px_0_#141313]"
          data-testid="judge-skip-btn"
        >
          <Tx v={J.skip} />
        </button>
        <button
          type="button"
          onClick={handleCorrect}
          className="wall-btn min-h-[58px] bg-[#00C853] text-lg font-black text-ink shadow-[4px_4px_0_#141313]"
          data-testid="judge-correct-btn"
        >
          <Tx v={J.correct} />
        </button>
      </footer>
    </div>
  );
}
