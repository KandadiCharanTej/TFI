import { describe, expect, it } from "vitest";
import { CardSchema } from "./index";

describe("CardSchema", () => {
  it("validates bilingual cards and requires both te and en scripts", () => {
    const valid = CardSchema.safeParse({
      id: "hsg-001",
      deck: "classics",
      game: "head-set-go",
      te: "పోకిరి",
      en: "Pokiri",
      year: 2006,
      difficulty: 1,
      tags: ["Puri Jagannadh"],
      verified: false,
    });
    expect(valid.success).toBe(true);

    const missingTelugu = CardSchema.safeParse({
      id: "hsg-002",
      deck: "classics",
      game: "head-set-go",
      te: "",
      en: "Pokiri",
      difficulty: 1,
      tags: [],
      verified: false,
    });
    expect(missingTelugu.success).toBe(false);
  });
});
