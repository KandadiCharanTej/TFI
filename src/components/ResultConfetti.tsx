'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '@/utils/audio';

export function fireCelebrationConfetti() {
  soundManager.playFanfare();
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F6BE18', '#EC1276', '#141313', '#00C853', '#00E5FF'],
    });
  } catch {}
}

export function ResultConfetti() {
  useEffect(() => {
    fireCelebrationConfetti();
  }, []);

  return null;
}

