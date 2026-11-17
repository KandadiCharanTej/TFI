/**
 * Design System: "THE WALL" V2 (LOCKED PALETTE, COLOR JOBS, STUDIO TYPOGRAPHY)
 * Single 2.5px ink borders, hard shadows, zero gradients/blur/purple.
 */
export const WALL_COLORS = {
  concrete: "#EAE6DF", // page background
  sticker: "#FFFFFF", // cards and ticket stubs
  card: "#F4F1EA", // quiet panels
  ink: "#141313", // text, borders, shadows
  yellow: "#F6BE18", // primary action and one large block per page
  magenta: "#EC1276", // Pass/Skip, live moments, Admit one gang stub, warning, game color
  green: "#00C853", // Correct/Got it, success, Ready offline ticks, game color
  cyan: "#00E5FF", // online only: room codes, Online badge, online tiles, Coming next strip
} as const;

export type WallColorKey = keyof typeof WALL_COLORS;

/** Clear job for each accent color in the system. */
export const COLOR_JOBS = {
  primaryActionAndHero: WALL_COLORS.yellow,
  passLiveAndWarning: WALL_COLORS.magenta,
  correctAndOfflineReady: WALL_COLORS.green,
  onlineAndRooms: WALL_COLORS.cyan,
} as const;

/** Game panel identity color (illustration panels & matching dots only — no text inside colored panels). */
export const GAME_COLOR_KEYS: Record<string, "yellow" | "magenta" | "green" | "cyan"> = {
  "head-set-go": "yellow",
  transify: "magenta",
  "dumb-charades": "green",
  "emoji-cinema": "yellow",
  "rapid-fire": "magenta",
  "most-likely": "green",
  "box-office-auction": "cyan",
  // MVP games (hidden in beta)
  "cricket-iq": "yellow",
  "cricket-auction": "cyan",
  "dream-xi-challenge": "cyan",
} as const;

export const GAME_COLORS: Record<string, string> = {
  "head-set-go": WALL_COLORS.yellow,
  transify: WALL_COLORS.magenta,
  "dumb-charades": WALL_COLORS.green,
  "emoji-cinema": WALL_COLORS.yellow,
  "rapid-fire": WALL_COLORS.magenta,
  "most-likely": WALL_COLORS.green,
  "box-office-auction": WALL_COLORS.cyan,
  "cricket-iq": WALL_COLORS.yellow,
  "cricket-auction": WALL_COLORS.cyan,
  "dream-xi-challenge": WALL_COLORS.cyan,
} as const;

export function getGameColorKey(slug: string): "yellow" | "magenta" | "green" | "cyan" {
  return GAME_COLOR_KEYS[slug] ?? "yellow";
}

export function getGameColor(slug: string): string {
  return GAME_COLORS[slug] ?? WALL_COLORS.yellow;
}

/**
 * V2 Typography System: one voice across two scripts, three families at most.
 * P2 Winner: Bricolage Grotesque + Anek Telugu + Space Mono.
 */
export const WALL_FONTS = {
  display: "'Bricolage Grotesque', 'Anek Telugu', system-ui, sans-serif",
  sans: "'Bricolage Grotesque', 'Anek Telugu', system-ui, sans-serif",
  mono: "'Space Mono', monospace",
  telugu: "'Anek Telugu', 'Bricolage Grotesque', sans-serif",
} as const;

/** Mode colors kept for compatibility. */
export const MODE_COLORS = {
  onePhone: WALL_COLORS.yellow,
  online: WALL_COLORS.cyan,
} as const;

export type GameModeColorKey = keyof typeof MODE_COLORS;
