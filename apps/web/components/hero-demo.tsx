"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SpeechSticker, Starburst, XMark } from "./art-kit";
import { Tx, useLang } from "./lang-provider";
import { CountUp } from "./motion-kit";
import { TicketStub } from "./sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { LANDING_TRANSLATIONS } from "@/lib/i18n-landing";
import { markUserAudioInteraction, playPartySound, triggerPartyHaptic } from "@/lib/sound";
import { isCalmActive, usePreferencesStore } from "@/lib/store";

const ConfettiBurst = dynamic(
  () => import("./confetti-burst").then((m) => m.ConfettiBurst),
  { ssr: false },
);

interface DemoCard {
  readonly en: string;
  readonly te: string;
  readonly year: number;
}

const DEMO_CARDS: readonly DemoCard[] = [
  { en: "Pokiri", te: "పోకిరి", year: 2006 },
  { en: "Magadheera", te: "మగధీర", year: 2009 },
  { en: "Baahubali", te: "బాహుబలి", year: 2015 },
  { en: "Athadu", te: "అతడు", year: 2005 },
  { en: "Pushpa", te: "పుష్ప", year: 2021 },
  { en: "Eega", te: "ఈగ", year: 2012 },
  { en: "Mahanati", te: "మహానటి", year: 2018 },
  { en: "Kalki 2898 AD", te: "కల్కి 2898 AD", year: 2024 },
] as const;

