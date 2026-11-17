"use client";

import { useEffect, useState } from "react";
import { Tx, useLang } from "./lang-provider";
import { TicketStub } from "./sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

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
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(4);
  const [userInteracted, setUserInteracted] = useState(false);
  const [flash, setFlash] = useState<"pass" | "correct" | null>(null);

  useEffect(() => {
    if (userInteracted) return;
    if (typeof window !== "undefined") {
      const reducedAttr = document.documentElement.getAttribute("data-reduced-motion") === "true";
      const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
      if (reducedAttr || mq) return;
    }
    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % DEMO_CARDS.length);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [userInteracted]);

  const handleAction = (kind: "pass" | "correct") => {
    setUserInteracted(true);
    setFlash(kind);
    if (kind === "correct") {
      setScore((s) => s + 1);
    }
    window.setTimeout(() => {
      setFlash(null);
      setIdx((prev) => (prev + 1) % DEMO_CARDS.length);
    }, 180);
  };

  const card = DEMO_CARDS[idx] ?? DEMO_CARDS[0]!;
  const progressPct = Math.round(((idx + 1) / DEMO_CARDS.length) * 100);

  return (
    <div className="relative flex w-full max-w-[400px] flex-col items-center">
      {/* The ONLY tilted decorative element on the screen: -3deg Magenta TicketStub */}
      <div className="z-10 -mb-3 self-end pr-2">
        <TicketStub
          bg="magenta"
          tilt={-3}
          className="px-1 py-0.5 shadow-[0_4px_0_#141313]"
          data-testid="hero-ticket-stub"
        >
          <span className="block font-bold leading-none text-white text-[19px]">
            <Tx v={TRANSLATIONS.landing.admitOneGang} />
          </span>
        </TicketStub>
      </div>

      {/* Phone-shaped frame containing the live playable Head Set Go card */}
      <div
        role="group"
        aria-label={TRANSLATIONS.landing.mock.judgeCardLabel[lang]}
        data-testid="hero-live-demo"
        className="w-full rounded-[28px] border-[3px] border-ink bg-ink p-2.5 shadow-[0_7px_0_#141313]"
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
                {lang === "te" ? `స్కోర్ ${score}` : `Score ${score}`}
              </span>
              <span className="mono-num rounded-full border-2 border-ink bg-yellow px-2.5 py-0.5 text-[13px] text-ink">
                0:42
              </span>
            </div>
          </div>

          <div
            className="mt-2.5 h-2 w-full overflow-hidden rounded-full border border-ink bg-card"
            aria-hidden="true"
          >
            <div
              className="h-full bg-ink transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Card text hero: Film title and year only (no dialogues) */}
          <div className="my-5 rounded-[16px] border-2 border-ink bg-card px-4 py-7 text-center">
            <span className="wall-label block text-ink/75">{card.year}</span>
            {lang === "te" ? (
              <div className="mt-1">
                <p
                  className="te-lead m-0 text-[36px] text-ink sm:text-[42px]"
                  data-testid="hero-demo-card-title"
                >
                  {card.te}
                </p>
                <p className="te-sub m-0 text-[15px] text-ink/80">{card.en}</p>
              </div>
            ) : (
              <p
                className="m-0 mt-1 font-display text-[38px] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[44px]"
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
              className="wall-btn min-h-[48px] w-full bg-magenta px-3 text-[19px] font-bold text-white"
            >
              <Tx v={TRANSLATIONS.common.pass} />
            </button>
            <button
              type="button"
              data-testid="hero-demo-correct"
              onClick={() => handleAction("correct")}
              className="wall-btn min-h-[48px] w-full bg-green px-3 text-[17px] font-bold text-ink"
            >
              <Tx v={TRANSLATIONS.common.correct} />
            </button>
          </div>
        </div>
      </div>

      {/* Tiny caption "Try it" with arrow */}
      <div className="mt-2.5 flex items-center gap-1.5 text-[14px] font-bold text-ink">
        <span aria-hidden="true">↑</span>
        <span>
          <Tx v={TRANSLATIONS.landing.tryIt} />
        </span>
      </div>
    </div>
  );
}
