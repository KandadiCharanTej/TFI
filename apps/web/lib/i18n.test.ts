import { describe, expect, it } from "vitest";
import { FAN_VIBES, GAMES_CATALOG, TELUGU_CONJUNCT_SAMPLES, TRANSLATIONS } from "./i18n";
import { TELUGU_CHAR_PATTERN, fmt, parseLang, readLangFromCookieString } from "./lang";

interface Leaf {
  readonly path: string;
  readonly value: Record<string, unknown>;
}

function isBi(value: unknown): value is { en: string; te: string } {
  if (typeof value !== "object" || value === null) return false;
  const keys = Object.keys(value);
  return keys.includes("en") || keys.includes("te");
}

/** Walk the translation tree and collect every { en, te } leaf. */
function collectLeaves(node: unknown, path: string, out: Leaf[]): void {
  if (Array.isArray(node)) {
    node.forEach((item, i) => collectLeaves(item, `${path}[${i}]`, out));
    return;
  }
  if (typeof node !== "object" || node === null) return;
  if (isBi(node)) {
    out.push({ path, value: node as Record<string, unknown> });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    // `num` is a plain label like "01", not a translatable string.
    if (typeof child === "string") continue;
    collectLeaves(child, path ? `${path}.${key}` : key, out);
  }
}

const leaves: Leaf[] = [];
collectLeaves(TRANSLATIONS, "", leaves);
for (const game of GAMES_CATALOG) {
  collectLeaves(game.title, `games.${game.slug}.title`, leaves);
  collectLeaves(game.description, `games.${game.slug}.description`, leaves);
}
TELUGU_CONJUNCT_SAMPLES.forEach((s, i) => collectLeaves(s, `conjunct[${i}]`, leaves));

/** Language names are the one allowed exception for Telugu script in English mode. */
const ENGLISH_MAY_CONTAIN_TELUGU = new Set([
  "lang.switchVisibleTe",
  "lang.nameTelugu",
]);

/** Keys where Telugu mode keeps Latin letters on purpose. */
const TELUGU_MAY_BE_LATIN = new Set([
  "brand.name",
  "lang.switchVisibleEn",
  "lang.nameEnglish",
]);

describe("translation file", () => {
  it("has a meaningful number of strings", () => {
    expect(leaves.length).toBeGreaterThan(150);
  });

  it("gives every key BOTH an en and a te value", () => {
    const problems = leaves
      .filter(
        (l) =>
          typeof l.value.en !== "string" ||
          typeof l.value.te !== "string" ||
          (l.value.en as string).trim() === "" ||
          (l.value.te as string).trim() === "",
      )
      .map((l) => l.path);
    expect(problems).toEqual([]);
  });

  it("never puts Telugu script in an English value (language names excepted)", () => {
    const offenders = leaves
      .filter((l) => !ENGLISH_MAY_CONTAIN_TELUGU.has(l.path))
      .filter((l) => TELUGU_CHAR_PATTERN.test(String(l.value.en)) && !l.path.startsWith("conjunct"))
      .map((l) => l.path);
    expect(offenders).toEqual([]);
  });

  it("puts Telugu script in every Telugu value (brand and language codes excepted)", () => {
    const offenders = leaves
      .filter((l) => !TELUGU_MAY_BE_LATIN.has(l.path))
      .filter((l) => !TELUGU_CHAR_PATTERN.test(String(l.value.te)))
      .map((l) => l.path);
    expect(offenders).toEqual([]);
  });

  it("keeps the working brand name in one key, in English letters", () => {
    expect(TRANSLATIONS.brand.name.en).toBe("TFI & Pitch");
    expect(TRANSLATIONS.brand.tagline.en).toBe("Our movies. Our cricket. Our gang.");
    expect(TRANSLATIONS.brand.tagline.te).toBe("మన సినిమా, మన క్రికెట్, మన గ్యాంగ్");
  });

  it("includes the exact unofficial disclaimer", () => {
    expect(TRANSLATIONS.brand.unofficialDisclaimer.en).toBe(
      "Unofficial fan-made game. Not affiliated with any film, actor, studio, cricket league or team.",
    );
  });

  it("defines all 10 games", () => {
    expect(GAMES_CATALOG).toHaveLength(10);
    expect(FAN_VIBES.length).toBeGreaterThan(0);
  });

  it("never contains the forbidden league acronym or betting words", () => {
    const text = JSON.stringify(TRANSLATIONS) + JSON.stringify(GAMES_CATALOG);
    const forbidden = ["I", "P", "L"].join("");
    expect(text.toUpperCase()).not.toContain(forbidden);
    const lower = text.toLowerCase();
    for (const word of ["win cash", "real cash", "stake", "wallet balance"]) {
      expect(lower).not.toContain(word);
    }
  });
});

describe("language helpers", () => {
  it("defaults to English", () => {
    expect(parseLang(undefined)).toBe("en");
    expect(parseLang("fr")).toBe("en");
    expect(parseLang("te")).toBe("te");
  });

  it("reads the lang cookie from a cookie string", () => {
    expect(readLangFromCookieString("a=1; lang=te; b=2")).toBe("te");
    expect(readLangFromCookieString("a=1")).toBe("en");
  });

  it("fills placeholders", () => {
    expect(fmt("{n} cards", { n: 30 })).toBe("30 cards");
    expect(fmt("{missing}", {})).toBe("{missing}");
  });
});
