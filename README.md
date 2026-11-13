# TFI & Pitch

A Telugu-first party-game web app for friends. 10 short games around Telugu cinema, Indian cricket, and friend-group banter.

## Language rule (decided 13 Nov 2026)

The app is **English by default**. Telugu script appears only when the user switches with the **తె / EN** button.

| Cookie | Meaning |
|--------|---------|
| `lang=en` (default) | English everywhere. Noto Sans Telugu font not loaded. |
| `lang=te` | Telugu script leads, English small beneath. Telugu typography rules apply. |

The switch label "తె / EN" uses Telugu script in both modes — this is the only allowed exception.

## Development

```bash
pnpm install          # install all packages
pnpm content:build    # build card JSONs from CSVs (run this once after cloning)
pnpm dev              # start dev server
pnpm typecheck        # TypeScript check (all packages)
pnpm test             # unit tests (all packages)
pnpm lint             # ESLint
pnpm build            # production build
pnpm test:e2e         # Playwright E2E (needs system Chrome)
```

## Package structure

```
apps/
  web/                Next.js 15 app (the main product)
packages/
  content/            Card schema (Zod) + CSV→JSON build pipeline
  game-core/          XState v5 machine + shared types
  config/             Shared Tailwind tokens, TypeScript config
  realtime/           Stub for future online room socket server
```

## Content pipeline

Card data lives in `packages/content/sheets/*.csv`. After editing a CSV, run:

```bash
pnpm content:build
```

This validates all cards with Zod, rejects duplicates, writes JSON to `packages/content/dist/` and copies to `apps/web/public/cards/` (served as static files, cached by the service worker).

All 60 starter cards have `verified: false`. They need review by a Telugu cinema enthusiast before v1.

## Legal

Unofficial fan-made game. Not affiliated with any film, actor, studio, cricket league or team. All auctions use pretend game coins only — no real money, payments, wallets or prizes.
