"use client";

/**
 * Head Set Go — Landscape round screen.
 * No AppFrame — layout.tsx strips chrome for paths ending in /round.
 */

import { useEffect, useRef, useCallback, useMemo, useState, useReducer } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Tx, useLang } from "@/components/lang-provider";
import {
  ConfettiBurst,
  HowToPlayDialog,
  QuitRoundDialog,
  RoundSkeleton,
} from "@/components/round-ui";
import { TRANSLATIONS } from "@/lib/i18n";

// ─── Types ───────────────────────────────────────────────────────────────────

interface RoundCard { id: string; en: string; te: string; }

type Stamp = "correct" | "pass" | null;
type Phase = "loading" | "getReady" | "playing" | "paused" | "done";

interface RS {
  cards: RoundCard[];
  currentIndex: number;
  correctIds: string[];
  passedIds: string[];
  secondsLeft: number;
  duration: number;
  phase: Phase;
  countdown: number;
  stamp: Stamp;
  muted: boolean;
}

type RA =
  | { type: "SEED"; cards: RoundCard[]; duration: number }
  | { type: "COUNTDOWN_TICK" }
  | { type: "TICK" }
  | { type: "CORRECT" }
  | { type: "PASS" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "CLEAR_STAMP" }
  | { type: "TOGGLE_MUTE" };

function reducer(s: RS, a: RA): RS {
  switch (a.type) {
    case "SEED":
      return { ...s, cards: a.cards, secondsLeft: a.duration, duration: a.duration, phase: "getReady", countdown: 3 };
    case "COUNTDOWN_TICK":
      if (s.countdown <= 1) return { ...s, phase: "playing", countdown: 3 };
      return { ...s, countdown: s.countdown - 1 };
    case "TICK": {
      const left = Math.max(0, s.secondsLeft - 1);
      return left <= 0 ? { ...s, secondsLeft: 0, phase: "done" } : { ...s, secondsLeft: left };
    }
    case "CORRECT": {
      if (s.phase !== "playing") return s;
      const card = s.cards[s.currentIndex];
      const ni = s.currentIndex + 1;
      return { ...s, correctIds: card ? [...s.correctIds, card.id] : s.correctIds, currentIndex: ni, phase: ni >= s.cards.length ? "done" : s.phase, stamp: "correct" };
    }
    case "PASS": {
      if (s.phase !== "playing") return s;
      const card = s.cards[s.currentIndex];
      const ni = s.currentIndex + 1;
      return { ...s, passedIds: card ? [...s.passedIds, card.id] : s.passedIds, currentIndex: ni, phase: ni >= s.cards.length ? "done" : s.phase, stamp: "pass" };
    }
    case "PAUSE": return s.phase === "playing" ? { ...s, phase: "paused" } : s;
    case "RESUME": return { ...s, phase: "getReady", countdown: 3 };
    case "CLEAR_STAMP": return { ...s, stamp: null };
    case "TOGGLE_MUTE": return { ...s, muted: !s.muted };
    default: return s;
  }
}

const INITIAL: RS = { cards: [], currentIndex: 0, correctIds: [], passedIds: [], secondsLeft: 60, duration: 60, phase: "loading", countdown: 3, stamp: null, muted: false };

// ─── Audio (Web Audio, no files) ─────────────────────────────────────────────

