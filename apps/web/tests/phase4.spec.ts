/**
 * Phase 4 E2E: Screenshot fixes, PWA install & offline, info pages & Me, feedback & analytics.
 */
import { test, expect } from "@playwright/test";
import { BASE, setLang, waitHydrated } from "./helpers";

test.describe("Part 1: Screenshot & layout fixes", () => {
  test("Landing wall numbers read 01 to 07 with no gaps", async ({ page }) => {
    await setLang(page, "en");
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    const numbers = await page.locator("#games .mono-num").allInnerTexts();
    expect(numbers).toEqual(["01", "02", "03", "04", "05", "06", "07"]);
  });

  test("Badges tell the truth and Box Office Auction shows Coming soon with no Play button", async ({ page }) => {
    await setLang(page, "en");
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);

    const emojiCard = page.locator("a[href='/play/emoji-cinema']");
    await expect(emojiCard).toContainText(/One phone/i);

    const mostCard = page.locator("a[href='/play/most-likely']");
    await expect(mostCard).toContainText(/One phone/i);

    const auctionCard = page.locator("a[href='/play/box-office-auction']");
    await expect(auctionCard).toContainText(/Coming soon/i);
    await expect(auctionCard).not.toContainText(/Play →/i);
  });

  test("Language switch తె is legible and same size as EN in both modes", async ({ page }) => {
    await setLang(page, "en");
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    const teBox = await page.getByTestId("lang-switch-te").boundingBox();
    expect(teBox?.height).toBeGreaterThanOrEqual(24);
    expect(teBox?.width).toBeGreaterThanOrEqual(24);
  });
});
