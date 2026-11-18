/**
 * Phase 5 (Flag On + Live PartyKit): 3-browser-context Online Rooms E2E
 * - ENABLE_ROOMS=true adds Join to bottom/side navigation
 * - Host creates room -> P2 joins via 4-letter code boxes -> P3 joins via /r/[code] invite link
 * - Wrong code returns clear error + next step
 * - P2 refreshes and keeps exact same seat
 * - Host removes P3 -> P3 sees Removed screen
 * - Host leaves -> P2 automatically becomes Host (longest-connected)
 * - New guest P4 joins -> New Host (P2) starts Ready check -> both tap Ready -> countdown completes
 * - Axe 0 violations & 0 console errors on enabled room screens
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";

const DESIGN_V4_DIR = path.resolve(process.cwd(), "../../reference/design-v4");
const DESIGN_V5_DIR = path.resolve(process.cwd(), "../../reference/design-v5");

function saveV4Shot(name: string, buf: Buffer) {
  fs.mkdirSync(DESIGN_V4_DIR, { recursive: true });
  fs.writeFileSync(path.join(DESIGN_V4_DIR, name), buf);
}

function saveV5Shot(name: string, buf: Buffer) {
  fs.mkdirSync(DESIGN_V5_DIR, { recursive: true });
  fs.writeFileSync(path.join(DESIGN_V5_DIR, name), buf);
}

const BASE = "http://127.0.0.1:3102";

test.describe("Phase 5 — Live PartyKit Online Rooms (3+ Browser Contexts)", () => {
  test("Full multi-phone room lifecycle: create, join by code & link, refresh seat, remove, host handover, Ready check", async ({
    browser,
    browserName,
  }) => {
    test.setTimeout(90_000);

    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();
    const ctx3 = await browser.newContext();
    const ctx4 = await browser.newContext();

    const p1 = await ctx1.newPage();
    const p2 = await ctx2.newPage();
    const p3 = await ctx3.newPage();
    const p4 = await ctx4.newPage();

    const consoleErrors: string[] = [];
    for (const pg of [p1, p2, p3, p4]) {
      pg.on("console", (msg) => {
        if (msg.type() === "error" && msg.text().includes("fetching the script")) return;
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
    }

    try {
      // 1. ENABLE_ROOMS=true shows Join in navigation & keeps Box Office Auction Coming soon
      await p1.goto(`${BASE}/play`);
      await p1.waitForLoadState("networkidle");
      await expect(p1.locator("a[href='/join']:visible").first()).toBeVisible();
      await expect(p1.locator("a[href='/play/box-office-auction']")).toContainText("Coming soon");

      // 2. Host (p1 = "Arjun") creates a Ready check room at /room/new
      await p1.goto(`${BASE}/room/new`);
      await p1.waitForLoadState("networkidle");
      const axeNew = await new AxeBuilder({ page: p1 }).analyze();
      expect(axeNew.violations).toEqual([]);

      await p1.getByTestId("room-host-name").fill("Arjun");
      await p1.getByTestId("create-room-btn").click();
      await p1.waitForURL("**/room/**");

      const code = (await p1.getByTestId("room-code-display").innerText()).trim();
      expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/);
      await expect(p1.getByTestId("host-badge")).toBeVisible();
      await expect(p1.getByTestId("room-player-list")).toContainText("Arjun");

      const axeLobby = await new AxeBuilder({ page: p1 }).analyze();
      expect(axeLobby.violations).toEqual([]);

      // 3. Player 2 (p2 = "Bala") tries an invalid code at /join -> gets clear error -> enters valid code via 4 boxes
      await p2.goto(`${BASE}/join`);
      await p2.waitForLoadState("networkidle");
      const axeJoin = await new AxeBuilder({ page: p2 }).analyze();
      expect(axeJoin.violations).toEqual([]);

      for (let i = 0; i < 4; i++) {
        await p2.getByTestId(`join-code-${i}`).fill("Z");
      }
      await p2.getByTestId("join-name-input").fill("Bala");
      await p2.getByTestId("join-submit-btn").click();
      await expect(p2.getByTestId("join-error-box")).toContainText("Room not found");

      for (let i = 0; i < 4; i++) {
        await p2.getByTestId(`join-code-${i}`).fill(code[i]!);
      }
      await p2.getByTestId("join-submit-btn").click();
      await p2.waitForURL(`**/room/${code}`);
      await expect(p2.getByTestId("waiting-for-host")).toBeVisible();
      await expect(p1.getByTestId("room-player-list")).toContainText("Bala");

      // 4. Player 3 (p3 = "Charan") joins via invite link /r/[code]
      await p3.goto(`${BASE}/r/${code}`);
      await p3.waitForLoadState("networkidle");
      const axeInvite = await new AxeBuilder({ page: p3 }).analyze();
      expect(axeInvite.violations).toEqual([]);

      await p3.getByTestId("invite-name-input").fill("Charan");
      await p3.getByTestId("invite-join-btn").click();
      await p3.waitForURL(`**/room/${code}`);
      await expect(p1.getByTestId("room-player-list")).toContainText("Charan");
      await expect(p1.getByTestId("room-player-list").locator("li")).toHaveCount(3);

      // Capture Design V4 & V5 live lobby screenshots (EN & TE at 390x844) once on Chromium
      if (browserName === "chromium") {
        await p1.setViewportSize({ width: 390, height: 844 });
        await p1.waitForTimeout(250);
        const enBuf = await p1.screenshot({ fullPage: true });
        saveV4Shot("after-lobby-390x844-en.png", enBuf);
        saveV5Shot("lobby-390x844-en.png", enBuf);
        await p1.getByTestId("lang-switch-te").click();
        await p1.waitForTimeout(300);
        const teBuf = await p1.screenshot({ fullPage: true });
        saveV4Shot("after-lobby-390x844-te.png", teBuf);
        saveV5Shot("lobby-390x844-te.png", teBuf);
        await p1.getByTestId("lang-switch-en").click();
        await p1.waitForTimeout(200);
        await p1.setViewportSize({ width: 1280, height: 720 });
      }

      // 5. Player 2 (Bala) refreshes and keeps the exact same seat
      const balaRowId = await p2
        .getByTestId("room-player-list")
        .locator("li", { hasText: "Bala" })
        .getAttribute("data-testid");
      await p2.reload();
      await p2.waitForLoadState("domcontentloaded");
      await expect(p2.getByTestId(balaRowId!)).toContainText("Bala", { timeout: 10000 });
      await expect(p2.getByTestId("room-player-list").locator("li")).toHaveCount(3);

      // 6. Host (Arjun) removes Player 3 (Charan)
      const charanTestId = await p1
        .getByTestId("room-player-list")
        .locator("li", { hasText: "Charan" })
        .getAttribute("data-testid");
      const charanId = charanTestId!.replace("player-row-", "");
      await p1.getByTestId(`remove-player-${charanId}`).click();
      await expect(p3.getByTestId("room-removed-screen")).toBeVisible({ timeout: 5000 });
      await expect(p1.getByTestId("room-player-list").locator("li")).toHaveCount(2);

      // 7. Host (Arjun) leaves -> Player 2 (Bala) automatically becomes Host!
      await p1.getByTestId("room-leave-btn").click();
      await expect(p2.getByTestId("host-badge")).toBeVisible({ timeout: 5000 });
      await expect(p2.getByTestId("room-start-btn")).toBeVisible();

      // 8. Player 4 (Divya) joins via /r/[code], and new Host (Bala) starts Ready check!
      await p4.goto(`${BASE}/r/${code}`);
      await expect(p4.getByTestId("invite-name-input")).toBeVisible({ timeout: 10000 });
      await p4.getByTestId("invite-name-input").fill("Divya");
      await p4.getByTestId("invite-join-btn").click();
      await p4.waitForURL(`**/room/${code}`, { timeout: 10000 });
      await expect(p2.getByTestId("room-player-list").locator("li")).toHaveCount(2, { timeout: 10000 });

      await p2.getByTestId("room-start-btn").click({ timeout: 10000 });
      await expect(p2.getByTestId("ready-check-panel")).toBeVisible({ timeout: 10000 });
      await expect(p4.getByTestId("ready-check-panel")).toBeVisible({ timeout: 10000 });

      await p2.getByTestId("ready-check-btn").click({ timeout: 10000 });
      await p4.getByTestId("ready-check-btn").click({ timeout: 10000 });

      await expect(p2.getByTestId("ready-done")).toBeVisible({ timeout: 8000 });
      await expect(p4.getByTestId("ready-done")).toBeVisible({ timeout: 8000 });

      expect(consoleErrors).toEqual([]);
    } finally {
      await ctx1.close();
      await ctx2.close();
      await ctx3.close();
      await ctx4.close();
    }
  });
});
