"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  DoodleBolt,
  DoodleClapper,
  DoodleDotColumn,
  DoodleFilmStrip,
  DoodleMegaphone,
  DoodleSmiley,
  DoodleStar,
  DoodleTicket,
  DoodleX,
} from "./doodle-kit";
import { markUserAudioInteraction, playPartySound } from "@/lib/sound";
import { isCalmActive, usePreferencesStore } from "@/lib/store";

const ConfettiBurst = dynamic(
  () => import("./confetti-burst").then((m) => m.ConfettiBurst),
  { ssr: false },
);

export interface HeroDoodlesProps {
  /** Increments on demo "Correct!" to flash the bolt. */
  readonly correctPulse?: number;
  /** Increments on demo "Pass" to shake the magenta X. */
  readonly passShake?: number;
}

/**
 * Street-poster party doodle backdrop layer (Phase 5c):
 * - Phones (<768px): 5 doodles (cropped magenta XL X, white star, bolt, small ink star, dot column).
 * - Tablet (768-1279px): +3 doodles (white XL X on bottom-right yellow slab, clapper, megaphone) = 8.
 * - Desktop (1280px+): +4 doodles (interactive smiley, 56px ink X, film strip, ticket stub) = 12.
 * - Lazy-started after first paint; auto-downgrades on low-memory devices; stops all motion in Calm mode.
 */
