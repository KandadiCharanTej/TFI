# DESIGN_V4.md — TFI & Pitch "Party Mode" Design System

## 1. The Problem with Design V3
Design V3 (`design-v3-clean`) established crisp hierarchy, zero clutter, and clear color roles, but felt too quiet and editorial for a live Telugu cinema party game. Full-screen parties need **Kahoot / Jackbox / Spotify Wrapped** energy: bold poster typography, unapologetic full-bleed color blocking, oversized sticker illustrations, crisp sound + haptic feedback, confetti bursts, and clear structure so strangers grasp the product in 5 seconds.

## 2. Mandatory Guardrails ("Loud With Structure")
1. **One focal point per section**: every screen section leads the eye to one unmistakable primary anchor.
2. **Strict grid & spacing scale**: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px` only.
3. **Readable contrast always (WCAG AA+)**:
   - Ink `#141313` text on Yellow `#F6BE18`, Cyan `#00E5FF`, Green `#00C853`, Concrete `#EAE6DF`, Card `#F4F1EA`, and White `#FFFFFF`.
   - White `#FFFFFF` text on Magenta `#EC1276` ONLY for large bold type (`>= 19 px` / bold display >= 18.66 px, weight `700+`).
   - Normal body text (`<= 17 px`) NEVER sits directly on Magenta or Green; place body copy inside a White `#FFFFFF` card on top.
4. **Non-blocking decorations**: `Starburst`, `XMark`, `Squiggle`, `SpotlightBeam`, confetti shapes, and floating stickers are always `aria-hidden="true"` and `pointer-events: none`, never overlap text, and are hidden/reduced on narrow viewports where space is tight.
5. **Restrained tilt**: tilt (`rotate`) ONLY on decorative elements and badge/ticket stickers, maximum **3 tilted elements per viewport**, NEVER on readable text blocks, buttons, grid cards, or active round cards.
6. **Script parity**: Telugu mode matches English mode in visual punch, color blocking, motion, and optical sizing (`+10%` scale, zero uppercase, zero artificial letter-spacing).
7. **Speed & budget targets**: First Load JS `< 150 KB` per route, hero LCP `< 2.5 s` mobile 4G, CLS `< 0.1`, Lighthouse mobile `>= 90` Perf and `100` A11y. Transform/opacity animations only. Inline SVG/CSS art (`< 2 KB` per illustration).
8. **Calm mode (`/me`)**: user toggle (default `OFF` = party on) + automatic sync with `(prefers-reduced-motion: reduce)`. Disables auto-playing hero demos, marquee motion, hover wiggles, confetti, and audio; preserves clean static visual polish.
9. **Honest content only**: zero fabricated player counts, reviews, or social proof.

## 3. Typography & Font Lab Round 3 Decision
Evaluated on `/dev/fonts` across `120 px` Display and `14 px` Labels in both scripts:
- **L1 (Selected Winner): `Bricolage Grotesque` ExtraBold Condensed (`75%` width, `800`, `21 KB`) for Display + `Bricolage Grotesque` (`100%` width, `500..800`, `30 KB`) for H3/body/buttons + `Anek Telugu` (`800`, `136.4 KB`, TE mode only) + `Space Mono` (`700`, `9.3 KB`)** (+ `2.0 KB` `Anek Telugu Switch` subset for `తె`). All SIL OFL 1.1.
  - **Rationale**:
    1. Condensed `75%` ExtraBold gives 120 px poster loudness while fitting tight 390 px / 1280 px viewports without single-word orphan lines.
    2. Using one shared Bricolage family across display and UI body prevents clash and keeps `14 px` labels hyper-legible via its optical-size (`12..96`) axis.
    3. Harmonic humanist modulation pairs naturally with `Anek Telugu` 800 without Tall-ascender line clipping on `96 px` round cards.
    4. `Unbounded` (L2) over-widens headlines horizontally at `120 px`, and `Lilita One` + `Baloo Tammudu 2` (L3) costs `+85 KB` extra Telugu weight with looser small-text legibility.
    5. Total EN font transfer = **`62.3 KB`** (`< 140 KB` budget); TE mode = **`198.7 KB`** (`< 280 KB` budget). Omitted Latin-only italic `Shrikhand` in production hero pills so Telugu mode stays optically identical.

### Type Scale (Desktop / Phone)
| Role | Class | Size (Desktop / Phone) | Weight | Line Height | Tracking | Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Display | `.display-title` | `clamp(52px, 6.4vw, 120px)` / `64px` (scaled `>=48px` on `320px`) | `800` | `0.98` (TE `1.22`) | `-0.02em` (TE `0`) | Latin `uppercase` allowed in display/hero; TE `none` |
| H1 | `.h1-title` | `clamp(48px, 5vw, 80px)` / `48px` | `800` | `1.02` (TE `1.28`) | `-0.02em` | Latin display/sentence; TE `none` |
| H2 | `.h2-title` | `clamp(36px, 3.6vw, 56px)` / `36px` | `800` | `1.08` (TE `1.35`) | `-0.015em` | Sentence / Title |
| H3 | `.h3-title` | `clamp(22px, 2vw, 28px)` / `22px` | `800` | `1.2` (TE `1.4`) | `-0.01em` | Sentence |
| Body Large | `.body-lg` | `20px` / `18px` | `500–600` | `1.5` | `0` | Sentence |
| Body | `body` | `17px` / `16px` | `500` | `1.55` | `0` | Sentence |
| Buttons | `.wall-btn` | `18px–20px` | `800` | `1.15` | `0` | Sentence |
| Small / Label | `.wall-label` | `14px` / `12px` | `600–700` | `1.25` | `0.06em` (TE `0`) | Latin `uppercase`; TE `none` |
| Numbers | `.mono-num` | inherited | `700` | tabular | `tabular-nums` | Space Mono |

