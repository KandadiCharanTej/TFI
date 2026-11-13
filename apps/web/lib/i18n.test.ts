import { describe, expect, it } from "vitest";
import {
  FAN_VIBES,
  GAMES_CATALOG,
  TELUGU_CONJUNCT_SAMPLES,
  TRANSLATIONS,
} from "./i18n";

describe("Translation & Content Rules (Non-Negotiable Rules 1, 2, 3, 8)", () => {
  it("keeps the working brand name in English letters only in brand.name", () => {
    expect(TRANSLATIONS.brand.name).toBe("TFI & Pitch");
    expect(TRANSLATIONS.brand.tagline.te).toBe("మన సినిమా, మన క్రికెట్, మన గ్యాంగ్");
  });

  it("includes the exact unofficial legal disclaimer", () => {
    expect(TRANSLATIONS.brand.unofficialDisclaimer.en).toContain(
      "Unofficial fan-made game. Not affiliated with any film, actor, studio, cricket league or team.",
    );
  });

  it("defines all 10 games with both Telugu and English titles and descriptions", () => {
    expect(GAMES_CATALOG).toHaveLength(10);
    for (const game of GAMES_CATALOG) {
      expect(game.title.te.trim().length).toBeGreaterThan(0);
      expect(game.title.en.trim().length).toBeGreaterThan(0);
      expect(game.description.te.trim().length).toBeGreaterThan(0);
      expect(game.description.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("never contains the forbidden 3-letter league acronym anywhere in translations or catalog", () => {
    const serialized = JSON.stringify({
      TRANSLATIONS,
      GAMES_CATALOG,
      FAN_VIBES,
      TELUGU_CONJUNCT_SAMPLES,
    });
    const forbidden = ["I", "P", "L"].join("");
    expect(serialized.toUpperCase()).not.toContain(forbidden);
  });

  it("never contains real-money betting phrases", () => {
    const serialized = JSON.stringify(TRANSLATIONS).toLowerCase();
    expect(serialized).not.toContain("win cash");
    expect(serialized).not.toContain("real cash");
    expect(serialized).not.toContain("stake");
  });
});
