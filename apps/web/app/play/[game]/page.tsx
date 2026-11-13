import { notFound, redirect } from "next/navigation";
import { MODE_COLORS } from "@tfi/config/tokens";
import { GAME_REGISTRY, getGameById } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { GameTitle } from "@/components/game-title";
import { WallIcon } from "@/components/icons";
import { Tx } from "@/components/lang-provider";
import { Badge, Sticker, WallLinkButton } from "@/components/sticker-kit";
import { readShowMvpFlag } from "@/lib/games";
import { GAMES_CATALOG, TRANSLATIONS } from "@/lib/i18n";
import SetupClient from "./setup-client";

export function generateStaticParams() {
  const showMvp = readShowMvpFlag(process.env.SHOW_MVP_GAMES);
  return GAME_REGISTRY.filter((g) => showMvp || g.release === "beta").map((g) => ({ game: g.id }));
}

const RULES_MAP: Record<string, { en: string; te: string }> = {
  transify: TRANSLATIONS.gamesMeta.transifyRule,
  "emoji-cinema": TRANSLATIONS.gamesMeta.emojiCinemaRule,
  "rapid-fire": TRANSLATIONS.gamesMeta.rapidFireRule,
  "cricket-iq": TRANSLATIONS.gamesMeta.cricketIqRule,
};

export default async function GameSetupPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: slug } = await params;

  // Head Set Go has its own dedicated flow
  if (slug === "head-set-go") {
    redirect("/play/head-set-go");
  }

  const regGame = getGameById(slug);
  const catalogGame = GAMES_CATALOG.find((g) => g.slug === slug);
  if (!regGame || !catalogGame) notFound();
  // MVP games (cricket etc.) are hidden in the beta: no page unless SHOW_MVP_GAMES=true.
  if (regGame.release === "mvp" && !readShowMvpFlag(process.env.SHOW_MVP_GAMES)) notFound();

  // If the game is ready and uses the Judge template:
  if (regGame.status === "ready" && regGame.template === "Judge") {
    const rule = RULES_MAP[slug] ?? catalogGame.description;
    return (
      <SetupClient
        game={regGame}
        title={catalogGame.title}
        description={catalogGame.description}
        rule={rule}
      />
    );
  }

  // Otherwise, it's a Coming Soon game (Phase 3b or Wave 2)
  const panelColor = MODE_COLORS[regGame.mode === "Online" ? "online" : "onePhone"];

  return (
    <AppFrame>
      <div className="mx-auto max-w-[480px] space-y-6 p-4">
        <Sticker className="p-6">
          <div className="flex items-center justify-between">
            <Badge tone="yellow">GAME #{regGame.number}</Badge>
            <Badge tone={regGame.mode === "Online" ? "cyan" : "white"}>
              {regGame.mode}
            </Badge>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[14px] border-[2.5px] border-ink text-ink"
              style={{ backgroundColor: panelColor }}
            >
              <div className="h-14 w-14">
                <WallIcon kind={regGame.iconId} />
              </div>
            </div>
            <div>
              <GameTitle
                title={catalogGame.title}
                as="h1"
                teClassName="text-[28px]"
                enClassName="text-[26px]"
              />
              <p className="m-0 mt-1 text-[14px] font-bold text-ink">
                <Tx v={catalogGame.description} />
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[14px] border-2 border-ink bg-card p-4">
            <p className="m-0 text-[15px] font-black text-ink">
              <Tx v={TRANSLATIONS.judge.comingSoon} />
            </p>
            <p className="m-0 mt-1 text-[13px] font-bold text-ink/70">
              <Tx v={TRANSLATIONS.judge.comingSoonNote} />
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <WallLinkButton href="/play" variant="white">
              ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
            </WallLinkButton>
            {regGame.mode === "Online" ? (
              <WallLinkButton href={`/room/new?game=${regGame.id}`} variant="cyan">
                Create Online Room →
              </WallLinkButton>
            ) : null}
          </div>
        </Sticker>
      </div>
    </AppFrame>
  );
}
