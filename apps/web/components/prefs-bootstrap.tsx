"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/lib/store";

/**
 * Runs once on the client to hydrate remembered device preferences.
 */
export function PrefsBootstrap() {
  useEffect(() => {
    usePreferencesStore.getState().hydrate();
  }, []);

  return null;
}
