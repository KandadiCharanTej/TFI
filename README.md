# TFI & Pitch (తెలుగు సినిమా పార్టీ గేమ్స్)

**Cinema. Friends. Fun.**

The premier Telugu-first social gaming platform where friends play Telugu cinema-based party games together. Built with playful Neo-Brutalism, warm ivory tones, bold borders, hard offset shadows, and authentic Tollywood culture.

---

## 🍿 The 5 Launch Games (All Included & Playable)

1. **TFI Box Office Auction (బాక్స్ ఆఫీస్ వేలం) — Flagship Game**
   - **Single-Device Pass & Play**: One device passed around the circle with secret blind bidding screens and privacy handoff.
   - **Online Multiplayer**: Real-time room codes, live countdown timer, server bid validation, and anti-sniping extensions.
   - **Scoring Engine**: 40% Box Office + 30% Audience Reception + 30% Cult Repeat Value + Genre Diversity Bonus.
2. **Head Set Go (హెడ్ సెట్ గో)**
   - Forehead party game with device orientation tilt sensors (tilt down = correct, tilt up = pass) and touch button fallbacks.
3. **Transify (ట్రాన్సిఫై)**
   - Guess Telugu blockbusters from hilarious broken-English literal translations with private Judge reveal screen.
4. **Dumb Charades (డంబ్ చారేడ్స్)**
   - Team 1 vs Team 2 with secret "Actor Only" curtain reveal, round tracking, and team scoreboards.
5. **Emoji Cinema (ఎమోజి సినిమా)**
   - Rapid-fire Tollywood emoji puzzles with 4 choices, timers, and explanations.

---

## 🎨 Design System

- **Warm Ivory:** `#FFF8E9`
- **Mango Yellow:** `#FFCB45`
- **Cinema Coral:** `#FF704D`
- **Cobalt Blue:** `#4385EA`
- **Fresh Green:** `#83CBA2`
- **Lavender:** `#CBB8F5`
- **Ink Black:** `#171717`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.14.0)
- npm 9+

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your mobile browser or browser mobile simulator (390px - 430px width for authentic phone feel).

### Build for Production

```bash
npm run build
npm run start
```

---

## 🗄️ Database & Realtime Setup (Supabase)

The project includes offline support and client-side simulation for guest play without login. To connect a live Supabase PostgreSQL backend for persistence:

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL schema from [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor.
3. Add environment variables to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
