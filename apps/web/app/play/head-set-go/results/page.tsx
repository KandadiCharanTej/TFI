"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getGameColor } from "@tfi/config/tokens";
import { AppFrame } from "@/components/app-frame";
import { ConfettiBurst } from "@/components/confetti-burst";
import { FeedbackSticker } from "@/components/feedback-sticker";
import { Tx, useLang } from "@/components/lang-provider";
import { CountUp } from "@/components/motion-kit";
import { Sticker, TicketStub, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { GAME_TRANSLATIONS } from "@/lib/i18n-games";
import { drawWallSharePoster } from "@/lib/share-card";
import { playPartySound } from "@/lib/sound";

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
    const canvas = document.createElement("canvas");
    drawWallSharePoster(canvas, {
      template: "score",
      gameTitle: "Head Set Go",
      headline: `${correct} correct`,
      subline: `Deck: ${deck}`,
      rows: [{ label: "Score", value: `${correct} pts` }],
      showNames: true,
      unofficialFooter: TRANSLATIONS.brand.unofficialDisclaimer.en,
      gameColor: getGameColor("head-set-go"),
    });
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
    playPartySound("win");
  }, []);

  const cardMap = Object.fromEntries(allCards.map((c) => [c.id, c]));

  async function handleShare() {
    setSharing(true);
    setShareMsg("");
    const blob = await buildShareSticker(correctIds.length, deckRef.current);
    if (!blob) {
      setShareMsg(GAME_TRANSLATIONS.hsg.shareFailed[lang]);
      setSharing(false);
      return;
    }
    const file = new File([blob], "head-set-go-score.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: `Head Set Go — ${correctIds.length} correct` });
      setShareMsg(GAME_TRANSLATIONS.hsg.shareDone[lang]);
    } else {
      downloadBlob(blob, "head-set-go-score.png");
      setShareMsg(GAME_TRANSLATIONS.hsg.shareSaved[lang]);
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
      <ConfettiBurst trigger={1} />
      <div className="mx-auto max-w-[480px] space-y-5 p-4">
        {/* Ticket-stub Score header */}
        <TicketStub
          bg="yellow"
          className="text-center"
          header={
            <div className="flex items-center justify-between text-ink">
              <span className="wall-label">
                <Tx v={TRANSLATIONS.common.admitOneGang} />
              </span>
              <span className="wall-label">Head Set Go</span>
            </div>
          }
          footer={
            <p className="m-0 text-[15px] font-bold text-ink">
              <Tx v={GAME_TRANSLATIONS.hsg.timesUp} /> · <Tx v={GAME_TRANSLATIONS.hsg.scoreLabel} />
            </p>
          }
        >
          <p
            className="mono-num m-0 text-[84px] font-bold leading-none text-ink"
            aria-label={`${correctIds.length} ${GAME_TRANSLATIONS.hsg.scoreLabel[lang]}`}
          >
            <CountUp value={correctIds.length} durationMs={480} />
          </p>
        </TicketStub>

        {/* Got it */}
        <Sticker className="p-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-ink">
            <Tx v={GAME_TRANSLATIONS.hsg.gotIt} /> ({correctIds.length})
          </p>
          {correctIds.length === 0 ? (
            <p className="text-sm text-ink opacity-80">
              <Tx v={GAME_TRANSLATIONS.hsg.emptyList} />
            </p>
          ) : (
            <ul className="space-y-1">
              {correctIds.map((id) => (
                <li key={id} className="flex items-center gap-2 text-[15px] font-bold text-ink">
                  <span
                    aria-hidden
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-ink bg-green text-[12px] font-bold text-ink"
                  >
                    ✓
                  </span>{" "}
                  {label(id)}
                </li>
              ))}
            </ul>
          )}
        </Sticker>

        {/* Passed */}
        <Sticker className="p-5">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-ink">
            <Tx v={GAME_TRANSLATIONS.hsg.passedList} /> ({passedIds.length})
          </p>
          {passedIds.length === 0 ? (
            <p className="text-sm text-ink opacity-80">
              <Tx v={GAME_TRANSLATIONS.hsg.emptyList} />
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
            <Tx v={GAME_TRANSLATIONS.hsg.playAgain} />
          </WallButton>
          <WallLinkButton href="/play/head-set-go" variant="white" className="flex-1">
            <Tx v={GAME_TRANSLATIONS.hsg.changeDeck} />
          </WallLinkButton>
        </div>

        <div className="flex flex-wrap gap-3">
          <WallButton
            variant="white"
            className="flex-1"
            onClick={handleShare}
            disabled={sharing}
          >
            {sharing ? "…" : <Tx v={GAME_TRANSLATIONS.hsg.share} />}
          </WallButton>
          <WallLinkButton href="/play" variant="white" className="flex-1">
            <Tx v={GAME_TRANSLATIONS.hsg.home} />
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
