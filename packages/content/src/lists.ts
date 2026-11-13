import { z } from "zod";
import { CardSchema, type GameCard } from "./card.js";
import type { Row } from "./csv.js";

export const MIN_FILM_YEAR = 1930;
export const currentYear = () => new Date().getFullYear();

const yearField = z
  .union([z.literal(""), z.coerce.number().int().min(MIN_FILM_YEAR).max(currentYear())])
  .transform((v) => (v === "" ? undefined : v));

/** One film, written once, used by every game. Both languages are required. */
export const FilmSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "id must be a lowercase slug"),
  titleEn: z.string().min(1, "English title is required"),
  titleTe: z.string().min(1, "Telugu title is required"),
  year: yearField,
  director: z.string(),
  notes: z.string(),
  verified: z.enum(["true", "false"]).transform((v) => v === "true"),
});
export type Film = z.infer<typeof FilmSchema>;

export const ActorSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "id must be a lowercase slug"),
  nameEn: z.string().min(1, "English name is required"),
  nameTe: z.string().min(1, "Telugu name is required"),
  verified: z.enum(["true", "false"]).transform((v) => v === "true"),
});
export type Actor = z.infer<typeof ActorSchema>;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export interface ListsResult<T> {
  readonly items: T[];
  readonly errors: string[];
}

export function parseFilms(rows: readonly Row[]): ListsResult<Film> {
  const items: Film[] = [];
  const errors: string[] = [];
  const ids = new Set<string>();
  const titles = new Set<string>();
  rows.forEach((row, i) => {
    const r = FilmSchema.safeParse(row);
    if (!r.success) {
      errors.push(`films row ${i + 1} (${row.id ?? "no-id"}): ${r.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
      return;
    }
    const key = norm(r.data.titleEn);
    if (ids.has(r.data.id)) errors.push(`films row ${i + 1}: duplicate id "${r.data.id}"`);
    else if (titles.has(key)) errors.push(`films row ${i + 1}: duplicate film "${r.data.titleEn}"`);
    else {
      ids.add(r.data.id);
      titles.add(key);
      items.push(r.data);
    }
  });
  return { items, errors };
}

export function parseActors(rows: readonly Row[]): ListsResult<Actor> {
  const items: Actor[] = [];
  const errors: string[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  rows.forEach((row, i) => {
    const r = ActorSchema.safeParse(row);
    if (!r.success) {
      errors.push(`actors row ${i + 1} (${row.id ?? "no-id"}): ${r.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
      return;
    }
    const key = norm(r.data.nameEn);
    if (ids.has(r.data.id)) errors.push(`actors row ${i + 1}: duplicate id "${r.data.id}"`);
    else if (names.has(key)) errors.push(`actors row ${i + 1}: duplicate actor "${r.data.nameEn}"`);
    else {
      ids.add(r.data.id);
      names.add(key);
      items.push(r.data);
    }
  });
  return { items, errors };
}

export type DeckKind = "transify" | "emoji" | "film" | "actor" | "plain";

/** What kind of deck is this, judging by its columns. */
export function deckKind(headers: readonly string[]): DeckKind {
  if (headers.includes("filmId") && headers.includes("clueEn")) return "transify";
  if (headers.includes("filmId") && headers.includes("emoji")) return "emoji";
  if (headers.includes("filmId")) return "film";
  if (headers.includes("actorId")) return "actor";
  return "plain";
}

const toDifficulty = (v: string): number => (v ? Number(v) : 1);
const toTags = (v: string): string[] => (v ? v.split("|") : []);

function filmHint(f: Film): string | undefined {
  const parts = [f.year ? String(f.year) : "", f.director].filter(Boolean);
  return parts.length ? parts.join(" · ") : undefined;
}

/**
 * Turn one deck row into the card the app reads. References are checked here:
 * a missing film or actor is reported, never silently skipped.
 */
export function resolveRow(
  kind: DeckKind,
  row: Row,
  films: ReadonlyMap<string, Film>,
  actors: ReadonlyMap<string, Actor>,
): { card?: GameCard; error?: string } {
  const base = {
    id: row.id ?? "",
    deck: row.deck ?? "",
    game: row.game ?? "",
    difficulty: toDifficulty(row.difficulty ?? ""),
    tags: toTags(row.tags ?? ""),
  };
  let draft: Record<string, unknown>;
  if (kind === "actor") {
    const a = actors.get(row.actorId ?? "");
    if (!a) return { error: `${row.id}: unknown actorId "${row.actorId}"` };
    draft = { ...base, en: a.nameEn, te: a.nameTe, actorId: a.id, verified: row.verified === "true" && a.verified };
  } else if (kind === "plain") {
    draft = { ...row, ...base, verified: row.verified === "true" };
  } else {
    const f = films.get(row.filmId ?? "");
    if (!f) return { error: `${row.id}: unknown filmId "${row.filmId}"` };
    const common = {
      ...base,
      filmId: f.id,
      year: f.year,
      hint: filmHint(f),
      verified: row.verified === "true" && f.verified,
    };
    if (kind === "film") draft = { ...common, en: f.titleEn, te: f.titleTe };
    else if (kind === "transify")
      draft = { ...common, en: row.clueEn, te: row.clueTe, answerEn: f.titleEn, answerTe: f.titleTe };
    else draft = { ...common, en: row.emoji, te: row.emoji, answerEn: f.titleEn, answerTe: f.titleTe };
  }
  if (draft.hint === undefined) delete draft.hint;
  if (draft.year === undefined) delete draft.year;
  const parsed = CardSchema.safeParse(draft);
  if (!parsed.success) {
    return { error: `${row.id ?? "no-id"}: ${parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}` };
  }
  return { card: parsed.data };
}
