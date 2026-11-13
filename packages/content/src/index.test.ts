import { describe, it, expect } from "vitest";
import { CardSchema } from "./index.js";

describe("CardSchema", () => {
  const validCard = {
    id: "hsg-mov-001",
    game: "head-set-go",
    deck: "movies",
    en: "Pokiri",
    te: "పోకిరి",
    difficulty: 1,
    tags: ["action"],
    verified: false,
  };

  it("accepts a valid card", () => {
    expect(CardSchema.safeParse(validCard).success).toBe(true);
  });

  it("rejects card with empty en", () => {
    expect(CardSchema.safeParse({ ...validCard, en: "" }).success).toBe(false);
  });

  it("rejects card with empty te", () => {
    expect(CardSchema.safeParse({ ...validCard, te: "" }).success).toBe(false);
  });

  it("rejects difficulty outside 1-3", () => {
    expect(CardSchema.safeParse({ ...validCard, difficulty: 4 }).success).toBe(false);
  });

  it("accepts optional fields", () => {
    const card = { ...validCard, answerEn: "Pokiri", year: 2006, hint: "Puri Jagannadh film" };
    expect(CardSchema.safeParse(card).success).toBe(true);
  });

  it("rejects year outside sane range", () => {
    expect(CardSchema.safeParse({ ...validCard, year: 1800 }).success).toBe(false);
  });
});
