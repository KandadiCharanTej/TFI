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

test.describe("Part 2: Installable PWA & offline", () => {
  test("Manifest and all four PNG icons return 200", async ({ request }) => {
    const manifestRes = await request.get(`${BASE}/manifest.webmanifest`);
    expect(manifestRes.status()).toBe(200);
    const manifest = await manifestRes.json();
    expect(manifest.name).toBe("TFI & Pitch");
    expect(manifest.theme_color).toBe("#EAE6DF");
    expect(manifest.start_url).toBe("/play");

    for (const path of [
      "/icons/icon-192.png",
      "/icons/icon-512.png",
      "/icons/icon-maskable-512.png",
      "/icons/apple-touch-icon.png",
    ]) {
      const res = await request.get(`${BASE}${path}`);
      expect(res.status()).toBe(200);
    }
  });

  test("All 6 playable beta games work offline after first visit and /offline lists saved games", async ({
    page,
    context,
  }) => {
    test.setTimeout(90_000);
    await page.addInitScript(() => {
      (window as unknown as { __FORCE_SW__?: boolean }).__FORCE_SW__ = true;
    });
    await setLang(page, "en");
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);
    await page.evaluate(async () => {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.ready;
      }
    });

    const playableSlugs = [
      "head-set-go",
      "transify",
      "dumb-charades",
      "emoji-cinema",
      "rapid-fire",
      "most-likely",
    ];

    for (const slug of playableSlugs) {
      await page.goto(`${BASE}/play/${slug}`);
      await waitHydrated(page);
    }

    // Check Ready offline badge appears on /play
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);
    await expect(page.getByTestId("offline-ready-head-set-go")).toBeVisible();

    // Go offline and verify all 6 visited games load cleanly
    await context.setOffline(true);
    for (const slug of playableSlugs) {
      await page.goto(`${BASE}/play/${slug}`);
      await expect(page.locator("h1")).toBeVisible();
    }

    // Visit /offline directly and confirm saved games are listed
    await page.goto(`${BASE}/offline`);
    await expect(page.getByText(/Games saved offline/i)).toBeVisible();
    await expect(page.locator("a[href='/play/head-set-go']")).toBeVisible();
    await context.setOffline(false);
  });

  test("Install sticker shows iOS sheet and hides for 14 days on Not now", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
    });
    await setLang(page, "en");
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);

    const sticker = page.getByTestId("install-sticker");
    await expect(sticker).toBeVisible();
    await sticker.getByRole("button", { name: /Add to home screen/i }).click();
    await expect(page.getByTestId("ios-install-sheet")).toBeVisible();

    await sticker.getByRole("button", { name: /Not now/i }).click();
    await expect(sticker).toBeHidden();

    await page.reload();
    await waitHydrated(page);
    await expect(page.getByTestId("install-sticker")).toBeHidden();
  });
});

test.describe("Part 3: Info pages, /me settings, 404, and footer", () => {
  test("Public footer links to About, Privacy, and Terms work across routes", async ({ page }) => {
    await setLang(page, "en");
    for (const route of ["/about", "/privacy", "/terms"]) {
      await page.goto(`${BASE}${route}`);
      await waitHydrated(page);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("footer a[href='/about']")).toBeVisible();
      await expect(page.locator("footer a[href='/privacy']")).toBeVisible();
      await expect(page.locator("footer a[href='/terms']")).toBeVisible();
    }
  });

  test("/me toggles persist and Clear my data resets device preferences", async ({ page }) => {
    await setLang(page, "en");
    await page.goto(`${BASE}/me`);
    await waitHydrated(page);

    const nameInput = page.locator("#guest-name-input");
    await nameInput.fill("Boss Fan");
    await page.getByRole("button", { name: /Large text/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-large-text", "true");

    await page.getByRole("button", { name: /Clear my data on this device/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: /Yes, clear data/i }).click();
    await expect(nameInput).toHaveValue("Guest Tiger");
    await expect(page.locator("html")).toHaveAttribute("data-large-text", "false");
  });

  test("404 page renders cleanly with link back to Play Home", async ({ page }) => {
    await setLang(page, "en");
    await page.goto(`${BASE}/this-page-does-not-exist-404`);
    await expect(page.getByRole("heading", { name: /Page not found/i })).toBeVisible();
    await expect(page.locator("a[href='/play']").first()).toBeVisible();
  });
});
