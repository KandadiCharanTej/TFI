"use client";

import { useEffect, useState } from "react";
import { getMostCrownedWinners, type CrownSummary } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { Badge, Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

const V = TRANSLATIONS.vote;
const RESULTS_KEY = "tfi.vote.results";

interface StoredVoteResults {
  titles: CrownSummary[];
  totalPrompts: number;
}

async function generateVoteSharePng(
  titles: CrownSummary[],
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
    ctx.fillText("MOST LIKELY", W / 2, 215);

    const sorted = [...titles].sort((a, b) => b.crowns - a.crowns || b.totalVotes - a.totalVotes);
    const crowned = getMostCrownedWinners(sorted);
    const crownLine =
      crowned.length > 1
        ? `TIED CROWN: ${crowned[0]?.crowns ?? 0} CROWNS`
        : showNames && crowned[0]
          ? `CROWNED: ${crowned[0].player.name.toUpperCase()}`
          : `TOP CROWNED: ${crowned[0]?.crowns ?? 0} CROWNS`;

    ctx.font = "bold 50px sans-serif";
    ctx.fillStyle = "#EC1276";
    ctx.fillText(crownLine, W / 2, 340);

    sorted.slice(0, 5).forEach((s, idx) => {
      const y = 440 + idx * 105;
      ctx.fillStyle = idx === 0 ? "#F6BE18" : "#F4F1EA";
      ctx.fillRect(140, y - 50, W - 280, 82);
      ctx.strokeRect(140, y - 50, W - 280, 82);

      ctx.fillStyle = "#141313";
      ctx.textAlign = "left";
      ctx.font = "bold 34px sans-serif";
      const label = showNames ? s.player.name : `Friend ${idx + 1}`;
      ctx.fillText(`${idx + 1}. ${label}`, 170, y);

      ctx.textAlign = "right";
      ctx.font = "bold 32px monospace";
      ctx.fillText(`${s.crowns} crowns`, W - 170, y);
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

export default function MostLikelyResultsPage() {
  const { lang } = useLang();
  const t = useT();
  const [results, setResults] = useState<StoredVoteResults | null>(null);
  const [showNames, setShowNames] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Most Likely Titles | TFI & Pitch`;
    try {
      const raw = sessionStorage.getItem(RESULTS_KEY);
      if (raw) {
        setResults(JSON.parse(raw) as StoredVoteResults);
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
              <Tx v={V.titlesHeading} />
            </h1>
            <p className="m-0 text-sm font-bold text-ink/75">
              No recent game found. Start a new round of Most Likely!
            </p>
            <WallLinkButton href="/play/most-likely" variant="yellow">
              <Tx v={TRANSLATIONS.judge.playAgain} /> →
            </WallLinkButton>
          </Sticker>
        </div>
      </AppFrame>
    );
  }

  const sorted = [...results.titles].sort((a, b) => b.crowns - a.crowns || b.totalVotes - a.totalVotes);
  const crowned = getMostCrownedWinners(sorted);
  const isTie = crowned.length > 1;

  const handleShare = async () => {
    const blob = await generateVoteSharePng(sorted, showNames);
    if (!blob) {
      setShareMsg(t(TRANSLATIONS.judge.shareFailed));
      return;
    }
    const file = new File([blob], "tfi-most-likely.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "TFI & Pitch — Most Likely" });
        setShareMsg(t(TRANSLATIONS.judge.shareDone));
        return;
      } catch {
        /* fallback */
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tfi-most-likely.png";
    a.click();
    URL.revokeObjectURL(url);
    setShareMsg(t(TRANSLATIONS.judge.shareSaved));
  };

  return (
    <AppFrame>
      <div className="mx-auto max-w-[520px] space-y-6 p-4">
        <Sticker className="space-y-5 p-6 text-center">
          <Badge tone={isTie ? "cyan" : "yellow"}>
            <Tx v={isTie ? TRANSLATIONS.judge.tie : V.titlesHeading} />
          </Badge>

          <div data-testid="vote-crowned-display" className="space-y-1">
            <p className="m-0 text-xs font-black uppercase tracking-wider text-ink/70">
              <Tx v={V.crownedMostOften} />
            </p>
            <h1 className="anton-title m-0 text-[38px] leading-none text-ink">
              {crowned.map((c) => c.player.name).join(" & ")}
            </h1>
            <p className="mono-num m-0 pt-1 text-xl font-black text-magenta">
              👑 {t(V.crownsCount, { n: crowned[0]?.crowns ?? 0 })}
            </p>
          </div>

          <div className="space-y-2.5 text-left">
            {sorted.map((item, idx) => (
              <div
                key={item.player.id}
                data-testid={`vote-title-row-${idx}`}
                className={`flex items-center justify-between rounded-[14px] border-2 border-ink px-4 py-3 ${
                  idx === 0 ? "bg-yellow" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="mono-num flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-white text-sm font-black">
                    {idx + 1}
                  </span>
                  <span className="text-[16px] font-extrabold text-ink">{item.player.name}</span>
                </div>
                <div className="text-right">
                  <span className="mono-num block text-[16px] font-black text-ink">
                    {t(V.crownsCount, { n: item.crowns })}
                  </span>
                  <span className="mono-num block text-[11px] font-bold text-ink/70">
                    {t(V.votesCount, { n: item.totalVotes })}
                  </span>
                </div>
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
            <WallLinkButton href="/play/most-likely" variant="yellow" className="flex-1">
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
