"use client";

import { useEffect, useState } from "react";
import { Tx } from "@/components/lang-provider";
import { Sticker } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

const DISMISS_KEY = "tfi_install_dismissed_at";
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia?.("(display-mode: standalone)").matches || nav.standalone === true
  );
}

function isIosBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isRecentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && Date.now() - ts < FOURTEEN_DAYS_MS;
  } catch {
    return false;
  }
}

export function InstallSticker() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosMode, setIosMode] = useState(false);
  const [showIosSheet, setShowIosSheet] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (isStandaloneMode() || isRecentlyDismissed()) {
      setHidden(true);
      return;
    }

    if (isIosBrowser()) {
      setIosMode(true);
      setHidden(false);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setHidden(false);
    };
    const onInstalled = () => {
      setHidden(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (hidden || (!deferredPrompt && !iosMode)) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Ignore storage error
    }
    setHidden(true);
    setShowIosSheet(false);
  };

  const handleInstall = async () => {
    window.dispatchEvent(new CustomEvent("tfi:install_clicked"));
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setHidden(true);
      }
      setDeferredPrompt(null);
      return;
    }
    if (iosMode) {
      setShowIosSheet(true);
    }
  };

  const P = TRANSLATIONS.pwa;

  return (
    <Sticker data-testid="install-sticker" className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-[15px] font-extrabold text-ink">
            <Tx v={P.installTitle} />
          </p>
          <p className="m-0 mt-0.5 text-[13px] font-medium text-ink">
            <Tx v={P.installBody} />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="min-h-[44px] px-3 text-[13px] font-bold text-ink underline"
          >
            <Tx v={P.notNow} />
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="wall-btn min-h-[44px] bg-yellow px-4 text-[13px] text-ink"
          >
            <Tx v={P.installBtn} />
          </button>
        </div>
      </div>

      {showIosSheet ? (
        <div
          role="dialog"
          aria-label="iPhone install instructions"
          data-testid="ios-install-sheet"
          className="mt-3 space-y-2 rounded-[12px] border-2 border-ink bg-concrete p-3 text-ink"
        >
          <p className="m-0 text-[16px] font-extrabold">
            <Tx v={P.iosTitle} />
          </p>
          <p className="m-0 text-[16px] font-medium">
            <Tx v={P.iosStep1} />
          </p>
          <p className="m-0 text-[16px] font-medium">
            <Tx v={P.iosStep2} />
          </p>
          <button
            type="button"
            onClick={() => setShowIosSheet(false)}
            className="wall-btn min-h-[44px] min-w-[44px] bg-sticker px-4 text-[14px] text-ink"
          >
            <Tx v={P.iosClose} />
          </button>
        </div>
      ) : null}
    </Sticker>
  );
}
