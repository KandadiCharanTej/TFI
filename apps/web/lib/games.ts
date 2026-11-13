import { GAMES_CATALOG, type GameCatalogItem } from "./i18n";

export type ModeFilter = "All" | "onePhone" | "online";
export const MODE_FILTERS: readonly ModeFilter[] = ["All", "onePhone", "online"] as const;

/** Server-only: the one environment flag that turns MVP (cricket etc.) games on. */
export function readShowMvpFlag(value: string | undefined): boolean {
  return value === "true";
}

/** The games a visitor may see. Beta shows only release:"beta". */
export function getVisibleCatalog(showMvp: boolean): readonly GameCatalogItem[] {
  return GAMES_CATALOG.filter((g) => showMvp || g.release === "beta");
}

/** "Phone or online" games show under both filters. */
export function filterByMode(
  games: readonly GameCatalogItem[],
  mode: ModeFilter,
): readonly GameCatalogItem[] {
  if (mode === "All") return games;
  return games.filter((g) =>
    mode === "onePhone" ? g.modeKey !== "online" : g.modeKey !== "onePhone",
  );
}

/** Panel colour follows MODE: yellow = playable on one phone, cyan = online only. */
export function panelModeKey(game: Pick<GameCatalogItem, "isOnlineOnly">): "onePhone" | "online" {
  return game.isOnlineOnly ? "online" : "onePhone";
}
