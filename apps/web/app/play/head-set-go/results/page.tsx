"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { FeedbackSticker } from "@/components/feedback-sticker";
import { Tx, useLang } from "@/components/lang-provider";
import { Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

interface RoundCard {
  id: string;
  en: string;
  te: string;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function buildShareSticker(correct: number, deck: string): Promise<Blob | null> {
  try {
    const W = 1080, H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background
    ctx.fillStyle = "#F5E642";
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = "#141313";
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, W - 12, H - 12);

    // Game name
    ctx.fillStyle = "#141313";
    ctx.font = "bold 72px serif";
    ctx.textAlign = "center";
    ctx.fillText("HEAD SET GO", W / 2, 160);

    // Score
    ctx.font = "bold 220px monospace";
    ctx.fillText(String(correct), W / 2, 480);

    ctx.font = "bold 42px sans-serif";
    ctx.fillText(`${correct} correct`, W / 2, 560);

    // Deck
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(`Deck: ${deck}`, W / 2, 650);

    // TFI & Pitch
    ctx.font = "bold 52px serif";
    ctx.fillText("TFI & Pitch", W / 2, 820);

    // Disclaimer
    ctx.fillStyle = "#141313";
    ctx.font = "24px sans-serif";
    ctx.fillText("Unofficial fan-made game. Not affiliated with any film,", W / 2, 1250);
    ctx.fillText("actor, studio or team.", W / 2, 1290);

    return new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
  } catch {
    return null;
  }
}

export default function HsgResultsPage() {
  const router = useRouter();
  const { lang } = useLang();
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [allCards, setAllCards] = useState<RoundCard[]>([]);
  const [sharing, setSharing] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const deckRef = useRef("movies");

  useEffect(() => {
    setCorrectIds(JSON.parse(sessionStorage.getItem("hsg.correctIds") ?? "[]"));
    setPassedIds(JSON.parse(sessionStorage.getItem("hsg.passedIds") ?? "[]"));
    setAllCards(JSON.parse(sessionStorage.getItem("hsg.allCards") ?? "[]"));
    deckRef.current = sessionStorage.getItem("hsg.deck") ?? "movies";
  }, []);

  const cardMap = Object.fromEntries(allCards.map((c) => [c.id, c]));

  async function handleShare() {
    setSharing(true);
    setShareMsg("");
    const blob = await buildShareSticker(correctIds.length, deckRef.current);
    if (!blob) {
      setShareMsg(TRANSLATIONS.hsg.shareFailed[lang]);
      setSharing(false);
      return;
    }
    const file = new File([blob], "head-set-go-score.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: `Head Set Go — ${correctIds.length} correct` });
      setShareMsg(TRANSLATIONS.hsg.shareDone[lang]);
    } else {
      downloadBlob(blob, "head-set-go-score.png");
      setShareMsg(TRANSLATIONS.hsg.shareSaved[lang]);
    }
    setSharing(false);
  }

  function label(id: string) {
    const card = cardMap[id];
    if (!card) return id;
    return lang === "te" ? card.te : card.en;
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-[480px] space-y-5 p-4">
        {/* Score header */}
        <Sticker className="p-5 text-center">
          <p className="m-0 text-[20px] font-extrabold uppercase tracking-wider text-ink">
            <Tx v={TRANSLATIONS.hsg.timesUp} />
          </p>
          <p
            className="mono-num mt-2 text-[88px] font-black leading-none text-ink"
            aria-label={`${correctIds.length} ${TRANSLATIONS.hsg.scoreLabel[lang]}`}
          >
            {correctIds.length}
          </p>
          <p className="text-[16px] font-bold text-ink opacity-70">
            <Tx v={TRANSLATIONS.hsg.scoreLabel} />
          </p>
        </Sticker>

        {/* Got it */}
        <Sticker className="p-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-ink">
            <Tx v={TRANSLATIONS.hsg.gotIt} /> ({correctIds.length})
          </p>
          {correctIds.length === 0 ? (
            <p className="text-sm text-ink opacity-50">
              <Tx v={TRANSLATIONS.hsg.emptyList} />
            </p>
          ) : (
            <ul className="space-y-1">
              {correctIds.map((id) => (
                <li key={id} className="flex items-center gap-2 text-[15px] font-bold text-ink">
                  <span className="text-green-600" aria-hidden>✓</span> {label(id)}
                </li>
              ))}
            </ul>
          )}
        </Sticker>

        {/* Passed */}
        <Sticker className="p-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-ink">
            <Tx v={TRANSLATIONS.hsg.passedList} /> ({passedIds.length})
          </p>
          {passedIds.length === 0 ? (
            <p className="text-sm text-ink opacity-50">
              <Tx v={TRANSLATIONS.hsg.emptyList} />
            </p>
          ) : (
            <ul className="space-y-1">
              {passedIds.map((id) => (
                <li key={id} className="flex items-center gap-2 text-[15px] font-bold text-ink opacity-70">
                  <span aria-hidden>→</span> {label(id)}
                </li>
              ))}
            </ul>
          )}
        </Sticker>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <WallButton
            variant="yellow"
            className="flex-1"
            onClick={() => router.push("/play/head-set-go/round")}
          >
            <Tx v={TRANSLATIONS.hsg.playAgain} />
          </WallButton>
          <WallLinkButton href="/play/head-set-go" variant="white" className="flex-1">
            <Tx v={TRANSLATIONS.hsg.changeDeck} />
          </WallLinkButton>
        </div>

        <div className="flex flex-wrap gap-3">
          <WallButton
            variant="white"
            className="flex-1"
            onClick={handleShare}
            disabled={sharing}
          >
            {sharing ? "…" : <Tx v={TRANSLATIONS.hsg.share} />}
          </WallButton>
          <WallLinkButton href="/play" variant="white" className="flex-1">
            <Tx v={TRANSLATIONS.hsg.home} />
          </WallLinkButton>
        </div>

        {shareMsg && (
          <p className="text-center text-sm font-bold text-ink" role="status">
            {shareMsg}
          </p>
        )}
        <div className="flex justify-center">
          <FeedbackSticker />
        </div>
      </div>
    </AppFrame>
  );
}
