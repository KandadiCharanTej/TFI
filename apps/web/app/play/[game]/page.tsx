import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CATEGORY_COLORS } from "@tfi/config/tokens";
import { AppFrame } from "@/components/app-frame";
import { GameTitle } from "@/components/game-title";
import { WallIcon } from "@/components/icons";
import { Badge, Sticker, WallLinkButton } from "@/components/sticker-kit";
import { GAMES_CATALOG } from "@/lib/i18n";

export function generateStaticParams() {
  return GAMES_CATALOG.map((g) => ({ game: g.slug }));
}

export default async function GameSetupPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: slug } = await params;

  // Head Set Go has its own setup page — redirect there.
  if (slug === "head-set-go") {
    redirect("/play/head-set-go");
  }

  const game = GAMES_CATALOG.find((g) => g.slug === slug);
  if (!game) notFound();

  const panelColor = CATEGORY_COLORS[game.category];

  return (
    <AppFrame>
      <div className="space-y-6">
        <Sticker className="p-6">
          <div className="flex items-center justify-between">
            <Badge tone="yellow">GAME #{game.number}</Badge>
            <Badge tone={game.isOnlineOnly ? "cyan" : "white"}>
              {game.modeKey === "onePhone"
                ? "1 Phone"
                : game.modeKey === "online"
                  ? "Online"
                  : "1 Phone or Online"}
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
              <GameTitle title={game.title} as="h1" teClassName="text-[28px]" enClassName="text-[26px]" />
              <p className="m-0 mt-1 text-[15px] font-bold text-ink">{game.description.en}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[14px] border-2 border-ink bg-card p-4">
            <p className="m-0 text-[14px] font-bold text-ink">
              Full game setup coming in a later phase. Head Set Go is ready now.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <WallLinkButton href="/play" variant="white">
              ← Back to Play Home
            </WallLinkButton>
            {game.isOnlineOnly ? (
              <Link href={`/room/new?game=${game.slug}`} className="wall-btn bg-cyan text-ink">
                Create Online Room →
              </Link>
            ) : null}
          </div>
        </Sticker>
      </div>
    </AppFrame>
  );
}
