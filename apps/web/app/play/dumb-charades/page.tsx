"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DifficultyMix } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { GameSetupHero } from "@/components/game-setup-hero";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { Chip, Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { recordRecentlyPlayed } from "@/lib/games";
import { GAMES_CATALOG, TRANSLATIONS } from "@/lib/i18n";
import { GAME_TRANSLATIONS } from "@/lib/i18n-games";

const C = GAME_TRANSLATIONS.charades;
const TEAMS_KEY = "tfi.charades.teams";
const CONFIG_KEY = "tfi.charades.config";
const HIDE_HOWTO_KEY = "tfi.charades.hideHowTo";

export default function DumbCharadesSetupPage() {
  const router = useRouter();
  const { lang } = useLang();
  const t = useT();
  const catalogGame = GAMES_CATALOG.find((g) => g.slug === "dumb-charades")!;

  const [teams, setTeams] = useState<string[]>(["Team A", "Team B"]);
  const [newTeam, setNewTeam] = useState("");
  const [roundsPerTeam, setRoundsPerTeam] = useState<3 | 5 | 8>(3);
  const [duration, setDuration] = useState<60 | 90 | 120>(90);
  const [difficultyMix, setDifficultyMix] = useState<DifficultyMix>("mixed");
  const [showRulesModal, setShowRulesModal] = useState(false);

  useEffect(() => {
    document.title = `${catalogGame.title[lang]} | TFI & Pitch`;
  }, [catalogGame, lang]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TEAMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) {
          setTeams(parsed.slice(0, 4));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistTeams = (next: string[]) => {
    setTeams(next);
    try {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const handleAddTeam = () => {
    const trimmed = newTeam.trim();
    if (!trimmed || teams.length >= 4) return;
    persistTeams([...teams, trimmed]);
    setNewTeam("");
  };

  const handleRemoveTeam = (idx: number) => {
    if (teams.length <= 2) return;
    persistTeams(teams.filter((_, i) => i !== idx));
  };

  const handleTeamNameChange = (idx: number, val: string) => {
    const next = [...teams];
    next[idx] = val;
    persistTeams(next);
  };

  const handleStart = () => {
    recordRecentlyPlayed("dumb-charades");
    const cleanTeams = teams.map((n, i) => ({
      id: `t${i + 1}`,
      name: n.trim() || `Team ${i + 1}`,
    }));
    try {
      sessionStorage.setItem(
        CONFIG_KEY,
        JSON.stringify({
          teams: cleanTeams,
          roundsPerTeam,
          duration,
          difficultyMix,
        }),
      );
    } catch {
      /* ignore */
    }
    router.push("/play/dumb-charades/round");
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
      <div className="mx-auto max-w-[540px] space-y-5">
        <div className="flex items-center justify-between gap-2">
          <WallLinkButton href="/play" variant="white" size="sm">
            ← <Tx v={TRANSLATIONS.common.backToPlay} />
          </WallLinkButton>
        </div>

        <GameSetupHero
          slug="dumb-charades"
          gameNumber={catalogGame.number}
          iconKind="charades"
          title={catalogGame.title}
          description={GAME_TRANSLATIONS.gamesMeta.dumbCharadesRule}
          onOpenHowTo={resetHowTo}
          howToTestId="charades-help-btn"
        />

        <Sticker className="p-5 sm:p-6">
          <p className="wall-label m-0 text-ink/75">
            <Tx v={TRANSLATIONS.gameSetup.stepFlow} />
          </p>

          {/* Teams (2 to 4) */}
          <div className="mt-4 space-y-2.5">
            <label className="block text-[13px] font-black uppercase tracking-wider text-ink">
              <Tx v={C.teams} />
            </label>
            <div className="space-y-2">
              {teams.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={name}
                    maxLength={24}
                    onChange={(e) => handleTeamNameChange(idx, e.target.value)}
                    placeholder={t(C.teamPlaceholder)}
                    aria-label={`${t(C.teamPlaceholder)} ${idx + 1}`}
                    data-testid={`team-input-${idx}`}
                    className="min-h-[44px] flex-1 rounded-[10px] border-2 border-ink bg-card px-3 text-[15px] font-bold text-ink focus:bg-white focus:outline-none"
                  />
                  {teams.length > 2 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveTeam(idx)}
                      aria-label={`${t(GAME_TRANSLATIONS.judge.removePlayer)} ${name}`}
                      className="min-h-[44px] rounded-[10px] border-2 border-ink bg-white px-3 text-xs font-black text-ink"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {teams.length < 4 ? (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newTeam}
                  maxLength={24}
                  onChange={(e) => setNewTeam(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTeam();
                    }
                  }}
                  placeholder={t(C.teamPlaceholder)}
                  aria-label={t(C.addTeam)}
                  data-testid="add-team-input"
                  className="min-h-[44px] flex-1 rounded-[10px] border-2 border-dashed border-ink bg-white px-3 text-[14px] font-bold text-ink focus:border-solid focus:outline-none"
                />
                <WallButton type="button" variant="white" size="sm" onClick={handleAddTeam} data-testid="add-team-btn">
                  + <Tx v={C.addTeam} />
                </WallButton>
              </div>
            ) : null}
          </div>

          {/* Rounds per team */}
          <div className="mt-5">
            <span className="mb-2 block text-[13px] font-black uppercase tracking-wider text-ink">
              <Tx v={C.roundsPerTeam} />
            </span>
            <div className="flex flex-wrap gap-2">
              {([3, 5, 8] as const).map((r) => (
                <Chip
                  key={r}
                  active={roundsPerTeam === r}
                  onClick={() => setRoundsPerTeam(r)}
                  data-testid={`rounds-${r}`}
                >
                  {r}
                </Chip>
              ))}
            </div>
          </div>

          {/* Acting time */}
          <div className="mt-5">
            <span className="mb-2 block text-[13px] font-black uppercase tracking-wider text-ink">
              <Tx v={C.actingTime} />
            </span>
            <div className="flex flex-wrap gap-2">
              {([60, 90, 120] as const).map((sec) => (
                <Chip
                  key={sec}
                  active={duration === sec}
                  onClick={() => setDuration(sec)}
                  data-testid={`duration-${sec}`}
                >
                  {sec}s
                </Chip>
              ))}
            </div>
          </div>

          {/* Difficulty mix */}
          <div className="mt-5">
            <span className="mb-2 block text-[13px] font-black uppercase tracking-wider text-ink">
              <Tx v={C.difficultyMix} />
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "mixed", label: C.mixed },
                  { id: "easy", label: C.easy },
                  { id: "medium", label: C.medium },
                  { id: "hard", label: C.hard },
                ] as const
              ).map((d) => (
                <Chip
                  key={d.id}
                  active={difficultyMix === d.id}
                  onClick={() => setDifficultyMix(d.id)}
                  data-testid={`diff-${d.id}`}
                >
                  <Tx v={d.label} />
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
              data-testid="charades-start-btn"
            >
              <Tx v={GAME_TRANSLATIONS.judge.startGame} /> →
            </WallButton>
          </div>
        </Sticker>

        {showRulesModal ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t(C.howToTitle)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 p-4"
          >
            <Sticker className="w-full max-w-[420px] space-y-4 p-6">
              <h2 className="h2-title m-0 text-ink">
                <Tx v={C.howToTitle} />
              </h2>
              <div className="space-y-3 text-left">
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
              <WallButton
                type="button"
                variant="yellow"
                className="w-full"
                onClick={() => setShowRulesModal(false)}
              >
                <Tx v={C.gotItStart} />
              </WallButton>
            </Sticker>
          </div>
        ) : null}
      </div>
    </AppFrame>
  );
}
