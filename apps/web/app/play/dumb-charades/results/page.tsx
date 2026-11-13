"use client";

import { useEffect, useState } from "react";
import { getCharadesWinners, type CharadesTeamScore } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { Badge, Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

const RESULTS_KEY = "tfi.charades.results";

interface StoredCharadesResults {
  scores: CharadesTeamScore[];
}

async function generateCharadesSharePng(
  scores: CharadesTeamScore[],
  showNames: boolean,
): Promise<Blob | null> {
  try {
    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#EAE6DF";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#141313";
    for (let x = 20; x < W; x += 28) {
      for (let y = 20; y < H; y += 28) {
        ctx.globalAlpha = 0.08;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#141313";
    ctx.fillRect(92, 112, W - 160, H - 240);

    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#141313";
    ctx.lineWidth = 8;
    ctx.fillRect(80, 100, W - 160, H - 240);
    ctx.strokeRect(80, 100, W - 160, H - 240);

    ctx.fillStyle = "#F6BE18";
    ctx.fillRect(140, 160, W - 280, 80);
    ctx.strokeRect(140, 160, W - 280, 80);

    ctx.fillStyle = "#141313";
    ctx.font = "bold 42px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DUMB CHARADES", W / 2, 215);

    const sorted = [...scores].sort((a, b) => b.score - a.score);
    const winners = getCharadesWinners(sorted);
    const winnerText =
      winners.length > 1
        ? "IT'S A TIE!"
        : showNames && winners[0]
          ? `WINNERS: ${winners[0].team.name.toUpperCase()}`
          : `TOP SCORE: ${winners[0]?.score ?? 0} PTS`;

    ctx.font = "bold 52px sans-serif";
    ctx.fillStyle = "#EC1276";
    ctx.fillText(winnerText, W / 2, 340);

    sorted.slice(0, 4).forEach((sc, idx) => {
      const y = 440 + idx * 120;
      ctx.fillStyle = idx === 0 ? "#F6BE18" : "#F4F1EA";
      ctx.fillRect(140, y - 55, W - 280, 90);
      ctx.strokeRect(140, y - 55, W - 280, 90);

      ctx.fillStyle = "#141313";
      ctx.textAlign = "left";
      ctx.font = "bold 36px sans-serif";
      const label = showNames ? sc.team.name : `Team ${idx + 1}`;
      ctx.fillText(`${idx + 1}. ${label}`, 170, y);

      ctx.textAlign = "right";
      ctx.font = "bold 36px monospace";
      ctx.fillText(`${sc.score} pts`, W - 170, y);
    });

    ctx.textAlign = "center";
    ctx.fillStyle = "#141313";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText("TFI & Pitch", W / 2, 1140);

    ctx.font = "24px sans-serif";
    ctx.fillText("Unofficial fan-made game. Not affiliated with any film,", W / 2, 1240);
    ctx.fillText("actor, studio or team.", W / 2, 1280);

    return new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
  } catch {
    return null;
  }
}

export default function DumbCharadesResultsPage() {
  const { lang } = useLang();
  const t = useT();
  const [results, setResults] = useState<StoredCharadesResults | null>(null);
  const [showNames, setShowNames] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Dumb Charades Results | TFI & Pitch`;
    try {
      const raw = sessionStorage.getItem(RESULTS_KEY);
      if (raw) {
        setResults(JSON.parse(raw) as StoredCharadesResults);
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
            <h1 className="anton-title m-0 text-[28px] text-ink">
              <Tx v={TRANSLATIONS.judge.resultsTitle} />
            </h1>
            <p className="m-0 text-sm font-bold text-ink/75">
              No recent game found. Start a new round of Dumb Charades!
            </p>
            <WallLinkButton href="/play/dumb-charades" variant="yellow">
              <Tx v={TRANSLATIONS.judge.playAgain} /> →
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
    const blob = await generateCharadesSharePng(sorted, showNames);
    if (!blob) {
      setShareMsg(t(TRANSLATIONS.judge.shareFailed));
      return;
    }
    const file = new File([blob], "tfi-dumb-charades.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "TFI & Pitch — Dumb Charades" });
        setShareMsg(t(TRANSLATIONS.judge.shareDone));
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
    setShareMsg(t(TRANSLATIONS.judge.shareSaved));
  };

  return (
    <AppFrame>
      <div className="mx-auto max-w-[520px] space-y-6 p-4">
        <Sticker className="space-y-5 p-6 text-center">
          <Badge tone={isTie ? "cyan" : "yellow"}>
            <Tx v={isTie ? TRANSLATIONS.judge.tie : TRANSLATIONS.judge.winner} />
          </Badge>

          <div data-testid="charades-winner-display">
            <h1 className="anton-title m-0 text-[38px] leading-none text-ink">
              {isTie ? winners.map((w) => w.team.name).join(" & ") : winners[0]?.team.name}
            </h1>
            <p className="mono-num m-0 mt-2 text-2xl font-black text-magenta">
              {winners[0]?.score ?? 0} pts
            </p>
          </div>

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
              <Tx v={TRANSLATIONS.judge.showNames} />
            </label>

            <WallButton type="button" variant="white" onClick={handleShare} className="w-full">
              📸 <Tx v={TRANSLATIONS.judge.shareSticker} />
            </WallButton>
            {shareMsg ? <p className="m-0 text-xs font-bold text-ink">{shareMsg}</p> : null}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <WallLinkButton href="/play/dumb-charades" variant="yellow" className="flex-1">
              <Tx v={TRANSLATIONS.judge.playAgain} />
            </WallLinkButton>
            <WallLinkButton href="/play" variant="white" className="flex-1">
              <Tx v={TRANSLATIONS.common.backToPlayHome} />
            </WallLinkButton>
          </div>
        </Sticker>
      </div>
    </AppFrame>
  );
}
