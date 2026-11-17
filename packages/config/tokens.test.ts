import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  COLOR_JOBS,
  GAME_COLORS,
  MODE_COLORS,
  SURFACE_SPECS,
  WALL_COLORS,
  WALL_FONTS,
  getGameColor,
} from "./tokens";

describe("The Wall Design System Tokens (V4 Party Mode)", () => {
  it("locks exact hex values for all 8 Wall colors and forbids purple", () => {
    expect(WALL_COLORS).toEqual({
      concrete: "#EAE6DF",
      sticker: "#FFFFFF",
      card: "#F4F1EA",
      ink: "#141313",
      yellow: "#F6BE18",
      magenta: "#EC1276",
      green: "#00C853",
      cyan: "#00E5FF",
    });
    expect(Object.keys(WALL_COLORS)).toHaveLength(8);
  });

  it("maps game colors, color jobs, and V4 surface specs strictly to locked palette", () => {
    expect(COLOR_JOBS).toEqual({
      primaryActionAndHero: "#F6BE18",
      passLiveAndWarning: "#EC1276",
      correctAndOfflineReady: "#00C853",
      onlineAndRooms: "#00E5FF",
    });
    expect(SURFACE_SPECS.cardBorderPx).toBe(3);
    expect(SURFACE_SPECS.btnBorderPx).toBe(3);
    expect(SURFACE_SPECS.btnRadiusPx).toBe(16);
    expect(getGameColor("head-set-go")).toBe("#F6BE18");
    expect(getGameColor("transify")).toBe("#EC1276");
    expect(getGameColor("dumb-charades")).toBe("#00C853");
    expect(getGameColor("emoji-cinema")).toBe("#F6BE18");
    expect(getGameColor("rapid-fire")).toBe("#EC1276");
    expect(getGameColor("most-likely")).toBe("#00C853");
    expect(getGameColor("box-office-auction")).toBe("#00E5FF");

    const allowed = new Set<string>(Object.values(WALL_COLORS));
    for (const color of Object.values(GAME_COLORS)) {
      expect(allowed.has(color)).toBe(true);
    }
    expect(MODE_COLORS.onePhone).toBe("#F6BE18");
    expect(MODE_COLORS.online).toBe("#00E5FF");
  });

  it("defines the V4 3-family typography system without Anton or Permanent Marker", () => {
    expect(WALL_FONTS.display).toContain("Bricolage Grotesque");
    expect(WALL_FONTS.sans).toContain("Bricolage Grotesque");
    expect(WALL_FONTS.mono).toContain("Space Mono");
    expect(WALL_FONTS.telugu).toContain("Anek Telugu");
    const allFonts = Object.values(WALL_FONTS).join(" ");
    expect(allFonts).not.toContain("Anton");
    expect(allFonts).not.toContain("Permanent Marker");
  });

  it("allows Latin display uppercase only, forbids uppercase on buttons/chips/subheadings, and forbids uppercase or tracking on Telugu", () => {
    const cssPath = path.resolve(__dirname, "../../apps/web/app/globals.css");
    const css = fs.readFileSync(cssPath, "utf8");
    const neverUppercaseSelectors = [
      ".h2-title",
      ".h3-title",
      ".wall-btn",
      ".wall-chip",
    ];
    for (const sel of neverUppercaseSelectors) {
      const escaped = sel.replace(".", "\\.");
      const match = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "m").exec(css);
      expect(match, `Selector ${sel} should exist in globals.css`).not.toBeNull();
      expect(match?.[1]).not.toMatch(/text-transform:\s*uppercase/i);
    }
    expect(css).toMatch(/html\[lang="te"\]\s+body\s*\*\s*\{[^}]*text-transform:\s*none\s*!important/is);
    expect(css).toMatch(/html\[lang="te"\]\s+body\s*\*\s*\{[^}]*letter-spacing:\s*normal\s*!important/is);
  });
});
