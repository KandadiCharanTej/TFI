"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { GameTitle } from "@/components/game-title";
import { Tx, useLang } from "@/components/lang-provider";
import { Badge, Sticker, WallButton } from "@/components/sticker-kit";
import { recordRecentlyPlayed } from "@/lib/games";
import { TRANSLATIONS } from "@/lib/i18n";

const DECKS = [
  { id: "movies", label: { en: "Movies", te: "సినిమాలు" }, count: 30, color: "#F6BE18" },
  { id: "actors", label: { en: "Actors & Directors", te: "నటులు & దర్శకులు" }, count: 40, color: "#00E5FF" },
] as const;

type DeckId = "movies" | "actors";
const TIMER_OPTIONS = [30, 60, 90, 120, 150, 180];

export default function HsgSetupPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [deck, setDeck] = useState<DeckId>("movies");
  const [duration, setDuration] = useState(60);

  function decreaseTimer() {
    setDuration((d) => Math.max(30, d - 30));
  }
  function increaseTimer() {
    setDuration((d) => Math.min(180, d + 30));
  }

  function handleStart() {
    recordRecentlyPlayed("head-set-go");
    sessionStorage.setItem("hsg.deck", deck);
    sessionStorage.setItem("hsg.duration", String(duration));
    router.push("/play/head-set-go/round");
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-[520px] space-y-5 p-4 pb-24 md:pb-8">
        {/* Header + 3-step indicator */}
        <Sticker className="p-5">
          <div className="flex items-center justify-between gap-2">
            <Badge tone="yellow">Game #01</Badge>
            <Badge tone="white">
              <Tx v={TRANSLATIONS.modes.onePhone} />
            </Badge>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-ink bg-yellow"
            />
            <GameTitle
              as="h1"
              title={TRANSLATIONS.hsg.name}
              enClassName="text-[32px]"
              teClassName="text-[32px]"
            />
          </div>
          <p className="m-0 mt-1.5 text-[15px] font-medium text-ink/90">
            <Tx v={TRANSLATIONS.hsg.tip} />
          </p>
          <p className="wall-label m-0 mt-3 text-ink/75">
            <Tx v={TRANSLATIONS.gameSetup.stepFlow} />
          </p>
        </Sticker>

        {/* Deck picker */}
        <Sticker className="p-5">
          <p className="wall-label m-0 mb-3 text-ink">
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
                  className="flex items-center gap-4 rounded-[14px] border-2 border-ink p-4 text-left transition-all"
                  style={{
                    backgroundColor: active ? "#F6BE18" : "#F4F1EA",
                    boxShadow: active ? "0 4px 0 #141313" : "none",
                  }}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border-2 border-ink bg-sticker"
                  >
                    <span className="text-2xl">{d.id === "movies" ? "🎬" : "⭐"}</span>
                  </div>
                  <div>
                    <p className="h3-title m-0 text-ink">{d.label[lang]}</p>
                    <p className="m-0 text-[13px] font-semibold text-ink/80">{d.count} cards</p>
                  </div>
                  {active && (
                    <span className="ml-auto text-xl font-bold text-ink" aria-hidden>
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
          <p className="wall-label m-0 mb-3 text-ink">
            <Tx v={TRANSLATIONS.hsg.timerHeading} />
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={decreaseTimer}
              disabled={duration <= 30}
              aria-label="Decrease timer"
              className="flex min-h-[54px] min-w-[54px] items-center justify-center rounded-[14px] border-2 border-ink bg-card text-2xl font-bold text-ink shadow-[0_3px_0_#141313] disabled:opacity-40"
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
              className="flex min-h-[54px] min-w-[54px] items-center justify-center rounded-[14px] border-2 border-ink bg-card text-2xl font-bold text-ink shadow-[0_3px_0_#141313] disabled:opacity-40"
            >
              +
            </button>
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDuration(t)}
                className="flex min-h-[28px] min-w-[28px] items-center justify-center rounded-full"
                aria-label={`${t} seconds`}
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full border border-ink transition-all ${
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
          className="w-full text-[18px]"
          onClick={handleStart}
          data-testid="hsg-start-btn"
        >
          <Tx v={TRANSLATIONS.hsg.start} /> →
        </WallButton>
      </div>
    </AppFrame>
  );
}
