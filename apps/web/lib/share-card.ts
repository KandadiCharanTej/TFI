export type ShareTemplate = "score" | "winner" | "gang";

export const SHARE_TEMPLATES: readonly ShareTemplate[] = ["score", "winner", "gang"];

export interface ShareCardInput {
  template: ShareTemplate;
  gameTitle: string;
  headline: string;
  subline: string;
  rows: readonly { label: string; value: string }[];
  showNames: boolean;
  unofficialFooter: string;
}

/**
 * Draws a 1080x1350 Wall-style share poster onto a Canvas2D context
 * using one of three cycleable templates (Score, Winner, Gang Poster).
 */
export function drawWallSharePoster(canvas: HTMLCanvasElement, input: ShareCardInput): void {
  const W = 1080;
  const H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { template, gameTitle, headline, subline, rows, showNames, unofficialFooter } = input;

  // 1. Concrete / Template Accent Background
  ctx.fillStyle = template === "winner" ? "#F6BE18" : template === "gang" ? "#00E5FF" : "#EAE6DF";
  ctx.fillRect(0, 0, W, H);

  // Subtle dot grid
  ctx.fillStyle = "rgba(20,19,19,0.08)";
  for (let x = 24; x < W; x += 36) {
    for (let y = 24; y < H; y += 36) {
      ctx.fillRect(x, y, 4, 4);
    }
  }

  // 2. Main Sticker Card
  const cardX = 72;
  const cardY = 88;
  const cardW = W - 144;
  const cardH = H - 230;
  ctx.fillStyle = "#141313";
  ctx.fillRect(cardX + 14, cardY + 14, cardW, cardH);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#141313";
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // 3. Top Header Pill
  ctx.fillStyle = template === "gang" ? "#F6BE18" : "#EC1276";
  ctx.fillRect(cardX + 48, cardY + 48, 360, 58);
  ctx.strokeRect(cardX + 48, cardY + 48, 360, 58);
  ctx.fillStyle = template === "gang" ? "#141313" : "#FFFFFF";
  ctx.font = "900 28px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(
    template === "score" ? "FINAL SCORE" : template === "winner" ? "CHAMPION" : "THE GANG",
    cardX + 72,
    cardY + 87,
  );

  // 4. Game Title & Headline
  ctx.fillStyle = "#141313";
  ctx.font = "900 44px sans-serif";
  ctx.fillText(gameTitle.toUpperCase(), cardX + 48, cardY + 175);

  ctx.fillStyle = "#EC1276";
  ctx.font = "900 76px sans-serif";
  ctx.fillText(headline.slice(0, 22), cardX + 48, cardY + 275);

  ctx.fillStyle = "#141313";
  ctx.font = "700 34px sans-serif";
  ctx.fillText(subline.slice(0, 40), cardX + 48, cardY + 335);

  // 5. Score / Gang Rows
  const startY = cardY + 400;
  rows.slice(0, 6).forEach((row, idx) => {
    const ry = startY + idx * 102;
    ctx.fillStyle = idx === 0 ? "#F6BE18" : "#F4F1EA";
    ctx.fillRect(cardX + 48, ry, cardW - 96, 82);
    ctx.lineWidth = 4;
    ctx.strokeRect(cardX + 48, ry, cardW - 96, 82);

    ctx.fillStyle = "#141313";
    ctx.font = "800 32px sans-serif";
    ctx.textAlign = "left";
    const label = showNames ? row.label : `Player ${idx + 1}`;
    ctx.fillText(label.slice(0, 22), cardX + 76, ry + 52);

    ctx.textAlign = "right";
    ctx.font = "900 36px monospace";
    ctx.fillText(row.value, cardX + cardW - 76, ry + 53);
  });

  // 6. Unofficial Footer
  ctx.textAlign = "center";
  ctx.fillStyle = "#141313";
  ctx.font = "800 24px sans-serif";
  ctx.fillText("TFI & PITCH · tfiandpitch.app", W / 2, H - 84);
  ctx.font = "600 18px sans-serif";
  ctx.fillText(unofficialFooter.slice(0, 72), W / 2, H - 46);
}
