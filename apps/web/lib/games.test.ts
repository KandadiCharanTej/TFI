import { describe, expect, it } from "vitest";
import { filterByMode, getVisibleCatalog, readShowMvpFlag } from "./games";

describe("beta catalog filtering", () => {
  it("shows exactly the 7 beta games by default", () => {
    const slugs = getVisibleCatalog(false).map((g) => g.slug);
    expect(slugs).toHaveLength(7);
    expect(slugs.join(" ")).not.toMatch(/cricket|dream/);
  });
  it("shows all 10 when the MVP flag is on", () => {
    expect(getVisibleCatalog(true)).toHaveLength(10);
  });
  it("reads the flag strictly", () => {
    expect(readShowMvpFlag("true")).toBe(true);
    expect(readShowMvpFlag("1")).toBe(false);
    expect(readShowMvpFlag(undefined)).toBe(false);
  });
  it("filters by mode", () => {
    const beta = getVisibleCatalog(false);
    expect(filterByMode(beta, "All")).toHaveLength(7);
    expect(filterByMode(beta, "onePhone").some((g) => g.slug === "box-office-auction")).toBe(false);
    expect(filterByMode(beta, "online").some((g) => g.slug === "box-office-auction")).toBe(true);
    expect(filterByMode(beta, "online").some((g) => g.slug === "transify")).toBe(false);
  });
});