export function HeroDemo() {
  const { lang } = useLang();
  const calmMode = usePreferencesStore((s) => s.reducedMotion || s.osReducedMotion);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(4);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [confettiCount, setConfettiCount] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [flash, setFlash] = useState<"pass" | "correct" | null>(null);
  const [popCorrectSticker, setPopCorrectSticker] = useState(false);

  useEffect(() => {
    if (userInteracted || calmMode || isCalmActive()) return;
    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % DEMO_CARDS.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [userInteracted, calmMode]);

  const handleAction = (kind: "pass" | "correct") => {
    markUserAudioInteraction();
    setUserInteracted(true);
    setFlash(kind);

    if (kind === "correct") {
      setScore((s) => s + 1);
      setPopCorrectSticker(true);
      playPartySound("correct");
      triggerPartyHaptic("correct");
      const nextStreak = correctStreak + 1;
      setCorrectStreak(nextStreak);
      if (nextStreak % 3 === 0) {
        setConfettiCount((c) => c + 1);
        playPartySound("clack");
      }
      window.setTimeout(() => setPopCorrectSticker(false), 950);
    } else {
      playPartySound("pass");
      triggerPartyHaptic("pass");
    }

    window.setTimeout(() => {
      setFlash(null);
      setIdx((prev) => (prev + 1) % DEMO_CARDS.length);
    }, 220);
  };

  const card = DEMO_CARDS[idx] ?? DEMO_CARDS[0]!;
  const progressPct = Math.round(((idx + 1) / DEMO_CARDS.length) * 100);

  return (
    <div className="relative flex w-full max-w-[410px] flex-col items-center">
      <ConfettiBurst trigger={confettiCount} />

      {/* Decorative Starburst + FDFS SpeechSticker (pointer-events none, aria-hidden, desktop spaced cleanly) */}
      <div className="pointer-events-none absolute -left-8 -top-3 hidden md:block" aria-hidden="true">
        <Starburst color="white" size={52} />
      </div>
      <div className="pointer-events-none absolute -left-10 bottom-20 z-10 hidden sm:block" aria-hidden="true">
        <SpeechSticker tone="cyan" tilt={-2}>
          <Tx v={LANDING_TRANSLATIONS.fdfsCallout} />
        </SpeechSticker>
      </div>
      <div className="pointer-events-none absolute -right-6 bottom-10 hidden md:block" aria-hidden="true">
        <XMark color="magenta" size={34} tilt={12} />
      </div>

      {/* Decorative Tilted #1: Magenta TicketStub */}
      <div className="z-10 -mb-3 self-end pr-2">
        <TicketStub
          bg="magenta"
          tilt={-3}
          className="px-1 py-0.5 shadow-[0_5px_0_#141313]"
          data-testid="hero-ticket-stub"
        >
          <span className="block text-[19px] font-extrabold leading-none text-white">
            <Tx v={LANDING_TRANSLATIONS.admitOneGang} />
          </span>
        </TicketStub>
      </div>

      {/* Pops green SpeechSticker on Correct! tap */}
      {popCorrectSticker ? (
        <div
          aria-hidden="true"
          className="wall-stamp pointer-events-none absolute right-2 top-16 z-20"
        >
          <SpeechSticker tone="green" tilt={2}>
            ✓ <Tx v={TRANSLATIONS.common.correct} />
          </SpeechSticker>
        </div>
      ) : null}

      {/* Phone-shaped frame containing the live playable Head Set Go demo */}
      <div
        role="group"
        aria-label={LANDING_TRANSLATIONS.mock.judgeCardLabel[lang]}
        data-testid="hero-live-demo"
        className="w-full rounded-[28px] border-[3px] border-ink bg-ink p-2.5 shadow-[0_8px_0_#141313]"
      >
        <div
          className="wall-demo-panel relative overflow-hidden rounded-[20px] border-2 border-ink bg-sticker p-5 transition-colors duration-150"
          style={{
            backgroundColor:
              flash === "correct"
                ? "#00C853"
                : flash === "pass"
                  ? "#EC1276"
                  : "#FFFFFF",
          }}
        >
          {/* Thin top timer bar + mono score/clock */}
          <div className="flex items-center justify-between gap-3">
            <span className="wall-label text-ink">Head Set Go</span>
            <div className="flex items-center gap-2">
              <span className="mono-num text-[13px] text-ink" data-testid="hero-demo-score">
                {lang === "te" ? "స్కోర్ " : "Score "}
                <CountUp value={score} durationMs={260} />
              </span>
              <span className="mono-num rounded-full border-2 border-ink bg-yellow px-2.5 py-0.5 text-[13px] text-ink">
                0:42
              </span>
            </div>
          </div>

          <div
            className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full border-2 border-ink bg-card"
            aria-hidden="true"
          >
            <div
              className="h-full bg-ink transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Card text hero: Film title and year only (no dialogues) */}
          <div className="my-5 rounded-[16px] border-[2.5px] border-ink bg-card px-4 py-7 text-center">
            <span className="mono-num block text-[13px] text-ink/80">{card.year}</span>
            {lang === "te" ? (
              <div className="mt-1">
                <p
                  className="te-lead m-0 text-[38px] text-ink sm:text-[44px]"
                  data-testid="hero-demo-card-title"
                >
                  {card.te}
                </p>
                <p className="te-sub m-0 text-[15px] text-ink/80">{card.en}</p>
              </div>
            ) : (
              <p
                className="m-0 mt-1 text-[38px] font-extrabold leading-[1.06] tracking-[-0.02em] text-ink sm:text-[44px]"
                data-testid="hero-demo-card-title"
              >
                {card.en}
              </p>
            )}
          </div>

          {/* Interactive Pass (Magenta/White) & Correct! (Green/Ink) tap zones */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              data-testid="hero-demo-pass"
              onClick={() => handleAction("pass")}
              className="wall-btn min-h-[50px] w-full bg-magenta px-3 text-[19px] font-extrabold text-white"
            >
              <Tx v={TRANSLATIONS.common.pass} />
            </button>
            <button
              type="button"
              data-testid="hero-demo-correct"
              onClick={() => handleAction("correct")}
              className="wall-btn min-h-[50px] w-full bg-green px-3 text-[18px] font-extrabold text-ink"
            >
              <Tx v={TRANSLATIONS.common.correct} />
            </button>
          </div>
        </div>
      </div>

      {/* Tiny caption "Try it" with arrow */}
      <div className="mt-3 flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3.5 py-1 text-[13px] font-extrabold text-ink shadow-[0_3px_0_#141313]">
        <span aria-hidden="true">↑</span>
        <span>
          <Tx v={LANDING_TRANSLATIONS.tryIt} />
        </span>
      </div>
    </div>
  );
}
