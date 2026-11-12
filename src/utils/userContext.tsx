'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, FanIdentity, LanguagePref } from '@/types';
import { soundManager } from './audio';

interface UserContextType {
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  setFanIdentity: (fan: FanIdentity) => void;
  setLanguagePref: (lang: LanguagePref) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  isLoaded: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_' + Math.random().toString(36).substring(2, 9),
  name: 'TFI Fan',
  fanIdentity: 'bhAAi',
  languagePref: 'te-en',
  soundEnabled: true,
  hapticsEnabled: true,
  gamesPlayed: 0,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tfi_pitch_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        soundManager.setEnabled(parsed.soundEnabled ?? true);
      } else {
        localStorage.setItem('tfi_pitch_user_profile', JSON.stringify(DEFAULT_PROFILE));
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem('tfi_pitch_user_profile', JSON.stringify(updated));
      } catch {}
      if (typeof partial.soundEnabled === 'boolean') {
        soundManager.setEnabled(partial.soundEnabled);
      }
      return updated;
    });
  };

  const setFanIdentity = (fanIdentity: FanIdentity) => {
    updateProfile({ fanIdentity });
  };

  const setLanguagePref = (languagePref: LanguagePref) => {
    updateProfile({ languagePref });
  };

  const toggleSound = () => {
    const nextVal = !profile.soundEnabled;
    updateProfile({ soundEnabled: nextVal });
    soundManager.setEnabled(nextVal);
    if (nextVal) soundManager.playClick();
  };

  const toggleHaptics = () => {
    updateProfile({ hapticsEnabled: !profile.hapticsEnabled });
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        setFanIdentity,
        setLanguagePref,
        toggleSound,
        toggleHaptics,
        isLoaded,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
