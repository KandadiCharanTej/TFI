/**
 * Small device-only preferences (rule 4: nothing leaves the phone).
 * Every call is wrapped in try/catch because storage can be blocked.
 */
export const PREF_KEYS = {
  deviceName: "tfi.deviceName",
  sound: "tfi.sound",
  vibration: "tfi.vibration",
  reducedMotion: "tfi.reducedMotion",
  largeText: "tfi.largeText",
  headSetGoSetup: "tfi.hsg.setup",
} as const;

export function readStringPref(key: string, fallback: string): string {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw && raw.trim().length > 0) return raw;
  } catch {
    // Ignore
  }
  return fallback;
}

export function writeStringPref(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore
  }
}

export function readBoolPref(key: string, fallback: boolean): boolean {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === "1") return true;
    if (raw === "0") return false;
  } catch {
    // Storage blocked: use the fallback.
  }
  return fallback;
}

export function writeBoolPref(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // Storage blocked: the choice just will not be remembered.
  }
}

export function readJsonPref<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJsonPref(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore.
  }
}

/** True when the phone asks for less motion OR the user turned it on in Me. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  const osSetting =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return osSetting || document.documentElement.dataset.reducedMotion === "true";
}
