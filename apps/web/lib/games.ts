import { getGameById } from "@tfi/game-core";
import { GAMES_CATALOG, type GameCatalogItem } from "./i18n";
import type { Lang } from "./lang";

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

/**
 * Formats true player count and estimated session duration from GAME_REGISTRY.
 * Example: "2 to 8 players · 5 min" (or teams for Dumb Charades).
 */
export function formatGameMeta(slug: string, lang: Lang): string {
  const reg = getGameById(slug);
  if (!reg) {
    return lang === "te" ? "2 నుండి 8 మంది · 5 నిమి" : "2 to 8 players · 5 min";
  }
  const mins = Math.max(3, Math.round((reg.defaultTimerSec * 5) / 60));
  if (reg.template === "Charades") {
    return lang === "te"
      ? `${reg.playerMin} నుండి ${reg.playerMax} జట్లు · ${mins} నిమి`
      : `${reg.playerMin} to ${reg.playerMax} teams · ${mins} min`;
  }
  return lang === "te"
    ? `${reg.playerMin} నుండి ${reg.playerMax} మంది · ${mins} నిమి`
    : `${reg.playerMin} to ${reg.playerMax} players · ${mins} min`;
}

