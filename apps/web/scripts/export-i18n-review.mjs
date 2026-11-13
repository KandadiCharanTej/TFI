import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GAMES_CATALOG, TELUGU_CONJUNCT_SAMPLES, TRANSLATIONS } from "../lib/i18n.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

const rows = [["key", "English", "Telugu"]];

function esc(value) {
  const s = String(value).replace(/"/g, '""');
  return `"${s}"`;
}

function walk(prefix, obj) {
  if (obj && typeof obj === "object" && "en" in obj && "te" in obj && typeof obj.en === "string") {
    rows.push([prefix, obj.en, obj.te]);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => walk(`${prefix}[${idx}]`, item));
    return;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      walk(prefix ? `${prefix}.${k}` : k, v);
    }
  }
}

walk("TRANSLATIONS", TRANSLATIONS);
GAMES_CATALOG.forEach((game) => {
  walk(`GAMES_CATALOG.${game.slug}`, {
    title: game.title,
    description: game.description,
  });
});
TELUGU_CONJUNCT_SAMPLES.forEach((sample, idx) => {
  walk(`TELUGU_CONJUNCT_SAMPLES[${idx}]`, sample);
});

const csv = rows.map((r) => r.map(esc).join(",")).join("\n") + "\n";
const outPath = path.join(repoRoot, "i18n-review.csv");
fs.writeFileSync(outPath, csv, "utf8");
console.log(`Wrote ${rows.length - 1} bilingual strings to ${outPath}`);
