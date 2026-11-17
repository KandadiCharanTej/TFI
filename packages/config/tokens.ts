/**
 * Design System: "THE WALL" V4 — PARTY MODE
 * Locked 8-color palette, color-blocked sections, 3px ink borders, chunky hard shadows.
 */
export const WALL_COLORS = {
  concrete: "#EAE6DF", // neutral page background & sticky slim header
  sticker: "#FFFFFF", // cards, ticket stubs, clean body panels
  card: "#F4F1EA", // quiet secondary surfaces
  ink: "#141313", // text, 3px borders, hard shadows, marquee tape, footer
  yellow: "#F6BE18", // main CTA, hero block, closing CTA block, game color
  magenta: "#EC1276", // Pass/Skip, live moments, How-it-plays block, stubs, game color
  green: "#00C853", // Correct/Got it, success ticks, game color
  cyan: "#00E5FF", // online rooms, Coming next strip, room code stubs, Box Office Auction
} as const;

export type WallColorKey = keyof typeof WALL_COLORS;

/** Clear job for each accent color in the system. */
export const COLOR_JOBS = {
  primaryActionAndHero: WALL_COLORS.yellow,
  passLiveAndWarning: WALL_COLORS.magenta,
  correctAndOfflineReady: WALL_COLORS.green,
  onlineAndRooms: WALL_COLORS.cyan,
} as const;

/** Surface rules (Design V4 Party Mode). */
export const SURFACE_SPECS = {
  cardBorderPx: 3,
  cardRadiusPx: 20,
  cardShadow: "0 6px 0 #141313",
  btnBorderPx: 3,
  btnRadiusPx: 16,
  btnShadow: "0 5px 0 #141313",
} as const;

/** Game identity color (setup bands, tile backgrounds, round full-bleed backgrounds). */
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
 * V4 Typography System (Font Lab Round 3 L1 Winner):
 * Bricolage Grotesque Condensed ExtraBold (display) + Bricolage Grotesque (body)
 * + Anek Telugu 800 (Telugu mode only) + Space Mono (tabular numbers).
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
