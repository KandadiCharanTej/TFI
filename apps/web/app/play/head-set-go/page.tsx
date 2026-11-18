"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { GameSetupHero } from "@/components/game-setup-hero";
import { Tx, useLang } from "@/components/lang-provider";
import { HowToPlayDialog } from "@/components/round-ui";
import { Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { recordRecentlyPlayed } from "@/lib/games";
import { TRANSLATIONS } from "@/lib/i18n";
import { GAME_TRANSLATIONS } from "@/lib/i18n-games";
import { markUserAudioInteraction, playPartySound } from "@/lib/sound";

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
  const [howToOpen, setHowToOpen] = useState(false);
  const [dontShowHelp, setDontShowHelp] = useState(false);

  function decreaseTimer() {
    setDuration((d) => Math.max(30, d - 30));
  }
  function increaseTimer() {
    setDuration((d) => Math.min(180, d + 30));
  }

  function handleStart() {
    markUserAudioInteraction();
    playPartySound("tap");
    recordRecentlyPlayed("head-set-go");
    sessionStorage.setItem("hsg.deck", deck);
    sessionStorage.setItem("hsg.duration", String(duration));
    router.push("/play/head-set-go/round");
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-[540px] space-y-5 pb-20 md:pb-8">
        <div className="flex items-center justify-between gap-2">
          <WallLinkButton href="/play" variant="white" size="sm">
            ← <Tx v={TRANSLATIONS.common.backToPlay} />
          </WallLinkButton>
        </div>

        <GameSetupHero
          slug="head-set-go"
          gameNumber="01"
          iconKind="head"
          title={GAME_TRANSLATIONS.hsg.name}
          description={GAME_TRANSLATIONS.hsg.tip}
          onOpenHowTo={() => setHowToOpen(true)}
          howToTestId="hsg-help-btn"
        />

        <HowToPlayDialog
          open={howToOpen}
          onClose={() => setHowToOpen(false)}
          title={lang === "te" ? "హెడ్ సెట్ గో ఎలా ఆడాలి" : "How to play Head Set Go"}
          dontShow={dontShowHelp}
          onToggleDontShow={setDontShowHelp}
          steps={[
            {
              title: lang === "te" ? "1. నుదుటిపై ఫోన్" : "1. Phone on forehead",
              body:
                lang === "te"
                  ? "ఫోన్ అడ్డంగా తిప్పి నుదుటిపై ఉంచండి."
                  : "Hold the phone sideways against your forehead.",
            },
            {
              title: lang === "te" ? "2. ఫ్రెండ్స్ క్లూస్ ఇస్తారు" : "2. Friends shout clues",
              body:
                lang === "te"
                  ? "పేరు చెప్పకుండా సినిమా క్లూస్ చెప్తారు."
                  : "They describe the card without saying the name.",
            },
            {
              title: lang === "te" ? "3. సరైనది లేదా పాస్" : "3. Correct or Pass",
              body:
                lang === "te"
                  ? "కుడివైపు సరి, ఎడమవైపు పాస్ నొక్కండి."
                  : "Tap right for Correct, left for Pass.",
            },
          ]}
        />

        {/* Deck picker */}
        <Sticker className="p-5">
          <p className="wall-label m-0 mb-3 text-ink">
            <Tx v={GAME_TRANSLATIONS.hsg.pickDeck} />
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
                  className="flex items-center gap-4 rounded-[16px] border-[3px] border-ink p-4 text-left transition-all"
                  style={{
                    backgroundColor: active ? "#F6BE18" : "#F4F1EA",
                    boxShadow: active ? "0 5px 0 #141313" : "none",
                  }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border-2 border-ink bg-sticker">
                    <span className="text-2xl">{d.id === "movies" ? "🎬" : "⭐"}</span>
                  </div>
                  <div>
                    <p className="h3-title m-0 text-ink">{d.label[lang]}</p>
                    <p className="m-0 text-[13px] font-bold text-ink/80">{d.count} cards</p>
                  </div>
                  {active ? (
                    <span className="ml-auto text-xl font-extrabold text-ink" aria-hidden>
                      ✓
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </Sticker>

        {/* Timer stepper */}
        <Sticker className="p-5">
          <p className="wall-label m-0 mb-3 text-ink">
            <Tx v={GAME_TRANSLATIONS.hsg.timerHeading} />
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={decreaseTimer}
              disabled={duration <= 30}
              aria-label="Decrease timer"
              className="flex min-h-[56px] min-w-[56px] items-center justify-center rounded-[16px] border-[3px] border-ink bg-card text-2xl font-extrabold text-ink shadow-[0_4px_0_#141313] disabled:opacity-40"
            >
              −
            </button>
            <div
              className="mono-num flex-1 text-center text-[52px] font-bold leading-none text-ink"
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
              className="flex min-h-[56px] min-w-[56px] items-center justify-center rounded-[16px] border-[3px] border-ink bg-card text-2xl font-extrabold text-ink shadow-[0_4px_0_#141313] disabled:opacity-40"
            >
              +
            </button>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-1">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDuration(t)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full"
                aria-label={`${t} seconds`}
              >
                <span
                  className={`block h-3.5 w-3.5 rounded-full border-2 border-ink transition-all ${
                    t === duration ? "bg-ink" : "bg-card"
                  }`}
                />
              </button>
            ))}
          </div>
        </Sticker>

        <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] z-20 rounded-[18px] border-[3px] border-ink bg-concrete p-2 shadow-[0_4px_0_#141313] md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <WallButton
            variant="yellow"
            size="lg"
            className="w-full"
            onClick={handleStart}
            data-testid="hsg-start-btn"
          >
            <Tx v={GAME_TRANSLATIONS.hsg.start} /> →
          </WallButton>
        </div>
      </div>
    </AppFrame>
  );
}
