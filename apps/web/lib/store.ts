"use client";

import { create } from "zustand";
import type { Locale } from "./i18n";

export interface PreferencesState {
  locale: Locale;
  deviceName: string;
  soundEnabled: boolean;
  reducedMotion: boolean;
  fanVibe: string;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setDeviceName: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setFanVibe: (vibe: string) => void;
}

const GUEST_ANIMALS = [
  "Guest Tiger",
  "Guest Falcon",
  "Guest Panther",
  "Guest Cobra",
  "Guest Lion",
  "Guest Stallion",
] as const;

export function getDefaultGuestName(): string {
  return GUEST_ANIMALS[0];
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  locale: "te",
  deviceName: getDefaultGuestName(),
  soundEnabled: true,
  reducedMotion: false,
  fanVibe: "bhAAi",
  setLocale: (locale) => set({ locale }),
  toggleLocale: () =>
    set((state) => ({
      locale: state.locale === "te" ? "en" : "te",
    })),
  setDeviceName: (deviceName) => set({ deviceName }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setReducedMotion: (reducedMotion) => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.reducedMotion = String(reducedMotion);
    }
    set({ reducedMotion });
  },
  setFanVibe: (fanVibe) => set({ fanVibe }),
}));