function useAudio(muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const beep = useCallback((freq: number, dur: number, vol = 0.3) => {
    if (muted) return;
    if (typeof navigator !== "undefined" && "userActivation" in navigator && !navigator.userActivation.hasBeenActive) return;
    try {
      ctxRef.current ??= new AudioContext();
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; gain.gain.value = vol;
      osc.start(); osc.stop(ctx.currentTime + dur);
    } catch { /* silent */ }
  }, [muted]);
  const clack = useCallback(() => {
    if (muted) return;
    if (typeof navigator !== "undefined" && "userActivation" in navigator && !navigator.userActivation.hasBeenActive) return;
    try {
      ctxRef.current ??= new AudioContext();
      const ctx = ctxRef.current;
      // Short percussive clapperboard "clack": dual high-mid transient
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "triangle";
      osc2.type = "square";
      osc1.frequency.setValueAtTime(1400, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.055);
      osc2.frequency.setValueAtTime(720, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.055);
      gain.gain.setValueAtTime(0.32, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.06);
      osc2.stop(ctx.currentTime + 0.06);
    } catch { /* silent */ }
  }, [muted]);
  return useMemo(
    () => ({
      clack,
      correct: () => beep(880, 0.1),
      pass: () => beep(330, 0.1),
      countdown: () => beep(660, 0.07, 0.2),
      timeUp: () => beep(220, 0.35),
    }),
    [beep, clack],
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HsgRoundPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [s, dispatch] = useReducer(reducer, INITIAL);
  const [isLandscape, setIsLandscape] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [dontShowHelp, setDontShowHelp] = useState(false);
  const [streak, setStreak] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const audio = useAudio(s.muted);

  // Orientation
  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load cards from sessionStorage / JSON
  useEffect(() => {
    async function load() {
      const deckId = sessionStorage.getItem("hsg.deck") ?? "movies";
      const duration = parseInt(sessionStorage.getItem("hsg.duration") ?? "60", 10);
      let cards: RoundCard[] = [];
      try {
        const url = `/cards/head-set-go-${deckId}.json`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json() as RoundCard[];
          cards = [...data];
        }
      } catch { /* ignore */ }
      if (!cards.length) {
        // Fallback hardcoded cards so the game still works
        cards = [
          { id: "f1", en: "Pokiri", te: "పోకిరి" },
          { id: "f2", en: "Magadheera", te: "మగధీర" },
          { id: "f3", en: "Baahubali", te: "బాహుబలి" },
          { id: "f4", en: "Pushpa", te: "పుష్ప" },
          { id: "f5", en: "RRR", te: "ఆర్ఆర్ఆర్" },
          { id: "f6", en: "Arya", te: "ఆర్య" },
          { id: "f7", en: "Jersey", te: "జెర్సీ" },
          { id: "f8", en: "Uppena", te: "ఉప్పెన" },
        ];
      }
      // Shuffle
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [cards[i], cards[j]] = [cards[j]!, cards[i]!];
      }
      dispatch({ type: "SEED", cards, duration });
    }
    void load();
  }, []);

  // Countdown
  useEffect(() => {
    if (s.phase !== "getReady") return;
    const id = setInterval(() => {
      if (s.countdown <= 1) audio.clack();
      else audio.countdown();
      dispatch({ type: "COUNTDOWN_TICK" });
    }, 1000);
    return () => clearInterval(id);
  }, [s.phase, s.countdown, audio]);

  // Round timer
  useEffect(() => {
    if (s.phase !== "playing") return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [s.phase]);

  // Auto-pause on tab hide
  useEffect(() => {
    const fn = () => { if (document.hidden) dispatch({ type: "PAUSE" }); };
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, []);

  // Stamp flash (< 250ms per V2 spec)
  useEffect(() => {
    if (!s.stamp) return;
    const id = setTimeout(() => dispatch({ type: "CLEAR_STAMP" }), 220);
    return () => clearTimeout(id);
  }, [s.stamp]);

  // Navigate to results
  useEffect(() => {
    if (s.phase !== "done") return;
    audio.timeUp();
    sessionStorage.setItem("hsg.correctIds", JSON.stringify(s.correctIds));
    sessionStorage.setItem("hsg.passedIds", JSON.stringify(s.passedIds));
    sessionStorage.setItem("hsg.allCards", JSON.stringify(s.cards));
    const id = setTimeout(() => router.push("/play/head-set-go/results"), 500);
    return () => clearTimeout(id);
  }, [s.phase, s.correctIds, s.passedIds, s.cards, router, audio]);

  // Wake Lock
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock.request("screen").then((l) => { lock = l; }).catch(() => {/* silent */});
    return () => { lock?.release().catch(() => {/* silent */}); };
  }, []);

  const handlePass = useCallback(() => {
    if (s.phase !== "playing") return;
    audio.pass(); navigator.vibrate?.(30); setStreak(0); dispatch({ type: "PASS" });
  }, [s.phase, audio]);

  const handleCorrect = useCallback(() => {
    if (s.phase !== "playing") return;
    audio.correct(); navigator.vibrate?.(50);
    setStreak((prev) => {
      const next = prev + 1;
      if (next >= 3) setConfettiTrigger((c) => c + 1);
      return next;
    });
    dispatch({ type: "CORRECT" });
  }, [s.phase, audio]);

  const currentCard = s.cards[s.currentIndex];
  const cardText = currentCard ? (lang === "te" ? currentCard.te : currentCard.en) : "—";
  const pct = s.duration > 0 ? (s.secondsLeft / s.duration) * 100 : 0;
  const timerColor = s.secondsLeft <= 10 ? "#EC1276" : "#141313";
  const bg = s.stamp === "correct" ? "#00C853" : s.stamp === "pass" ? "#EC1276" : "#F6BE18";

  // Loading
  if (s.phase === "loading") {
    return (
      <main className="wall-safe-round flex items-center justify-center bg-yellow">
        <RoundSkeleton />
      </main>
    );
  }

  // Portrait splash
  if (!isLandscape) {
    return (
      <main className="wall-safe-round flex flex-col items-center justify-center gap-4 bg-yellow p-8 text-center">
        <div className="text-6xl" aria-hidden>📱➡️</div>
        <p className="h1-title text-ink"><Tx v={TRANSLATIONS.hsg.turnSideways} /></p>
        <p className="text-[15px] font-bold text-ink"><Tx v={TRANSLATIONS.hsg.turnSidewaysNote} /></p>
      </main>
    );
  }

  return (
    <main className="wall-safe-round relative flex flex-col overflow-hidden p-0 transition-colors duration-150" style={{ background: bg }}>
      {s.phase === "getReady" ? (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-yellow/95">
          <p className="wall-label text-[16px] text-ink"><Tx v={TRANSLATIONS.hsg.getReady} /></p>
          <p className="mono-num text-[120px] font-bold leading-none text-ink" aria-live="assertive">{s.countdown}</p>
        </div>
      ) : null}
      <ConfettiBurst trigger={confettiTrigger} />
      <QuitRoundDialog open={quitOpen} onOpenChange={setQuitOpen} onConfirm={() => router.push("/play/head-set-go")} />
      <HowToPlayDialog
        open={helpOpen}
        onClose={() => { setHelpOpen(false); dispatch({ type: "RESUME" }); }}
        title={lang === "te" ? "హెడ్ సెట్ గో ఎలా ఆడాలి" : "How to play Head Set Go"}
        dontShow={dontShowHelp}
        onToggleDontShow={setDontShowHelp}
        steps={[
          { title: lang === "te" ? "1. నుదిటిపై ఫోన్" : "1. Phone on forehead", body: lang === "te" ? "ఫోన్ అడ్డంగా తిప్పి నుదిటిపై ఉంచండి." : "Hold the phone landscape against your forehead." },
          { title: lang === "te" ? "2. ఫ్రెండ్స్ క్లూస్ ఇస్తారు" : "2. Friends shout clues", body: lang === "te" ? "పేరు చెప్పకుండా క్లూస్ ఇస్తారు." : "They describe the card without saying the name." },
          { title: lang === "te" ? "3. సరి లేదా పాస్" : "3. Correct or Pass", body: lang === "te" ? "కుడివైపు సరి, ఎడమవైపు పాస్ నొక్కండి." : "Tap right for Correct, left for Pass." },
        ]}
      />
      {/* Timer bar: ink on white, turns magenta at 10s */}
      <div className="relative h-3 w-full border-b-2 border-ink bg-white">
        <div className="h-full transition-[width]" style={{ width: `${pct}%`, backgroundColor: timerColor }} />
      </div>

      {/* Top pills */}
      <div className="flex items-center justify-between px-6 pt-3">
        <div className="mono-num rounded-full border-2 border-ink bg-sticker px-4 py-1.5 text-[18px] font-black text-ink shadow-[2px_2px_0px_#141313]" aria-label={TRANSLATIONS.hsg.timeLeft.en}>
          {s.secondsLeft}s
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { dispatch({ type: "PAUSE" }); setHelpOpen(true); }}
            aria-label="How to play"
            className="rounded-full border-2 border-ink bg-sticker px-3 py-1.5 text-sm font-extrabold text-ink shadow-[2px_2px_0px_#141313]"
          >
            ?
          </button>
          <Dialog.Root open={pauseOpen} onOpenChange={(o) => { setPauseOpen(o); if (o) dispatch({ type: "PAUSE" }); }}>
            <Dialog.Trigger asChild>
              <button type="button" aria-label={TRANSLATIONS.hsg.pause.en} className="rounded-full border-2 border-ink bg-sticker px-4 py-1.5 text-sm font-extrabold text-ink shadow-[2px_2px_0px_#141313]">⏸</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-ink/60" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border-[2.5px] border-ink bg-sticker p-6 shadow-[0_5px_0_#141313]">
                <Dialog.Title className="h2-title text-ink"><Tx v={TRANSLATIONS.hsg.paused} /></Dialog.Title>
                <div className="mt-5 flex flex-col gap-3">
                  <Dialog.Close asChild>
                    <button type="button" onClick={() => dispatch({ type: "RESUME" })} className="wall-btn bg-yellow text-ink"><Tx v={TRANSLATIONS.hsg.resume} /></button>
                  </Dialog.Close>
                  <button type="button" onClick={() => { setPauseOpen(false); setQuitOpen(true); }} className="wall-btn bg-card text-ink"><Tx v={TRANSLATIONS.hsg.quit} /></button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <div className="flex items-center gap-2">
          {streak >= 2 ? (
            <div className="mono-num rounded-full border-2 border-ink bg-magenta px-3 py-1 text-[19px] font-bold text-white">
              🔥 {streak}
            </div>
          ) : null}
          <div className="mono-num rounded-full border-2 border-ink bg-sticker px-4 py-1.5 text-[18px] font-bold text-ink" aria-label={TRANSLATIONS.hsg.correctCount.en}>
            ✓ {s.correctIds.length}
          </div>
        </div>
      </div>

      {/* Card word — hero of the screen: 96px+ TE with EN below, 72px+ EN in English mode */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center" aria-live="polite" aria-label={TRANSLATIONS.hsg.currentCard.en}>
        {lang === "te" && currentCard ? (
          <div>
            <p className="te-lead m-0 text-[clamp(56px,9vw,96px)] text-ink">
              {currentCard.te}
            </p>
            <p className="te-sub m-0 mt-1 text-[22px] text-ink/85">
              {currentCard.en}
            </p>
          </div>
        ) : (
          <p className="m-0 font-display text-[clamp(52px,8vw,80px)] font-extrabold leading-[1.06] tracking-[-0.02em] text-ink">
            {cardText}
          </p>
        )}
      </div>

      {/* Tap zones — Pass (magenta / white large bold) and Correct! (green / ink) */}
      <div className="flex border-t-2 border-ink" style={{ height: "36%" }}>
        <button
          type="button"
          onClick={handlePass}
          aria-label={TRANSLATIONS.hsg.passStamp.en}
          className="flex flex-1 items-center justify-center border-r-2 border-ink bg-magenta text-[24px] font-bold text-white"
        >
          <Tx v={TRANSLATIONS.hsg.passStamp} />
        </button>
        <button
          type="button"
          onClick={handleCorrect}
          aria-label={TRANSLATIONS.hsg.correctStamp.en}
          className="flex flex-1 items-center justify-center bg-green text-[24px] font-bold text-ink"
        >
          <Tx v={TRANSLATIONS.hsg.correctStamp} />
        </button>
      </div>
    </main>
  );
}
