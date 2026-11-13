"use client";

import { useEffect, useRef } from "react";

const PALETTE = ["#F6BE18", "#EC1276", "#00E5FF", "#00C853", "#141313"];

/**
 * Tiny in-palette canvas confetti burst (< 2 KB).
 * Respects prefers-reduced-motion and html[data-reduced-motion="true"].
 */
export function ConfettiBurst({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (trigger <= 0) return;
    if (typeof window === "undefined") return;
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.reducedMotion === "true";
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 28 }, (_, i) => ({
      x: canvas.width * (0.25 + Math.random() * 0.5),
      y: canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 9,
      vy: -4 - Math.random() * 6,
      size: 6 + (i % 5),
      color: PALETTE[i % PALETTE.length] ?? "#F6BE18",
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
    }));

    let frame = 0;
    let raf = 0;
    const step = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.34;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      }
      if (frame < 52) {
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
