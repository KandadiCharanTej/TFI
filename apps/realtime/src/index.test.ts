import { describe, expect, it } from "vitest";
import { checkRealtimeHealth } from "./index";

describe("realtime room stub", () => {
  it("reports healthy and validates room code", () => {
    expect(checkRealtimeHealth("K7QM")).toEqual({ ok: true, validCode: true });
  });
});
