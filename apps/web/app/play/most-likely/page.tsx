"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MODE_COLORS } from "@tfi/config/tokens";
import { AppFrame } from "@/components/app-frame";
import { GameTitle } from "@/components/game-title";
import { WallIcon } from "@/components/icons";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { Badge, Chip, Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { GAMES_CATALOG, TRANSLATIONS } from "@/lib/i18n";

const V = TRANSLATIONS.vote;
const PLAYERS_KEY = "tfi.vote.players";
const CONFIG_KEY = "tfi.vote.config";
const HIDE_HOWTO_KEY = "tfi.vote.hideHowTo";

export default function MostLikelySetupPage() {
  const router = useRouter();
  const { lang } = useLang();
  const t = useT();
  const catalogGame = GAMES_CATALOG.find((g) => g.slug === "most-likely")!;

  const [players, setPlayers] = useState<string[]>(["Anu", "Bala", "Charan", "Divya"]);
  const [newPlayer, setNewPlayer] = useState("");
  const [promptCount, setPromptCount] = useState<5 | 8 | 10>(5);
  const [showRulesModal, setShowRulesModal] = useState(false);

  useEffect(() => {
    document.title = `${catalogGame.title[lang]} | TFI & Pitch`;
  }, [catalogGame, lang]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLAYERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          setPlayers(parsed.slice(0, 10));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistPlayers = (next: string[]) => {
    setPlayers(next);
    try {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const handleAddPlayer = () => {
    const trimmed = newPlayer.trim();
    if (!trimmed || players.length >= 10) return;
    persistPlayers([...players, trimmed]);
    setNewPlayer("");
  };

  const handleRemovePlayer = (idx: number) => {
    if (players.length <= 3) return;
    persistPlayers(players.filter((_, i) => i !== idx));
  };

  const handlePlayerNameChange = (idx: number, val: string) => {
    const next = [...players];
    next[idx] = val;
    persistPlayers(next);
  };

  const handleStart = () => {
    const cleanPlayers = players.map((n, i) => ({
      id: `p${i + 1}`,
      name: n.trim() || `Player ${i + 1}`,
    }));
    try {
      sessionStorage.setItem(
        CONFIG_KEY,
        JSON.stringify({
          players: cleanPlayers,
          totalPrompts: promptCount,
        }),
      );
    } catch {
      /* ignore */
    }
    router.push("/play/most-likely/round");
  };

  const resetHowTo = () => {
    try {
      localStorage.removeItem(HIDE_HOWTO_KEY);
    } catch {
      /* ignore */
    }
    setShowRulesModal(true);
  };

  return (
    <AppFrame>
      <div className="mx-auto max-w-[520px] space-y-6 p-4">
        <div className="flex items-center justify-between gap-2">
          <WallLinkButton href="/play" variant="white" size="sm">
            ← <Tx v={TRANSLATIONS.common.backToPlay} />
          </WallLinkButton>
          <button
            type="button"
            onClick={resetHowTo}
            aria-label={t(V.howToTitle)}
            data-testid="vote-help-btn"
            className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-ink bg-white text-lg font-black text-ink shadow-btn active:translate-y-0.5"
          >
            ?
          </button>
        </div>

        <Sticker className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <Badge tone="yellow">GAME #{catalogGame.number}</Badge>
            <Badge tone="white"><Tx v={TRANSLATIONS.modes.onePhone} /></Badge>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] border-[2.5px] border-ink text-ink"
              style={{ backgroundColor: MODE_COLORS.onePhone }}
            >
              <div className="h-10 w-10">
                <WallIcon kind="most" />
              </div>
            </div>
            <div>
              <GameTitle
                title={catalogGame.title}
                as="h1"
                teClassName="text-[28px]"
                enClassName="text-[26px]"
              />
              <p className="m-0 mt-1 text-[13px] font-bold text-ink/80">
                <Tx v={TRANSLATIONS.gamesMeta.mostLikelyRule} />
              </p>
            </div>
          </div>

          {/* Players (3 to 10) */}
          <div className="mt-6 space-y-2.5">
            <label className="block text-[13px] font-black uppercase tracking-wider text-ink">
              <Tx v={V.playersLabel} />
            </label>
            <div className="space-y-2">
              {players.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={name}
                    maxLength={20}
                    onChange={(e) => handlePlayerNameChange(idx, e.target.value)}
                    placeholder={t(TRANSLATIONS.judge.playerNamePlaceholder)}
                    aria-label={`${t(TRANSLATIONS.judge.playerNamePlaceholder)} ${idx + 1}`}
                    data-testid={`vote-player-input-${idx}`}
                    className="min-h-[44px] flex-1 rounded-[10px] border-2 border-ink bg-card px-3 text-[15px] font-bold text-ink focus:bg-white focus:outline-none"
                  />
                  {players.length > 3 ? (
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(idx)}
                      aria-label={`${t(TRANSLATIONS.judge.removePlayer)} ${name}`}
                      className="min-h-[44px] rounded-[10px] border-2 border-ink bg-white px-3 text-xs font-black text-ink"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {players.length < 10 ? (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newPlayer}
                  maxLength={20}
                  onChange={(e) => setNewPlayer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPlayer();
                    }
                  }}
                  placeholder={t(TRANSLATIONS.judge.playerNamePlaceholder)}
                  aria-label={t(TRANSLATIONS.judge.addPlayer)}
                  data-testid="vote-add-player-input"
                  className="min-h-[44px] flex-1 rounded-[10px] border-2 border-dashed border-ink bg-white px-3 text-[14px] font-bold text-ink focus:border-solid focus:outline-none"
                />
                <WallButton
                  type="button"
                  variant="white"
                  size="sm"
                  onClick={handleAddPlayer}
                  data-testid="vote-add-player-btn"
                >
                  + <Tx v={TRANSLATIONS.judge.addPlayer} />
                </WallButton>
              </div>
            ) : null}
          </div>

          {/* Prompts count (5, 8, 10) */}
          <div className="mt-5">
            <span className="mb-2 block text-[13px] font-black uppercase tracking-wider text-ink">
              <Tx v={V.promptsCount} />
            </span>
            <div className="flex flex-wrap gap-2">
              {([5, 8, 10] as const).map((cnt) => (
                <Chip
                  key={cnt}
                  active={promptCount === cnt}
                  onClick={() => setPromptCount(cnt)}
                  data-testid={`prompts-${cnt}`}
                >
                  {cnt}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <WallButton
              type="button"
              variant="yellow"
              className="w-full text-[18px]"
              onClick={handleStart}
              data-testid="vote-start-btn"
            >
              <Tx v={TRANSLATIONS.judge.startGame} /> →
            </WallButton>
          </div>
        </Sticker>

        {showRulesModal ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t(V.howToTitle)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
          >
            <Sticker className="w-full max-w-[420px] space-y-4 p-6">
              <h2 className="anton-title m-0 text-[26px] text-ink">
                <Tx v={V.howToTitle} />
              </h2>
              <div className="space-y-2.5 text-left">
                {[
                  { title: V.step1Title, body: V.step1Body },
                  { title: V.step2Title, body: V.step2Body },
                  { title: V.step3Title, body: V.step3Body },
                ].map((s, idx) => (
                  <div key={idx} className="rounded-[12px] border-2 border-ink bg-card p-3">
                    <p className="m-0 text-[14px] font-black text-ink"><Tx v={s.title} /></p>
                    <p className="m-0 mt-0.5 text-[13px] font-semibold text-ink/80"><Tx v={s.body} /></p>
                  </div>
                ))}
              </div>
              <WallButton
                type="button"
                variant="yellow"
                className="w-full"
                onClick={() => setShowRulesModal(false)}
              >
                <Tx v={TRANSLATIONS.charades.gotItStart} />
              </WallButton>
            </Sticker>
          </div>
        ) : null}
      </div>
    </AppFrame>
  );
}
