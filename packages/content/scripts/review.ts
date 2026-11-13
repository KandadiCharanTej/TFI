/**
 * Review sheet generator.
 * Usage: pnpm content:review
 *
 * Writes packages/content/review/review.csv for the team to fill in and prints
 * how many items are verified and unverified.
 * Columns: id, English, Telugu, year, director, reviewer OK?, correction
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv, parseFilms, parseActors, toCsv } from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHEETS = resolve(__dirname, "../sheets");
const OUT_DIR = resolve(__dirname, "../review");
const read = (n: string) => parseCsv(readFileSync(resolve(SHEETS, `${n}.csv`), "utf8"));

const films = parseFilms(read("films")).items;
const actors = parseActors(read("actors")).items;

type Out = (string | number)[];
const rows: Out[] = [];
const counts: Record<string, { verified: number; unverified: number }> = {};
const count = (group: string, verified: boolean) => {
  const c = (counts[group] ??= { verified: 0, unverified: 0 });
  if (verified) c.verified++;
  else c.unverified++;
};

for (const f of films) {
  rows.push([`film:${f.id}`, f.titleEn, f.titleTe, f.year ?? "", f.director, "", ""]);
  count("films", f.verified);
}
for (const a of actors) {
  rows.push([`actor:${a.id}`, a.nameEn, a.nameTe, "", "", "", ""]);
  count("actors", a.verified);
}
// Text that lives in decks (clues, questions, prompts): English and Telugu both need a check.
for (const deck of ["transify-movies", "rapid-fire-party", "most-likely-party"]) {
  let table;
  try {
    table = read(deck);
  } catch {
    continue;
  }
  for (const r of table) {
    const en = r.clueEn ?? r.en ?? "";
    const te = r.clueTe ?? r.te ?? "";
    rows.push([`${deck}:${r.id}`, en, te, "", "", "", ""]);
    count(deck, r.verified === "true");
  }
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  resolve(OUT_DIR, "review.csv"),
  toCsv(["id", "English", "Telugu", "year", "director", "reviewer OK?", "correction"], rows),
);

console.log("Review sheet written to packages/content/review/review.csv\n");
let v = 0;
let u = 0;
for (const [group, c] of Object.entries(counts)) {
  console.log(`${group.padEnd(22)} verified ${String(c.verified).padStart(3)}   unverified ${String(c.unverified).padStart(3)}`);
  v += c.verified;
  u += c.unverified;
}
console.log(`${"TOTAL".padEnd(22)} verified ${String(v).padStart(3)}   unverified ${String(u).padStart(3)}`);
