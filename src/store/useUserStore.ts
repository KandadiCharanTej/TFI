import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserPreferences {
  displayName: string;
  languageMode: 'telugu' | 'both'; // 'telugu' or 'both' (Telugu + English transliteration)
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  hasCompletedOnboarding: boolean;
}

interface UserState {
  preferences: UserPreferences;
  setDisplayName: (name: string) => void;
  setLanguageMode: (mode: 'telugu' | 'both') => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  completeOnboarding: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      preferences: {
        displayName: 'MegaFan_99',
        languageMode: 'both',
        soundEnabled: true,
        hapticsEnabled: true,
        hasCompletedOnboarding: false,
      },
      setDisplayName: (name: string) =>
        set((state) => ({
          preferences: { ...state.preferences, displayName: name || 'TFI Fan' },
        })),
      setLanguageMode: (mode) =>
        set((state) => ({
          preferences: { ...state.preferences, languageMode: mode },
        })),
      toggleSound: () =>
        set((state) => ({
          preferences: { ...state.preferences, soundEnabled: !state.preferences.soundEnabled },
        })),
      toggleHaptics: () =>
        set((state) => ({
          preferences: { ...state.preferences, hapticsEnabled: !state.preferences.hapticsEnabled },
        })),
      completeOnboarding: () =>
        set((state) => ({
          preferences: { ...state.preferences, hasCompletedOnboarding: true },
        })),
    }),
    {
      name: 'tfi-user-preferences',
    }
  )
);
