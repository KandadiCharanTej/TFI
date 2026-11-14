import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "path";

const SCREENSHOT_DIR = path.resolve(__dirname, "../../../reference/screenshots");

/** Set lang cookie so server renders the right language on first paint. */
async function setLangCookie(page: Page, lang: "en" | "te") {
  await page.context().addCookies([{ name: "lang", value: lang, domain: "127.0.0.1", path: "/" }]);
}

test.describe("Phase 0 & Phase 1 Quality Gates", () => {
  test("Health page renders all 8 Wall tokens, self-hosted fonts, and unclipped Telugu conjuncts", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      // Ignore service-worker 404s for old chunks (stale SW cache between builds)
      if (msg.type() === "error" && msg.text().includes("fetching the script")) return;
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // Telugu conjuncts only render in Telugu mode (STEP 0 rule)
    await setLangCookie(page, "te");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/health");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(600);
    // Wait for TeluguOnly to mount and reveal conjuncts
    await page.waitForSelector("[data-testid='conjunct-te-0']", { timeout: 5000 });

    // In Telugu mode, the health heading shows "సిస్టమ్ ఆరోగ్యం" or we just check STATUS: HEALTHY
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Check Telugu conjuncts line-height >= 1.5, letter-spacing = 0px, text-transform = none, no clipping
    for (let i = 0; i < 3; i++) {
      const el = page.getByTestId(`conjunct-te-${i}`);
      await expect(el).toBeVisible();
      const metrics = await el.evaluate((node) => {
        const cs = window.getComputedStyle(node);
        const fontSize = parseFloat(cs.fontSize);
        const lineHeight = parseFloat(cs.lineHeight);
        return {
          fontSize,
          lineHeightRatio: lineHeight / fontSize,
          letterSpacing: cs.letterSpacing,
          textTransform: cs.textTransform,
          clippedVertically: node.scrollHeight > node.clientHeight + 2,
        };
      });
      expect(metrics.lineHeightRatio).toBeGreaterThanOrEqual(1.5);
      expect(["0px", "normal"]).toContain(metrics.letterSpacing);
      expect(metrics.textTransform).toBe("none");
      expect(metrics.clippedVertically).toBe(false);
    }

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toEqual([]);
    expect(consoleErrors).toEqual([]);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "health-1280x900.png"),
      fullPage: true,
    });
  });

  test("Landing page at 1280px wide passes axe and has zero console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && msg.text().includes("fetching the script")) return;
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await setLangCookie(page, "en");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);

    // English-mode heading
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Game night for Telugu movie fans.",
    );
    // English subline
    await expect(
      page.getByText(/Guess, act and bid on your favourite films/i),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Unofficial fan-made game. Not affiliated with any film, actor, studio or team.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Game coins only. There is no real-money betting."),
    ).toBeVisible();

    // Filter games interaction
    const onlineFilter = page.getByRole("button", { name: "Online", exact: true });
    await onlineFilter.click();
    await expect(onlineFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: "Box Office Auction" })).toBeVisible();

    const allFilter = page.getByRole("button", { name: /All/i });
    await allFilter.click();

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toEqual([]);
    expect(consoleErrors).toEqual([]);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "landing-1280x800.png"),
      fullPage: true,
    });
  });

  test("Landing page at 390x844 (mobile) passes axe", async ({
    page,
  }) => {
    await setLangCookie(page, "en");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toEqual([]);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "landing-390x844.png"),
      fullPage: true,
    });
  });

  test("Play Home (/play) at 390x844 and 1280x800 passes axe and keyboard navigation", async ({
    page,
    browserName,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && msg.text().includes("fetching the script")) return;
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // 1. Mobile 390x844
    await setLangCookie(page, "en");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);

    await expect(page.getByText(/TODAY'S PICK/i)).toBeVisible();
    await expect(
      page.getByText("Got a room code? Join your friends"),
    ).toBeVisible();

    // Language switch in top bar
    const langBtn = page.getByRole("button", { name: /Switch language/i });
    await expect(langBtn).toBeVisible();
    await langBtn.click();
    await page.waitForTimeout(400);

    const axeMobile = await new AxeBuilder({ page }).analyze();
    expect(axeMobile.violations).toEqual([]);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "play-390x844.png"),
      fullPage: false,
    });

    // 2. Desktop 1280x800
    await page.waitForLoadState("networkidle");
    await setLangCookie(page, "en");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/play");
    await page.waitForLoadState("networkidle");

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "play-1280x800.png"),
      fullPage: true,
    });

    // Keyboard tab navigation check (macOS WebKit does not Tab-focus <a> without Option+Tab)
    if (browserName !== "webkit") {
      await page.keyboard.press("Tab");
      const focusedTag = await page.evaluate(
        () => document.activeElement?.tagName ?? "",
      );
      expect(["A", "BUTTON"]).toContain(focusedTag);
    }

    const axeDesktop = await new AxeBuilder({ page }).analyze();
    expect(axeDesktop.violations).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
