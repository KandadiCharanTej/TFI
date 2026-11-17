"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { isCalmActive, usePreferencesStore } from "@/lib/store";

/**
 * Reveal: section pops in once (translateY 24px + scale 0.98 -> 1, 60ms stagger).
 * Immediately visible under Calm mode or prefers-reduced-motion.
 */
export function Reveal({
  children,
  staggerIndex = 0,
  className = "",
}: {
  readonly children: ReactNode;
  readonly staggerIndex?: number;
  readonly className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);
  const reducedMotion = usePreferencesStore((s) => s.reducedMotion || s.osReducedMotion);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion || isCalmActive()) {
      setVisible(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      data-visible={visible ? "true" : "false"}
      className={`v4-reveal ${className}`}
      style={{
        transitionDelay: visible && !reducedMotion ? `${staggerIndex * 60}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

/**
 * CountUp: animates integer scores up smoothly unless Calm mode is on.
 */
export function CountUp({
  value,
  durationMs = 450,
  className = "",
}: {
  readonly value: number;
  readonly durationMs?: number;
  readonly className?: string;
}) {
  const [shown, setShown] = useState(value);
  const reducedMotion = usePreferencesStore((s) => s.reducedMotion || s.osReducedMotion);

  useEffect(() => {
    if (reducedMotion || isCalmActive() || value <= 0) {
      setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - p) * (1 - p);
      setShown(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, reducedMotion]);

  return <span className={`mono-num ${className}`}>{shown}</span>;
}

/**
 * MarqueeTape: opposite-direction cinema marquee strips (ink + yellow)
 * that pause on hover, focus, or Calm mode, plus accessible Pause toggle.
 */
export function MarqueeTape({
  items,
  label,
  pauseLabel = "Pause",
  playLabel = "Play",
}: {
  readonly items: readonly string[];
  readonly label: string;
  readonly pauseLabel?: string;
  readonly playLabel?: string;
}) {
  const [paused, setPaused] = useState(false);

  const renderStrip = (prefix: string, textColor: string, diamondColor: string) =>
    items.map((item, idx) => (
      <span key={`${prefix}-${idx}`} className="inline-flex items-center gap-6">
        <span className={`text-[18px] md:text-[22px] font-extrabold whitespace-nowrap ${textColor}`}>
          {item}
        </span>
        <span
          aria-hidden="true"
          className={`inline-block h-2.5 w-2.5 rotate-45 ${diamondColor}`}
        />
      </span>
    ));

  return (
    <section
      aria-label={label}
      className={`wall-tape-wrap relative overflow-hidden bg-concrete pt-4 pb-11 ${
        paused ? "wall-tape-paused" : ""
      }`}
    >
      <div className="space-y-2.5">
        <div
          className="overflow-hidden border-y-[3px] border-ink bg-ink py-2.5"
          style={{ transform: "rotate(-1deg) scale(1.02)" }}
        >
          <div className="wall-tape-track">
            {renderStrip("ink-a", "text-yellow", "bg-yellow")}
            {renderStrip("ink-b", "text-yellow", "bg-yellow")}
          </div>
        </div>
        <div
          className="overflow-hidden border-y-[3px] border-ink bg-yellow py-2.5"
          style={{ transform: "rotate(1deg) scale(1.02)" }}
        >
          <div className="wall-tape-rev">
            {renderStrip("yel-a", "text-ink", "bg-magenta")}
            {renderStrip("yel-b", "text-ink", "bg-magenta")}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        data-testid="marquee-pause-btn"
        className="absolute right-3 bottom-1 z-10 min-h-[36px] rounded-full border-2 border-ink bg-white px-3 text-[12px] font-bold text-ink shadow-[0_2px_0_#141313]"
      >
        {paused ? playLabel : pauseLabel}
      </button>
    </section>
  );
}
