# DECISIONS.md

One-line record of architecture, design, and engineering choices made during development.

- **2026-11-13 (Phase 0)**: Self-hosted all 5 font families (`Anton`, `Permanent Marker`, `Plus Jakarta Sans`, `Space Mono`, `Noto Sans Telugu` subset to Telugu + Latin) directly in `apps/web/public/fonts/*.woff2` extracted from the reference preview bundle so zero requests go to Google Fonts at runtime.
- **2026-11-13 (Phase 0)**: Kept the working brand name (`TFI & Pitch`) in English letters only under a single translation key (`brand.name`) and used Telugu in `brand.tagline` (`మన సినిమా, మన క్రికెట్, మన గ్యాంగ్`) per product rule 2.
- **2026-11-13 (Phase 0)**: Enforced Non-Negotiable Rule 1 (Telugu leads on every game card, title, and clue with English underneath, `line-height >= 1.5`, zero letter-spacing, never uppercased, and ~10% larger than English beside it) across all 10 games—including adding Telugu script titles for Cricket and Party games that had blank `te` strings in the raw HTML export.
- **2026-11-13 (Phase 0)**: Enforced Non-Negotiable Rule 4 & 7 on contrast and accessibility: used `--ink` (`#141313`) text on `--magenta` (`#EC1276`), `--yellow` (`#F6BE18`), `--green` (`#00C853`), and `--cyan` (`#00E5FF`) surfaces, reserving `--magenta` text exclusively for large bold/marker words on white or concrete backgrounds, and pairing every color indicator with text or an icon.
- **2026-11-13 (Phase 1)**: Built `/` (Landing) from the exported `TFI & Pitch Landing and App Preview – Landing page.html` and built `/play` (Play home) from the written layout spec, adding stub routes for `/play/[game]`, `/join`, `/me`, `/room/new`, `/about`, `/privacy`, `/terms`, and `/offline` so every navigation link works without 404s.
