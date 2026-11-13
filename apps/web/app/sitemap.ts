import type { MetadataRoute } from "next";
import { GAME_REGISTRY } from "@tfi/game-core";
import { readShowMvpFlag } from "@/lib/games";

export const dynamic = "force-dynamic";

/** Only beta games appear (cricket and other MVP games stay out unless SHOW_MVP_GAMES=true). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tfi-and-pitch.example";
  const showMvp = readShowMvpFlag(process.env.SHOW_MVP_GAMES);
  const games = GAME_REGISTRY.filter((g) => showMvp || g.release === "beta");
  const pages = ["", "/play", "/about", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...games.map((g) => ({ url: `${base}/play/${g.id}` })),
  ];
}
