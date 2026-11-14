/**
 * Design System: "THE WALL" V2 (LOCKED PALETTE, STUDIO TYPOGRAPHY)
 * Calm, high-craft surfaces. Single 2.5px ink borders, hard shadows, zero gradients/blur/purple.
 */
export const WALL_COLORS = {
  concrete: "#EAE6DF", // page background
  sticker: "#FFFFFF", // cards and ticket stubs
  card: "#F4F1EA", // quiet panels
  ink: "#141313", // text, borders, shadows
  yellow: "#F6BE18", // primary action and one hero block per page; "One phone" mode
  magenta: "#EC1276", // live moments and Pass
  green: "#00C853", // Correct and success
  cyan: "#00E5FF", // online mode and room codes
} as const;

export type WallColorKey = keyof typeof WALL_COLORS;

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

/** Game panel colour follows play MODE (not category). */
export const MODE_COLORS = {
  onePhone: WALL_COLORS.yellow,
  online: WALL_COLORS.cyan,
} as const;

export type GameModeColorKey = keyof typeof MODE_COLORS;
