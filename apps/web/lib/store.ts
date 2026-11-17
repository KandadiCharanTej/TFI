"use client";

import { create } from "zustand";
import {
  PREF_KEYS,
  readBoolPref,
  readStringPref,
  writeBoolPref,
  writeStringPref,
} from "./prefs";

export interface PreferencesState {
  deviceName: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reducedMotion: boolean;
  osReducedMotion: boolean;
  largeText: boolean;
  fanVibe: string;
  setDeviceName: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setLargeText: (large: boolean) => void;
  setFanVibe: (vibe: string) => void;
  clearDeviceData: () => void;
  /** Load remembered choices and subscribe to OS reduced-motion. */
  hydrate: () => void;
}

export function getDefaultGuestName(): string {
  return "Guest Tiger";
}

export function getOsReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function syncDocumentMotionFlag(userCalm: boolean, osReduce: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.reducedMotion = String(Boolean(userCalm || osReduce));
}

export function isCalmActive(): boolean {
  if (typeof window === "undefined") return false;
  const state = usePreferencesStore.getState();
  return state.reducedMotion || state.osReducedMotion || getOsReducedMotion();
}

let osMediaBound = false;

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  deviceName: getDefaultGuestName(),
  soundEnabled: true,
  vibrationEnabled: true,
  reducedMotion: false,
  osReducedMotion: false,
  largeText: false,
  fanVibe: "bhAAi",
  setDeviceName: (deviceName) => {
    writeStringPref(PREF_KEYS.deviceName, deviceName);
    set({ deviceName });
  },
  setSoundEnabled: (soundEnabled) => {
    writeBoolPref(PREF_KEYS.sound, soundEnabled);
    set({ soundEnabled });
  },
  setVibrationEnabled: (vibrationEnabled) => {
    writeBoolPref(PREF_KEYS.vibration, vibrationEnabled);
    set({ vibrationEnabled });
  },
  setReducedMotion: (reducedMotion) => {
    syncDocumentMotionFlag(reducedMotion, get().osReducedMotion);
    writeBoolPref(PREF_KEYS.reducedMotion, reducedMotion);
    set({ reducedMotion });
  },
  setLargeText: (largeText) => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.largeText = String(largeText);
    }
    writeBoolPref(PREF_KEYS.largeText, largeText);
    set({ largeText });
  },
  setFanVibe: (fanVibe) => set({ fanVibe }),
  clearDeviceData: () => {
    try {
      window.localStorage.clear();
    } catch {
      // Ignore storage errors
    }
    const osReduced = getOsReducedMotion();
    syncDocumentMotionFlag(osReduced, osReduced);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.largeText = "false";
    }
    set({
      deviceName: getDefaultGuestName(),
      soundEnabled: true,
      vibrationEnabled: true,
      reducedMotion: osReduced,
      osReducedMotion: osReduced,
      largeText: false,
      fanVibe: "bhAAi",
    });
  },
  hydrate: () => {
    const deviceName = readStringPref(PREF_KEYS.deviceName, getDefaultGuestName());
    const soundEnabled = readBoolPref(PREF_KEYS.sound, true);
    const vibrationEnabled = readBoolPref(PREF_KEYS.vibration, true);
    const osReducedMotion = getOsReducedMotion();
    const reducedMotion = readBoolPref(PREF_KEYS.reducedMotion, osReducedMotion);
    const largeText = readBoolPref(PREF_KEYS.largeText, false);
    syncDocumentMotionFlag(reducedMotion, osReducedMotion);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.largeText = String(largeText);
    }
    set({
      deviceName,
      soundEnabled,
      vibrationEnabled,
      reducedMotion,
      osReducedMotion,
      largeText,
    });

    if (!osMediaBound && typeof window !== "undefined" && window.matchMedia) {
      osMediaBound = true;
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      const onChange = (e: MediaQueryListEvent) => {
        const nextOs = e.matches;
        syncDocumentMotionFlag(get().reducedMotion, nextOs);
        set({ osReducedMotion: nextOs });
      };
      mql.addEventListener?.("change", onChange);
    }
  },
}));
