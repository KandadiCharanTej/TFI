/**
 * Design System: "THE WALL" (LOCKED)
 * Street-poster wall tokens. No gradients, no blur, no glass, no purple.
 */
export const WALL_COLORS = {
  concrete: "#EAE6DF", // page background
  sticker: "#FFFFFF", // cards and stickers
  card: "#F4F1EA", // quiet panels
  ink: "#141313", // text, borders, shadows
  yellow: "#F6BE18", // main action and highlight; "One phone" game panels
  magenta: "#EC1276", // live moments, bids, Pass (never a game-panel colour)
  green: "#00C853", // Correct, Sold (never a game-panel colour)
  cyan: "#00E5FF", // room codes, the "Online" badge; "Online" game panels
} as const;

export type WallColorKey = keyof typeof WALL_COLORS;

export const WALL_FONTS = {
  anton: "'Anton', sans-serif",
  marker: "'Permanent Marker', cursive",
  sans: "'Plus Jakarta Sans', 'Anek Telugu', system-ui, sans-serif",
  mono: "'Space Mono', monospace",
  telugu: "'Anek Telugu', 'Plus Jakarta Sans', sans-serif",
} as const;

/** Game sticker panel colour follows the play MODE (not a category). */
export const MODE_COLORS = {
  onePhone: WALL_COLORS.yellow,
  online: WALL_COLORS.cyan,
} as const;

export type GameModeColorKey = keyof typeof MODE_COLORS;
