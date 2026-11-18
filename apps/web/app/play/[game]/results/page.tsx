"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getGameColor, getGameColorKey } from "@tfi/config/tokens";
import { AppFrame } from "@/components/app-frame";
import { ConfettiBurst } from "@/components/confetti-burst";
import { FeedbackSticker } from "@/components/feedback-sticker";
import { Tx, useLang } from "@/components/lang-provider";
import { Badge, Sticker, TicketStub, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { GAME_TRANSLATIONS } from "@/lib/i18n-games";
import { drawWallSharePoster } from "@/lib/share-card";
import { playPartySound } from "@/lib/sound";
import { getGameById } from "@tfi/game-core";

const J = GAME_TRANSLATIONS.judge;

interface TurnSummary {
  playerId: string;
  playerName: string;
  turnNumber: number;
  correct: number;
  skipped: number;
}

interface Player {
  id: string;
  name: string;
}

interface PlayerScore {
  player: Player;
  correct: number;
  skipped: number;
  score: number;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function buildShareSticker(
  gameName: string,
  winnerNames: string,
  scores: PlayerScore[],
  showNames: boolean,
  gameColor: string,
): Promise<Blob | null> {
  try {
    const canvas = document.createElement("canvas");
    drawWallSharePoster(canvas, {
      template: "winner",
      gameTitle: gameName,
      headline: winnerNames,
      subline: `${scores[0]?.score ?? 0} pts · TFI & Pitch`,
      rows: scores.map((sc) => ({ label: sc.player.name, value: `${sc.score} pts` })),
      showNames,
      unofficialFooter: TRANSLATIONS.brand.unofficialDisclaimer.en,
      gameColor,
    });
    return new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
  } catch {
    return null;
  }
}

export default function JudgeResultsPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: slug } = use(params);
  const router = useRouter();
  const { lang } = useLang();
  const [turnSummaries, setTurnSummaries] = useState<TurnSummary[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showNames, setShowNames] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  const regGame = getGameById(slug);
  const gameName = regGame?.nameKey ? slug.replace(/-/g, " ") : slug;

  useEffect(() => {
    document.title = `${gameName} Results | TFI & Pitch`;
  }, [gameName]);

  useEffect(() => {
    try {
      const rawResults = sessionStorage.getItem("judge.results");
      const rawPlayers = sessionStorage.getItem("judge.players");
      if (rawResults) setTurnSummaries(JSON.parse(rawResults) as TurnSummary[]);
      if (rawPlayers) setPlayers(JSON.parse(rawPlayers) as Player[]);
      playPartySound("win");
    } catch {
      /* ignore */
    }
  }, []);

  // Compute final scores per player
  const playerScores: PlayerScore[] = players.map((player) => {
    const pTurns = turnSummaries.filter((t) => t.playerId === player.id);
    const correct = pTurns.reduce((acc, cur) => acc + cur.correct, 0);
    const skipped = pTurns.reduce((acc, cur) => acc + cur.skipped, 0);
    return {
      player,
      correct,
      skipped,
      score: correct,
    };
  });

  playerScores.sort((a, b) => b.score - a.score);

  const highestScore = playerScores[0]?.score ?? 0;
  const winners = playerScores.filter((p) => p.score === highestScore);
  const isTie = winners.length > 1;
  const winnerTitle = isTie
    ? (lang === "te" ? "టై అయింది!" : "It's a Tie!")
    : winners[0]?.player.name ?? (lang === "te" ? "విజేత" : "Winner");

  async function handleShare() {
    setSharing(true);
    setShareMsg("");
    try {
      const winnerStr = isTie
        ? winners.map((w) => (showNames ? w.player.name : "Player")).join(" & ")
        : winners[0]
          ? (showNames ? winners[0].player.name : "Winner")
          : "Winner";

      const blob = await buildShareSticker(gameName, winnerStr, playerScores, showNames, getGameColor(slug));
      if (!blob) throw new Error("Could not generate image");

      const file = new File([blob], `${slug}-result.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `TFI & Pitch · ${gameName}`,
          text: `Check out our ${gameName} score!`,
          files: [file],
        });
        setShareMsg(lang === "te" ? "స్టిక్కర్ షేర్ అయింది!" : "Sticker shared!");
      } else {
        downloadBlob(blob, `${slug}-results.png`);
        setShareMsg(
          lang === "te" ? "స్టిక్కర్ డౌన్‌లోడ్ అయింది!" : "Sticker downloaded!",
        );
      }
    } catch {
      setShareMsg(
        lang === "te"
          ? "స్టిక్కర్ తయారు కాలేదు. మళ్ళీ ప్రయత్నించండి."
          : "Could not share. Try downloading again.",
      );
    } finally {
      setSharing(false);
    }
  }

  const gameStubBg = getGameColorKey(slug);
  const isMagentaStub = gameStubBg === "magenta";

  return (
    <AppFrame>
      <ConfettiBurst trigger={1} />
      <div className="mx-auto max-w-[480px] space-y-5 p-4" data-testid="judge-results-screen">
        {/* Ticket-Stub Winner Banner in the game's color */}
        <TicketStub
          bg={gameStubBg}
          className="text-center"
          header={
            <div className="flex items-center justify-between gap-2">
              <Badge tone="white">
                <Tx v={TRANSLATIONS.common.admitOneGang} />
              </Badge>
              <Badge tone="white">
                {isTie ? <Tx v={J.tie} /> : <Tx v={J.winner} />}
              </Badge>
            </div>
          }
          footer={
            <p
              className={`mono-num m-0 text-xl font-bold ${
                isMagentaStub ? "text-white" : "text-ink"
              }`}
            >
              {highestScore} {lang === "te" ? "పాయింట్లు" : "pts"}
            </p>
          }
        >
          <div className="text-4xl mb-2" aria-hidden>
            🏆
          </div>
          <h1
            className={`h1-title m-0 ${isMagentaStub ? "text-white" : "text-ink"}`}
            data-testid="winner-display"
          >
            {winnerTitle}
          </h1>
        </TicketStub>

        {/* Scoreboard Table */}
        <Sticker className="p-5">
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-ink">
            <Tx v={J.score} />
          </p>
          <div className="divide-y-2 divide-dashed divide-ink">
            {playerScores.map((ps, idx) => (
              <div
                key={ps.player.id}
                className="flex items-center justify-between py-3"
                data-testid={`player-score-row-${idx}`}
              >
                <div className="flex items-center gap-3">
                  <span className="mono-num flex h-7 w-7 items-center justify-center rounded-[8px] border-2 border-ink bg-card text-xs font-black text-ink">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-extrabold text-ink text-base">
                      {ps.player.name}
                    </span>
                    <span className="block text-xs font-bold text-ink opacity-80">
                      {ps.correct} {lang === "te" ? "సరైనవి" : "correct"} · {ps.skipped}{" "}
                      {lang === "te" ? "వదిలేసినవి" : "skipped"}
                    </span>
                  </div>
                </div>
                <div className="mono-num rounded-full border-2 border-ink bg-yellow px-3 py-1 text-base font-black text-ink shadow-[2px_2px_0_#141313]">
                  {ps.score}
                </div>
              </div>
            ))}
          </div>
        </Sticker>

        {/* Share Sticker Box */}
        <Sticker className="p-5 space-y-4">
          <p className="text-xs font-black uppercase tracking-wider text-ink">
            <Tx v={J.shareSticker} />
          </p>

          <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-ink select-none">
            <input
              type="checkbox"
              checked={showNames}
              onChange={(e) => setShowNames(e.target.checked)}
              className="h-5 w-5 rounded border-2 border-ink text-yellow focus:ring-ink"
              data-testid="show-names-checkbox"
            />
            <span>
              <Tx v={J.showNames} />
            </span>
          </label>

          <WallButton
            variant="yellow"
            className="w-full text-base"
            onClick={handleShare}
            disabled={sharing}
            data-testid="share-sticker-btn"
          >
            {sharing ? "Generating…" : <><Tx v={J.shareSticker} /> 📱</>}
          </WallButton>

          {shareMsg && (
            <p className="text-center text-base font-bold text-ink" role="status">
              {shareMsg}
            </p>
          )}
        </Sticker>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-1">
          <WallButton
            variant="white"
            className="w-full text-base"
            onClick={() => router.push(`/play/${slug}`)}
            data-testid="play-again-btn"
          >
            <Tx v={J.playAgain} /> 🔄
          </WallButton>

          <WallLinkButton href="/play" variant="white" className="w-full text-base">
            ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
          </WallLinkButton>
          <div className="flex justify-center pt-1">
            <FeedbackSticker />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
