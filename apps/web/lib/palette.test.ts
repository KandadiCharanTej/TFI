import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { WALL_COLORS } from "@tfi/config/tokens";

const ALLOWED_HEX = new Set<string>(
  Object.values(WALL_COLORS).map((c) => c.toUpperCase()),
);

function walkTsxFiles(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "dev" || entry.name === "tests" || entry.name === "node_modules") continue;
      walkTsxFiles(full, out);
    } else if (entry.isFile() && /\.(ts|tsx|css)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) {
      out.push(full);
    }
  }
  return out;
}

describe("Phase 4c — Strict Palette & Clean Demo Content Gate", () => {
  it("fails if any production web page, component, or stylesheet uses a hex color outside WALL_COLORS", () => {
    const appDir = path.resolve(__dirname, "../app");
    const compDir = path.resolve(__dirname, "../components");
    const files = [...walkTsxFiles(appDir), ...walkTsxFiles(compDir)];

    const violations: string[] = [];
    const hexRe = /#[0-9a-fA-F]{3,8}\b/g;

    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      const matches = text.match(hexRe) ?? [];
      for (const raw of matches) {
        const normalized = raw.toUpperCase();
        // Expand 3-digit #FFF / #000 if ever used
        if (!ALLOWED_HEX.has(normalized)) {
          violations.push(`${path.relative(appDir, file)}: ${raw}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("removes film dialogues and catchphrases from the landing HeroDemo", () => {
    const heroDemoSrc = fs.readFileSync(
      path.resolve(__dirname, "../components/hero-demo.tsx"),
      "utf8",
    );
    expect(heroDemoSrc).not.toMatch(/okka saari/i);
    expect(heroDemoSrc).not.toMatch(/Kattappa/i);
    expect(heroDemoSrc).not.toMatch(/Thaggede/i);
    expect(heroDemoSrc).not.toContain("clueEn");
    expect(heroDemoSrc).not.toContain("clueTe");
  });
});
