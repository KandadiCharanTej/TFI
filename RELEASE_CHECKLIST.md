# Release Checklist (Beta)

1. **Content & Copy Review**
   - [ ] All card decks in `packages/content/sheets/` reviewed and `verified: true` where required (`pnpm content:review` & `pnpm content:build`).
   - [ ] Bilingual UI strings exported via `node --experimental-strip-types apps/web/scripts/export-i18n-review.mjs` and `i18n-review.csv` reviewed by a fluent Telugu speaker.
   - [ ] `/about` team credit (`"Made by <team name>"`) finalized.
2. **Legal**
   - [ ] `/privacy` and `/terms` drafts reviewed by legal counsel and `(Draft)` removed.
3. **Environment & Hosting (Vercel)**
   - [ ] `NEXT_PUBLIC_SITE_URL` set to production domain.
   - [ ] `SHOW_MVP_GAMES=false` (or unset) so only beta movie games appear.
   - [ ] `FEEDBACK_URL` set (or left blank if feedback form is not ready).
   - [ ] Optional `POSTHOG_KEY` and `SENTRY_DSN` configured.
4. **Quality & Speed Gates**
   - [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` pass cleanly.
   - [ ] `pnpm --filter @tfi/game-core test -- --coverage` shows >= 85% branch coverage.
   - [ ] `pnpm test:e2e` passes on Chromium and WebKit with 0 console errors and 0 axe violations.
   - [ ] Lighthouse mobile scores >= 90 Performance and 100 Accessibility on `/`, `/play`, and all beta setup & `/round` routes.
   - [ ] First Load JS < 150 KB per route.
5. **PWA & Offline Smoke Test**
   - [ ] Installable via Chrome/Android prompt and iPhone Safari "Add to Home Screen".
   - [ ] All 6 playable beta games load and run offline after first visit in both EN and తె.
