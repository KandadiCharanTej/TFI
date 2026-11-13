# TFI & Pitch — Design System ("The Wall")

## Palette & Mode Color Rules
- **Concrete Wall:** `#EAE6DF` (`--concrete`)
- **Sticker White:** `#FFFFFF` (`--sticker`)
- **Warm Card:** `#F4F1EA` (`--card`)
- **Ink:** `#141313` (`--ink`) — 2.5px–3px hard borders & offset shadows (`4px 4px 0` / `6px 6px 0`)
- **Mode Colors (Game Panels & Mode Chips):**
  - **One phone:** Yellow `#F6BE18` (`--yellow`)
  - **Online:** Cyan `#00E5FF` (`--cyan`)
- **Action / State Colors (Reserved):**
  - **Correct / Sold:** Green `#00C853` (`--green`)
  - **Pass / Live / Brand Accent:** Magenta `#EC1276` (`--magenta`)

## Typography Roles (Direction A — Poster)
- `--font-display`: `Anton` (English display titles, uppercase)
- `--font-accent`: `Permanent Marker` (English sticker accent word)
- `--font-body`: `Plus Jakarta Sans` (500–800)
- `--font-mono-role`: `Space Mono` (700 — timers, scores, room codes)
- `--font-telugu-display`: `Anek Telugu` (700–800 — Telugu display & body, never uppercase, loaded only in Telugu mode)

## Spacing Scale
`4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px` (CSS tokens `--space-1` through `--space-8`).

## Heading Scale & Readability
- **Hero Display:** `clamp(44px, 8.5vw, 112px)` (EN) / `clamp(38px, 7.2vw, 94px)` (TE)
- **Section Display:** `clamp(30px, 5vw, 56px)`
- **Card Display:** `clamp(22px, 3.2vw, 32px)`
- **Prose Measure:** `max-width: 65ch` (`.wall-prose`) for comfortable reading.

## Sticker Tilt & Safe Areas
- **Max Tilts:** `-1.5deg`, `0.8deg`, `1.5deg` (never exceed ±1.5deg on readable cards).
- **Full-Screen Round Ergonomics:** `min-height: 100dvh`, `env(safe-area-inset-*)` padding, `user-select: none`, `-webkit-touch-callout: none`, `touch-action: manipulation` on rapid-tap round controls.
- **Reduced Motion:** `prefers-reduced-motion: reduce` and `html[data-reduced-motion="true"]` disable animations, confetti, and shakes.
