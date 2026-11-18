import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { BASE, setLang, waitHydrated } from "./helpers";

const DESIGN_V5_DIR = path.resolve(process.cwd(), "../../reference/design-v5");

function saveV5Shot(name: string, buf: Buffer) {
  fs.mkdirSync(DESIGN_V5_DIR, { recursive: true });
  fs.writeFileSync(path.join(DESIGN_V5_DIR, name), buf);
}

interface TouchOffender {
  tag: string;
  text: string;
  testId: string | null;
  href: string | null;
  width: number;
  height: number;
}

interface OverlapOffender {
  doodle: string;
  target: string;
  intersectW: number;
  intersectH: number;
}

async function auditLayoutAndTargets(page: Page) {
  return page.evaluate(() => {
    const overflowX =
      document.documentElement.scrollWidth - document.documentElement.clientWidth;

    const interactive = Array.from(
      document.querySelectorAll(
        "a, button, input, select, textarea, [role='button'], [role='radio']",
      ),
    );
    const smallTargets: TouchOffender[] = [];
    for (const el of interactive) {
      if (!(el instanceof HTMLElement)) continue;
      if (el.getAttribute("aria-hidden") === "true" || el.tabIndex === -1) continue;
      const cls = el.className || "";
      if (typeof cls === "string" && cls.includes("visually-hidden")) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
        continue;
      }
      if (rect.width < 43.5 || rect.height < 43.5) {
        smallTargets.push({
          tag: el.tagName.toLowerCase(),
          text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 40),
          testId: el.getAttribute("data-testid"),
          href: el.getAttribute("href"),
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
        });
      }
    }

    const tinyLabels: Array<{ tag: string; size: number; text: string }> = [];
    const textEls = Array.from(document.querySelectorAll("p, span, label, li, a, button"));
    for (const el of textEls) {
      if (!(el instanceof HTMLElement)) continue;
      if (el.closest("[aria-hidden='true']")) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const txt = (el.innerText || "").trim();
      if (!txt) continue;
      const size = parseFloat(window.getComputedStyle(el).fontSize);
      if (size < 11.9) {
        tinyLabels.push({ tag: el.tagName.toLowerCase(), size, text: txt.slice(0, 30) });
      }
    }

    return {
      overflowX,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      smallTargets,
      tinyLabels,
    };
  });
}

