"use client";

import { useEffect, useRef } from "react";
import { useLang } from "./lang-provider";

/** Native <dialog> confirmation before quitting an active round. */
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
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal?.();
    } else if (!open && dialog.open) {
      dialog.close?.();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="quit-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onOpenChange(false);
      }}
      className="fixed inset-0 z-50 m-auto w-[min(92vw,380px)] rounded-[20px] border-[3px] border-ink bg-sticker p-5 shadow-[0_6px_0_#141313] backdrop:bg-ink/70"
    >
      <h2 id="quit-dialog-title" className="h2-title m-0 text-ink">
        {isTe ? "రౌండ్ ఆపాలా?" : "Leave this round?"}
      </h2>
      <p className="mt-2 text-[14px] font-semibold text-ink/75">
        {isTe ? "ప్రస్తుత స్కోరు పోతుంది." : "Your current round progress will be lost."}
      </p>
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
    </dialog>
  );
}

export interface HowToStep {
  title: string;
  body: string;
}

/** Unified 3-step How-To-Play native <dialog> with "Don't show again". */
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
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal?.();
    } else if (!open && dialog.open) {
      dialog.close?.();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="howto-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="fixed inset-0 z-50 m-auto w-[min(92vw,420px)] rounded-[20px] border-[3px] border-ink bg-sticker p-5 shadow-[0_6px_0_#141313] backdrop:bg-ink/75"
    >
      <h2 id="howto-dialog-title" className="h2-title m-0 text-ink">
        {title}
      </h2>
      <div className="mt-4 space-y-2.5">
        {steps.map((s, i) => (
          <div key={i} className="rounded-xl border-2 border-ink bg-card px-3.5 py-2.5">
            <div className="text-[14px] font-extrabold text-ink">{s.title}</div>
            <div className="mt-0.5 text-[13px] font-semibold text-ink/75">{s.body}</div>
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
        className="wall-btn mt-4 w-full bg-yellow text-[16px] text-ink"
      >
        {isTe ? "సరే, ఆడుదాం →" : "Got it, let's play →"}
      </button>
    </dialog>
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
