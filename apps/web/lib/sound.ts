"use client";

import { isCalmActive, usePreferencesStore } from "./store";

export type PartySoundKind = "tap" | "correct" | "pass" | "clack" | "tick" | "win";

let audioCtx: AudioContext | null = null;
let unlockedByUser = false;

export function markUserAudioInteraction(): void {
  unlockedByUser = true;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || !unlockedByUser) return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume().catch(() => undefined);
  }
  return audioCtx;
}

function playTone(
  ctx: AudioContext,
  freqStart: number,
  freqEnd: number,
  durationSec: number,
  type: OscillatorType,
  gainPeak: number,
  delaySec = 0,
): void {
  const now = ctx.currentTime + delaySec;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, now);
  if (freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + durationSec);
  }
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durationSec + 0.02);
}

/**
 * Play a short synthesized Web Audio cue (zero audio files).
 * Respects first-user-interaction requirement, soundEnabled pref, and Calm mode.
 */
export function playPartySound(kind: PartySoundKind): void {
  if (typeof window === "undefined") return;
  const { soundEnabled } = usePreferencesStore.getState();
  if (!soundEnabled || isCalmActive()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    switch (kind) {
      case "tap":
        playTone(ctx, 440, 240, 0.04, "triangle", 0.06);
        break;
      case "correct":
        playTone(ctx, 523.25, 523.25, 0.09, "triangle", 0.09, 0);
        playTone(ctx, 783.99, 783.99, 0.14, "triangle", 0.1, 0.07);
        break;
      case "pass":
        playTone(ctx, 200, 130, 0.12, "sawtooth", 0.055);
        break;
      case "clack":
        playTone(ctx, 980, 180, 0.045, "square", 0.08);
        break;
      case "tick":
        playTone(ctx, 880, 880, 0.028, "sine", 0.05);
        break;
      case "win":
        playTone(ctx, 523.25, 523.25, 0.12, "triangle", 0.09, 0);
        playTone(ctx, 659.25, 659.25, 0.12, "triangle", 0.09, 0.09);
        playTone(ctx, 783.99, 783.99, 0.12, "triangle", 0.09, 0.18);
        playTone(ctx, 1046.5, 1046.5, 0.25, "triangle", 0.11, 0.27);
        break;
    }
  } catch {
    /* ignore blocked WebAudio context */
  }
}

export function triggerPartyHaptic(kind: "correct" | "pass" | "tap"): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  const { vibrationEnabled } = usePreferencesStore.getState();
  if (!vibrationEnabled || isCalmActive()) return;
  try {
    if (kind === "correct") navigator.vibrate(20);
    else if (kind === "pass") navigator.vibrate([12, 24, 12]);
    else navigator.vibrate(8);
  } catch {
    /* ignore */
  }
}
