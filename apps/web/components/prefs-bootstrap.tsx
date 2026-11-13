"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/lib/store";

/**
 * Runs once on the client: loads remembered preferences and registers the
 * offline service worker (production only).
 */
export function PrefsBootstrap() {
  useEffect(() => {
    usePreferencesStore.getState().hydrate();

    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    };
    // Register after the page is idle so the first screen is never slowed down.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
