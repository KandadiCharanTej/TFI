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

  it("defines the 5 locked font families", () => {
    expect(WALL_FONTS.anton).toContain("Anton");
    expect(WALL_FONTS.marker).toContain("Permanent Marker");
    expect(WALL_FONTS.sans).toContain("Plus Jakarta Sans");
    expect(WALL_FONTS.mono).toContain("Space Mono");
    expect(WALL_FONTS.telugu).toContain("Anek Telugu");
  });
});
