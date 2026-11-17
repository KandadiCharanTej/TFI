import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { GAME_REGISTRY, getGameById } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { GameSetupHero } from "@/components/game-setup-hero";
import { Tx } from "@/components/lang-provider";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { readShowMvpFlag } from "@/lib/games";
import { getServerLang } from "@/lib/lang-server";
import { GAMES_CATALOG, TRANSLATIONS } from "@/lib/i18n";
import { GAME_TRANSLATIONS } from "@/lib/i18n-games";
import SetupClient from "./setup-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ game: string }>;
}): Promise<Metadata> {
  const { game: slug } = await params;
  const lang = await getServerLang();
  const catalogGame = GAMES_CATALOG.find((g) => g.slug === slug);
  if (!catalogGame) return {};
  const title = `${catalogGame.title[lang]} | TFI & Pitch`;
  const description = catalogGame.description[lang];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/og-share.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export function generateStaticParams() {
  const showMvp = readShowMvpFlag(process.env.SHOW_MVP_GAMES);
  return GAME_REGISTRY.filter((g) => showMvp || g.release === "beta").map((g) => ({ game: g.id }));
}

const RULES_MAP: Record<string, { en: string; te: string }> = {
  transify: GAME_TRANSLATIONS.gamesMeta.transifyRule,
  "emoji-cinema": GAME_TRANSLATIONS.gamesMeta.emojiCinemaRule,
  "rapid-fire": GAME_TRANSLATIONS.gamesMeta.rapidFireRule,
  "cricket-iq": GAME_TRANSLATIONS.gamesMeta.cricketIqRule,
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

  // Otherwise, it's a Coming Soon game (Box Office Auction or Wave 2)
  return (
    <AppFrame>
      <div className="mx-auto max-w-[540px] space-y-5">
        <GameSetupHero
          slug={regGame.id}
          gameNumber={regGame.number}
          iconKind={regGame.iconId}
          title={catalogGame.title}
          description={catalogGame.description}
          modeLabel={regGame.mode === "Online" ? TRANSLATIONS.modes.online : TRANSLATIONS.modes.onePhone}
          isComingSoon
        />

        <Sticker className="space-y-4 p-6">
          <div className="rounded-[14px] border-[2.5px] border-ink bg-card p-4">
            <p className="m-0 text-[16px] font-extrabold text-ink">
              <Tx v={GAME_TRANSLATIONS.judge.comingSoon} />
            </p>
            <p className="m-0 mt-1 text-[14px] font-semibold text-ink/80">
              <Tx v={GAME_TRANSLATIONS.judge.comingSoonNote} />
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
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
