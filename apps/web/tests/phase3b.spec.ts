/**
 * Phase 3b E2E: movie-only beta scope, Dumb Charades, Most Likely, polish.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { BASE, BETA_SLUGS, TELUGU_RE, bodyTextNoSwitch, setLang, waitHydrated } from "./helpers";

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
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Mayhem.");
    await expect(page.getByText("Beta · 7 games · Telugu cinema")).toBeVisible();
    const text = await bodyTextNoSwitch(page);
    expect(TELUGU_RE.test(text)).toBe(false);
  });

  test("Telugu tagline appears only in Telugu mode", async ({ page }) => {
    await setLang(page, "te");
    await page.goto(`${BASE}/`);
    await waitHydrated(page);
    await expect(page.getByText("మన సినిమా, మన సరదా, మన గ్యాంగ్")).toBeVisible();
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });
});

test.describe("Font direction A loading rules", () => {
  test("English mode never requests the Telugu font", async ({ page }) => {
    const fontUrls: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/fonts/")) fontUrls.push(r.url());
    });
    await setLang(page, "en");
    await page.goto(`${BASE}/play`);
    await waitHydrated(page);
    expect(fontUrls.filter((u) => /anek|noto/i.test(u))).toEqual([]);
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
