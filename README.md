# TFI & Pitch — Telugu Cultural Gaming Platform

> **Cinema. Friends. Fun.**  
> The premier Telugu-first social gaming platform where friends and families celebrate Telugu cinema through interactive party games, hilarious decoding challenges, and high-stakes box office auctions.

---

## 🎨 Design System: EDITION 01 — ACAMP OVERFLOW

**ACAMP OVERFLOW × PLAYFUL NEO-BRUTALISM × RETRO COMIC × TELUGU CINEMA STREET POSTER**

- **Concrete Canvas:** `#EAE6DF` with radial dot grid pattern (`radial-gradient(#141313 0.75px, transparent 0.75px)`)
- **Sticker Surface:** `#FFFFFF`
- **Inner Content Panel:** `#F4F1EA`
- **Ink Black Outlines & Shadows:** `#141313`
- **Street Yellow Primary:** `#F6BE18`
- **Hot Magenta Accent:** `#EC1276`
- **Winning Green:** `#00C853`
- **Room Cyan:** `#00E5FF`

### Typography Stack
- **Anton** (`--font-anton`): Main headings and game titles.
- **Permanent Marker** (`--font-marker`): Brush-style street accents and celebratory tags.
- **Plus Jakarta Sans** (`--font-jakarta`): UI body, descriptions, rules.
- **Space Mono** (`--font-mono`): Timers, room codes, purses, and auction prices.
- **Noto Sans Telugu** (`--font-telugu`): Authentic, crisp Telugu script rendering across mobile and desktop.

### Double-Outlined Die-Cut Sticker Card
```css
.diecut-sticker-card {
  background: #FFFFFF;
  border: 3px solid #141313;
  box-shadow:
    0 0 0 5px #FFFFFF,
    0 0 0 7px #141313,
    6px 8px 0 5px rgba(20, 19, 19, 0.18);
  border-radius: 1rem;
}
```

---

## 🎮 The 5 Official Games (100% Telugu Cinema)

### 1. Head Set Go (`/games/head-set-go`)
- **Type:** Single-device forehead party game.
- **Categories:** All Cinema Mix, Heroes & Stars, Cult Characters, Famous Dialogues, Brahmi Universe.
- **Controls:** Landscape UI with touch (Tap right for Correct, Tap left for Pass) + Gyroscope tilt (Tilt down = Correct, Tilt up = Pass).
- **Features:** 5-second countdown, Screen Wake Lock API support, timer options (60s–180s), tactile audio cues, comprehensive scorecard.

### 2. Transify (`/games/transify`)
- **Type:** Single-device Judge + Friends game.
- **Concept:** Guess Telugu movie titles and iconic cinema dialogues from hilarious literal or broken-English translations.
- **Features:** Judge private answer shutter with click-to-peek, categories (Literal Titles, Iconic Dialogues, Meme Slang), immediate card advance, and round summary.

### 3. Dumb Charades (`/games/dumb-charades`)
- **Type:** Single-device team game (Team A vs Team B).
- **Concept:** Act out Telugu movies without uttering a sound.
- **Features:** **Hold-to-Peek privacy shutter** so opposing teammates cannot accidentally see secret titles, actor handoff screen, live team scoreboards, customizable team names, round tracker.

### 4. Emoji Cinema (`/games/emoji-cinema`)
- **Type:** Single-device visual puzzle quiz.
- **Concept:** Decode Telugu blockbusters from emoji combinations.
- **Features:** 4 interactive choices, immediate green/red feedback, cinema trivia explanation on *why* the emojis match the movie, streaks, and TFI Fan IQ Rank ("Box Office Badshah").

### 5. TFI Box Office Auction (Flagship Game)
Compete to build the highest-grossing Telugu cinema catalog with a virtual purse (₹50 Cr – ₹200 Cr).
- **Mode A: Single-Device Pass-and-Play (`/games/box-office-auction/pass-and-play`)**
  - 2 to 8 players on one shared screen.
  - Secret private bidding turn for each player with purse validation.
  - Handoff privacy guarantee ("Pass phone to [Player Name]").
  - Suspenseful "Reveal All Bids" screen and winner calculation.
  - 100% playable offline!
