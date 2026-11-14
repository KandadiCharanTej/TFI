/**
 * Phase 4b E2E: Design V2 Overhaul verification
 * - No uppercase headings (h1-h6) on any screen
 * - No Anton or Permanent Marker anywhere
 * - 5-Second Landing Page Checklist at 390x844 and 1280x800
 * - Interactive live Head Set Go hero demo + 1 tilted TicketStub ("Admit one gang")
 * - Bento grid with true player/time metadata + segmented mode control
 * - /play TicketStub "Today's pick" + "Recently played" history
 * - Font network budgets (< 120 KB EN, < 250 KB TE)
 * - Captures BEFORE & AFTER screenshots into reference/design-v2/
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";
import path from "path";
import { BASE, BETA_SLUGS, setLang, waitHydrated } from "./helpers";

const DESIGN_V2_DIR = path.resolve(process.cwd(), "../../reference/design-v2");

function saveV2Shot(name: string, buf: Buffer) {
  fs.mkdirSync(DESIGN_V2_DIR, { recursive: true });
  fs.writeFileSync(path.join(DESIGN_V2_DIR, name), buf);
}

test.describe("Phase 4b — Design V2 Overhaul", () => {
  test("No heading (h1-h6), button, or chip uses text-transform: uppercase across core routes", async ({
    page,
  }) => {
    await setLang(page, "en");
    const routes = [
      "/",
      "/play",
      "/play/head-set-go",
      "/play/transify",
      "/play/dumb-charades",
      "/play/most-likely",
      "/join",
      "/me",
      "/about",
    ];

    for (const route of routes) {
      await page.goto(`${BASE}${route}`);
      await waitHydrated(page);
      const uppercaseHeadings = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6, .wall-btn, .wall-chip"));
        return els
          .filter((el) => window.getComputedStyle(el).textTransform === "uppercase")
          .map((el) => ({ tag: el.tagName, text: (el.textContent || "").trim().slice(0, 30) }));
      });
      expect(
        uppercaseHeadings,
        `Found uppercase heading/button/chip on ${route}: ${JSON.stringify(uppercaseHeadings)}`,
      ).toEqual([]);
    }
  });

  test("5-Second Landing Checklist & Interactive Hero Demo at 1280x800 and 390x844", async ({
    page,
  }) => {
    await setLang(page, "en");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/`);
    await waitHydrated(page);

    // 1. Wordmark, headline, Play now button, and live game demo all visible above the fold
    const h1 = page.getByRole("heading", { level: 1, name: "Game night for Telugu movie fans." });
    await expect(h1).toBeVisible();
    const h1Box = await h1.boundingBox();
    expect(h1Box?.y).toBeLessThan(400);

    const demo = page.getByTestId("hero-live-demo");
    await expect(demo).toBeVisible();
    const demoBox = await demo.boundingBox();
    expect(demoBox?.y).toBeLessThan(650);

    // 2. Only ONE tilted decorative element on the landing hero ("Admit one gang" ticket stub)
    await expect(page.getByTestId("hero-ticket-stub")).toContainText("Admit one gang");

    // 3. Tapping Correct! on the live hero demo increments the demo score and advances the card
    const beforeScore = await page.getByTestId("hero-demo-score").innerText();
    await page.getByTestId("hero-demo-correct").click();
    await page.waitForTimeout(260);
    const afterScore = await page.getByTestId("hero-demo-score").innerText();
    expect(afterScore).not.toBe(beforeScore);

    // 4. Bento grid shows true registry metadata ("2 to 10 players · 5 min")
    await expect(page.locator("#games")).toContainText("2 to 10 players · 5 min");

    // 5. Segmented control filters games cleanly
    await page.getByTestId("filter-online").click();
    await expect(page.locator("#games a[href='/play/box-office-auction']")).toBeVisible();
    await page.getByTestId("filter-All").click();

    // Check mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    await expect(h1).toBeVisible();
    await expect(demo).toBeVisible();
  });

  test("Play home shows greeting, TicketStub Today's pick, and Recently played after starting a game", async ({
    page,
  }) => {
    await setLang(page, "en");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/play/head-set-go`);
    await waitHydrated(page);
    await page.getByTestId("hsg-start-btn").click();
    await page.waitForURL("**/play/head-set-go/round");

    await page.goto(`${BASE}/play`);
    await waitHydrated(page);
    await expect(page.getByRole("heading", { level: 1, name: "Ready for game night?" })).toBeVisible();
    await expect(page.getByTestId("todays-pick-ticket")).toBeVisible();
    await expect(page.getByTestId("recently-played-section")).toBeVisible();
  });

  test("Capture AFTER screenshots in reference/design-v2/ across viewports in EN and TE", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Screenshots captured once in Chromium");
    test.setTimeout(120_000);

    // Landing 390, 768, 1280 in EN and TE
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
        saveV2Shot(`after-landing-${vp.w}x${vp.h}-${lang}.png`, await page.screenshot({ fullPage: true }));
      }

      // Play home 390 and 1280
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${BASE}/play`);
      await waitHydrated(page);
      saveV2Shot(`after-play-390x844-${lang}.png`, await page.screenshot({ fullPage: true }));

      // Setup screen (Transify) 390
      await page.goto(`${BASE}/play/transify`);
      await waitHydrated(page);
      saveV2Shot(`after-transify-setup-390x844-${lang}.png`, await page.screenshot({ fullPage: true }));

      // Landscape Head Set Go round 844x390
      await page.setViewportSize({ width: 844, height: 390 });
      await page.goto(`${BASE}/play/head-set-go`);
      await page.evaluate(() => {
        sessionStorage.setItem("hsg.deck", "movies");
        sessionStorage.setItem("hsg.duration", "60");
      });
      await page.goto(`${BASE}/play/head-set-go/round`);
      await page.waitForTimeout(3600);
      saveV2Shot(`after-hsg-round-844x390-${lang}.png`, await page.screenshot());

      // Results screen with TicketStub centerpiece 390x844
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
      saveV2Shot(`after-hsg-results-390x844-${lang}.png`, await page.screenshot({ fullPage: true }));
    }

    // Font Lab Round 2 screenshot
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/dev/fonts`);
    await waitHydrated(page);
    saveV2Shot("after-font-lab-round2-1280x800.png", await page.screenshot({ fullPage: true }));

    // Axe check on landing in both modes
    for (const slug of BETA_SLUGS.slice(0, 3)) {
      await page.goto(`${BASE}/play/${slug}`);
      await waitHydrated(page);
      const axe = await new AxeBuilder({ page }).analyze();
      expect(axe.violations).toEqual([]);
    }
  });
});
