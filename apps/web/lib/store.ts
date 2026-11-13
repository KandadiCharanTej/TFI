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
  largeText: boolean;
  fanVibe: string;
  setDeviceName: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setLargeText: (large: boolean) => void;
  setFanVibe: (vibe: string) => void;
  clearDeviceData: () => void;
  /** Load remembered choices from this device. Called once on the client. */
  hydrate: () => void;
}

export function getDefaultGuestName(): string {
  return "Guest Tiger";
}

function getOsReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  deviceName: getDefaultGuestName(),
  soundEnabled: true,
  vibrationEnabled: true,
  reducedMotion: false,
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
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
    writeBoolPref(PREF_KEYS.reducedMotion, reducedMotion);
    set({ reducedMotion });
  },
  setLargeText: (largeText) => {
    document.documentElement.dataset.largeText = String(largeText);
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
    document.documentElement.dataset.reducedMotion = String(osReduced);
    document.documentElement.dataset.largeText = "false";
    set({
      deviceName: getDefaultGuestName(),
      soundEnabled: true,
      vibrationEnabled: true,
      reducedMotion: osReduced,
      largeText: false,
      fanVibe: "bhAAi",
    });
  },
  hydrate: () => {
    const deviceName = readStringPref(PREF_KEYS.deviceName, getDefaultGuestName());
    const soundEnabled = readBoolPref(PREF_KEYS.sound, true);
    const vibrationEnabled = readBoolPref(PREF_KEYS.vibration, true);
    const reducedMotion = readBoolPref(PREF_KEYS.reducedMotion, getOsReducedMotion());
    const largeText = readBoolPref(PREF_KEYS.largeText, false);
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
    document.documentElement.dataset.largeText = String(largeText);
    set({ deviceName, soundEnabled, vibrationEnabled, reducedMotion, largeText });
  },
}));