- **Mode B: Online Multiplayer Rooms (`/rooms` & `/rooms/[code]`)**
  - Instant room creation with 5-letter alphanumeric code (e.g. `TFI88`).
  - Real-time player presence with selected hero fanbase avatars.
  - 15-second authoritative countdown timer.
  - **Anti-Sniping Rule:** Valid bid in the final 5 seconds resets the timer to 5 seconds!
  - Real-time purse deduction and portfolio tracking.
- **Shared Scoring Engine:**
  - `40% Box Office Performance + 30% Talk/Word-of-Mouth + 30% Cult & Repeat Value`.
  - **Synergy Combos:** Trivikram × Bob (+15 pts), Pushpa Raj × Sukumar (+15 pts), SSR Titan Combo (+20 pts), Brahmi Pack (+15 pts).
  - **Meme Traps:** Shakti, Son of India, Agnyaathavaasi (-15 pts each, or +30 pts Cult Meme Lord bonus if you boldly collect multiple disasters!).

---

## 🗄️ Telugu Cinema Database

Located at `src/data/teluguCinemaDatabase.ts` and `src/data/cinemaExpansion.ts`, featuring **100+ meticulously structured Telugu cinema entries** spanning:
- Pan-India Epics: *Baahubali 1 & 2, RRR, Pushpa 1 & 2, Kalki 2898 AD, Salaar, Devara, HanuMan*
- Golden Age & 2000s Nostalgia: *Pokiri, Athadu, Okkadu, Kushi, Tholi Prema, Indra, Tagore, Simhadri, Chatrapathi, Manmadhudu, Nuvvu Naaku Nachav, Malliswari, Happy Days, Kick, Race Gurram, Dookudu, Gabbar Singh, Julayi, Attarintiki Daredi, Ee Nagaraniki Emaindi*
- Comedy & Cult Giants: *Venky, Dhee, Dubai Seenu, Adhurs, Ready, King, Sudigadu, Jathi Ratnalu, Mathu Vadalara, DJ Tillu, Tillu Square, MAD*
- Classics: *Mayabazar, Sankarabharanam, Sagara Sangamam, Swathi Muthyam, Rudraveena, Geethanjali, Shiva, Jagadeka Veerudu Athiloka Sundari, Gang Leader, Gharana Mogudu, Goodachari 116, Mosagallaku Mosagadu*

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd TFI

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Test
```bash
# Build Next.js optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 📱 Progressive Web App (PWA) & Offline Support

- **Manifest:** Configured at `/manifest.json` with app icons, theme colors (`#F6BE18`), and standalone display.
- **Service Worker:** Located at `/sw.js` for caching static assets and cinema data for offline single-device gameplay.
- **Web Audio API:** Zero external MP3 files needed—synthesizes retro clicks, timer ticks, chimes, and auction gavels on the fly.
- **Screen Wake Lock:** Prevents screen dimming during landscape Head Set Go gameplay.

---

## 🏆 Fanbase Avatars

Players can pick from legendary Tollywood identities in their profile:
1. **bhAAi** (Allu Arjun) — *"తగ్గేదే లే! (Thaggedhe Le!)"*
2. **Bob** (Mahesh Babu) — *"ఒక్కసారి కమిట్ అయితే నా మాట నేనే వినను!"*
3. **Darling** (Prabhas) — *"హే డార్లింగ్!"*
4. **Tarak** (Jr NTR) — *"చూడు ఒక్కసారి చూడు!"*
5. **OG** (Pawan Kalyan) — *"నక్కెంత తిక్కో నాక్కూడా తెలీదు!"*
6. **Boss** (Chiranjeevi) — *"ఇది బాస్ టైమ్!"*
7. **Natural Star** (Nani) — *"ఆట మొదలైంది!"*

---

## 📄 License
MIT License. Built with pride for Telugu cinema lovers worldwide.
