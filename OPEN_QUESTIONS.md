# OPEN QUESTIONS

Things that need a human decision or native-speaker review before they go live.

## Content

### Cards pending verification (all 180 starter cards across 6 decks)

All cards in the content pipeline are marked `verified: false`. They need review by a Telugu cinema enthusiast and cricket fan who can confirm:
- Telugu script spelling is correct (no missing conjuncts or malformed glyphs)
- Difficulty ratings are appropriate for the target audience (16–35, friends)
- No card accidentally refers to a currently-sensitive topic
- Cricket IQ cards never reference protected brand terms (e.g. tournament names)

The CSVs are at:
- `packages/content/sheets/head-set-go-movies.csv` (30 cards)
- `packages/content/sheets/head-set-go-actors.csv` (30 cards)
- `packages/content/sheets/transify-movies.csv` (30 cards)
- `packages/content/sheets/emoji-cinema-movies.csv` (30 cards)
- `packages/content/sheets/rapid-fire-party.csv` (30 cards)
- `packages/content/sheets/cricket-iq-trivia.csv` (30 cards)

### Telugu translations in `lib/i18n.ts`

All `.te` values were written by the engineer and need a fluent-speaker check for:
- Natural phrasing (not too formal or literal)
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
