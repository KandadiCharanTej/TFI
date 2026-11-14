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
 * Draws a 1080x1350 V2 Film Ticket Stub share poster onto a Canvas2D context.
 * Includes "Admit one gang", game name, score/winner, date, side ticket notches,
 * dashed perforation line, and unofficial line at the bottom.
 */
export function drawWallSharePoster(canvas: HTMLCanvasElement, input: ShareCardInput): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("tfi:share_clicked"));
  }
  const W = 1080;
  const H = 1350;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { template, gameTitle, headline, subline, rows, showNames, unofficialFooter } = input;
  const bgColor = template === "winner" ? "#F6BE18" : template === "gang" ? "#00E5FF" : "#EAE6DF";

  // 1. Concrete / Template Accent Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);

  // Subtle 5% concrete dot grid
  ctx.fillStyle = "rgba(20,19,19,0.05)";
  for (let x = 24; x < W; x += 32) {
    for (let y = 24; y < H; y += 32) {
      ctx.fillRect(x, y, 4, 4);
    }
  }

  // 2. Main Ticket-Stub Card
  const cardX = 80;
  const cardY = 88;
  const cardW = W - 160;
  const cardH = H - 230;
  const notchY = cardY + 340;
  const notchR = 28;

  // Hard shadow
  ctx.fillStyle = "#141313";
  ctx.fillRect(cardX + 12, cardY + 12, cardW, cardH);

  // White ticket body
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#141313";
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Side semi-circle notches
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(cardX, notchY, notchR, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cardX + cardW, notchY, notchR, Math.PI / 2, -Math.PI / 2);
  ctx.fill();
  ctx.stroke();

  // Dashed perforation line across the ticket
  ctx.save();
  ctx.setLineDash([14, 12]);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#141313";
  ctx.beginPath();
  ctx.moveTo(cardX + notchR + 8, notchY);
  ctx.lineTo(cardX + cardW - notchR - 8, notchY);
  ctx.stroke();
  ctx.restore();

  // 3. Top Header: "Admit one gang" + Date
  const dateStr = new Date().toISOString().slice(0, 10);
  ctx.fillStyle = "#F6BE18";
  ctx.fillRect(cardX + 48, cardY + 42, 320, 52);
  ctx.lineWidth = 4;
  ctx.strokeRect(cardX + 48, cardY + 42, 320, 52);
  ctx.fillStyle = "#141313";
  ctx.font = "800 24px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("ADMIT ONE GANG", cardX + 68, cardY + 76);

  ctx.textAlign = "right";
  ctx.font = "700 24px monospace";
  ctx.fillText(dateStr, cardX + cardW - 48, cardY + 76);

  // 4. Game Title & Headline (Sentence case)
  ctx.textAlign = "left";
  ctx.fillStyle = "#141313";
  ctx.font = "800 42px sans-serif";
  ctx.fillText(gameTitle, cardX + 48, cardY + 162);

  ctx.fillStyle = "#141313";
  ctx.font = "900 72px sans-serif";
  ctx.fillText(headline.slice(0, 22), cardX + 48, cardY + 252);

  ctx.fillStyle = "#141313";
  ctx.font = "600 30px sans-serif";
  ctx.fillText(subline.slice(0, 42), cardX + 48, cardY + 305);

  // 5. Score / Gang Rows below perforation
  const startY = notchY + 46;
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
  ctx.fillText("TFI & Pitch · tfiandpitch.app", W / 2, H - 84);
  ctx.font = "600 18px sans-serif";
  ctx.fillText(unofficialFooter.slice(0, 72), W / 2, H - 46);
}
