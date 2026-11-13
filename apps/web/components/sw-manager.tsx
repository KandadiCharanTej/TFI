"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Tx } from "@/components/lang-provider";
import { TRANSLATIONS } from "@/lib/i18n";

export const SW_CACHE_NAME = "tfi-offline-v2";

/**
 * Registers the service worker after load and shows a non-intrusive
 * "New version ready. Refresh" sticker — never during an active /round route.
 */
export function SwManager() {
  const pathname = usePathname();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const forceSw =
      typeof window !== "undefined" &&
      (window as unknown as { __FORCE_SW__?: boolean }).__FORCE_SW__;
    if ((process.env.NODE_ENV !== "production" && !forceSw) || !("serviceWorker" in navigator)) {
      return;
    }

    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
          }
          reg.addEventListener("updatefound", () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.addEventListener("statechange", () => {
              if (installing.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(installing);
              }
            });
          });
        })
        .catch(() => undefined);
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const isRound = pathname?.endsWith("/round") ?? false;
  if (!waitingWorker || dismissed || isRound) return null;

  const handleRefresh = () => {
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
  };

  return (
    <div
      role="status"
      data-testid="sw-update-banner"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-[440px] items-center justify-between gap-3 rounded-[16px] border-[3px] border-ink bg-yellow px-4 py-3 text-ink shadow-sticker"
    >
      <span className="text-[13px] font-extrabold text-ink">
        <Tx v={TRANSLATIONS.pwa.swUpdateBanner} />
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleRefresh}
          className="wall-btn min-h-[38px] bg-sticker px-3 text-[12px] text-ink"
        >
          <Tx v={TRANSLATIONS.pwa.swRefreshBtn} />
        </button>
        <button
          type="button"
          aria-label="Dismiss update"
          onClick={() => setDismissed(true)}
          className="min-h-[38px] px-2 text-[14px] font-extrabold text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Returns the set of game slugs whose `/play/<slug>` page is cached for offline play.
 */
export function useOfflineReadyGames(): Set<string> {
  const [slugs, setSlugs] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (typeof window === "undefined" || !("caches" in window)) return;
    let active = true;
    const scan = async () => {
      try {
        const cache = await caches.open(SW_CACHE_NAME);
        const requests = await cache.keys();
        const found = new Set<string>();
        for (const req of requests) {
          const url = new URL(req.url);
          const match = /^\/play\/([a-z0-9-]+)\/?$/.exec(url.pathname);
          if (match?.[1]) {
            found.add(match[1]);
          }
        }
        if (active) setSlugs(found);
      } catch {
        // Ignore cache access errors
      }
    };
    scan();
    return () => {
      active = false;
    };
  }, []);

  return slugs;
}
