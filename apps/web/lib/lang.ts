/**
 * LANGUAGE RULE (decided by the product owner on 13 Nov):
 * The app is ENGLISH ONLY by default. Telugu script appears ONLY when the
 * user switches to Telugu with the "తె / EN" switch. The choice lives in a
 * cookie named "lang" so the server renders the right language on first paint.
 *
 * This file is safe to import from server and client code (no React, no DOM).
 */
export type Lang = "en" | "te";

export const LANG_COOKIE = "lang";
export const DEFAULT_LANG: Lang = "en";

/** One year, in seconds. */
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseLang(value: string | undefined | null): Lang {
  return value === "te" ? "te" : DEFAULT_LANG;
}

/** Build the Set-Cookie style string used by `document.cookie`. */
export function buildLangCookie(lang: Lang): string {
  return `${LANG_COOKIE}=${lang}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/** Read the lang cookie out of a raw cookie header / document.cookie string. */
export function readLangFromCookieString(raw: string): Lang {
  for (const part of raw.split(";")) {
    const [name, value] = part.trim().split("=");
    if (name === LANG_COOKIE) return parseLang(value);
  }
  return DEFAULT_LANG;
}

/** A pair of strings, one per language. Every user-facing string is one of these. */
export interface Bi {
  readonly en: string;
  readonly te: string;
}

export function tr(lang: Lang, value: Bi): string {
  return value[lang];
}

/** Replace {name} placeholders, for example "{n} cards". */
export function fmt(template: string, values: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const found = values[key];
    return found === undefined ? match : String(found);
  });
}

/** Matches any character in the Telugu Unicode block (U+0C00 to U+0C7F). */
export const TELUGU_CHAR_PATTERN = /[\u0C00-\u0C7F]/;
