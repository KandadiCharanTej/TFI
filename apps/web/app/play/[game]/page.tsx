import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_COLORS } from "@tfi/config/tokens";
import { AppFrame } from "@/components/app-frame";
import { WallIcon } from "@/components/icons";
import { Badge, Sticker, WallLinkButton } from "@/components/sticker-kit";
import { GAMES_CATALOG, TRANSLATIONS } from "@/lib/i18n";

export function generateStaticParams() {
  return GAMES_CATALOG.map((g) => ({ game: g.slug }));
}

export default async function GameSetupPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: slug } = await params;
  const game = GAMES_CATALOG.find((g) => g.slug === slug);

  if (!game) {
    notFound();
  }

  const panelColor = CATEGORY_COLORS[game.category];

  return (
    <AppFrame>
      <div className="space-y-6">
        <Sticker className="p-6">
          <div className="flex items-center justify-between">
            <Badge tone="yellow">GAME #{game.number}</Badge>
            <Badge tone={game.isOnlineOnly ? "cyan" : "white"}>
              {TRANSLATIONS.modes[game.modeKey].en}
            </Badge>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[14px] border-[2.5px] border-ink text-ink"
              style={{ backgroundColor: panelColor }}
            >
              <div className="h-14 w-14">
                <WallIcon kind={game.iconKind} />
              </div>
            </div>
            <div>
              <p className="te-script m-0 text-[28px] leading-[1.55] text-ink" lang="te">
                {game.title.te}
              </p>
              <h1 className="anton-title m-0 text-[26px] leading-tight text-ink">
                {game.title.en}
              </h1>
              <p className="m-0 mt-1 text-[15px] font-bold text-ink">
                {game.description.en}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[14px] border-2 border-ink bg-card p-4">
            <p className="te-script m-0 text-[18px] leading-[1.55] text-ink" lang="te">
              డెక్ &amp; టైమర్ సెటప్ (ఫేజ్ 2లో పూర్తి రౌండ్ ఇంజిన్)
            </p>
            <p className="m-0 mt-1 text-[14px] font-bold text-ink">
              Deck &amp; timer setup ready for Phase 2 state machine integration.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <WallLinkButton href="/play" variant="white">
              ← Back to Play Home
            </WallLinkButton>
            {game.isOnlineOnly ? (
              <Link
                href={`/room/new?game=${game.slug}`}
                className="wall-btn bg-cyan text-ink"
              >
                Create Online Room →
              </Link>
            ) : null}
          </div>
        </Sticker>
      </div>
    </AppFrame>
  );
}
