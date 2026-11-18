# DESIGN_V5.md — Phase 5c: Funky Hero Doodle Layer & Mobile Polish

Design V5 (`phase-5c`) preserves every locked **Design V4** font (`Bricolage Grotesque Condensed 800`, `Bricolage Grotesque`, `Anek Telugu 800`, `Space Mono`), locked 8-color Wall palette (`#EAE6DF`, `#FFFFFF`, `#F4F1EA`, `#141313`, `#F6BE18`, `#EC1276`, `#00C853`, `#00E5FF`), headline copy, and section order, while upgrading two areas:
1. **Part A — Street-Poster Hero Doodle Layer** (`apps/web/components/doodle-kit.tsx`, `hero-doodles.tsx`, `hero-inline-doodles.tsx`)
2. **Part B — Mobile-First Ergonomics & Zero-Overflow Layout Across Phones**

---

## Part A: Street-Poster Hero Doodle Layer

### 1. Inline Original SVG Kit (each `< 2 KB`, palette-only, `aria-hidden="true"`)
Built in `apps/web/components/doodle-kit.tsx` and `apps/web/components/hero-inline-doodles.tsx`:
- **Headline Plate & Crown:** Yellow plate (`border-[3px] border-ink ring-4 ring-white shadow-[0_6px_0_#141313]`) with tilted `-1.5deg` magenta accent pill (`TELUGU` / `తెలుగు`) and `DoodleCrown` sitting on the upper-right plate corner.
- **Scribble Oval (`DoodleScribbleOval`):** Hand-drawn magenta oval that draws once on load around `"favourite films"` (EN) / `"ఫేవరెట్ సినిమాలను"` (TE) without touching text glyphs.
- **Corner Slabs:** Diagonal yellow corner slabs cut into the top-left and bottom-right corners of the hero.
- **Hero Backdrop Doodles (`HeroDoodles`, lazy-loaded client-side):**
  - `XMark`: Ink (`56 px`), Magenta (`140–172 px` cropped bottom-left XL + `24 px` XS), White-on-yellow-slab (`184 px` cropped bottom-right XL).
  - `Star`: Outlined white (`34–46 px`) + small solid ink star (`16 px` bottom-right).
  - `LightningBolt`: Magenta (`30–44 px`), flashes on Demo `"Correct!"`.
  - `DotColumn`: `4x2` ink dots (`24x48 px`).
  - **Cinema Doodles:** `DoodleClapper`, `DoodleFilmStrip`, `DoodleTicket`, `DoodleMegaphone`.
  - `DoodleSmiley`: X-eyes + tongue ink line doodle on desktop; **1 tap** winks + party sound, **5 taps** launches confetti burst.

### 2. Responsive Breakpoint Budget (`5 / 8 / 12`)
Measured by `apps/web/tests/phase5c.spec.ts` with zero text or demo overlap in EN and TE:
- **Phones (`< 768 px` — `5` visible):** Cropped bottom-left magenta XL `XMark`, top-right outlined `Star`, mid-right magenta `LightningBolt`, bottom-right small ink `Star`, and `4x2` `DotColumn`.
- **Tablets (`768–1279 px` — `8` visible):** Adds bottom-right white XL `XMark` on corner slab, top-center `DoodleClapper`, and bottom-right `DoodleMegaphone`.
- **Desktop (`1280 px+` — `12` visible):** Adds center-gutter ink `56 px` `XMark`, top-left `DoodleFilmStrip`, center-gutter green `DoodleTicket`, and interactive bottom `DoodleSmiley` easter egg (`[data-testid="hero-doodle-smiley"]`).
  *(Note: desktop also displays existing ambient starburst & XS right-edge X beside the phone frame; interactive `data-doodle-item` budget strictly stays `<= 5` phones, `<= 8` tablet, `<= 12` desktop.)*

