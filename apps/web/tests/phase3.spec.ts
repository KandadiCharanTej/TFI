/**
 * Phase 3 E2E tests — Font Lab + Judge Template + 4 One-Phone Games.
 */
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "path";
import fs from "fs";

const BASE = "http://127.0.0.1:3100";
const TELUGU_RE = /[\u0C00-\u0C7F]/;
const FONTS_LAB_DIR = path.resolve(process.cwd(), "reference/fonts-lab");
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reference/screenshots");

async function setLang(page: Page, lang: "en" | "te") {
  await page.context().addCookies([
    { name: "lang", value: lang, domain: "127.0.0.1", path: "/" },
  ]);
}

async function bodyTextNoSwitch(page: Page): Promise<string> {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-testid='lang-switch']").forEach((el) => el.remove());
    clone.querySelectorAll("script").forEach((el) => el.remove());
    return clone.innerText;
  });
}

async function waitHydrated(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
}

function saveFile(filepath: string, buffer: Buffer) {
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, buffer);
}

// ─── STEP 0: Font Lab Screenshots & Verification ─────────────────────────────

test.describe("STEP 0: Font Lab at /dev/fonts", () => {
  test("capture 390px and 1280px screenshots in English and Telugu", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(`${BASE}/dev/fonts`);
    await waitHydrated(page);

    // Desktop 1280x800 EN
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.click("[data-testid='lab-toggle-en']");
    await page.waitForTimeout(300);
    const buf1280En = await page.screenshot({ fullPage: true });
    saveFile(path.join(FONTS_LAB_DIR, "font-lab-1280x800-en.png"), buf1280En);

    // Desktop 1280x800 TE
    await page.click("[data-testid='lab-toggle-te']");
    await page.waitForTimeout(300);
    const buf1280Te = await page.screenshot({ fullPage: true });
    saveFile(path.join(FONTS_LAB_DIR, "font-lab-1280x800-te.png"), buf1280Te);

    // Mobile 390x844 EN
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click("[data-testid='lab-toggle-en']");
    await page.waitForTimeout(300);
    const buf390En = await page.screenshot({ fullPage: true });
    saveFile(path.join(FONTS_LAB_DIR, "font-lab-390x844-en.png"), buf390En);

    // Mobile 390x844 TE
    await page.click("[data-testid='lab-toggle-te']");
    await page.waitForTimeout(300);
    const buf390Te = await page.screenshot({ fullPage: true });
    saveFile(path.join(FONTS_LAB_DIR, "font-lab-390x844-te.png"), buf390Te);

    expect(fs.existsSync(path.join(FONTS_LAB_DIR, "font-lab-390x844-en.png"))).toBe(true);
    expect(fs.existsSync(path.join(FONTS_LAB_DIR, "font-lab-1280x800-te.png"))).toBe(true);
  });
});

// ─── STEP 0 item 4c: Computed font check in Telugu mode ───────────────────────

test.describe("STEP 0 item 4c: Telugu Mode Computed Font Check", () => {
  test("Telugu text nodes use Anek Telugu without system fallback", async ({ page }) => {
    await setLang(page, "te");
    await page.goto(`${BASE}/play/transify`);
    await waitHydrated(page);

    const fontCheck = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll("h1, h2, p, button, span"));
      const teluguNodes = elements.filter((el) => /[\u0C00-\u0C7F]/.test(el.textContent || ""));
      return teluguNodes.map((el) => {
        const computed = window.getComputedStyle(el).fontFamily;
        return {
          text: (el.textContent || "").trim().slice(0, 15),
          font: computed,
          hasTeluguFont:
            computed.includes("Anek Telugu") ||
            (el.getAttribute("data-testid") === "lang-switch-te" &&
              computed.includes("Anek Telugu Switch")),
        };
      });
    });

    expect(fontCheck.length).toBeGreaterThan(0);
    for (const item of fontCheck) {
      expect(item.hasTeluguFont, `Element "${item.text}" did not compute to Anek Telugu: ${item.font}`).toBe(true);
    }
  });
});

// ─── English Mode Check on New Pages ─────────────────────────────────────────

test.describe("English mode has zero Telugu characters on new routes", () => {
  const NEW_ROUTES = [
    "/play/transify",
    "/play/emoji-cinema",
    "/play/rapid-fire",
    "/play/dumb-charades",
    "/play/most-likely",
  ];

  for (const route of NEW_ROUTES) {
    test(`route ${route} has no Telugu script in English mode`, async ({ page }) => {
      await setLang(page, "en");
      await page.goto(`${BASE}${route}`);
      await waitHydrated(page);
      const text = await bodyTextNoSwitch(page);
      expect(TELUGU_RE.test(text), `Found unexpected Telugu on ${route}: ${text}`).toBe(false);
    });
  }
});

