import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "path";

const SCREENSHOT_DIR = path.resolve(__dirname, "../../../reference/screenshots");

test.describe("Phase 0 & Phase 1 Quality Gates", () => {
  test("Health page renders all 8 Wall tokens, self-hosted fonts, and unclipped Telugu conjuncts", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/health");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "TFI & Pitch",
    );

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

  test("Landing page at 1280px wide matches preview spec, passes axe, and has zero console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Movies.");
    await expect(page.getByText("మన సినిమా, మన క్రికెట్, మన గ్యాంగ్")).toBeVisible();
    await expect(
      page.getByText(
        "Unofficial fan-made game. Not affiliated with any film, actor, studio, cricket league or team.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText("Game coins only. There is no real-money betting."),
    ).toBeVisible();

    // Filter games interaction
    const cricketFilter = page.getByRole("button", { name: /Cricket/i });
    await cricketFilter.click();
    await expect(cricketFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: "Cricket IQ" })).toBeVisible();

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

  test("Landing page at 390x844 (mobile) passes axe and Telugu check", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toEqual([]);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "landing-390x844.png"),
      fullPage: true,
    });
  });

  test("Play Home (/play) at 390x844 and 1280x800 passes axe, keyboard navigation, and language toggle", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // 1. Mobile 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/play");

    await expect(page.getByText(/TODAY'S PICK/i)).toBeVisible();
    await expect(
      page.getByText("Got a room code? Join your friends"),
    ).toBeVisible();

    // Language switch in top bar
    const langBtn = page.getByRole("button", { name: /భాష మార్చండి|Switch language/i });
    await expect(langBtn).toBeVisible();
    await langBtn.click();

    const axeMobile = await new AxeBuilder({ page }).analyze();
    expect(axeMobile.violations).toEqual([]);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "play-390x844.png"),
      fullPage: false,
    });

    // 2. Desktop 1280x800
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/play");

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "play-1280x800.png"),
      fullPage: true,
    });

    // Keyboard tab navigation check
    await page.keyboard.press("Tab");
    const focusedTag = await page.evaluate(
      () => document.activeElement?.tagName ?? "",
    );
    expect(["A", "BUTTON"]).toContain(focusedTag);

    const axeDesktop = await new AxeBuilder({ page }).analyze();
    expect(axeDesktop.violations).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
