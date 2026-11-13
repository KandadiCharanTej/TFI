/**
 * Content build script.
 * Usage: pnpm content:build
 *
 * 1. Reads the master lists (films.csv, actors.csv) and checks them.
 * 2. Reads every deck CSV. Decks may point at a film (filmId) or actor (actorId);
 *    those references are resolved here, and a missing one stops the build.
 * 3. Writes one JSON file per deck to packages/content/dist/ and apps/web/public/cards/.
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv, parseCsvLine, parseFilms, parseActors, deckKind, resolveRow } from "../src/index.js";
import type { GameCard } from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SHEETS = resolve(ROOT, "sheets");
const DIST = resolve(ROOT, "dist");
const WEB_PUBLIC = resolve(ROOT, "../../apps/web/public/cards");
const MASTER = new Set(["films", "actors"]);

mkdirSync(DIST, { recursive: true });
mkdirSync(WEB_PUBLIC, { recursive: true });

let totalErrors = 0;
const fail = (msg: string) => {
  console.error("   " + msg);
  totalErrors++;
};

const read = (name: string) => readFileSync(resolve(SHEETS, `${name}.csv`), "utf8");

// ---- master lists
const filmsRes = parseFilms(parseCsv(read("films")));
const actorsRes = parseActors(parseCsv(read("actors")));
for (const [label, res] of [["films", filmsRes], ["actors", actorsRes]] as const) {
  if (res.errors.length) {
    console.error(`\n❌ ${label}: ${res.errors.length} error(s)`);
    res.errors.forEach(fail);
  } else {
    console.log(`✅ ${label}: ${res.items.length} entries OK`);
  }
}
const films = new Map(filmsRes.items.map((f) => [f.id, f]));
const actors = new Map(actorsRes.items.map((a) => [a.id, a]));

// ---- decks
const decks = readdirSync(SHEETS)
  .filter((f) => f.endsWith(".csv"))
  .map((f) => f.replace(/\.csv$/, ""))
  .filter((d) => !MASTER.has(d));

for (const deck of decks) {
  const text = read(deck);
  const header = parseCsvLine(text.split("\n")[0]!.replace(/\r/g, ""));
  const kind = deckKind(header);
  const cards: GameCard[] = [];
  const seen = new Set<string>();
  const errors: string[] = [];
  for (const row of parseCsv(text)) {
    const { card, error } = resolveRow(kind, row, films, actors);
    if (error || !card) {
      errors.push(error ?? "unknown error");
      continue;
    }
    if (seen.has(card.id)) {
      errors.push(`${card.id}: duplicate id`);
      continue;
    }
    seen.add(card.id);
    cards.push(card);
  }
  if (errors.length) {
    console.error(`\n❌ ${deck}: ${errors.length} error(s)`);
    errors.forEach(fail);
  } else {
    console.log(`✅ ${deck}: ${cards.length} cards OK (${kind})`);
  }
  const outPath = resolve(DIST, `${deck}.json`);
  writeFileSync(outPath, JSON.stringify(cards, null, 2));
  copyFileSync(outPath, resolve(WEB_PUBLIC, `${deck}.json`));
}

if (totalErrors > 0) {
  console.error(`\nBuild failed with ${totalErrors} error(s).`);
  process.exit(1);
} else {
  console.log("\nContent build complete.");
}
