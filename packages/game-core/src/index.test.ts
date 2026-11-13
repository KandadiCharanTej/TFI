import { describe, expect, it } from "vitest";
import { isValidRoomCode, ROUND_PHASES } from "./index";

describe("game-core foundation", () => {
  it("defines the 5 standard state-machine phases", () => {
    expect(ROUND_PHASES).toEqual(["setup", "ready", "playing", "roundEnd", "results"]);
  });

  it("rejects room codes containing confusing characters I, O, 0, 1", () => {
    expect(isValidRoomCode("K7QM")).toBe(true);
    expect(isValidRoomCode("K0QM")).toBe(false);
    expect(isValidRoomCode("I7QM")).toBe(false);
    expect(isValidRoomCode("O7QM")).toBe(false);
    expect(isValidRoomCode("17QM")).toBe(false);
  });
});
