"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef } from "react";
import { useLang } from "./lang-provider";

const PALETTE = ["#F6BE18", "#EC1276", "#00E5FF", "#00C853", "#141313"];

/**
 * Tiny in-palette canvas confetti burst (< 3 KB).
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

/** Radix confirmation dialog before quitting an active round. */
export function QuitRoundDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const { lang } = useLang();
  const isTe = lang === "te";
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border-[3px] border-ink bg-sticker p-5 shadow-[6px_6px_0_#141313]">
          <Dialog.Title className="h2-title m-0 text-ink">
            {isTe ? "రౌండ్ ఆపాలా?" : "Leave this round?"}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-[14px] font-semibold text-ink/75">
            {isTe
              ? "ప్రస్తుత స్కోరు పోతుంది."
              : "Your current round progress will be lost."}
          </Dialog.Description>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="wall-btn min-h-[48px] bg-sticker px-4 text-[14px] text-ink"
            >
              {isTe ? "కొనసాగించు" : "Keep playing"}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="wall-btn min-h-[48px] bg-magenta px-4 text-[19px] font-bold text-white"
            >
              {isTe ? "బయటకు వెళ్ళు" : "Quit round"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface HowToStep {
  title: string;
  body: string;
}

/** Unified 3-step How-To-Play Radix dialog with "Don't show again". */
export function HowToPlayDialog({
  open,
  onClose,
  title,
  steps,
  dontShow,
  onToggleDontShow,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  steps: readonly HowToStep[];
  dontShow: boolean;
  onToggleDontShow: (val: boolean) => void;
}) {
  const { lang } = useLang();
  const isTe = lang === "te";
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/75" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border-[3px] border-ink bg-sticker p-5 shadow-[6px_6px_0_#141313]">
          <Dialog.Title className="h2-title m-0 text-ink">
            {title}
          </Dialog.Title>
          <div className="mt-4 space-y-2.5">
            {steps.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-ink bg-card px-3.5 py-2.5"
              >
                <div className="text-[14px] font-extrabold text-ink">{s.title}</div>
                <div className="mt-0.5 text-[13px] font-semibold text-ink/75">
                  {s.body}
                </div>
              </div>
            ))}
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[13px] font-bold text-ink">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => onToggleDontShow(e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            {isTe ? "మళ్ళీ చూపవద్దు" : "Don't show again"}
          </label>
          <button
            type="button"
            onClick={onClose}
            className="wall-btn mt-4 w-full bg-yellow text-[15px] text-ink"
          >
            {isTe ? "సరే, ఆడుదాం →" : "Got it, let's play →"}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Designed loading skeleton for round cards. */
export function RoundSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col gap-4 p-4">
      <div className="h-8 w-36 animate-pulse rounded-full border-2 border-ink/20 bg-card" />
      <div className="h-56 w-full animate-pulse rounded-[20px] border-[3px] border-ink/20 bg-sticker" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-14 animate-pulse rounded-xl border-2 border-ink/20 bg-card" />
        <div className="h-14 animate-pulse rounded-xl border-2 border-ink/20 bg-card" />
      </div>
    </div>
  );
}

/** Designed offline / error status banner. */
export function OfflineBanner({ offline }: { offline: boolean }) {
  const { lang } = useLang();
  if (!offline) return null;
  return (
    <div
      role="status"
      className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-cyan px-3.5 py-1 text-[12px] font-extrabold text-ink shadow-[2px_2px_0_#141313]"
    >
      <span aria-hidden="true">●</span>
      {lang === "te"
        ? "ఆఫ్‌లైన్ మోడ్ — సేవ్ చేసిన కార్డులతో ఆడండి"
        : "Offline mode — playing from cached deck"}
    </div>
  );
}
