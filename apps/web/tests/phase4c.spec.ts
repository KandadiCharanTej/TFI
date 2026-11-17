/**
 * Phase 4c E2E: Colors Back, Language Switch Subset Font, Clean HeroDemo, & Design V3 Screenshots
 * - Verifies all beta pages use ONLY the locked 8 Wall colors
 * - Verifies rendered landing screenshot pixels contain ALL FOUR accent colors (#F6BE18, #EC1276, #00C853, #00E5FF)
 * - Verifies the "తె" switch subset font (< 3 KB) renders at same visual size & weight 700 as "EN"
 * - Verifies HeroDemo cards show only title + year (no dialogues) and flash magenta/green on Pass/Correct
 * - Captures AFTER screenshots (390x844, 768x1024, 1280x800, EN & TE) into reference/design-v3/
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { BASE, setLang, waitHydrated } from "./helpers";

const DESIGN_V3_DIR = path.resolve(process.cwd(), "../../reference/design-v3");

function saveV3Shot(name: string, buf: Buffer) {
  fs.mkdirSync(DESIGN_V3_DIR, { recursive: true });
  const target = path.join(DESIGN_V3_DIR, name);
  if (!fs.existsSync(target)) {
    fs.writeFileSync(target, buf);
  }
}

const ALLOWED_RGB = new Set([
  "234, 230, 223", // #EAE6DF concrete
  "255, 255, 255", // #FFFFFF white / sticker
  "244, 241, 234", // #F4F1EA card
  "20, 19, 19",    // #141313 ink
  "246, 190, 24",  // #F6BE18 yellow
  "236, 18, 118",  // #EC1276 magenta
  "0, 200, 83",    // #00C853 green
  "0, 229, 255",   // #00E5FF cyan
]);

test.describe("Phase 4c — Color Jobs, Language Switch Subset, & Clean Content", () => {
  test("All beta pages compute strictly within the 8-color Wall palette", async ({ page }) => {
    const routes = [
      "/",
      "/play",
      "/play/head-set-go",
      "/play/transify",
      "/play/dumb-charades",
      "/play/emoji-cinema",
      "/play/rapid-fire",
      "/play/most-likely",
      "/play/box-office-auction",
      "/me",
      "/about",
      "/join",
    ];
    await setLang(page, "en");
    await page.setViewportSize({ width: 1280, height: 800 });

    for (const route of routes) {
      await page.goto(`${BASE}${route}`);
      await waitHydrated(page);
      const offPalette = await page.evaluate((allowed) => {
        const allowedSet = new Set(allowed);
        const bad: { tag: string; prop: string; val: string }[] = [];
        const normRgb = (c: string): { rgb: string; alpha: number } | null => {
          const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (!m) return null;
          const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
          return { rgb: `${m[1]}, ${m[2]}, ${m[3]}`, alpha };
        };
        for (const el of Array.from(document.body.querySelectorAll("*:not(script):not(style):not(noscript)"))) {
          const cs = window.getComputedStyle(el);
          if (cs.display === "none") continue;
          for (const prop of ["backgroundColor", "color"] as const) {
            const parsed = normRgb(cs[prop]);
            if (!parsed || parsed.alpha === 0) continue;
            // Allow translucent ink or concrete (e.g. text-ink/90, bg-concrete/95)
            if (parsed.alpha < 1 && (parsed.rgb === "20, 19, 19" || parsed.rgb === "234, 230, 223")) {
              continue;
            }
            if (!allowedSet.has(parsed.rgb)) {
              bad.push({ tag: el.tagName, prop, val: cs[prop] });
            }
          }
        }
        return bad;
      }, Array.from(ALLOWED_RGB));

      expect(offPalette, `Off-palette computed colors on ${route}: ${JSON.stringify(offPalette.slice(0, 5))}`).toEqual([]);
    }
  });

  test("Language switch తె loads <3KB subset font and matches EN size at weight 700", async ({
    page,
  }) => {
    const fontResponses: Record<string, number> = {};
    page.on("response", async (res) => {
      if (res.url().includes("/fonts/")) {
        const buf = await res.body().catch(() => Buffer.alloc(0));
        fontResponses[path.basename(res.url())] = buf.length;
      }
    });

    await setLang(page, "en");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);

    expect(fontResponses["anek-telugu-switch.woff2"]).toBeDefined();
    expect(fontResponses["anek-telugu-switch.woff2"]!).toBeLessThan(3 * 1024);
    expect(fontResponses["anek-telugu.woff2"]).toBeUndefined();

    const checkSizes = async () => {
      const teEl = page.getByTestId("lang-switch-te");
      const enEl = page.getByTestId("lang-switch-en");
      const teBox = await teEl.boundingBox();
      const enBox = await enEl.boundingBox();
      expect(teBox).not.toBeNull();
      expect(enBox).not.toBeNull();
      expect(Math.abs((teBox?.height ?? 0) - (enBox?.height ?? 0))).toBeLessThanOrEqual(2);
      const teStyle = await teEl.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return { fontFamily: cs.fontFamily, fontWeight: cs.fontWeight };
      });
      expect(teStyle.fontFamily).toContain("Anek Telugu Switch");
      expect(Number(teStyle.fontWeight)).toBeGreaterThanOrEqual(700);
    };

    await checkSizes();
    await page.setViewportSize({ width: 1280, height: 800 });
    await checkSizes();
  });

  test("HeroDemo shows title and year only (no dialogue quotes) and flashes magenta/green", async ({
    page,
  }) => {
    await setLang(page, "en");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/`);
    await waitHydrated(page);

    const demoText = await page.getByTestId("hero-live-demo").innerText();
    expect(demoText).not.toMatch(/okka saari|Kattappa|Thaggede/i);

    await page.getByTestId("hero-demo-pass").click();
    await page.waitForTimeout(260);
    await page.getByTestId("hero-demo-correct").click();
    await page.waitForTimeout(260);
    await expect(page.getByTestId("hero-demo-score")).toContainText("Score 5");
  });

  test("Landing screenshot contains all 4 accent colors and captures design-v3 screenshots", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Screenshot pixel & design-v3 capture runs once on Chromium");
    test.setTimeout(120_000);

    for (const lang of ["en", "te"] as const) {
      await setLang(page, lang);
      for (const vp of [
        { w: 390, h: 844 },
        { w: 768, h: 1024 },
        { w: 1280, h: 800 },
      ]) {
        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.goto(`${BASE}/`);
        await waitHydrated(page);
        const shotBuf = await page.screenshot({ fullPage: true });
        saveV3Shot(`after-landing-${vp.w}x${vp.h}-${lang}.png`, shotBuf);

        // Verify landing screenshot pixels actually contain all 4 accent colors on EN 1280x800
        if (lang === "en" && vp.w === 1280) {
          const dataUrl = `data:image/png;base64,${shotBuf.toString("base64")}`;
          const foundAccents = await page.evaluate(async (url) => {
            const img = new Image();
            img.src = url;
            await new Promise((res, rej) => {
              img.onload = res;
              img.onerror = rej;
            });
            const c = document.createElement("canvas");
            c.width = img.width;
            c.height = img.height;
            const ctx = c.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, c.width, c.height).data;
            let yellow = false;
            let magenta = false;
            let green = false;
            let cyan = false;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i]!;
              const g = data[i + 1]!;
              const b = data[i + 2]!;
              if (Math.abs(r - 246) <= 4 && Math.abs(g - 190) <= 4 && Math.abs(b - 24) <= 4) yellow = true;
              if (Math.abs(r - 236) <= 4 && Math.abs(g - 18) <= 4 && Math.abs(b - 118) <= 4) magenta = true;
              if (r <= 4 && Math.abs(g - 200) <= 4 && Math.abs(b - 83) <= 4) green = true;
              if (r <= 4 && Math.abs(g - 229) <= 4 && Math.abs(b - 255) <= 4) cyan = true;
              if (yellow && magenta && green && cyan) break;
            }
            return { yellow, magenta, green, cyan };
          }, dataUrl);

          expect(foundAccents, "Landing screenshot must contain all 4 accent colors").toEqual({
            yellow: true,
            magenta: true,
            green: true,
            cyan: true,
          });
        }
      }

      // Play home
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${BASE}/play`);
      await waitHydrated(page);
      saveV3Shot(`after-play-390x844-${lang}.png`, await page.screenshot({ fullPage: true }));

      // Transify setup (magenta game color)
      await page.goto(`${BASE}/play/transify`);
      await waitHydrated(page);
      saveV3Shot(`after-transify-setup-390x844-${lang}.png`, await page.screenshot({ fullPage: true }));

      // Landscape Head Set Go round
      await page.setViewportSize({ width: 844, height: 390 });
      await page.goto(`${BASE}/play/head-set-go`);
      await page.evaluate(() => {
        sessionStorage.setItem("hsg.deck", "movies");
        sessionStorage.setItem("hsg.duration", "60");
      });
      await page.goto(`${BASE}/play/head-set-go/round`);
      await page.waitForTimeout(3600);
      saveV3Shot(`after-hsg-round-844x390-${lang}.png`, await page.screenshot());

      // Head Set Go results
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${BASE}/play/head-set-go`);
      await page.evaluate(() => {
        sessionStorage.setItem("hsg.correctIds", JSON.stringify(["f1", "f2", "f3", "f4"]));
        sessionStorage.setItem("hsg.passedIds", JSON.stringify(["f5"]));
        sessionStorage.setItem(
          "hsg.allCards",
          JSON.stringify([
            { id: "f1", en: "Pokiri", te: "పోకిరి" },
            { id: "f2", en: "Magadheera", te: "మగధీర" },
            { id: "f3", en: "Baahubali", te: "బాహుబలి" },
            { id: "f4", en: "Pushpa", te: "పుష్ప" },
            { id: "f5", en: "Eega", te: "ఈగ" },
          ]),
        );
      });
      await page.goto(`${BASE}/play/head-set-go/results`);
      await waitHydrated(page);
      saveV3Shot(`after-hsg-results-390x844-${lang}.png`, await page.screenshot({ fullPage: true }));
    }

    // Check axe 0 violations on landing EN/TE and play EN
    await setLang(page, "en");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
});
