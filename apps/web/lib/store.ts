"use client";

import { create } from "zustand";
import { PREF_KEYS, readBoolPref, writeBoolPref } from "./prefs";

export interface PreferencesState {
  deviceName: string;
  soundEnabled: boolean;
  reducedMotion: boolean;
  fanVibe: string;
  setDeviceName: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setFanVibe: (vibe: string) => void;
  /** Load remembered choices from this device. Called once on the client. */
  hydrate: () => void;
}

export function getDefaultGuestName(): string {
  return "Guest Tiger";
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  deviceName: getDefaultGuestName(),
  soundEnabled: true,
  reducedMotion: false,
  fanVibe: "bhAAi",
  setDeviceName: (deviceName) => set({ deviceName }),
  setSoundEnabled: (soundEnabled) => {
    writeBoolPref(PREF_KEYS.sound, soundEnabled);
    set({ soundEnabled });
  },
  setReducedMotion: (reducedMotion) => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
    writeBoolPref(PREF_KEYS.reducedMotion, reducedMotion);
    set({ reducedMotion });
  },
  setFanVibe: (fanVibe) => set({ fanVibe }),
  hydrate: () => {
    const soundEnabled = readBoolPref(PREF_KEYS.sound, true);
    const reducedMotion = readBoolPref(PREF_KEYS.reducedMotion, false);
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
    set({ soundEnabled, reducedMotion });
  },
}));
