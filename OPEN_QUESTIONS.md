# OPEN QUESTIONS

Things that need a human decision or native-speaker review before they go live.

## Content

### Content pending verification (`verified: false`)

All master items and cards in the content pipeline are marked `verified: false`. They need review by a Telugu cinema enthusiast (and cricket fan for MVP decks) who can confirm:
- Telugu script spelling is correct (no missing conjuncts or malformed glyphs)
- Release years and directors (where filled) are 100% accurate
- Difficulty ratings are appropriate for the target audience (16–35, friends)
- No card accidentally refers to a currently-sensitive topic
- Cricket IQ cards (hidden in beta) never reference protected brand terms

#### How to review (`pnpm content:review`)
1. Run `pnpm content:review` from the repo root. This generates `packages/content/review/review.csv` with columns `id, English, Telugu, year, director, reviewer OK?, correction` and prints verified/unverified counts.
2. Open `packages/content/review/review.csv` in Google Sheets or Excel.
3. For each row: check English, Telugu, year, and director. Put `OK` in `reviewer OK?` if accurate, or write the fix in `correction`.
4. Apply any approved corrections back to the source CSVs in `packages/content/sheets/` (`films.csv`, `actors.csv`, `transify-movies.csv`, `rapid-fire-party.csv`, `most-likely-party.csv`, etc.) and change `verified` from `false` to `true`.
5. Run `pnpm content:build` to validate all references and regenerate the JSON decks.

The source CSVs are at:
- `packages/content/sheets/films.csv` (80 films)
- `packages/content/sheets/actors.csv` (40 actors)
- `packages/content/sheets/head-set-go-movies.csv` (30 cards, refs `films.csv`)
- `packages/content/sheets/head-set-go-actors.csv` (40 cards, refs `actors.csv`)
- `packages/content/sheets/transify-movies.csv` (30 cards, refs `films.csv`)
- `packages/content/sheets/emoji-cinema-movies.csv` (30 cards, refs `films.csv`)
- `packages/content/sheets/dumb-charades-movies.csv` (80 cards, refs `films.csv`)
- `packages/content/sheets/rapid-fire-party.csv` (30 movie-edition cards)
- `packages/content/sheets/most-likely-party.csv` (30 movie-edition prompts)
- `packages/content/sheets/cricket-iq-trivia.csv` (30 cards, MVP-only / hidden in beta)

### Telugu translations in `lib/i18n.ts`

All `.te` values were written by the engineer and need a fluent-speaker check for:
- Natural phrasing (not too formal or literal), including the new beta tagline `మన సినిమా, మన సరదా, మన గ్యాంగ్`
- Correct spelling and conjuncts
- Appropriate register (friends playing a party game — casual, not academic)

## Gameplay

### Head tilt controls for Head Set Go

Proposal: use `DeviceMotionEvent` to auto-detect tilt instead of tap zones.  
**Decision needed:** opt-in after the beta? Always on? Requires HTTPS and user permission prompt on iOS.

### Round timer default

Currently 60 seconds. Is 60s too long / too short for first-time players?

## Design

### "Gang" sticker on landing hero

The landing spec says `"Gang"` is a white sticker with magenta Permanent Marker text, tilted −2 degrees. Currently this is a plain styled span. A proper tilted sticker needs Phase 3 polish pass.

### Fan-vibe chips

The chips (bhAAi, Bob, Darling, Tarak, OG, Boss, Nani) are in the landing design but not wired to game logic. Purely cosmetic, or used to personalise cards?

## Legal

### Actor / director names

Using names as plain factual identifiers is generally fine, but confirm with legal counsel before v1 public launch, especially for currently-active public figures.