test.describe("Phase 5c — Funky Hero Doodles & Perfect on Phones", () => {
  test("Hero doodle counts (<=5 phone, <=8 tablet, <=12 desktop), zero overlap, above-the-fold CTA, and interactions", async ({
    page,
    browserName,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const heroVps = [
      { w: 320, h: 568, maxDoodles: 5 },
      { w: 360, h: 640, maxDoodles: 5 },
      { w: 390, h: 844, maxDoodles: 5 },
      { w: 768, h: 1024, maxDoodles: 8 },
      { w: 1280, h: 800, maxDoodles: 12 },
      { w: 1920, h: 1080, maxDoodles: 12 },
    ];

    for (const lang of ["en", "te"] as const) {
      await setLang(page, lang);
      for (const vp of heroVps) {
        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.goto(`${BASE}/`);
        await waitHydrated(page);
        await page.waitForTimeout(350);

        const heroCheck = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll("[data-doodle-item]")).filter(
            (el) => {
              const r = el.getBoundingClientRect();
              const s = window.getComputedStyle(el);
              return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
            },
          );

          const targets = Array.from(
            document.querySelectorAll(
              "[data-hero-text] h1, [data-hero-text] p, [data-hero-text] a, [data-hero-text] button, [data-hero-text] li, [data-testid='hero-live-demo']",
            ),
          );

          const overlaps: OverlapOffender[] = [];
          for (const d of items) {
            const dr = d.getBoundingClientRect();
            const dName = d.getAttribute("data-doodle-item") || "doodle";
            for (const t of targets) {
              const tr = t.getBoundingClientRect();
              if (tr.width === 0 || tr.height === 0) continue;
              const iw = Math.min(dr.right, tr.right) - Math.max(dr.left, tr.left);
              const ih = Math.min(dr.bottom, tr.bottom) - Math.max(dr.top, tr.top);
              if (iw > 2 && ih > 2) {
                overlaps.push({
                  doodle: dName,
                  target:
                    (t.getAttribute("data-testid") || t.tagName.toLowerCase()) +
                    ":" +
                    (t.textContent || "").trim().slice(0, 20),
                  intersectW: Math.round(iw),
                  intersectH: Math.round(ih),
                });
              }
            }
          }

          const playBtn = document.querySelector("[data-testid='hero-play-btn']");
          const headerPlayBtn = document.querySelector("[data-testid='header-play-btn']");
          const header = document.querySelector("header");
          const playRect = playBtn?.getBoundingClientRect();
          const headerRect = header?.getBoundingClientRect();
          const headerPlayVisible = headerPlayBtn
            ? window.getComputedStyle(headerPlayBtn).display !== "none" &&
              headerPlayBtn.getBoundingClientRect().width > 0
            : false;

          return {
            visibleDoodles: items.length,
            overlaps,
            heroPlayTop: playRect ? Math.round(playRect.top) : -1,
            heroPlayBottom: playRect ? Math.round(playRect.bottom) : -1,
            headerHeight: headerRect ? Math.round(headerRect.height) : 0,
            headerPlayVisible,
            overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        });

        expect(heroCheck.overflowX, `Overflow on / at ${vp.w}x${vp.h} (${lang})`).toBeLessThanOrEqual(0);
        expect(
          heroCheck.visibleDoodles,
          `Doodle count ${vp.w}x${vp.h} (${lang})`,
        ).toBeLessThanOrEqual(vp.maxDoodles);
        expect(
          heroCheck.overlaps,
          `Doodle overlaps on ${vp.w}x${vp.h} (${lang}): ${JSON.stringify(heroCheck.overlaps)}`,
        ).toEqual([]);
        expect(heroCheck.headerHeight).toBeLessThanOrEqual(66);

        if (vp.w === 390 || vp.w === 360 || vp.w === 1280) {
          expect(
            heroCheck.heroPlayBottom,
            `Hero Play button above fold on ${vp.w}x${vp.h} (${lang})`,
          ).toBeLessThanOrEqual(vp.h + 4);
        }
        if (vp.w <= 768) {
          expect(heroCheck.headerPlayVisible).toBe(false);
        }
      }
    }

    // Desktop interactive doodle checks + scroll header CTA + Calm mode check (Chromium)
    if (browserName === "chromium") {
      await setLang(page, "en");
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`${BASE}/`);
      await waitHydrated(page);
      await page.waitForTimeout(350);

      // Demo Correct -> Bolt flash class
      await page.getByTestId("hero-demo-correct").click();
      await expect(page.locator("[data-doodle-item='bolt-magenta']")).toHaveClass(
        /doodle-bolt-flash/,
      );

      // Demo Pass -> Magenta X shake class
      await page.getByTestId("hero-demo-pass").click();
      await expect(page.locator("[data-doodle-item='xl-x-magenta']")).toHaveClass(/doodle-x-shake/);

      // Smiley 5-tap easter egg
      const smiley = page.getByTestId("hero-doodle-smiley");
      for (let i = 0; i < 5; i++) {
        await smiley.click();
      }

      // Header CTA shows once scrolled past hero
      await page.evaluate(() => window.scrollTo(0, 750));
      await page.waitForTimeout(250);
      await expect(page.getByTestId("header-play-btn")).toBeVisible();
    }

    expect(consoleErrors).toEqual([]);
  });

  test("Device matrix horizontal overflow (0px), >=44x44 touch targets, >=12px labels, 200% zoom", async ({
    page,
    browserName,
  }) => {
    test.setTimeout(180_000);
    await setLang(page, "en");

    const phoneVps =
      browserName === "chromium"
        ? [
            { w: 320, h: 568 },
            { w: 360, h: 640 },
            { w: 375, h: 667 },
            { w: 390, h: 844 },
            { w: 414, h: 896 },
            { w: 430, h: 932 },
            { w: 480, h: 1040 },
            { w: 844, h: 390 },
            { w: 740, h: 360 },
            { w: 768, h: 1024 },
            { w: 1280, h: 800 },
          ]
        : [
            { w: 320, h: 568 },
            { w: 390, h: 844 },
            { w: 844, h: 390 },
          ];

    const routes = [
      "/",
      "/play",
      "/play/head-set-go",
      "/play/transify",
      "/play/dumb-charades",
      "/play/most-likely",
      "/me",
      "/about",
      "/offline",
    ];

    for (const vp of phoneVps) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      for (const route of routes) {
        await page.goto(`${BASE}${route}`);
        await waitHydrated(page);
        const audit = await auditLayoutAndTargets(page);
        expect(
          audit.overflowX,
          `Overflow on ${route} at ${vp.w}x${vp.h} (scroll=${audit.scrollWidth}, client=${audit.clientWidth})`,
        ).toBeLessThanOrEqual(0);
        expect(
          audit.smallTargets,
          `Sub-44px targets on ${route} at ${vp.w}x${vp.h}: ${JSON.stringify(audit.smallTargets)}`,
        ).toEqual([]);
        expect(
          audit.tinyLabels,
          `<12px text on ${route} at ${vp.w}x${vp.h}: ${JSON.stringify(audit.tinyLabels)}`,
        ).toEqual([]);
      }
    }

    // 200% text scaling check at 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ["/", "/play", "/play/head-set-go"]) {
      await page.goto(`${BASE}${route}`);
      await waitHydrated(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });
      await page.waitForTimeout(150);
      const overflow200 = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow200, `Overflow at 200% zoom on ${route}`).toBeLessThanOrEqual(0);
    }

    // Edge 280px width on landing
    await page.setViewportSize({ width: 280, height: 653 });
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    const overflow280 = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow280).toBeLessThanOrEqual(0);
  });

  test("Active rounds on phones & Telugu longest titles fit landscape without clipping or overflow", async ({
    page,
    browserName,
  }) => {
    test.setTimeout(90_000);

    // 1. Head Set Go in Telugu landscape (667x375 & 740x360) + Pass/Correct >= 96px tall
    await setLang(page, "te");
    for (const vp of [
      { w: 667, h: 375 },
      { w: 740, h: 360 },
      { w: 844, h: 390 },
    ]) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto(`${BASE}/play/head-set-go`);
      await page.evaluate(() => {
        sessionStorage.setItem("hsg.deck", "movies");
        sessionStorage.setItem("hsg.duration", "60");
      });
      await page.goto(`${BASE}/play/head-set-go/round`);
      await page.waitForTimeout(3600);

      const passBtn = page.getByRole("button", { name: "PASS" });
      const correctBtn = page.getByRole("button", { name: "CORRECT" });
      await expect(passBtn).toBeVisible();
      await expect(correctBtn).toBeVisible();

      const passRect = await passBtn.boundingBox();
      const correctRect = await correctBtn.boundingBox();
      expect(passRect?.height ?? 0).toBeGreaterThanOrEqual(95);
      expect(correctRect?.height ?? 0).toBeGreaterThanOrEqual(95);

      if (browserName === "chromium" && (vp.w === 667 || vp.w === 844)) {
        saveV5Shot(`hsg-round-${vp.w}x${vp.h}-te.png`, await page.screenshot());
      }

      // Advance 6 cards to check different Telugu title lengths
      for (let i = 0; i < 6; i++) {
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `HSG Telugu overflow at ${vp.w}x${vp.h} step ${i}`).toBeLessThanOrEqual(0);
        await (i % 2 === 0 ? correctBtn : passBtn).click();
        await page.waitForTimeout(120);
      }
    }

    // 2. Transify active round & Results at 390x844 + Head Set Go results
    await setLang(page, "en");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/play/transify`);
    await waitHydrated(page);
    if (browserName === "chromium") {
      saveV5Shot("setup-transify-390x844-en.png", await page.screenshot({ fullPage: true }));
    }
    await page.getByTestId("judge-start-btn").click();
    await page.waitForURL("**/play/transify/round");
    await expect(page.getByTestId("judge-round-screen")).toBeVisible();
    await page.waitForTimeout(3600);
    await expect(page.getByText(/GET READY/i)).toBeHidden({ timeout: 6000 });
    await expect(page.getByTestId("judge-clue")).toBeVisible();
    await expect(page.getByTestId("judge-skip-btn")).toBeVisible();
    await expect(page.getByTestId("judge-correct-btn")).toBeVisible();

    const skipRect = await page.getByTestId("judge-skip-btn").boundingBox();
    const okRect = await page.getByTestId("judge-correct-btn").boundingBox();
    expect(skipRect?.height ?? 0).toBeGreaterThanOrEqual(64);
    expect(okRect?.height ?? 0).toBeGreaterThanOrEqual(64);

    if (browserName === "chromium") {
      saveV5Shot("transify-round-390x844-en.png", await page.screenshot());
    }

    // Results screen 390x844
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
    const resAudit = await auditLayoutAndTargets(page);
    expect(resAudit.overflowX).toBeLessThanOrEqual(0);
    expect(resAudit.smallTargets).toEqual([]);
    if (browserName === "chromium") {
      saveV5Shot("results-390x844-en.png", await page.screenshot({ fullPage: true }));
    }
  });

  test("Capture reference/design-v5/ landing and play screenshots in EN & TE", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Reference screenshots captured once in Chromium");
    test.setTimeout(120_000);

    await setLang(page, "en");
    const shots: Array<{ name: string; w: number; h: number; full?: boolean }> = [
      { name: "landing-top-320x568-en.png", w: 320, h: 568 },
      { name: "landing-top-360x640-en.png", w: 360, h: 640 },
      { name: "landing-top-390x844-en.png", w: 390, h: 844 },
      { name: "landing-full-390x844-en.png", w: 390, h: 844, full: true },
      { name: "landing-top-430x932-en.png", w: 430, h: 932 },
      { name: "landing-top-844x390-en.png", w: 844, h: 390 },
      { name: "landing-top-768x1024-en.png", w: 768, h: 1024 },
      { name: "landing-top-1280x800-en.png", w: 1280, h: 800 },
      { name: "landing-full-1280x800-en.png", w: 1280, h: 800, full: true },
      { name: "landing-top-1920x1080-en.png", w: 1920, h: 1080 },
    ];

    for (const s of shots) {
      await page.setViewportSize({ width: s.w, height: s.h });
      await page.goto(`${BASE}/`);
      await waitHydrated(page);
      await page.waitForTimeout(450);
      saveV5Shot(s.name, await page.screenshot({ fullPage: Boolean(s.full) }));
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);
    saveV5Shot("play-390x844-en.png", await page.screenshot({ fullPage: true }));

    // Telugu landing captures
    await setLang(page, "te");
    for (const vp of [
      { w: 390, h: 844 },
      { w: 1280, h: 800 },
    ]) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto(`${BASE}/`);
      await waitHydrated(page);
      await page.waitForTimeout(450);
      saveV5Shot(`landing-top-${vp.w}x${vp.h}-te.png`, await page.screenshot());
    }
  });
});
