"use client";

import { useEffect, useRef } from "react";
import { isCalmActive } from "@/lib/store";

const PALETTE = ["#F6BE18", "#EC1276", "#00E5FF", "#00C853", "#141313"];

/**
 * Tiny in-palette canvas confetti burst (< 3 KB, 36 pieces, 1.2 s).
 * Never runs in Calm mode or when prefers-reduced-motion is active.
 */
export function ConfettiBurst({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (trigger <= 0 || typeof window === "undefined" || isCalmActive()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 40 }, (_, i) => ({
      x: canvas.width * (0.2 + Math.random() * 0.6),
      y: canvas.height * 0.28,
      vx: (Math.random() - 0.5) * 11,
      vy: -5 - Math.random() * 7,
      size: 7 + (i % 6),
      color: PALETTE[i % PALETTE.length] ?? "#F6BE18",
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.28,
    }));

    const startTime = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.36;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      }
      if (elapsed < 1200) {
        raf = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
