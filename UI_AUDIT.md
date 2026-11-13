# UI Audit (Phase 3b)

**Scope:** Beta routes (`/`, `/play`, `/play/head-set-go`, `/play/[game]`, `/play/dumb-charades`, `/play/most-likely`, setup, `/round`, `/results`) across `390x844`, `844x390` (landscape), and `1280x800` in English (`en`) and Telugu (`te`).
**Before screenshots:** `reference/ui-audit/before/`

## High Priority
1. **Desktop Hero Card Overlap (`/` at `1280x800`):** The Auction preview sticker (`LOT 3/10 MAGADHEERA`) sits on top of the Judge preview sticker's `Skip` button and lower `Answer` strip (`apps/web/app/page.tsx`). Both stickers must be legible with zero obscured controls.
2. **Mobile Hero Fold (`/` at `390x844`):** Sticky header + hero headline (`clamp(52px,9.6vw,120px)`) pushes primary CTAs (`Play now`, `See the games`) right to the bottom edge, especially in Telugu mode. Needs tighter mobile spacing and responsive heading scale so headline + pitch + `Play now` fit comfortably above the fold.
3. **Stale Game Count Copy (`/play`):** Heading reads `ALL 10 GAMES` even when Beta mode displays 7 games (`apps/web/lib/i18n.ts`). Must dynamically reflect visible game count (7 in Beta, 10 when `SHOW_MVP_GAMES=true`).
4. **Safe Areas, `100dvh`, & Touch Ergonomics on Round Screens:** Round screens use `min-h-screen` (`100vh`) instead of `min-h-[100dvh]`, lack `env(safe-area-inset-*)` padding for notched phones, and lack `user-select: none` / `-webkit-touch-callout: none` / `touch-action: manipulation` on rapid-tap round controls.
5. **Inconsistent Onboarding & Quit Confirmation:** `dumb-charades` and `most-likely` have a 3-step How-To-Play overlay (`?` button) and Radix quit confirmation, while `head-set-go` and the Judge template (`[game]/round`) lack the unified 3-step How-To-Play + Radix quit dialog.

## Medium Priority
6. **Thin Game Icons (`apps/web/components/icons.tsx`):** `head`, `trans`, `charades`, `emoji`, `rapid`, `most`, and `auction` use light 1.5px stroke icons instead of bold 3px-ink flat-palette sticker illustrations matching the Wall sticker aesthetic.
7. **Missing States & Micro-Feedback:**
   - Countdown lacks punchy `3, 2, 1, GO` stamp scale animation.
   - No streak counter badge, no `< 5 KB` canvas confetti burst (respecting `prefers-reduced-motion`) on streaks/winners, and no gentle shake on Time's up.
   - Missing designed loading skeleton, offline/error banner, deck-finished card, and landscape prompt state.
8. **Landing Page Conversion & Depth:** Missing a lightweight CSS-only "how a round plays" mini demo, FAQ section (5 questions), mobile sticky `Play now` CTA after scrolling past the hero, and conditional PWA Install sticker.
9. **Results Share Templates:** Results pages currently render a single 1080x1350 share layout instead of 3 cycleable Wall-style templates (Score, Winner, Gang photo-free poster) with player names off by default.

## Low Priority
10. **Active Nav Indicator (`AppFrame`):** Bottom bar & desktop rail should highlight the active section clearly.
11. **Design Tokens & Rules (`DESIGN.md`, `globals.css`):** Document formal spacing scale (`4, 8, 12, 16, 24, 32, 48, 64`), heading scale, max tilt (`-1.5, 0.8, 1.5`), and `<= 65ch` prose line length.
12. **Tap Press Tactility:** Buttons and interactive stickers benefit from a crisp active press offset (`translate(2px, 2px)`).
