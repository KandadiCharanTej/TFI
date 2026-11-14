"use client";

import { AppFrame } from "@/components/app-frame";
import { GameTitle } from "@/components/game-title";
import { Tx } from "@/components/lang-provider";
import { useVisibleGames } from "@/components/flags-provider";
import { useOfflineReadyGames } from "@/components/sw-manager";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function OfflinePage() {
  const P = TRANSLATIONS.pages;
  const visibleGames = useVisibleGames();
  const offlineSlugs = useOfflineReadyGames();
  const savedGames = visibleGames.filter((g) => !g.isOnlineOnly && offlineSlugs.has(g.slug));

  return (
    <AppFrame>
      <div className="mx-auto max-w-[540px] space-y-5">
        <Sticker className="space-y-4 p-6 text-center">
          <h1 className="h1-title m-0 text-ink">
            <Tx v={P.offlineTitle} />
          </h1>
          <p className="m-0 text-base font-bold text-ink">
            <Tx v={P.offlineBody} />
          </p>
          <WallLinkButton href="/play" variant="yellow">
            <Tx v={TRANSLATIONS.common.goToPlayHome} /> →
          </WallLinkButton>
        </Sticker>

        <Sticker className="space-y-3 p-5">
          <h2 className="h3-title m-0 text-ink">
            <Tx v={TRANSLATIONS.pwa.offlineSavedHeading} />
          </h2>
          {savedGames.length === 0 ? (
            <p className="m-0 text-sm font-bold text-ink">
              <Tx v={TRANSLATIONS.pwa.offlineNoneSaved} />
            </p>
          ) : (
            <ul className="m-0 list-none space-y-2 p-0">
              {savedGames.map((game) => (
                <li
                  key={game.slug}
                  className="flex items-center justify-between gap-3 rounded-[12px] border-2 border-ink bg-concrete p-3"
                >
                  <GameTitle title={game.title} enClassName="text-[16px]" teClassName="text-[17px]" />
                  <WallLinkButton href={`/play/${game.slug}`} variant="yellow" className="min-h-[40px] px-3 text-[12px]">
                    <Tx v={TRANSLATIONS.playHome.playAction} /> →
                  </WallLinkButton>
                </li>
              ))}
            </ul>
          )}
        </Sticker>
      </div>
    </AppFrame>
  );
}
