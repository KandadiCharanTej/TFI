"use client";

import { useEffect, useState } from "react";
import { getMostCrownedWinners, type CrownSummary } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { FeedbackSticker } from "@/components/feedback-sticker";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { ConfettiBurst } from "@/components/confetti-burst";
import { Badge, Sticker, TicketStub, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { drawWallSharePoster, SHARE_TEMPLATES, type ShareTemplate } from "@/lib/share-card";

const V = TRANSLATIONS.vote;
const RESULTS_KEY = "tfi.vote.results";

interface StoredVoteResults {
  titles: CrownSummary[];
  totalPrompts: number;
}

export default function MostLikelyResultsPage() {
  const { lang } = useLang();
  const t = useT();
  const [results, setResults] = useState<StoredVoteResults | null>(null);
  const [showNames, setShowNames] = useState(false);
  const [templateIdx, setTemplateIdx] = useState(0);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const template: ShareTemplate = SHARE_TEMPLATES[templateIdx] ?? "score";

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
            <h1 className="h2-title m-0 text-ink">
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
    const canvas = document.createElement("canvas");
    drawWallSharePoster(canvas, {
      template,
      gameTitle: "Most Likely",
      headline: isTie ? crowned.map((c) => c.player.name).join(" & ") : (crowned[0]?.player.name ?? "Player 1"),
      subline: `${crowned[0]?.crowns ?? 0} crowns · TFI Movie Edition`,
      rows: sorted.map((item) => ({ label: item.player.name, value: `${item.crowns} 👑` })),
      showNames,
      unofficialFooter: TRANSLATIONS.brand.unofficialDisclaimer.en,
    });
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
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

          <TicketStub
            bg="yellow"
            data-testid="vote-crowned-display"
            header={
              <div className="flex items-center justify-between text-ink">
                <span className="wall-label">
                  <Tx v={TRANSLATIONS.landing.admitOneGang} />
                </span>
                <span className="wall-label">
                  <Tx v={V.crownedMostOften} />
                </span>
              </div>
            }
            footer={
              <p className="mono-num m-0 text-xl font-bold text-ink">
                👑 {t(V.crownsCount, { n: crowned[0]?.crowns ?? 0 })}
              </p>
            }
          >
            <h1 className="h1-title m-0 text-ink">
              {crowned.map((c) => c.player.name).join(" & ")}
            </h1>
          </TicketStub>

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

            <div className="flex gap-2">
              <WallButton
                type="button"
                variant="white"
                onClick={() => setTemplateIdx((i) => (i + 1) % SHARE_TEMPLATES.length)}
                className="px-4 text-xs"
              >
                🎨 {template.toUpperCase()}
              </WallButton>
              <WallButton type="button" variant="white" onClick={handleShare} className="flex-1">
                📸 <Tx v={TRANSLATIONS.judge.shareSticker} />
              </WallButton>
            </div>
            {shareMsg ? <p className="m-0 text-xs font-bold text-ink">{shareMsg}</p> : null}
            <p className="m-0 text-[11px] font-semibold text-ink/60">
              <Tx v={TRANSLATIONS.brand.unofficialDisclaimer} />
            </p>
            <ConfettiBurst trigger={1} />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <WallLinkButton href="/play/most-likely" variant="yellow" className="flex-1">
              <Tx v={TRANSLATIONS.judge.playAgain} />
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
