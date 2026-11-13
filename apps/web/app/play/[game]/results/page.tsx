"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { FeedbackSticker } from "@/components/feedback-sticker";
import { Tx, useLang } from "@/components/lang-provider";
import { Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { getGameById } from "@tfi/game-core";

const J = TRANSLATIONS.judge;

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
): Promise<Blob | null> {
  try {
    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background
    ctx.fillStyle = "#F6BE18";
    ctx.fillRect(0, 0, W, H);

    // Ink Border & Outer Rings
    ctx.strokeStyle = "#141313";
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, W - 20, H - 20);

    // Game name in Anton / bold
    ctx.fillStyle = "#141313";
    ctx.font = "bold 76px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(gameName.toUpperCase(), W / 2, 170);

    // Winner Banner / Sticker
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(100, 240, W - 200, 260);
    ctx.strokeStyle = "#141313";
    ctx.lineWidth = 8;
    ctx.strokeRect(100, 240, W - 200, 260);

    ctx.fillStyle = "#EC1276";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText("WINNER", W / 2, 310);

    ctx.fillStyle = "#141313";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText(winnerNames, W / 2, 410);

    // Score summary
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(100, 560, W - 200, 480);
    ctx.strokeRect(100, 560, W - 200, 480);

    ctx.fillStyle = "#141313";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("SCOREBOARD", W / 2, 630);

    const startY = 700;
    scores.slice(0, 6).forEach((sc, idx) => {
      const y = startY + idx * 55;
      ctx.textAlign = "left";
      ctx.font = "bold 32px sans-serif";
      const displayName = showNames ? sc.player.name : `Player ${idx + 1}`;
      ctx.fillText(`${idx + 1}. ${displayName}`, 160, y);

      ctx.textAlign = "right";
      ctx.font = "bold 32px monospace";
      ctx.fillText(`${sc.score} pts`, W - 160, y);
    });

    // Branding & Disclaimer
    ctx.textAlign = "center";
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

      const blob = await buildShareSticker(gameName, winnerStr, playerScores, showNames);
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

  return (
    <AppFrame>
      <div className="mx-auto max-w-[480px] space-y-5 p-4" data-testid="judge-results-screen">
        {/* Winner Banner */}
        <Sticker className="p-6 text-center">
          <div className="text-4xl mb-2" aria-hidden>
            🏆
          </div>
          <span className="rounded-full border-2 border-ink bg-yellow px-4 py-1 text-xs font-black uppercase text-ink">
            {isTie ? <Tx v={J.tie} /> : <Tx v={J.winner} />}
          </span>
          <h1
            className="anton-title mt-3 text-4xl font-black text-ink"
            data-testid="winner-display"
          >
            {winnerTitle}
          </h1>
          <p className="mono-num mt-1 text-2xl font-black text-ink">
            {highestScore} {lang === "te" ? "పాయింట్లు" : "pts"}
          </p>
        </Sticker>

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
                    <span className="block text-xs font-bold text-ink opacity-60">
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
            <p className="text-center text-xs font-bold text-ink" role="status">
              {shareMsg}
            </p>
          )}
        </Sticker>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
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