export function HeroDoodles({ correctPulse = 0, passShake = 0 }: HeroDoodlesProps) {
  const calm = usePreferencesStore((s) => s.reducedMotion || s.osReducedMotion);
  const [ready, setReady] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [smileyWink, setSmileyWink] = useState(false);
  const [smileyTaps, setSmileyTaps] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [boltFlash, setBoltFlash] = useState(false);
  const [xShake, setXShake] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);

  // Lazy-start animations & desktop pointer parallax after first paint
  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      if (typeof mem === "number" && mem <= 2) {
        setLowPower(true);
        document.documentElement.dataset.lowPower = "true";
      }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!ready || calm || lowPower || isCalmActive()) return;
    if (!window.matchMedia?.("(pointer: fine)").matches) return;

    const layerEl = layerRef.current;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 12;
      const dy = (e.clientY / window.innerHeight - 0.5) * 12;
      frame = window.requestAnimationFrame(() => {
        if (layerEl) {
          layerEl.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
        }
        frame = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
      if (layerEl) layerEl.style.transform = "";
    };
  }, [ready, calm, lowPower]);

  // Demo interactions: Correct -> bolt flash; Pass -> magenta X shake
  useEffect(() => {
    if (correctPulse <= 0 || calm || lowPower || isCalmActive()) return;
    setBoltFlash(true);
    const id = window.setTimeout(() => setBoltFlash(false), 380);
    return () => window.clearTimeout(id);
  }, [correctPulse, calm, lowPower]);

  useEffect(() => {
    if (passShake <= 0 || calm || lowPower || isCalmActive()) return;
    setXShake(true);
    const id = window.setTimeout(() => setXShake(false), 260);
    return () => window.clearTimeout(id);
  }, [passShake, calm, lowPower]);

  const handleSmileyTap = () => {
    markUserAudioInteraction();
    playPartySound("tap");
    setSmileyWink(true);
    window.setTimeout(() => setSmileyWink(false), 600);
    const next = smileyTaps + 1;
    setSmileyTaps(next);
    if (next >= 5) {
      setSmileyTaps(0);
      setConfettiTrigger((c) => c + 1);
      playPartySound("clack");
    }
  };

  const animReady = ready && !calm && !lowPower;

  return (
    <>
      <ConfettiBurst trigger={confettiTrigger} />

      <div
        ref={layerRef}
        data-doodle-layer="true"
        className={`pointer-events-none absolute inset-0 z-[2] overflow-hidden transition-opacity duration-300 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* === PHONE SET (5 doodles: visible across ALL viewports) === */}

        {/* 1. Magenta XL X partly cropped at bottom-left */}
        <div
          aria-hidden="true"
          data-doodle-item="xl-x-magenta"
          className={`pointer-events-none absolute -bottom-24 -left-16 sm:-bottom-24 sm:-left-16 md:-bottom-28 md:-left-20 ${
            animReady ? "doodle-enter-bl" : ""
          } ${xShake ? "doodle-x-shake" : ""}`}
        >
          <div className={animReady ? "doodle-spin-slow" : ""}>
            <DoodleX tone="magenta" size={140} tilt={16} className="md:hidden" />
            <DoodleX tone="magenta" size={172} tilt={16} className="hidden md:block" />
          </div>
        </div>

        {/* 2. Outlined white star top-right margin */}
        <div
          aria-hidden="true"
          data-doodle-item="star-white"
          className={`pointer-events-none absolute right-2 top-3 sm:right-6 sm:top-5 ${
            animReady ? "doodle-twinkle" : ""
          }`}
        >
          <DoodleStar size={34} tilt={-10} className="md:hidden" />
          <DoodleStar size={46} tilt={-10} className="hidden md:block" />
        </div>

        {/* 3. Magenta lightning bolt mid-right edge */}
        <div
          aria-hidden="true"
          data-doodle-item="bolt-magenta"
          className={`pointer-events-none absolute right-1 top-[44%] sm:right-4 md:top-[22%] lg:right-6 lg:top-[16%] ${
            boltFlash ? "doodle-bolt-flash" : animReady ? "doodle-flicker" : ""
          }`}
        >
          <DoodleBolt size={30} tilt={10} className="md:hidden" />
          <DoodleBolt size={44} tilt={10} className="hidden md:block" />
        </div>

        {/* 4. Small solid ink star bottom-right corner */}
        <div
          aria-hidden="true"
          data-doodle-item="star-ink-sm"
          className="pointer-events-none absolute bottom-3 right-3 sm:bottom-5 sm:right-6 lg:bottom-8 lg:right-8"
        >
          <DoodleStar solid size={24} tilt={18} />
        </div>

        {/* 5. 4x2 ink dot column top-right inset */}
        {/* 5. 4x2 ink dot column */}
        <div
          aria-hidden="true"
          data-doodle-item="dot-column"
          className="pointer-events-none absolute right-3 top-[32%] sm:right-20 sm:top-5 lg:right-24 lg:top-6"
        >
          <DoodleDotColumn />
        </div>

        {/* === TABLET SET (+3 = 8 doodles total at 768px+) === */}

        {/* 6. White XL X resting on bottom-right yellow slab */}
        <div
          aria-hidden="true"
          data-doodle-item="xl-x-white"
          className={`pointer-events-none absolute -bottom-16 -right-12 hidden md:block ${
            animReady ? "doodle-enter-br" : ""
          }`}
        >
          <div className={animReady ? "doodle-spin-slow" : ""}>
            <DoodleX tone="white" size={184} tilt={-18} />
          </div>
        </div>

        {/* 7. Cinema clapperboard upper center gutter */}
        <div
          aria-hidden="true"
          data-doodle-item="clapper"
          className="pointer-events-none absolute left-[46%] top-3 hidden md:block"
        >
          <DoodleClapper size={42} />
        </div>

        {/* 8. Cinema megaphone right side gutter */}
        <div
          aria-hidden="true"
          data-doodle-item="megaphone"
          className="pointer-events-none absolute bottom-28 right-3 hidden md:block lg:right-4"
        >
          <DoodleMegaphone size={40} />
        </div>

        {/* === DESKTOP SET (+4 = 12 doodles total at 1280px+) === */}

        {/* 9. Ink M XMark (56px) open center gutter on desktop */}
        <div
          aria-hidden="true"
          data-doodle-item="md-x-ink"
          className="pointer-events-none absolute left-[53%] top-[58%] hidden xl:block"
        >
          <DoodleX tone="ink" size={56} tilt={-14} />
        </div>

        {/* 10. Small film strip top-left desktop bleed */}
        <div
          aria-hidden="true"
          data-doodle-item="film-strip"
          className="pointer-events-none absolute left-3 top-24 hidden xl:block"
        >
          <DoodleFilmStrip size={44} />
        </div>

        {/* 11. Ticket stub upper-center desktop gutter */}
        <div
          aria-hidden="true"
          data-doodle-item="ticket-doodle"
          className="pointer-events-none absolute left-[53%] top-[22%] hidden xl:block"
        >
          <DoodleTicket size={44} />
        </div>

        {/* 12. Interactive Smiley doodle (easter egg: 1 tap wink+sound, 5 taps confetti!) */}
        <div
          data-doodle-item="smiley-easter-egg"
          className="pointer-events-auto absolute bottom-6 left-[45%] hidden xl:block"
        >
          <button
            type="button"
            onClick={handleSmileyTap}
            aria-label="Party smiley doodle"
            data-testid="hero-doodle-smiley"
            className="flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-full bg-transparent p-0 transition-transform active:scale-95"
          >
            <DoodleSmiley size={54} wink={smileyWink} />
          </button>
        </div>
      </div>
    </>
  );
}
