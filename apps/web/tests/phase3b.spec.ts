/**
 * Phase 3b E2E: movie-only beta scope, Dumb Charades, Most Likely, polish.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { BASE, BETA_SLUGS, TELUGU_RE, bodyTextNoSwitch, saveShot, setLang, waitHydrated } from "./helpers";

test.describe("Beta scope: movie games only (flag off)", () => {
  const PAGES = ["/", "/play", "/about", "/privacy", "/terms", "/join", "/me", "/health"];

  for (const route of PAGES) {
    test(`no cricket text on ${route}`, async ({ page }) => {
      await setLang(page, "en");
      await page.goto(`${BASE}${route}`);
      await waitHydrated(page);
      const text = (await bodyTextNoSwitch(page)).toLowerCase();
      expect(text).not.toContain("cricket");
      expect(text).not.toContain("dream xi");
      const html = (await page.content()).toLowerCase();
      expect(html).not.toContain("<title>tfi & pitch | our movies. our cricket");
    });
  }

  test("Play home lists exactly the 7 beta games and no cricket", async ({ page }) => {
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);
    for (const name of ["Head Set Go", "Transify", "Dumb Charades", "Emoji Cinema", "Box Office Auction", "Rapid Fire", "Most Likely"]) {
      await expect(page.getByRole("link", { name: new RegExp(name) }).first()).toBeVisible();
    }
    await expect(page.locator("a[href='/play/cricket-iq']")).toHaveCount(0);
    await expect(page.locator("a[href='/play/cricket-auction']")).toHaveCount(0);
    await expect(page.locator("a[href='/play/dream-xi-challenge']")).toHaveCount(0);
  });

  test("hidden games return 404 and the sitemap lists only beta games", async ({ request }) => {
    const hidden = await request.get(`${BASE}/play/cricket-iq`);
    expect(hidden.status()).toBe(404);
    const sm = await request.get(`${BASE}/sitemap.xml`);
    expect(sm.status()).toBe(200);
    const xml = await sm.text();
    for (const slug of BETA_SLUGS) expect(xml).toContain(`/play/${slug}`);
    expect(xml).not.toContain("cricket");
    expect(xml).not.toContain("dream-xi");
  });

  test("mode filter chips replace the category chips", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    for (const name of ["All", "One phone", "Online"]) {
      await expect(page.getByRole("button", { name, exact: true }).first()).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Cinema", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Party", exact: true })).toHaveCount(0);
  });

  test("new hero copy and pill (English)", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Game night for Telugu movie fans.",
    );
    await expect(page.getByText("Free · No sign-up · Works offline")).toBeVisible();
    const text = await bodyTextNoSwitch(page);
    expect(TELUGU_RE.test(text)).toBe(false);
  });

  test("Telugu tagline appears only in Telugu mode", async ({ page }) => {
    await setLang(page, "te");
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "తెలుగు సినిమా ఫ్యాన్స్‌కు గేమ్ నైట్.",
      }),
    ).toBeVisible();
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });
});

test.describe("Font direction A loading rules", () => {
  test("English mode never requests the full Telugu font (only the <3KB switch subset)", async ({
    page,
  }) => {
    const fontUrls: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/fonts/")) fontUrls.push(r.url());
    });
    await setLang(page, "en");
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);
    const fullTeluguRequests = fontUrls.filter(
      (u) => /anek|noto/i.test(u) && !u.includes("anek-telugu-switch"),
    );
    expect(fullTeluguRequests).toEqual([]);
  });

  test("Telugu mode loads only Anek Telugu, under 250 KB", async ({ page }) => {
    const sizes: Record<string, number> = {};
    page.on("response", async (r) => {
      const u = r.url();
      if (u.includes("/fonts/")) {
        const body = await r.body().catch(() => Buffer.alloc(0));
        sizes[u] = body.length;
      }
    });
    await setLang(page, "te");
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);
    const names = Object.keys(sizes);
    expect(names.some((u) => u.includes("anek-telugu"))).toBe(true);
    expect(names.some((u) => /noto/i.test(u))).toBe(false);
    const teluguBytes = names
      .filter((u) => u.includes("anek-telugu"))
      .reduce((sum, u) => sum + (sizes[u] ?? 0), 0);
    expect(teluguBytes).toBeLessThan(250 * 1024);
  });
});

test.describe("Phase 3b games: Dumb Charades, Most Likely, Rapid Fire, & Offline", () => {
  test("Dumb Charades setup, round flow, shutter reveal, and axe check", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await setLang(page, "en");
    await page.goto(`${BASE}/play/dumb-charades`);
    await waitHydrated(page);
    await saveShot("phase3b-charades-setup.png", await page.screenshot());

    const axeSetup = await new AxeBuilder({ page }).analyze();
    expect(axeSetup.violations).toEqual([]);

    await page.getByTestId("charades-start-btn").click();
    await page.waitForURL("**/play/dumb-charades/round");

    // Dismiss How-To-Play dialog
    await expect(page.getByTestId("charades-howto-dialog")).toBeVisible();
    await page.getByTestId("charades-howto-ok").click();

    await expect(page.getByTestId("charades-passing-screen")).toBeVisible();
    await saveShot("phase3b-charades-round.png", await page.screenshot());

    // Press and hold shutter to reveal card, then start acting
    const shutter = page.getByTestId("charades-shutter-btn");
    await shutter.dispatchEvent("pointerdown");
    await expect(page.getByTestId("charades-revealed-title")).toBeVisible();
    await page.getByTestId("charades-start-acting-btn").click();

    await expect(page.getByTestId("charades-acting-screen")).toBeVisible();
    await page.getByTestId("charades-got-it-btn").click();
    await expect(page.getByTestId("charades-turn-end")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("Most Likely setup, privacy shield, self-vote block, reveal, and axe check", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await setLang(page, "en");
    await page.goto(`${BASE}/play/most-likely`);
    await waitHydrated(page);
    await saveShot("phase3b-most-likely-setup.png", await page.screenshot());

    const axeSetup = await new AxeBuilder({ page }).analyze();
    expect(axeSetup.violations).toEqual([]);

    await page.getByTestId("vote-start-btn").click();
    await page.waitForURL("**/play/most-likely/round");
    await page.getByTestId("vote-howto-ok").click();

    await expect(page.getByTestId("vote-privacy-screen")).toBeVisible();
    await saveShot("phase3b-most-likely-round.png", await page.screenshot());

    // 3 players vote on prompt 1
    await page.getByTestId("vote-ready-btn").click();
    await expect(page.getByTestId("vote-voting-screen")).toBeVisible();
    // Self-vote button p1 must be disabled
    await expect(page.getByTestId("vote-target-p1")).toBeDisabled();
    await page.getByTestId("vote-target-p2").click();

    await page.getByTestId("vote-ready-btn").click();
    await expect(page.getByTestId("vote-target-p2")).toBeDisabled();
    await page.getByTestId("vote-target-p3").click();

    await page.getByTestId("vote-ready-btn").click();
    await expect(page.getByTestId("vote-target-p3")).toBeDisabled();
    await page.getByTestId("vote-target-p2").click();

    // 4th player votes
    await page.getByTestId("vote-ready-btn").click();
    await expect(page.getByTestId("vote-target-p4")).toBeDisabled();
    await page.getByTestId("vote-target-p1").click();

    await expect(page.getByTestId("vote-reveal-screen")).toBeVisible();
    await expect(page.getByTestId("vote-prompt-winner")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("Rapid Fire movie edition has zero cricket text", async ({ page }) => {
    await setLang(page, "en");
    await page.goto(`${BASE}/play/rapid-fire`);
    await waitHydrated(page);
    const text = await bodyTextNoSwitch(page);
    expect(text.toLowerCase()).not.toContain("cricket");
    expect(text.toLowerCase()).not.toContain("ipl");
  });

  test("Offline replay works for Dumb Charades and Most Likely", async ({ page, context }) => {
    await setLang(page, "en");
    await page.goto(`${BASE}/play/dumb-charades`);
    await waitHydrated(page);
    await page.evaluate(() => navigator.serviceWorker?.ready);
    await page.reload();
    await waitHydrated(page);
    await page.goto(`${BASE}/play/most-likely`);
    await waitHydrated(page);

    await context.setOffline(true);
    await page.goto(`${BASE}/play/dumb-charades`);
    await expect(page.getByTestId("charades-start-btn")).toBeVisible();
    await page.goto(`${BASE}/play/most-likely`);
    await expect(page.getByTestId("vote-start-btn")).toBeVisible();
    await context.setOffline(false);
  });

  test("Axe 0 violations & 0 console errors across beta setup routes", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await setLang(page, "en");
    for (const slug of BETA_SLUGS) {
      await page.goto(`${BASE}/play/${slug}`);
      await waitHydrated(page);
      const axe = await new AxeBuilder({ page }).analyze();
      expect(axe.violations, `Axe violations on /play/${slug}`).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
});