## 4. Color-Blocking & Surface System
- **Surfaces**:
  - Cards (`.wall-sticker`): `#FFFFFF` (or game fill), `3px solid #141313` border, `20px` radius, `0 6px 0 #141313` hard shadow.
  - Buttons (`.wall-btn`): `3px solid #141313` border, `16px` radius, `0 5px 0 #141313` shadow; hover lifts `3px` + shine sweep (pointer fine only); active sinks `+4px`.
- **Patterns (subtle texture on full-bleed color blocks only, never behind small body text)**:
  - `.bg-halftone`: `radial-gradient(rgba(20,19,19,0.09) 2px, transparent 2px)` at `14px` pitch.
  - `.bg-stripes`: `repeating-linear-gradient(-45deg, rgba(20,19,19,0.06) 0 10px, transparent 10px 20px)`.
- **Landing Color-Block Rhythm** (never two loud blocks touching):
  1. **Top bar**: Concrete `#EAE6DF` (sticky slim)
  2. **Hero**: Full-bleed Yellow `#F6BE18` + halftone dots
  3. **Marquee Tapes**: Double opposite-scrolling Ink `#141313` & Yellow `#F6BE18` strips
  4. **How it plays**: Full-bleed Magenta `#EC1276` + giant white `01 / 02 / 03` cards + large bold white heading
  5. **Seven games**: Concrete `#EAE6DF` + filter chips + 2x2 featured `Head Set Go` + color game tiles
  6. **Telugu Switch Block**: Card `#F4F1EA` neutral block with giant live `English | తెలుగు` toggle + live sample card
  7. **Coming Next**: Full-bleed Cyan `#00E5FF` + stripes + `"Tell me when it opens"` CTA
  8. **Closing**: Full-bleed Yellow `#F6BE18` + static confetti shapes + giant `Play now` CTA
  9. **Footer**: Ink `#141313` with Concrete `#EAE6DF` text + unofficial disclaimer
- **Game & Round Colors**:
  - Yellow `#F6BE18`: `head-set-go`, `emoji-cinema`
  - Magenta `#EC1276`: `transify`, `rapid-fire`
  - Green `#00C853`: `dumb-charades`, `most-likely`
  - Cyan `#00E5FF`: `box-office-auction`, Online Rooms (`/room/[code]`)
  - Setup pages get a full-bleed top game-color header band + white `3px`-bordered controls card.
  - Round screens use full-bleed game-color canvas with pure white/card focus card (`>= 96 px` Telugu prompt scale).

## 5. Motion, Confetti & Web Audio Kit
- **Scroll Reveal** (`Reveal` / `.v4-reveal`): `opacity: 0 -> 1`, `translateY(24px -> 0) scale(0.98 -> 1)`, `380ms cubic-bezier(0.22, 1, 0.36, 1)`, `60ms` stagger via `IntersectionObserver`, triggers once. Bypassed immediately under Calm mode / `prefers-reduced-motion`.
- **Button Press & Shine**: Hover lift `-3px` + pseudo-element sheen sweep `420ms ease-out`; press `+4px` (`80ms ease`).
- **Tile Hover/Focus Wiggle**: Tile lifts `-6px`, illustration runs `@keyframes v4-wiggle` (`+-2deg`, `400ms ease-in-out`), Play ribbon slides in (`220ms`).
- **Countdown Urgency**: Last `10s` pulses timer scale `1 -> 1.06 -> 1` (`800ms`) and tints bar Magenta `#EC1276`.
- **Screen Shake**: On time-up (`4px`, `150ms` x-axis).
- **Canvas Confetti (`ConfettiBurst`, `< 5 KB`)**: `30–56` palette rectangles (`#F6BE18`, `#EC1276`, `#00C853`, `#00E5FF`, `#141313`), `1.2 s` burst (`requestAnimationFrame`), completely skipped in Calm mode.
- **Web Audio (`apps/web/lib/sound.ts`)**: Zero audio assets; synthesized Web Audio API cues gated on first pointer/keyboard gesture, Calm mode OFF, and user Sound setting:
  - `tap`: short `420->220 Hz` triangle pop (`35ms`)
  - `correct`: bright two-note major fifth chime `523->784 Hz` (`140ms`)
  - `pass`: low percussive buzz `190->140 Hz` (`110ms`)
  - `clack`: filtered crisp noise impulse (`45ms`)
  - `tick`: sharp `880 Hz` click (`25ms`) for last 3 seconds
  - `win`: 3-note fanfare chord `523/659/784 -> 1046 Hz` (`340ms`)
- **Haptics**: `navigator.vibrate?.([18])` on Correct, `[12, 24, 12]` on Pass (gated on Vibration setting).
