/**
 * Content build script.
 * Usage: pnpm content:build
 * Reads CSVs from packages/content/sheets/, validates with Zod,
 * writes JSON to packages/content/dist/ and apps/web/public/cards/.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CardSchema } from "../src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SHEETS = resolve(ROOT, "sheets");
const DIST = resolve(ROOT, "dist");
// Also copy to web public so the round page can fetch cards at runtime
const WEB_PUBLIC = resolve(ROOT, "../../apps/web/public/cards");

mkdirSync(DIST, { recursive: true });
mkdirSync(WEB_PUBLIC, { recursive: true });

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

const csvFiles = readdirSync(SHEETS).filter((f) => f.endsWith(".csv"));
const DECKS = csvFiles.map((f) => f.replace(/\.csv$/, ""));

let totalErrors = 0;

for (const deck of DECKS) {
  const csvPath = resolve(SHEETS, `${deck}.csv`);
  const raw = readFileSync(csvPath, "utf8");
  const lines = raw.trim().split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) continue;

  const headers = parseCsvLine(lines[0]!);

  const cards: unknown[] = [];
  const seenIds = new Set<string>();
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]!);
    const row: Record<string, unknown> = {};
    headers.forEach((h, idx) => {
      const v = values[idx]?.trim() ?? "";
      // Coerce typed fields
      if (h === "difficulty") row[h] = v ? Number(v) : 1;
      else if (h === "verified") row[h] = v === "true";
      else if (h === "tags") row[h] = v ? v.split("|") : [];
      else row[h] = v;
    });

    if (row.difficulty === undefined || Number.isNaN(row.difficulty)) {
      row.difficulty = 1;
    }
    if (row.verified === undefined) {
      row.verified = false;
    }

    // tags may be a single value (no pipe) — wrap in array
    if (typeof row.tags === "string") row.tags = row.tags ? [row.tags] : [];

    const result = CardSchema.safeParse(row);
    if (!result.success) {
      errors.push(`Row ${i} (${row.id ?? "no-id"}): ${result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
      totalErrors++;
      continue;
    }

    if (seenIds.has(result.data.id)) {
      errors.push(`Row ${i}: duplicate id "${result.data.id}"`);
      totalErrors++;
      continue;
    }
    seenIds.add(result.data.id);
    cards.push(result.data);
  }

  if (errors.length) {
    console.error(`\n❌ ${deck}: ${errors.length} error(s)`);
    for (const e of errors) console.error("   " + e);
  } else {
    console.log(`✅ ${deck}: ${cards.length} cards OK`);
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
