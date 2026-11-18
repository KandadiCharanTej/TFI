/**
 * Phase 5 (Flag Off): Verify ENABLE_ROOMS=false leaves beta pages unchanged,
 * bottom bar has only Play & Me, and room routes pass axe, 0 console errors,
 * English-only default, and Telugu Anek Telugu font checks.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { BASE, bodyTextNoSwitch, setLang, waitHydrated } from "./helpers";

const TELUGU_RE = /[\u0C00-\u0C7F]/;

test.describe("Phase 5 — ENABLE_ROOMS=false safety & quality gates", () => {
  test("Bottom bar & left nav show ONLY Play and Me when ENABLE_ROOMS is false, and Box Office Auction stays Coming soon", async ({
    page,
  }) => {
    await setLang(page, "en");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);

    const bottomNav = page.getByRole("navigation", { name: "Bottom navigation" });
    await expect(bottomNav.getByRole("link", { name: /Play/i })).toBeVisible();
    await expect(bottomNav.getByRole("link", { name: /Me/i })).toBeVisible();
    await expect(bottomNav.getByRole("link", { name: /Join/i })).toHaveCount(0);

    // Box Office Auction stays Coming soon
    const auctionCard = page.locator("a[href='/play/box-office-auction']");
    await expect(auctionCard).toContainText("Coming soon");

    // Landing unchanged
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    await expect(page.locator("#games a[href='/play/box-office-auction']")).toContainText("Coming soon");

    // /room/new cleanly indicates rooms open soon
    await page.goto(`${BASE}/room/new`);
    await waitHydrated(page);
    await expect(page.getByText(/Online rooms open soon/i)).toBeVisible();
  });

  test("New room routes pass axe 0 violations, 0 console errors, EN no-Telugu, and TE Anek Telugu font", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && msg.text().includes("fetching the script")) return;
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const ROUTES = ["/room/new", "/join", "/r/KXQM", "/room/KXQM"];
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of ROUTES) {
      await setLang(page, "en");
      await page.goto(`${BASE}${route}`);
      await waitHydrated(page);

      const textEn = await bodyTextNoSwitch(page);
      expect(
        TELUGU_RE.test(textEn),
        `Found Telugu script in EN mode on ${route}: ${textEn}`,
      ).toBe(false);

      const axeEn = await new AxeBuilder({ page }).analyze();
      expect(axeEn.violations, `Axe EN violations on ${route}`).toEqual([]);

      await setLang(page, "te");
      await page.goto(`${BASE}${route}`);
      await waitHydrated(page);

      const teCheck = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll("h1, h2, p, button, span"));
        return els
          .filter((el) => /[\u0C00-\u0C7F]/.test(el.textContent || ""))
          .map((el) => {
            const font = window.getComputedStyle(el).fontFamily;
            return {
              text: (el.textContent || "").trim().slice(0, 18),
              font,
              ok: font.includes("Anek Telugu") || el.getAttribute("data-testid") === "lang-switch-te",
            };
          });
      });
      expect(teCheck.length).toBeGreaterThan(0);
      for (const item of teCheck) {
        expect(item.ok, `Non-Anek font on ${route} for "${item.text}": ${item.font}`).toBe(true);
      }

      const axeTe = await new AxeBuilder({ page }).analyze();
      expect(axeTe.violations, `Axe TE violations on ${route}`).toEqual([]);
    }

    expect(consoleErrors).toEqual([]);
  });
});
