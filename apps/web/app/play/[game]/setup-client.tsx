"use client";

import { useState, useEffect } from "react";
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
import type { GameRegistryEntry } from "@tfi/game-core";

const J = GAME_TRANSLATIONS.judge;

interface SetupClientProps {
  game: GameRegistryEntry;
  title: { en: string; te: string };
  description: { en: string; te: string };
  rule: { en: string; te: string };
}

export default function SetupClient({ game, title, description, rule }: SetupClientProps) {
  const router = useRouter();
  const { lang } = useLang();
  const [duration, setDuration] = useState(game.defaultTimerSec);
  const [howToOpen, setHowToOpen] = useState(false);
  const [dontShowHelp, setDontShowHelp] = useState(false);
  const [players, setPlayers] = useState<string[]>([
    lang === "te" ? "ఆటగాడు 1" : "Player 1",
    lang === "te" ? "ఆటగాడు 2" : "Player 2",
  ]);

  // Restore saved player names from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tfi.judge.players");
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        if (Array.isArray(parsed) && parsed.length >= 2) {
          setPlayers(parsed.slice(0, 8));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  function handleAddPlayer() {
    if (players.length >= 8) return;
    const nextNum = players.length + 1;
    const newName = lang === "te" ? `ఆటగాడు ${nextNum}` : `Player ${nextNum}`;
    setPlayers((prev) => [...prev, newName]);
  }

  function handleRemovePlayer(index: number) {
    if (players.length <= 2) return;
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  }

  function handleNameChange(index: number, val: string) {
    setPlayers((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  }

  function handleStart() {
    markUserAudioInteraction();
    playPartySound("tap");
    recordRecentlyPlayed(game.id);
    try {
      localStorage.setItem("tfi.judge.players", JSON.stringify(players));
    } catch {
      /* ignore */
    }

    const payload = {
      gameId: game.id,
      deck: game.deckIds[0] ?? `${game.id}-deck`,
      duration,
      players: players.map((name, i) => ({
        id: `p${i + 1}`,
        name: name.trim() || (lang === "te" ? `ఆటగాడు ${i + 1}` : `Player ${i + 1}`),
      })),
    };

    sessionStorage.setItem("judge.config", JSON.stringify(payload));
    router.push(`/play/${game.id}/round`);
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-[540px] space-y-5" data-testid="judge-setup-screen">
        <div className="flex items-center justify-between gap-2">
          <WallLinkButton href="/play" variant="white" size="sm">
            ← <Tx v={TRANSLATIONS.common.backToPlay} />
          </WallLinkButton>
        </div>

        <GameSetupHero
          slug={game.id}
          gameNumber={game.number}
          iconKind={game.iconId}
          title={title}
          description={description}
          onOpenHowTo={() => setHowToOpen(true)}
          howToTestId="judge-help-btn"
        />

        <HowToPlayDialog
          open={howToOpen}
          onClose={() => setHowToOpen(false)}
          title={title[lang]}
          dontShow={dontShowHelp}
          onToggleDontShow={setDontShowHelp}
          steps={[
            {
              title: lang === "te" ? "1. జడ్జ్ ఫోన్ పట్టుకుంటారు" : "1. Judge holds the phone",
              body: rule[lang],
            },
            {
              title: lang === "te" ? "2. పాస్ లేదా సరైనది" : "2. Tap Correct or Pass",
              body:
                lang === "te"
                  ? "సరైన జవాబుకు ఆకుపచ్చ బటన్, పాస్ చేయడానికి పింక్ బటన్ నొక్కండి."
                  : "Green scores a point, magenta skips to the next card.",
            },
            {
              title: lang === "te" ? "3. ఫోన్ పాస్ చేయండి" : "3. Pass the phone",
              body:
                lang === "te"
                  ? "ప్రతి ఆటగాడికి ఒక రౌండ్ ఉంటుంది. చివరలో విజేత తెలుస్తారు."
                  : "Each player takes a turn as Judge until everyone scores.",
            },
          ]}
        />

        {/* Players List (2 to 8) */}
        <Sticker className="p-5">
          <div className="flex items-center justify-between">
            <p className="m-0 text-xs font-black uppercase tracking-wider text-ink">
              <Tx v={J.players} /> (2–8)
            </p>
            {players.length < 8 && (
              <button
                type="button"
                onClick={handleAddPlayer}
                className="min-h-[44px] min-w-[44px] rounded-full border-2 border-ink bg-yellow px-4 py-1 text-sm font-black text-ink shadow-[2px_2px_0_#141313]"
                data-testid="add-player-btn"
              >
                + <Tx v={J.addPlayer} />
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2.5">
            {players.map((name, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="mono-num flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border-2 border-ink bg-card text-xs font-black text-ink">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  placeholder={lang === "te" ? `ఆటగాడు ${i + 1}` : `Player ${i + 1}`}
                  aria-label={`Player ${i + 1} name`}
                  maxLength={18}
                  className="min-h-[44px] flex-1 rounded-[10px] border-2 border-ink bg-white px-3 py-2 text-[16px] font-bold text-ink shadow-[2px_2px_0_#141313] focus:outline-none focus:ring-2 focus:ring-ink"
                  data-testid={`player-input-${i}`}
                />
                {players.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(i)}
                    aria-label={`Remove player ${i + 1}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border-2 border-ink bg-card text-base font-black text-ink shadow-[2px_2px_0_#141313] hover:bg-yellow hover:text-ink"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </Sticker>

        {/* Round Timer Stepper */}
        <Sticker className="p-5">
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-ink">
            <Tx v={J.roundTime} />
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDuration((d) => Math.max(20, d - 15))}
              disabled={duration <= 20}
              aria-label="Decrease timer"
              className="flex min-h-[52px] min-w-[52px] items-center justify-center rounded-[12px] border-[2.5px] border-ink bg-card text-2xl font-black text-ink shadow-[3px_3px_0_#141313] disabled:opacity-40"
            >
              −
            </button>
            <div
              className="mono-num flex-1 text-center text-[44px] font-black leading-none text-ink"
              data-testid="judge-timer-value"
            >
              {duration}
              <span className="ml-1 text-[16px] font-bold opacity-80">s</span>
            </div>
            <button
              type="button"
              onClick={() => setDuration((d) => Math.min(120, d + 15))}
              disabled={duration >= 120}
              aria-label="Increase timer"
              className="flex min-h-[52px] min-w-[52px] items-center justify-center rounded-[12px] border-[2.5px] border-ink bg-card text-2xl font-black text-ink shadow-[3px_3px_0_#141313] disabled:opacity-40"
            >
              +
            </button>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {game.timerOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setDuration(opt)}
                className={`min-h-[44px] min-w-[44px] rounded-full border-2 border-ink px-3.5 py-1 text-sm font-black transition-all ${
                  opt === duration ? "bg-yellow shadow-[2px_2px_0_#141313]" : "bg-card text-ink/80"
                }`}
              >
                {opt}s
              </button>
            ))}
          </div>
        </Sticker>

        {/* Start Game Button */}
        <div>
          <WallButton
            variant="yellow"
            className="w-full text-[19px]"
            onClick={handleStart}
            data-testid="judge-start-btn"
          >
            <Tx v={J.startGame} /> →
          </WallButton>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <WallLinkButton href="/play" variant="white" size="sm">
            ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
          </WallLinkButton>
        </div>
      </div>
    </AppFrame>
  );
}
