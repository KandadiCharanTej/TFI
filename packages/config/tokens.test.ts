import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MODE_COLORS, WALL_COLORS, WALL_FONTS } from "./tokens";

describe("The Wall Design System Tokens", () => {
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

  it("maps game modes strictly to One phone=yellow, Online=cyan", () => {
    expect(MODE_COLORS.onePhone).toBe("#F6BE18");
    expect(MODE_COLORS.online).toBe("#00E5FF");
  });

  it("defines the V2 3-family typography system without Anton or Permanent Marker", () => {
    expect(WALL_FONTS.display).toContain("Bricolage Grotesque");
    expect(WALL_FONTS.sans).toContain("Bricolage Grotesque");
    expect(WALL_FONTS.mono).toContain("Space Mono");
    expect(WALL_FONTS.telugu).toContain("Anek Telugu");
    const allFonts = Object.values(WALL_FONTS).join(" ");
    expect(allFonts).not.toContain("Anton");
    expect(allFonts).not.toContain("Permanent Marker");
  });

  it("forbids text-transform: uppercase on heading, button, and chip classes in globals.css", () => {
    const cssPath = path.resolve(__dirname, "../../apps/web/app/globals.css");
    const css = fs.readFileSync(cssPath, "utf8");
    const checkedSelectors = [
      ".display-title",
      ".h1-title",
      ".h2-title",
      ".h3-title",
      ".anton-title",
      ".wall-btn",
      ".wall-chip",
    ];
    for (const sel of checkedSelectors) {
      const escaped = sel.replace(".", "\\.");
      const match = new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, "m").exec(css);
      expect(match, `Selector ${sel} should exist in globals.css`).not.toBeNull();
      expect(match?.[1]).not.toMatch(/text-transform:\s*uppercase/i);
    }
  });
});
