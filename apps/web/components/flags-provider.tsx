"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { getVisibleCatalog } from "@/lib/games";
import type { GameCatalogItem } from "@/lib/i18n";

export interface RuntimeFlags {
  readonly showMvp: boolean;
  readonly feedbackUrl: string;
  readonly posthogKey: string;
  readonly sentryDsn: string;
}

const FlagsContext = createContext<RuntimeFlags>({
  showMvp: false,
  feedbackUrl: "",
  posthogKey: "",
  sentryDsn: "",
});

/** The server reads env flags once and passes them down. */
export function FlagsProvider({
  showMvp,
  feedbackUrl = "",
  posthogKey = "",
  sentryDsn = "",
  children,
}: {
  readonly showMvp: boolean;
  readonly feedbackUrl?: string;
  readonly posthogKey?: string;
  readonly sentryDsn?: string;
  readonly children: ReactNode;
}) {
  const value = useMemo(
    () => ({ showMvp, feedbackUrl, posthogKey, sentryDsn }),
    [showMvp, feedbackUrl, posthogKey, sentryDsn],
  );
  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}

export function useFlags(): RuntimeFlags {
  return useContext(FlagsContext);
}

export function useVisibleGames(): readonly GameCatalogItem[] {
  const { showMvp } = useContext(FlagsContext);
  return useMemo(() => getVisibleCatalog(showMvp), [showMvp]);
}
