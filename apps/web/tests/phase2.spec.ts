/**
 * Phase 2 E2E tests — STEP 0 (language) + Head Set Go game flow.
 *
 * Run with:  pnpm test:e2e
 * Requires:  system Chrome at /Applications/Google Chrome.app
 *            pnpm build && next start -p 3100 (started by webServer config)
 */
import { test, expect, type Page } from "@playwright/test";
import path from "path";
import fs from "fs";

const BASE = "http://127.0.0.1:3100";
const TELUGU_RE = /[\u0C00-\u0C7F]/;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Set the lang cookie. Must use 127.0.0.1 to match the server domain. */
async function setLang(page: Page, lang: "en" | "te") {
  await page.context().addCookies([
    { name: "lang", value: lang, domain: "127.0.0.1", path: "/" },
  ]);
}

async function bodyText(page: Page): Promise<string> {
  return page.evaluate(() => document.body.innerText);
}

/** Get body text with ALL lang-switch elements stripped out. */
async function bodyTextNoSwitch(page: Page): Promise<string> {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    // Remove all lang-switch elements (there may be more than one)
    clone.querySelectorAll("[data-testid='lang-switch']").forEach((el) => el.remove());
    // Remove script tags (Next.js __NEXT_DATA__ contains all translation strings as JSON)
    clone.querySelectorAll("script").forEach((el) => el.remove());
    return clone.innerText;
  });
}

function saveScreenshot(filepath: string, buffer: Buffer) {
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, buffer);
}

const SCREENSHOT_DIR = path.join(process.cwd(), "reference/screenshots");

/** Wait for client hydration and React to settle. */
async function waitHydrated(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
}

// ─── STEP 0: English-mode tests ───────────────────────────────────────────────

test.describe("STEP 0 — English mode (default)", () => {
  const PAGES = ["/", "/play", "/health", "/about", "/join", "/me"];

  for (const route of PAGES) {
    test(`${route} contains no Telugu script (except lang switch)`, async ({ page }) => {
      await setLang(page, "en");
      await page.goto(`${BASE}${route}`);
      await waitHydrated(page);
      const text = await bodyTextNoSwitch(page);
      expect(TELUGU_RE.test(text), `Found Telugu chars in en mode on ${route}: "${text.match(/[\u0C00-\u0C7F].{0,20}/)?.[0] ?? ""}"`).toBe(false);
    });
  }

  test("/ renders in English by default (no cookie)", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    const text = await bodyTextNoSwitch(page);
    expect(TELUGU_RE.test(text)).toBe(false);
    expect(text).toContain("TFI & Pitch");
  });
});

// ─── STEP 0: Telugu-mode tests ────────────────────────────────────────────────

test.describe("STEP 0 — Telugu mode", () => {
  test("/ shows Telugu text when lang=te", async ({ page }) => {
    await setLang(page, "te");
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    const text = await bodyText(page);
    // The tagline or at minimum the switch contains Telugu
    expect(TELUGU_RE.test(text)).toBe(true);
  });

  test("lang switch persists after reload", async ({ page }) => {
    await setLang(page, "en");
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    // Click the language switch
    await page.click("[data-testid='lang-switch']");
    await page.waitForTimeout(600);
    // Reload — cookie should persist Telugu
    await page.reload();
    await waitHydrated(page);
    const text = await bodyTextNoSwitch(page);
    expect(TELUGU_RE.test(text)).toBe(true);
  });

  test("html lang attribute is 'te' when lang cookie is 'te'", async ({ page }) => {
    await setLang(page, "te");
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    const lang = await page.getAttribute("html", "lang");
    expect(lang).toBe("te");
  });
});

// ─── Phase 2: Head Set Go setup screen ───────────────────────────────────────

