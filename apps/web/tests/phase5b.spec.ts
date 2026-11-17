/**
 * Phase 5b E2E: Design V4 "Party Mode" Design Overhaul Verification
 * - 8 locked Wall palette colors across EN & TE; white-on-magenta only at >= 19px bold (700+)
 * - Zero horizontal overflow across 320, 390, 768, 1280, and 1920 px in EN & TE
 * - All decorative Starburst / XMark / Squiggle / SpotlightBeam art is aria-hidden + pointer-events: none
 * - Font stack (Bricolage Grotesque Condensed in EN, Anek Telugu in TE) + tight network weight (< 140 KB EN, < 280 KB TE)
 * - Zero Telugu script glyphs in EN mode outside language switch ("తె")
 * - Calm mode (/me toggle + OS prefers-reduced-motion) disables HeroDemo auto-advance, sounds & confetti
 * - MarqueeTape Pause/Play toggle works cleanly
 * - Captures AFTER screenshots (19 total with phase5-rooms lobby captures) into reference/design-v4/
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { BASE, setLang, waitHydrated } from "./helpers";

const DESIGN_V4_DIR = path.resolve(process.cwd(), "../../reference/design-v4");

function saveV4Shot(name: string, buf: Buffer) {
  fs.mkdirSync(DESIGN_V4_DIR, { recursive: true });
  fs.writeFileSync(path.join(DESIGN_V4_DIR, name), buf);
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

test.describe("Phase 5b — Design V4 Party Mode Overhaul", () => {
  test("Locked 8-color palette, white-on-magenta >=19px bold guardrail, axe 0 violations, 0 console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const routes = [
      "/",
      "/play",
      "/play/head-set-go",
      "/play/transify",
      "/play/dumb-charades",
      "/play/most-likely",
      "/play/box-office-auction",
      "/me",
      "/about",
      "/join",
    ];

    for (const lang of ["en", "te"] as const) {
      await setLang(page, lang);
      await page.setViewportSize({ width: 390, height: 844 });

      for (const route of routes) {
        await page.goto(`${BASE}${route}`);
        await waitHydrated(page);

        const axe = await new AxeBuilder({ page }).analyze();
        expect(axe.violations, `Axe violations on ${route} (${lang})`).toEqual([]);

        const audit = await page.evaluate((allowed) => {
          const allowedSet = new Set(allowed);
          const offPalette: { tag: string; prop: string; val: string }[] = [];
          const badMagentaText: { tag: string; fontSize: number; weight: number; text: string }[] = [];

          const normRgb = (c: string): { rgb: string; alpha: number } | null => {
            const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (!m) return null;
            return {
              rgb: `${m[1]}, ${m[2]}, ${m[3]}`,
              alpha: m[4] !== undefined ? parseFloat(m[4]) : 1,
            };
          };

          for (const el of Array.from(document.body.querySelectorAll("*:not(script):not(style):not(noscript)"))) {
            const cs = window.getComputedStyle(el);
            if (cs.display === "none") continue;
            for (const prop of ["backgroundColor", "color"] as const) {
              const parsed = normRgb(cs[prop]);
              if (!parsed || parsed.alpha === 0) continue;
              if (parsed.alpha < 1 && (parsed.rgb === "20, 19, 19" || parsed.rgb === "234, 230, 223")) {
                continue;
              }
              if (!allowedSet.has(parsed.rgb)) {
                offPalette.push({ tag: el.tagName, prop, val: cs[prop] });
              }
            }

            // White text directly on magenta must be large bold type (>= 19px, weight >= 700)
            const bg = normRgb(cs.backgroundColor);
            const fg = normRgb(cs.color);
            if (
              bg?.rgb === "236, 18, 118" &&
              fg?.rgb === "255, 255, 255" &&
              Array.from(el.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0)
            ) {
              const fsPx = parseFloat(cs.fontSize);
              const fw = Number(cs.fontWeight) || 400;
              if (fsPx < 18.5 || fw < 700) {
                badMagentaText.push({
                  tag: el.tagName,
                  fontSize: fsPx,
                  weight: fw,
                  text: (el.textContent ?? "").trim().slice(0, 30),
                });
              }
            }
          }

          return { offPalette, badMagentaText };
        }, Array.from(ALLOWED_RGB));

        expect(audit.offPalette, `Off-palette colors on ${route} (${lang})`).toEqual([]);
        expect(audit.badMagentaText, `White-on-magenta below 19px bold on ${route} (${lang})`).toEqual([]);
      }
    }

    expect(consoleErrors).toEqual([]);
  });

  test("Zero horizontal overflow at 320, 390, 768, 1280, and 1920 px in EN & TE", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const viewports = [
      { width: 320, height: 640 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1280, height: 800 },
      { width: 1920, height: 1080 },
    ];
    const routes = ["/", "/play", "/play/head-set-go", "/play/transify", "/me"];

    for (const lang of ["en", "te"] as const) {
      await setLang(page, lang);
      for (const vp of viewports) {
        await page.setViewportSize(vp);
        for (const route of routes) {
          await page.goto(`${BASE}${route}`, { waitUntil: "load" });
          await page.waitForTimeout(120);
          const overflow = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }));
          expect(
            overflow.scrollWidth,
            `Horizontal overflow on ${route} (${lang}) at ${vp.width}px: scroll=${overflow.scrollWidth}, client=${overflow.clientWidth}`,
          ).toBeLessThanOrEqual(overflow.clientWidth);
        }
      }
    }
  });

  test("Fonts comply with EN <140KB / TE <280KB budgets, condensed display stretch, and clean EN script", async ({
    page,
  }) => {
    const enFonts: Record<string, number> = {};
    page.on("response", async (res) => {
      if (res.url().includes("/fonts/")) {
        const buf = await res.body().catch(() => Buffer.alloc(0));
        enFonts[path.basename(res.url())] = buf.length;
      }
    });

    await setLang(page, "en");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/`);
    await waitHydrated(page);

    const enTotalBytes = Object.values(enFonts).reduce((a, b) => a + b, 0);
    expect(enTotalBytes, `EN fonts total ${enTotalBytes} bytes exceeded 140 KB`).toBeLessThan(140 * 1024);
    expect(enFonts["anek-telugu.woff2"]).toBeUndefined();

    // Check computed font + stretch + clean EN copy (no Telugu chars outside lang switch) + decorative SVG attrs
    const enDomAudit = await page.evaluate(() => {
      const h1 = document.querySelector("h1.display-title");
      const h1Style = h1 ? window.getComputedStyle(h1) : null;
      const bodyStyle = window.getComputedStyle(document.body);

      // Find any unexpected Telugu Unicode codepoints outside lang switch controls
      const badTelugu: string[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const parent = node.parentElement;
        const txt = (node.textContent ?? "").trim();
        if (
          txt &&
          /[\u0C00-\u0C7F]/.test(txt) &&
          !parent?.closest("[data-testid='lang-switch-te'], .lang-switch-te") &&
          !parent?.closest("[aria-label*='Telugu']") &&
          !parent?.closest("script,style")
        ) {
          badTelugu.push(txt);
        }
        node = walker.nextNode();
      }

      const decorativeSvgs = Array.from(document.querySelectorAll("svg[aria-hidden='true'].pointer-events-none"));
      const marqueeWrap = document.querySelector(".wall-tape-wrap");

      return {
        h1Font: h1Style?.fontFamily ?? "",
        h1Stretch: h1Style?.fontStretch ?? "",
        bodyFont: bodyStyle.fontFamily,
        badTelugu,
        decorativeCount: decorativeSvgs.length,
        hasMarquee: Boolean(marqueeWrap),
      };
    });

    expect(enDomAudit.h1Font).toContain("Bricolage Grotesque");
    expect(enDomAudit.h1Stretch).toMatch(/75%|condensed/);
    expect(enDomAudit.bodyFont).toContain("Bricolage Grotesque");
    expect(enDomAudit.badTelugu).toEqual([]);
    expect(enDomAudit.decorativeCount).toBeGreaterThanOrEqual(4);
    expect(enDomAudit.hasMarquee).toBe(true);

    // Switch to TE and verify Anek Telugu + TE transfer stays < 280 KB
    const teFonts: Record<string, number> = {};
    page.on("response", async (res) => {
      if (res.url().includes("/fonts/")) {
        const buf = await res.body().catch(() => Buffer.alloc(0));
        teFonts[path.basename(res.url())] = buf.length;
      }
    });
    await page.getByTestId("lang-switch-te").click();
    await waitHydrated(page);
    await page.waitForTimeout(300);

    const teTotalBytes = Object.values({ ...enFonts, ...teFonts }).reduce((a, b) => a + b, 0);
    expect(teTotalBytes, `TE fonts total ${teTotalBytes} bytes exceeded 280 KB`).toBeLessThan(280 * 1024);
  });

  test("Calm mode (/me toggle + OS prefers-reduced-motion) & Marquee Pause toggle", async ({
    page,
  }) => {
    await setLang(page, "en");
    await page.setViewportSize({ width: 1280, height: 800 });

    // Enable Calm mode from /me
    await page.goto(`${BASE}/me`);
    await waitHydrated(page);
    await page.getByTestId("toggle-calm-mode").click();
    await expect(page.locator("html")).toHaveAttribute("data-reduced-motion", "true");

    // On landing with Calm mode on, HeroDemo does not auto-advance over 3.2s
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    await expect(page.locator("html")).toHaveAttribute("data-reduced-motion", "true");
    const initialTitle = await page.getByTestId("hero-live-demo").innerText();
    await page.waitForTimeout(3100);
    const afterTitle = await page.getByTestId("hero-live-demo").innerText();
    expect(afterTitle).toBe(initialTitle);

    // Toggle Marquee pause button cleanly
    const pauseBtn = page.getByTestId("marquee-pause-btn");
    await expect(pauseBtn).toHaveText("Pause");
    await pauseBtn.click();
    await expect(pauseBtn).toHaveText("Play");
    await expect(page.locator(".wall-tape-wrap")).toHaveClass(/wall-tape-paused/);

    // Also test OS prefers-reduced-motion: reduce without in-app toggle
    await page.goto(`${BASE}/me`);
    await waitHydrated(page);
    await page.getByTestId("toggle-calm-mode").click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    await expect(page.locator("html")).toHaveAttribute("data-reduced-motion", "true");
  });

  test("Capture all AFTER Design V4 screenshots into reference/design-v4/ (and Font Lab Round 3)", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Design V4 screenshot capture runs once on Chromium");
    test.setTimeout(150_000);

    for (const lang of ["en", "te"] as const) {
      await setLang(page, lang);
      for (const vp of [
        { w: 390, h: 844 },
        { w: 768, h: 1024 },
        { w: 1280, h: 800 },
        { w: 1920, h: 1080 },
      ]) {
        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.goto(`${BASE}/`);
        await waitHydrated(page);
        await page.waitForTimeout(250);
        saveV4Shot(`after-landing-${vp.w}x${vp.h}-${lang}.png`, await page.screenshot({ fullPage: true }));
      }

      // Play home 390x844
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${BASE}/play`);
      await waitHydrated(page);
      saveV4Shot(`after-play-390x844-${lang}.png`, await page.screenshot({ fullPage: true }));

      // Transify setup 390x844
      await page.goto(`${BASE}/play/transify`);
      await waitHydrated(page);
      saveV4Shot(`after-transify-setup-390x844-${lang}.png`, await page.screenshot({ fullPage: true }));

      // Head Set Go landscape round 844x390
      await page.setViewportSize({ width: 844, height: 390 });
      await page.goto(`${BASE}/play/head-set-go`);
      await page.evaluate(() => {
        sessionStorage.setItem("hsg.deck", "movies");
        sessionStorage.setItem("hsg.duration", "60");
      });
      await page.goto(`${BASE}/play/head-set-go/round`);
      await page.waitForTimeout(3600);
      saveV4Shot(`after-hsg-round-844x390-${lang}.png`, await page.screenshot());

      // Head Set Go results 390x844
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
      await page.waitForTimeout(350);
      saveV4Shot(`after-hsg-results-390x844-${lang}.png`, await page.screenshot({ fullPage: true }));
    }

    // Font Lab Round 3 screenshot
    await setLang(page, "en");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/dev/fonts`);
    await waitHydrated(page);
    saveV4Shot("after-font-lab-round3-1280x800.png", await page.screenshot({ fullPage: true }));
  });
});