### 3. Motion, Calm Mode & Low-Power Budget
- CSS transforms & opacity only (`doodle-enter-bl/br` 350ms, slow `60s` X spin, `4s` star twinkle, `6s` bolt flicker, `12 px` desktop `pointermove` parallax initialized lazily on `requestAnimationFrame`).
- Automatically halted when **Calm mode** (`data-reduced-motion="true"`), OS `prefers-reduced-motion: reduce`, or low-memory devices (`navigator.deviceMemory <= 2` -> `data-low-power="true"`) are active.

---

## Part B: Mobile-First Improvements ("Perfect on Phones")

1. **Zero Horizontal Overflow Across Full Device Matrix (`280 px` to `1920 px`) & `200%` Text Scaling:**
   - Global `overflow-x: clip` and `overflow-wrap: anywhere`, plus `touch-action: manipulation` on interactive controls and `scroll-margin-bottom: 140px` on inputs so mobile keyboards do not obscure focused fields (`16 px` input text prevents iOS Safari auto-zoom).
2. **Above-the-Fold Hero + Smart Slim Header (`56 px`):**
   - Tightened hero vertical spacing so `Play now →` and headline sit above the fold on `360x640` and `390x844` (plus top of live demo visible on `390x844`).
   - `IntersectionObserver` hides header `Play now` while the hero CTA is visible on screen, surfacing it cleanly on scroll.
3. **`>= 44x44 px` Minimum Tappable Targets & Round Thumb Ergonomics:**
   - Audited all visible buttons, links, inputs, steppers, radio filters, language pills, and room controls across portrait/landscape viewports (`0` violations).
   - Fixed `.wall-btn` specificity inside `@layer components` (`apps/web/app/globals.css`) so active round thumb zones cleanly enforce `>= 64 px` height on portrait rounds (`Transify`, `Dumb Charades`, `Emoji Cinema`, `Rapid Fire`, `Most Likely`) and `>= 96 px` height on `Head Set Go` landscape PASS/CORRECT zones.
   - Wrapped round header pills (`✓ 0`, Judge badge, `60s`) cleanly (`whitespace-nowrap`) so `390 px` portrait bars never break numbers or icons mid-pill.
4. **Telugu Longest Titles in Landscape & Safe Areas:**
   - Fluid `clamp(28px, 8vw, 86px)` card sizing on `Head Set Go` keeps long Telugu movie titles legible with `0` horizontal overflow at `667x375` and `740x360`, respecting `env(safe-area-inset-*)` and `overscroll-behavior: none` during rapid round taps.
5. **Landing Bundle Code-Splitting:**
   - Split below-the-fold sections into `components/landing-below-fold.tsx` (`next/dynamic`) and dynamic-loaded `HeroDoodles`, keeping `/` at **`146 kB` First Load JS** and every route across the app at **`<= 148 kB`** (`< 150 kB` budget).

---

## Verification Metrics (Measured)
- **Typecheck / Lint / Unit Tests:** All 5 workspace packages pass (`tsc --noEmit`, `next lint` with 0 warnings/errors, `vitest run`).
- **`@tfi/game-core` Coverage:** **`99.01%` Statements / `99.01%` Lines / `88.27%` Branches** (`46/46` tests pass).
- **Playwright E2E (`chromium` + `webkit`):** **`174 passed`, `0 failed`** (`4` Chromium-only screenshot tasks skipped on WebKit) + Live Rooms (`test:e2e:rooms`): **`2 passed`, `0 failed`**; **0 axe violations**; **0 console errors**.
- **Lighthouse Mobile (all 19 routes — 15 beta + 4 live room routes):** **100 Accessibility** on every route; **95–100 Performance** (`/` Perf `100`, LCP **`0.91 s`**, CLS **`0.000`**; max CLS across all routes **`0.087`** on `/room/[code]`).
- **Screenshots:** Saved in `reference/design-v5/` (`landing-*` across `320x568`..`1920x1080` EN/TE, `play`, `setup-transify`, `hsg-round`, `transify-round`, `results`, `lobby`).
