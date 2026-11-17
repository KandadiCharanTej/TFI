# TFI & Pitch

A Telugu-cinema party-game web app for friends. Beta includes 7 movie games (6 one-phone games ready + Box Office Auction online coming in Phase 6). Set `SHOW_MVP_GAMES=true` to preview cricket and MVP games.

## Language rule (decided 13 Nov 2026)

The app is **English by default**. Telugu script appears only when the user switches with the **తె / EN** button.

| Cookie | Meaning |
|--------|---------|
| `lang=en` (default) | English everywhere. Anek Telugu font not loaded. |
| `lang=te` | Telugu script leads, English small beneath. Telugu typography rules apply. |

The switch label "తె / EN" uses Telugu script in both modes — this is the only allowed exception.

## Development

```bash
pnpm install          # install all packages
pnpm content:build    # build card JSONs from CSVs (run this once after cloning)
pnpm content:review   # export review.csv and print verified vs unverified counts
pnpm dev              # start web (3000) + PartyKit room server (1999) + print LAN URL
pnpm typecheck        # TypeScript check (all packages)
pnpm test             # unit tests (all packages)
pnpm lint             # ESLint
pnpm build            # production build
pnpm test:e2e         # Playwright E2E (needs system Chrome)
pnpm --filter @tfi/realtime simulate   # 10-player WebSocket room stress test
```

## Testing online rooms on two phones (same Wi-Fi)

1. Connect your laptop and both phones to the **same Wi-Fi network**.
2. Start everything in one command:
   ```bash
   pnpm dev
   ```
3. Look at the printed banner in the terminal for `Phone Wi-Fi: http://<your-lan-ip>:3000` (for example `http://192.168.1.42:3000`).
4. Open `http://<your-lan-ip>:3000/room/new` on Phone A, create a **Ready check** room, and share the 4-letter code or `/r/XXXX` link with Phone B (`http://<your-lan-ip>:3000/join`).
5. Leave `NEXT_PUBLIC_PARTYKIT_HOST` blank in `.env.local` so phones automatically connect to `<your-lan-ip>:1999`. (`ENABLE_ROOMS` defaults to `true` in `pnpm dev`.)

## How to deploy the room server (PartyKit on Cloudflare)

1. Log in to PartyKit (opens GitHub / browser sign-in once):
   ```bash
   cd apps/realtime
   npx partykit login
   ```
2. Set allowed website origins so only your site can create/query rooms:
   ```bash
   npx partykit env add ALLOWED_ORIGINS
   # Enter your production URL, e.g. https://your-site.vercel.app
   ```
3. Deploy the room server from `apps/realtime`:
   ```bash
   npx partykit deploy
   ```
   Copy the deployed host printed at the end (for example `tfi-and-pitch-rooms.<your-handle>.partykit.dev`).
4. In Vercel -> Project Settings -> Environment Variables, add:
   - `NEXT_PUBLIC_PARTYKIT_HOST=tfi-and-pitch-rooms.<your-handle>.partykit.dev`
   - `ENABLE_ROOMS=true` (when ready to open rooms publicly; leave `false` while closed)
5. Redeploy Vercel so the updated environment variables take effect.

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

## How to publish (Vercel)

1. Import this repository in **Vercel** and set the **Root Directory** to the repo root (Turborepo / pnpm workspace is auto-detected).
2. Set **Build Command** to `pnpm --filter @tfi/web build` and **Install Command** to `pnpm install --frozen-lockfile`.
3. Copy variables from `ENV.example` into Vercel Project Settings → Environment Variables (`NEXT_PUBLIC_SITE_URL`, `SHOW_MVP_GAMES=false`, optional `FEEDBACK_URL`, `POSTHOG_KEY`, `SENTRY_DSN`).
4. Deploy. Verify `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml`, and `/og-share.png` return HTTP 200.

## Legal

Unofficial fan-made game. Not affiliated with any film, actor, studio, cricket league or team. All auctions use pretend game coins only — no real money, payments, wallets or prizes.
