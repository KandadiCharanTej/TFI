/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        concrete: "#EAE6DF",
        sticker: "#FFFFFF",
        "inner-panel": "#F4F1EA",
        "ink-black": "#141313",
        "tfi-yellow": "#F6BE18",
        "tfi-magenta": "#EC1276",
        "win-green": "#00C853",
        "room-cyan": "#00E5FF",
      },
      fontFamily: {
        block: ["var(--font-anton)", "Anton", "sans-serif"],
        brush: ["var(--font-marker)", "'Permanent Marker'", "cursive"],
        sans: ["var(--font-jakarta)", "'Plus Jakarta Sans'", "sans-serif"],
        mono: ["var(--font-mono)", "'Space Mono'", "monospace"],
        telugu: ["var(--font-telugu)", "'Noto Sans Telugu'", "Gautami", "sans-serif"],
      },
      boxShadow: {
        "acamp-btn": "4px 4px 0px #141313",
        "acamp-btn-hover": "6px 6px 0px #141313",
        "acamp-card": "0 0 0 5px #FFFFFF, 0 0 0 7px #141313, 6px 8px 0px 5px rgba(20, 19, 19, 0.18)",
        "acamp-card-sm": "0 0 0 3px #FFFFFF, 0 0 0 5px #141313, 4px 5px 0px 3px rgba(20, 19, 19, 0.16)",
        "hard-offset": "5px 5px 0px #141313",
        "hard-offset-lg": "8px 8px 0px #141313",
      },
    },
  },
  plugins: [],
};

