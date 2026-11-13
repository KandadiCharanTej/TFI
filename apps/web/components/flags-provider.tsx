"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { getVisibleCatalog } from "@/lib/games";
import type { GameCatalogItem } from "@/lib/i18n";

const FlagsContext = createContext<{ showMvp: boolean }>({ showMvp: false });

/** The server reads SHOW_MVP_GAMES once and passes it down. */
export function FlagsProvider({
  showMvp,
  children,
}: {
  readonly showMvp: boolean;
  readonly children: ReactNode;
}) {
  const value = useMemo(() => ({ showMvp }), [showMvp]);
  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}

export function useVisibleGames(): readonly GameCatalogItem[] {
  const { showMvp } = useContext(FlagsContext);
  return useMemo(() => getVisibleCatalog(showMvp), [showMvp]);
}
