import type { Config } from "tailwindcss";
import { WALL_COLORS } from "@tfi/config/tokens";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      concrete: WALL_COLORS.concrete,
      sticker: WALL_COLORS.sticker,
      card: WALL_COLORS.card,
      ink: WALL_COLORS.ink,
      yellow: WALL_COLORS.yellow,
      magenta: WALL_COLORS.magenta,
      green: WALL_COLORS.green,
      cyan: WALL_COLORS.cyan,
    },
    fontFamily: {
      anton: ["var(--font-anton)", "Anton", "sans-serif"],
      marker: ["var(--font-marker)", "Permanent Marker", "cursive"],
      sans: ["var(--font-sans)", "Plus Jakarta Sans", "Noto Sans Telugu", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "Space Mono", "monospace"],
      telugu: ["var(--font-telugu)", "Noto Sans Telugu", "Plus Jakarta Sans", "sans-serif"],
    },
    extend: {
      borderRadius: {
        "sticker-lg": "20px",
        "sticker-sm": "16px",
        btn: "14px",
      },
      boxShadow: {
        sticker: "0 0 0 5px #FFFFFF, 0 0 0 7px #141313, 6px 8px 0 5px rgba(20, 19, 19, 0.18)",
        "sticker-sm": "0 0 0 4px #FFFFFF, 0 0 0 6px #141313, 4px 6px 0 4px rgba(20, 19, 19, 0.18)",
        btn: "4px 4px 0 #141313",
        "btn-hover": "2px 2px 0 #141313",
        "btn-none": "0 0 0 #141313",
        "btn-light": "4px 4px 0 #EAE6DF",
        logo: "3px 3px 0 #141313",
      },
    },
  },
  plugins: [],
};

export default config;
