import type { Page } from "@playwright/test";
import fs from "fs";
import path from "path";

export const BASE = "http://127.0.0.1:3100";
export const TELUGU_RE = /[\u0C00-\u0C7F]/;
export const SHOTS = path.resolve(process.cwd(), "../../reference/screenshots");

export const BETA_SLUGS = [
  "head-set-go",
  "transify",
  "dumb-charades",
  "emoji-cinema",
  "box-office-auction",
  "rapid-fire",
  "most-likely",
] as const;

export async function setLang(page: Page, lang: "en" | "te") {
  await page.context().addCookies([{ name: "lang", value: lang, domain: "127.0.0.1", path: "/" }]);
}

export async function bodyTextNoSwitch(page: Page): Promise<string> {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-testid='lang-switch']").forEach((el) => el.remove());
    clone.querySelectorAll("[data-testid='bilingual-demo']").forEach((el) => el.remove());
    clone.querySelectorAll("script,style").forEach((el) => el.remove());
    return clone.innerText;
  });
}

export async function waitHydrated(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
}

export function saveShot(name: string, buf: Buffer) {
  fs.mkdirSync(SHOTS, { recursive: true });
  fs.writeFileSync(path.join(SHOTS, name), buf);
}
