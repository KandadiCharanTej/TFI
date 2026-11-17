import { describe, expect, it } from "vitest";
import { checkRealtimeHealth } from "./index";

describe("realtime room stub", () => {
  it("reports healthy and validates room code", () => {
    expect(checkRealtimeHealth("KXQM")).toEqual({ ok: true, validCode: true });
    expect(checkRealtimeHealth("K7QM")).toEqual({ ok: true, validCode: false });
  });
});
