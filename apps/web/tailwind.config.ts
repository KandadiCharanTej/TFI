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
      white: WALL_COLORS.sticker,
      card: WALL_COLORS.card,
      ink: WALL_COLORS.ink,
      yellow: WALL_COLORS.yellow,
      magenta: WALL_COLORS.magenta,
      green: WALL_COLORS.green,
      cyan: WALL_COLORS.cyan,
    },
    fontFamily: {
      anton: ["var(--font-display)", "Bricolage Grotesque", "sans-serif"],
      marker: ["var(--font-display)", "Bricolage Grotesque", "sans-serif"],
      sans: ["var(--font-body)", "Bricolage Grotesque", "Anek Telugu", "system-ui", "sans-serif"],
      mono: ["var(--font-mono)", "Space Mono", "monospace"],
      telugu: ["var(--font-telugu)", "Anek Telugu", "Bricolage Grotesque", "sans-serif"],
    },
    extend: {
      borderRadius: {
        "sticker-lg": "20px",
        "sticker-sm": "16px",
        btn: "16px",
      },
      boxShadow: {
        sticker: "0 6px 0 #141313",
        "sticker-sm": "0 4px 0 #141313",
        btn: "0 5px 0 #141313",
        "btn-hover": "0 8px 0 #141313",
        "btn-none": "0 0 0 #141313",
        "btn-light": "0 5px 0 #EAE6DF",
        logo: "0 3px 0 #141313",
      },
    },
  },
  plugins: [],
};

export default config;