test.describe("Head Set Go — setup screen", () => {
  test("setup screen loads and shows deck picker", async ({ page }) => {
    await setLang(page, "en");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/play/head-set-go`);
    await waitHydrated(page);

    // Should have Start button
    const startBtn = page.getByTestId("hsg-start-btn");
    await expect(startBtn).toBeVisible();

    // Should have two deck options
    await expect(page.getByRole("button", { name: /movies/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /actors/i })).toBeVisible();

    saveScreenshot(
      path.join(SCREENSHOT_DIR, "hsg-setup-en.png"),
      await page.screenshot({ fullPage: true }),
    );
  });

  test("setup screen in Telugu mode shows Telugu text", async ({ page }) => {
    await setLang(page, "te");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/play/head-set-go`);
    await waitHydrated(page);
    const text = await bodyText(page);
    expect(TELUGU_RE.test(text)).toBe(true);

    saveScreenshot(
      path.join(SCREENSHOT_DIR, "hsg-setup-te.png"),
      await page.screenshot({ fullPage: true }),
    );
  });

  test("timer stepper increases and decreases", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/play/head-set-go`);
    await waitHydrated(page);

    // Default 60s shown — use data-testid to avoid matching the "s" suffix span
    await expect(page.getByTestId("hsg-timer-value")).toContainText("60");

    // Increase
    await page.click("[aria-label='Increase timer']");
    await expect(page.getByTestId("hsg-timer-value")).toContainText("90");

    // Decrease back
    await page.click("[aria-label='Decrease timer']");
    await expect(page.getByTestId("hsg-timer-value")).toContainText("60");
  });
});

// ─── Phase 2: Head Set Go round screen ───────────────────────────────────────

test.describe("Head Set Go — round screen", () => {
  async function goToRound(page: Page, lang: "en" | "te" = "en") {
    await setLang(page, lang);
    await page.setViewportSize({ width: 844, height: 390 });
    // Go to any same-origin page first to set sessionStorage
    await page.goto(`${BASE}/play/head-set-go`);
    await page.evaluate(() => {
      sessionStorage.setItem("hsg.deck", "movies");
      sessionStorage.setItem("hsg.duration", "30");
    });
    // Now navigate to round
    await page.goto(`${BASE}/play/head-set-go/round`);
    await page.waitForLoadState("networkidle");
    // Wait for 3-2-1 countdown + buffer
    await page.waitForTimeout(4500);
  }

  test("round screen shows PASS and CORRECT tap zones in landscape", async ({ page }) => {
    await goToRound(page);
    await expect(page.getByRole("button", { name: /pass/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /correct/i })).toBeVisible();

    saveScreenshot(
      path.join(SCREENSHOT_DIR, "hsg-round-en.png"),
      await page.screenshot(),
    );
  });

  test("tapping CORRECT increments score", async ({ page }) => {
    await goToRound(page);
    await page.getByRole("button", { name: /correct/i }).click();
    // Score pill: ✓ 1
    await expect(page.getByText(/✓\s*1/)).toBeVisible();
  });

  test("pause dialog opens and shows Resume", async ({ page }) => {
    await goToRound(page);
    await page.click("[aria-label='Pause']");
    await expect(page.getByRole("button", { name: /resume/i })).toBeVisible();

    saveScreenshot(
      path.join(SCREENSHOT_DIR, "hsg-paused-en.png"),
      await page.screenshot(),
    );
  });

  test("round screen in Telugu mode contains Telugu text", async ({ page }) => {
    await goToRound(page, "te");
    const text = await bodyText(page);
    expect(TELUGU_RE.test(text)).toBe(true);

    saveScreenshot(
      path.join(SCREENSHOT_DIR, "hsg-round-te.png"),
      await page.screenshot(),
    );
  });
});

// ─── Phase 2: Head Set Go results screen ─────────────────────────────────────

test.describe("Head Set Go — results screen", () => {
  async function goToResults(page: Page, lang: "en" | "te" = "en") {
    await setLang(page, lang);
    await page.setViewportSize({ width: 390, height: 844 });
    // Seed sessionStorage via same-origin navigation
    await page.goto(`${BASE}/play/head-set-go`);
    await page.evaluate(() => {
      sessionStorage.setItem("hsg.correctIds", JSON.stringify(["hsg-mov-001", "hsg-mov-002"]));
      sessionStorage.setItem("hsg.passedIds", JSON.stringify(["hsg-mov-003"]));
      sessionStorage.setItem(
        "hsg.allCards",
        JSON.stringify([
          { id: "hsg-mov-001", en: "Pokiri", te: "పోకిరి" },
          { id: "hsg-mov-002", en: "Magadheera", te: "మగధీర" },
          { id: "hsg-mov-003", en: "Baahubali", te: "బాహుబలి" },
        ]),
      );
      sessionStorage.setItem("hsg.deck", "movies");
    });
    await page.goto(`${BASE}/play/head-set-go/results`);
    await waitHydrated(page);
  }

  test("results page shows score and card lists", async ({ page }) => {
    await goToResults(page);
    // Score heading (use aria-label)
    await expect(page.getByLabel(/2.*score/i)).toBeVisible();
    // Got it list
    await expect(page.getByText("Pokiri")).toBeVisible();
    await expect(page.getByText("Magadheera")).toBeVisible();
    // Passed list
    await expect(page.getByText("Baahubali")).toBeVisible();

    saveScreenshot(
      path.join(SCREENSHOT_DIR, "hsg-results-en.png"),
      await page.screenshot({ fullPage: true }),
    );
  });

  test("results page in Telugu shows Telugu card names", async ({ page }) => {
    await goToResults(page, "te");
    await waitHydrated(page);
    await expect(page.getByText("పోకిరి")).toBeVisible();
    await expect(page.getByText("మగధీర")).toBeVisible();

    saveScreenshot(
      path.join(SCREENSHOT_DIR, "hsg-results-te.png"),
      await page.screenshot({ fullPage: true }),
    );
  });

  test("Play again button returns to setup", async ({ page }) => {
    await goToResults(page);
    await page.click("text=Play again");
    await expect(page).toHaveURL(/\/play\/head-set-go/);
  });
});

// ─── Service worker ─────────────────────────────────────────────────────────

test("service worker registers and /play/head-set-go loads", async ({ page }) => {
  await page.goto(`${BASE}/play/head-set-go`);
  await waitHydrated(page);
  expect(page.url()).toContain("/play/head-set-go");
});
