/**
 * Design System: "THE WALL" (LOCKED)
 * Street-poster wall tokens. No gradients, no blur, no glass, no purple.
 */
export const WALL_COLORS = {
  concrete: "#EAE6DF", // page background
  sticker: "#FFFFFF", // cards and stickers
  card: "#F4F1EA", // quiet panels
  ink: "#141313", // text, borders, shadows
  yellow: "#F6BE18", // main action and highlight; Cinema category
  magenta: "#EC1276", // live moments, bids, Pass; Party category
  green: "#00C853", // Correct, Sold; Cricket category
  cyan: "#00E5FF", // room codes and the "Online" badge
} as const;

export type WallColorKey = keyof typeof WALL_COLORS;

export const WALL_FONTS = {
  anton: "'Anton', sans-serif",
  marker: "'Permanent Marker', cursive",
  sans: "'Plus Jakarta Sans', 'Noto Sans Telugu', system-ui, sans-serif",
  mono: "'Space Mono', monospace",
  telugu: "'Noto Sans Telugu', 'Plus Jakarta Sans', sans-serif",
} as const;

export const CATEGORY_COLORS = {
  Cinema: WALL_COLORS.yellow,
  Cricket: WALL_COLORS.green,
  Party: WALL_COLORS.magenta,
} as const;

export type GameCategory = keyof typeof CATEGORY_COLORS;
