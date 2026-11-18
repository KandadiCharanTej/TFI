"use client";

import { useEffect, useState } from "react";
import { getCharadesWinners, type CharadesTeamScore } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { FeedbackSticker } from "@/components/feedback-sticker";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { ConfettiBurst } from "@/components/confetti-burst";
import { Badge, Sticker, TicketStub, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { GAME_TRANSLATIONS } from "@/lib/i18n-games";
import { drawWallSharePoster, SHARE_TEMPLATES, type ShareTemplate } from "@/lib/share-card";
import { playPartySound } from "@/lib/sound";

const RESULTS_KEY = "tfi.charades.results";

interface StoredCharadesResults {
  scores: CharadesTeamScore[];
}

export default function DumbCharadesResultsPage() {
  const { lang } = useLang();
  const t = useT();
  const [results, setResults] = useState<StoredCharadesResults | null>(null);
  const [showNames, setShowNames] = useState(false);
  const [templateIdx, setTemplateIdx] = useState(0);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const template: ShareTemplate = SHARE_TEMPLATES[templateIdx] ?? "score";

  useEffect(() => {
    document.title = `Dumb Charades Results | TFI & Pitch`;
    try {
      const raw = sessionStorage.getItem(RESULTS_KEY);
      if (raw) {
        setResults(JSON.parse(raw) as StoredCharadesResults);
        playPartySound("win");
      }
    } catch {
      /* ignore */
    }
  }, [lang]);

  if (!results) {
    return (
      <AppFrame>
        <div className="mx-auto max-w-[480px] p-4">
          <Sticker className="space-y-4 p-6 text-center">
            <h1 className="h2-title m-0 text-ink">
              <Tx v={GAME_TRANSLATIONS.judge.resultsTitle} />
            </h1>
            <p className="m-0 text-sm font-bold text-ink/75">
              No recent game found. Start a new round of Dumb Charades!
            </p>
            <WallLinkButton href="/play/dumb-charades" variant="yellow">
              <Tx v={GAME_TRANSLATIONS.judge.playAgain} /> →
            </WallLinkButton>
          </Sticker>
        </div>
      </AppFrame>
    );
  }

  const sorted = [...results.scores].sort((a, b) => b.score - a.score);
  const winners = getCharadesWinners(sorted);
  const isTie = winners.length > 1;

  const handleShare = async () => {
    const canvas = document.createElement("canvas");
    drawWallSharePoster(canvas, {
      template,
      gameTitle: "Dumb Charades",
      headline: isTie ? winners.map((w) => w.team.name).join(" & ") : (winners[0]?.team.name ?? "Team 1"),
      subline: `${winners[0]?.score ?? 0} pts · TFI Movie Edition`,
      rows: sorted.map((sc) => ({ label: sc.team.name, value: `${sc.score} pts` })),
      showNames,
      unofficialFooter: TRANSLATIONS.brand.unofficialDisclaimer.en,
      gameColor: "#00C853",
    });
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!blob) {
      setShareMsg(t(GAME_TRANSLATIONS.judge.shareFailed));
      return;
    }
    const file = new File([blob], "tfi-dumb-charades.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "TFI & Pitch — Dumb Charades" });
        setShareMsg(t(GAME_TRANSLATIONS.judge.shareDone));
        return;
      } catch {
        /* fallback */
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tfi-dumb-charades.png";
    a.click();
    URL.revokeObjectURL(url);
    setShareMsg(t(GAME_TRANSLATIONS.judge.shareSaved));
  };

  return (
    <AppFrame>
      <ConfettiBurst trigger={1} />
      <div className="mx-auto max-w-[520px] space-y-6 p-4">
        <Sticker className="space-y-5 p-6 text-center">
          <Badge tone={isTie ? "cyan" : "yellow"}>
            <Tx v={isTie ? GAME_TRANSLATIONS.judge.tie : GAME_TRANSLATIONS.judge.winner} />
          </Badge>

          <TicketStub
            bg="green"
            data-testid="charades-winner-display"
            header={
              <div className="flex items-center justify-between text-ink">
                <span className="wall-label">
                  <Tx v={TRANSLATIONS.common.admitOneGang} />
                </span>
                <span className="wall-label">Dumb Charades</span>
              </div>
            }
            footer={
              <p className="mono-num m-0 text-xl font-bold text-ink">
                {winners[0]?.score ?? 0} pts
              </p>
            }
          >
            <h1 className="h1-title m-0 text-ink">
              {isTie ? winners.map((w) => w.team.name).join(" & ") : winners[0]?.team.name}
            </h1>
          </TicketStub>

          <div className="space-y-2.5 text-left">
            {sorted.map((sc, idx) => (
              <div
                key={sc.team.id}
                data-testid={`charades-score-row-${idx}`}
                className={`flex items-center justify-between rounded-[14px] border-2 border-ink px-4 py-3 ${
                  idx === 0 ? "bg-yellow" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="mono-num flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-white text-sm font-black">
                    {idx + 1}
                  </span>
                  <span className="text-[16px] font-extrabold text-ink">{sc.team.name}</span>
                </div>
                <span className="mono-num text-[18px] font-black text-ink">{sc.score} pts</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t-2 border-ink/15 pt-4">
            <label className="flex cursor-pointer items-center justify-center gap-2 text-sm font-bold text-ink">
              <input
                type="checkbox"
                checked={showNames}
                onChange={(e) => setShowNames(e.target.checked)}
                className="h-5 w-5 accent-ink"
              />
              <Tx v={GAME_TRANSLATIONS.judge.showNames} />
            </label>

            <div className="grid grid-cols-1 gap-2 sm:flex">
              <WallButton
                type="button"
                variant="white"
                onClick={() => setTemplateIdx((i) => (i + 1) % SHARE_TEMPLATES.length)}
                className="px-4 text-sm"
              >
                🎨 {template.toUpperCase()}
              </WallButton>
              <WallButton type="button" variant="white" onClick={handleShare} className="w-full sm:flex-1">
                📸 <Tx v={GAME_TRANSLATIONS.judge.shareSticker} />
              </WallButton>
            </div>
            {shareMsg ? <p className="m-0 text-base font-bold text-ink">{shareMsg}</p> : null}
            <p className="m-0 text-[12px] font-semibold text-ink/80">
              <Tx v={TRANSLATIONS.brand.unofficialDisclaimer} />
            </p>
          </div>

          <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] z-20 flex flex-col gap-3 rounded-[18px] border-[3px] border-ink bg-concrete p-2 shadow-[0_4px_0_#141313] sm:flex-row md:static md:border-0 md:bg-transparent md:p-0 md:pt-2 md:shadow-none">
            <WallLinkButton href="/play/dumb-charades" variant="yellow" className="flex-1">
              <Tx v={GAME_TRANSLATIONS.judge.playAgain} />
            </WallLinkButton>
            <WallLinkButton href="/play" variant="white" className="flex-1">
              <Tx v={TRANSLATIONS.common.backToPlayHome} />
            </WallLinkButton>
          </div>
          <div className="flex justify-center">
            <FeedbackSticker />
          </div>
        </Sticker>
      </div>
    </AppFrame>
  );
}
