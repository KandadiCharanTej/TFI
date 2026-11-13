"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { Tx } from "@/components/lang-provider";
import { Badge, Sticker, WallButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

const DECKS = [
  { id: "movies", label: { en: "Movies", te: "సినిమాలు" }, count: 30, color: "#F5E642" },
  { id: "actors", label: { en: "Actors & Directors", te: "నటులు & దర్శకులు" }, count: 30, color: "#EC1276" },
] as const;

type DeckId = "movies" | "actors";
const TIMER_OPTIONS = [30, 60, 90, 120, 150, 180];

export default function HsgSetupPage() {
  const router = useRouter();
  const [deck, setDeck] = useState<DeckId>("movies");
  const [duration, setDuration] = useState(60);

  function decreaseTimer() {
    setDuration((d) => Math.max(30, d - 30));
  }
  function increaseTimer() {
    setDuration((d) => Math.min(180, d + 30));
  }

  function handleStart() {
    // Store setup in sessionStorage so the round page can read it
    sessionStorage.setItem("hsg.deck", deck);
    sessionStorage.setItem("hsg.duration", String(duration));
    router.push("/play/head-set-go/round");
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-[480px] space-y-5 p-4">
        {/* Header */}
        <Sticker className="p-5">
          <div className="flex items-center justify-between">
            <Badge tone="yellow">GAME #01</Badge>
            <Badge tone="white">1 PHONE</Badge>
          </div>
          <h1 className="anton-title mt-3 text-[32px] leading-[1.05] text-ink">
            Head Set Go
          </h1>
          <p className="mt-1 text-[14px] font-bold text-ink">
            <Tx v={TRANSLATIONS.hsg.tip} />
          </p>
        </Sticker>

        {/* Deck picker */}
        <Sticker className="p-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-ink">
            <Tx v={TRANSLATIONS.hsg.pickDeck} />
          </p>
          <div className="flex flex-col gap-3">
            {DECKS.map((d) => {
              const active = deck === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDeck(d.id)}
                  aria-pressed={active}
                  className={`flex items-center gap-4 rounded-[14px] border-[2.5px] border-ink p-4 text-left transition-all ${
                    active ? "shadow-[4px_4px_0px_#141313]" : ""
                  }`}
                  style={{ backgroundColor: active ? d.color : "#F5F0E8" }}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border-2 border-ink"
                    style={{ backgroundColor: d.color }}
                  >
                    <span className="text-2xl">{d.id === "movies" ? "🎬" : "⭐"}</span>
                  </div>
                  <div>
                    <p className="anton-title m-0 text-[20px] leading-[1.1] text-ink">{d.label.en}</p>
                    <p className="m-0 text-[13px] font-bold text-ink">{d.count} cards</p>
                  </div>
                  {active && (
                    <span className="ml-auto text-xl" aria-hidden>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Sticker>

        {/* Timer stepper */}
        <Sticker className="p-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-ink">
            <Tx v={TRANSLATIONS.hsg.timerHeading} />
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={decreaseTimer}
              disabled={duration <= 30}
              aria-label="Decrease timer"
              className="flex min-h-[52px] min-w-[52px] items-center justify-center rounded-[12px] border-[2.5px] border-ink bg-card text-2xl font-extrabold text-ink shadow-[3px_3px_0px_#141313] disabled:opacity-40"
            >
              −
            </button>
            <div
              className="mono-num flex-1 text-center text-[48px] font-bold leading-none text-ink"
              data-testid="hsg-timer-value"
            >
              {duration}
              <span className="ml-1 text-[18px] font-bold text-ink">s</span>
            </div>
            <button
              type="button"
              onClick={increaseTimer}
              disabled={duration >= 180}
              aria-label="Increase timer"
              className="flex min-h-[52px] min-w-[52px] items-center justify-center rounded-[12px] border-[2.5px] border-ink bg-card text-2xl font-extrabold text-ink shadow-[3px_3px_0px_#141313] disabled:opacity-40"
            >
              +
            </button>
          </div>
          <div className="mt-2 flex justify-center gap-1">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDuration(t)}
                className="flex min-h-[24px] min-w-[24px] items-center justify-center rounded-full"
                aria-label={`${t} seconds`}
              >
                <span
                  className={`block h-2 w-2 rounded-full border border-ink transition-all ${
                    t === duration ? "bg-ink" : "bg-card"
                  }`}
                />
              </button>
            ))}
          </div>
        </Sticker>

        {/* Start button */}
        <WallButton
          variant="yellow"
          className="w-full text-[20px]"
          onClick={handleStart}
          data-testid="hsg-start-btn"
        >
          <Tx v={TRANSLATIONS.hsg.start} /> →
        </WallButton>
      </div>
    </AppFrame>
  );
}
