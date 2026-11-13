import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { deckKind, parseActors, parseCsv, parseCsvLine, parseFilms, resolveRow, toCsv } from "./index";

const SHEETS = resolve(dirname(fileURLToPath(import.meta.url)), "../sheets");
const sheet = (n: string) => readFileSync(resolve(SHEETS, `${n}.csv`), "utf8");

const film = (over: Record<string, string> = {}) => ({
  id: "pokiri", titleEn: "Pokiri", titleTe: "పోకిరి", year: "2006", director: "Puri Jagannadh", notes: "", verified: "false", ...over,
});

describe("films master list rules", () => {
  it("accepts a good film", () => {
    expect(parseFilms([film()]).errors).toEqual([]);
  });
  it("needs both languages", () => {
    expect(parseFilms([film({ titleTe: "" })]).errors).toHaveLength(1);
    expect(parseFilms([film({ titleEn: "" })]).errors).toHaveLength(1);
  });
  it("allows an empty year but rejects a year before 1930 or in the future", () => {
    expect(parseFilms([film({ year: "" })]).errors).toEqual([]);
    expect(parseFilms([film({ year: "1929" })]).errors).toHaveLength(1);
    expect(parseFilms([film({ year: String(new Date().getFullYear() + 1) })]).errors).toHaveLength(1);
    expect(parseFilms([film({ year: String(new Date().getFullYear()) })]).errors).toEqual([]);
  });
  it("rejects duplicate ids and duplicate titles", () => {
    expect(parseFilms([film(), film({ titleEn: "Another" })]).errors.join()).toContain("duplicate id");
    expect(parseFilms([film(), film({ id: "pokiri-2", titleEn: "POKIRI!" })]).errors.join()).toContain("duplicate film");
  });
  it("rejects a bad id", () => {
    expect(parseFilms([film({ id: "Not A Slug" })]).errors).toHaveLength(1);
  });
});

describe("actors master list rules", () => {
  const a = { id: "nani", nameEn: "Nani", nameTe: "నాని", verified: "false" };
  it("accepts a good actor and needs both languages", () => {
    expect(parseActors([a]).errors).toEqual([]);
    expect(parseActors([{ ...a, nameTe: "" }]).errors).toHaveLength(1);
  });
  it("rejects duplicates", () => {
    expect(parseActors([a, { ...a, id: "nani-2" }]).errors.join()).toContain("duplicate actor");
  });
});

describe("deck reference checks", () => {
  const films = new Map(parseFilms([film()]).items.map((f) => [f.id, f]));
  const actors = new Map(parseActors([{ id: "nani", nameEn: "Nani", nameTe: "నాని", verified: "false" }]).items.map((x) => [x.id, x]));
  const base = { id: "t-1", game: "transify", deck: "transify-movies", difficulty: "1", tags: "a|b", verified: "false" };

  it("detects deck kinds from columns", () => {
    expect(deckKind(["filmId", "clueEn"])).toBe("transify");
    expect(deckKind(["filmId", "emoji"])).toBe("emoji");
    expect(deckKind(["filmId"])).toBe("film");
    expect(deckKind(["actorId"])).toBe("actor");
    expect(deckKind(["en", "te"])).toBe("plain");
  });
  it("resolves a Transify row from the film list", () => {
    const { card, error } = resolveRow("transify", { ...base, filmId: "pokiri", clueEn: "Rogue", clueTe: "రోగ్" }, films, actors);
    expect(error).toBeUndefined();
    expect(card).toMatchObject({ en: "Rogue", answerEn: "Pokiri", answerTe: "పోకిరి", year: 2006, hint: "2006 · Puri Jagannadh", tags: ["a", "b"] });
  });
  it("fails on a missing film or actor", () => {
    expect(resolveRow("film", { ...base, filmId: "nope" }, films, actors).error).toContain('unknown filmId "nope"');
    expect(resolveRow("actor", { ...base, actorId: "nope" }, films, actors).error).toContain('unknown actorId "nope"');
  });
  it("leaves year and hint out when the film has none", () => {
    const bare = new Map(parseFilms([film({ year: "", director: "" })]).items.map((f) => [f.id, f]));
    const { card } = resolveRow("film", { ...base, filmId: "pokiri" }, bare, actors);
    expect(card?.year).toBeUndefined();
    expect(card?.hint).toBeUndefined();
  });
  it("a card is verified only when the deck row AND the film are", () => {
    const ok = new Map(parseFilms([film({ verified: "true" })]).items.map((f) => [f.id, f]));
    expect(resolveRow("film", { ...base, filmId: "pokiri", verified: "true" }, ok, actors).card?.verified).toBe(true);
    expect(resolveRow("film", { ...base, filmId: "pokiri", verified: "true" }, films, actors).card?.verified).toBe(false);
  });
});

describe("the real sheets", () => {
  const filmsRes = parseFilms(parseCsv(sheet("films")));
  const actorsRes = parseActors(parseCsv(sheet("actors")));
  const films = new Map(filmsRes.items.map((f) => [f.id, f]));
  const actors = new Map(actorsRes.items.map((a) => [a.id, a]));

  it("has 80 films and 40 actors with no errors", () => {
    expect(filmsRes.errors).toEqual([]);
    expect(actorsRes.errors).toEqual([]);
    expect(filmsRes.items).toHaveLength(80);
    expect(actorsRes.items).toHaveLength(40);
  });
  it("starts every film and actor as unverified", () => {
    expect([...films.values()].every((f) => !f.verified)).toBe(true);
    expect([...actors.values()].every((a) => !a.verified)).toBe(true);
  });
  it("every deck row points at a film or actor that exists", () => {
    const decks = readdirSync(SHEETS).filter((f) => f.endsWith(".csv")).map((f) => f.replace(".csv", "")).filter((d) => d !== "films" && d !== "actors");
    const problems: string[] = [];
    for (const deck of decks) {
      const text = sheet(deck);
      const kind = deckKind(parseCsvLine(text.split("\n")[0]!.replace(/\r/g, "")));
      for (const row of parseCsv(text)) {
        const { error } = resolveRow(kind, row, films, actors);
        if (error) problems.push(`${deck}: ${error}`);
      }
    }
    expect(problems).toEqual([]);
  });
  it("never contains the forbidden league letters", () => {
    const forbidden = new RegExp(`\\b${["I", "P", "L"].join("")}\\b`, "i");
    for (const f of readdirSync(SHEETS).filter((n) => n.endsWith(".csv"))) {
      expect(forbidden.test(sheet(f.replace(".csv", "")))).toBe(false);
    }
  });
  it("Dumb Charades deck has all three difficulties, each with plenty of films", () => {
    const rows = parseCsv(sheet("dumb-charades-movies"));
    for (const d of ["1", "2", "3"]) expect(rows.filter((r) => r.difficulty === d).length).toBeGreaterThanOrEqual(15);
  });
  it("Rapid Fire is the movie edition: 30 cards, no cricket", () => {
    const rows = parseCsv(sheet("rapid-fire-party"));
    expect(rows).toHaveLength(30);
    expect(sheet("rapid-fire-party").toLowerCase()).not.toContain("cricket");
  });
});

describe("csv helpers", () => {
  it("handles quotes and commas", () => {
    expect(parseCsvLine('a,"b, c",d')).toEqual(["a", "b, c", "d"]);
    expect(toCsv(["x"], [['he said "hi", ok']])).toBe('x\n"he said ""hi"", ok"\n');
  });
});