// ─── Phase 3: The 4 Games Playthrough Sessions ────────────────────────────────

test.describe("Phase 3: Four One-Phone Games (390 x 844)", () => {
  const GAMES = [
    { slug: "transify", title: "Transify" },
    { slug: "emoji-cinema", title: "Emoji Cinema" },
    { slug: "rapid-fire", title: "Rapid Fire" },
    // Cricket IQ is hidden in the beta; it is only tested when SHOW_MVP_GAMES=true.
    ...(process.env.SHOW_MVP_GAMES === "true" ? [{ slug: "cricket-iq", title: "Cricket IQ" }] : []),
  ];

  for (const g of GAMES) {
    test(`full playthrough session for ${g.title}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error" && msg.text().includes("fetching the script")) return;
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      await page.setViewportSize({ width: 390, height: 844 });
      await setLang(page, "en");

      // 1. Setup screen
      await page.goto(`${BASE}/play/${g.slug}`);
      await waitHydrated(page);
      await expect(page.getByTestId("judge-setup-screen")).toBeVisible();

      // Check accessibility on setup screen
      const axeSetup = await new AxeBuilder({ page }).analyze();
      expect(axeSetup.violations).toEqual([]);

      // Start the game
      await page.click("[data-testid='judge-start-btn']");

      // 2. Round screen (getReady countdown → active playing)
      await page.waitForURL(`**/play/${g.slug}/round`);
      // Wait for countdown (3 -> 0) to transition into playing
      await page.waitForSelector("[data-testid='judge-round-screen']", { timeout: 8000 });

      // Check Clue and Answer
      await expect(page.getByTestId("judge-clue")).toBeVisible();
      await expect(page.getByTestId("judge-answer")).toBeVisible();

      // Test Skip and Correct buttons
      await page.click("[data-testid='judge-skip-btn']");
      await page.waitForTimeout(200);
      await page.click("[data-testid='judge-correct-btn']");
      await page.waitForTimeout(200);

      // Check Pause dialog
      await page.click("[data-testid='judge-pause-btn']");
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("button", { name: "Resume" }).click();
      await page.waitForTimeout(300);

      // Finish Player 1's turn
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent("judge-time-up"));
      });
      // Click next turn button when turn ends
      await page.waitForSelector("[data-testid='judge-next-turn-btn']", { timeout: 10000 });
      await page.click("[data-testid='judge-next-turn-btn']");

      // Player 2 passing phone
      await page.waitForSelector("[data-testid='judge-ready-btn']", { timeout: 5000 });
      await page.click("[data-testid='judge-ready-btn']");

      // Player 2 active round
      await page.waitForSelector("[data-testid='judge-round-screen']", { timeout: 8000 });
      await page.click("[data-testid='judge-correct-btn']");
      await page.waitForTimeout(200);

      // Finish Player 2's turn
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent("judge-time-up"));
      });
      await page.waitForSelector("[data-testid='judge-next-turn-btn']", { timeout: 10000 });
      await page.click("[data-testid='judge-next-turn-btn']");

      // 3. Results screen
      await page.waitForURL(`**/play/${g.slug}/results`);
      await page.waitForSelector("[data-testid='judge-results-screen']", { timeout: 8000 });
      await expect(page.getByTestId("winner-display")).toBeVisible();

      // Screenshot results screen
      const resShot = await page.screenshot({ fullPage: true });
      saveFile(path.join(SCREENSHOT_DIR, `${g.slug}-results-en.png`), resShot);

      // Check accessibility on results screen
      const axeResults = await new AxeBuilder({ page }).analyze();
      expect(axeResults.violations).toEqual([]);

      // Check share sticker trigger
      await page.click("[data-testid='share-sticker-btn']");
      await page.waitForTimeout(500);

      expect(consoleErrors).toEqual([]);
    });
  }

  test("3-player turn rotation on Transify", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await setLang(page, "en");

    await page.goto(`${BASE}/play/transify`);
    await waitHydrated(page);

    // Add 3rd player
    await page.click("[data-testid='add-player-btn']");
    await expect(page.getByTestId("player-input-2")).toBeVisible();
    await page.fill("[data-testid='player-input-0']", "Raju");
    await page.fill("[data-testid='player-input-1']", "Anu");
    await page.fill("[data-testid='player-input-2']", "Suresh");

    await page.click("[data-testid='judge-start-btn']");
    await page.waitForURL("**/play/transify/round");

    // Player 1 (Raju)
    await page.waitForSelector("[data-testid='judge-round-screen']", { timeout: 8000 });
    await page.click("[data-testid='judge-correct-btn']");
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("judge-time-up")));
    await page.waitForSelector("[data-testid='judge-next-turn-btn']", { timeout: 10000 });
    await page.click("[data-testid='judge-next-turn-btn']");

    // Pass to Anu
    await page.waitForSelector("[data-testid='judge-ready-btn']", { timeout: 5000 });
    await expect(page.getByText("Anu")).toBeVisible();
    await page.click("[data-testid='judge-ready-btn']");

    // Player 2 (Anu)
    await page.waitForSelector("[data-testid='judge-round-screen']", { timeout: 8000 });
    await page.click("[data-testid='judge-correct-btn']");
    await page.click("[data-testid='judge-correct-btn']");
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("judge-time-up")));
    await page.waitForSelector("[data-testid='judge-next-turn-btn']", { timeout: 10000 });
    await page.click("[data-testid='judge-next-turn-btn']");

    // Pass to Suresh
    await page.waitForSelector("[data-testid='judge-ready-btn']", { timeout: 5000 });
    await expect(page.getByText("Suresh")).toBeVisible();
    await page.click("[data-testid='judge-ready-btn']");

    // Player 3 (Suresh)
    await page.waitForSelector("[data-testid='judge-round-screen']", { timeout: 8000 });
    await page.click("[data-testid='judge-skip-btn']");
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("judge-time-up")));
    await page.waitForSelector("[data-testid='judge-next-turn-btn']", { timeout: 10000 });
    await page.click("[data-testid='judge-next-turn-btn']");

    // Results screen
    await page.waitForURL("**/play/transify/results");
    await expect(page.getByTestId("judge-results-screen")).toBeVisible();
    await expect(page.getByTestId("winner-display")).toContainText("Anu");
    await expect(page.getByTestId("player-score-row-0")).toContainText("Anu");
    await expect(page.getByTestId("player-score-row-1")).toContainText("Raju");
    await expect(page.getByTestId("player-score-row-2")).toContainText("Suresh");
  });

  test("Transify in Telugu mode", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await setLang(page, "te");

    await page.goto(`${BASE}/play/transify`);
    await waitHydrated(page);

    await expect(page.getByTestId("judge-setup-screen")).toBeVisible();
    const setupText = await page.evaluate(() => document.body.innerText);
    expect(TELUGU_RE.test(setupText)).toBe(true);

    await page.click("[data-testid='judge-start-btn']");
    await page.waitForURL("**/play/transify/round");

    await page.waitForSelector("[data-testid='judge-round-screen']", { timeout: 8000 });
    const roundText = await page.evaluate(() => document.body.innerText);
    expect(TELUGU_RE.test(roundText)).toBe(true);

    // Skip, Correct
    await page.click("[data-testid='judge-correct-btn']");
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("judge-time-up")));
    await page.waitForSelector("[data-testid='judge-next-turn-btn']", { timeout: 10000 });
    await page.click("[data-testid='judge-next-turn-btn']");

    await page.waitForSelector("[data-testid='judge-ready-btn']", { timeout: 5000 });
    await page.click("[data-testid='judge-ready-btn']");

    await page.waitForSelector("[data-testid='judge-round-screen']", { timeout: 8000 });
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("judge-time-up")));
    await page.waitForSelector("[data-testid='judge-next-turn-btn']", { timeout: 10000 });
    await page.click("[data-testid='judge-next-turn-btn']");

    await page.waitForURL("**/play/transify/results");
    await expect(page.getByTestId("judge-results-screen")).toBeVisible();

    const buf = await page.screenshot({ fullPage: true });
    saveFile(path.join(SCREENSHOT_DIR, "transify-results-te.png"), buf);
  });

  test("Offline replay test after first visit", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await setLang(page, "en");

    // First visit: loads and caches
    await page.goto(`${BASE}/play/transify`);
    await waitHydrated(page);

    // Warm up cards in cache
    await page.evaluate(async () => {
      await fetch("/cards/transify-movies.json");
    });

    // Disconnect network
    await page.context().setOffline(true);

    // Verify offline fetch of cached card JSON succeeds
    const cachedData = await page.evaluate(async () => {
      try {
        const res = await fetch("/cards/transify-movies.json");
        return await res.json();
      } catch {
        return null;
      }
    });
    expect(cachedData).toBeTruthy();
    expect(Array.isArray(cachedData)).toBe(true);
    expect(cachedData.length).toBe(30);

    // Restore online
    await page.context().setOffline(false);
  });
});
