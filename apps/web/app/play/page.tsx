"use client";

import { useState } from "react";
import Link from "next/link";
import { MODE_COLORS } from "@tfi/config/tokens";
import { AppFrame } from "@/components/app-frame";
import { GameTitle } from "@/components/game-title";
import { WallIcon } from "@/components/icons";
import { Tx, useT } from "@/components/lang-provider";
import { Badge, Chip, Sticker, WallLinkButton } from "@/components/sticker-kit";
import { useVisibleGames } from "@/components/flags-provider";
import { MODE_FILTERS, filterByMode, panelModeKey, type ModeFilter } from "@/lib/games";
import { TRANSLATIONS } from "@/lib/i18n";

const FILTER_DOTS: Record<ModeFilter, string> = {
  All: "#FFFFFF",
  onePhone: MODE_COLORS.onePhone,
  online: MODE_COLORS.online,
};

const P = TRANSLATIONS.playHome;

export default function PlayHomePage() {
  const [filter, setFilter] = useState<ModeFilter>("All");
  const t = useT();
  const visibleGames = useVisibleGames();

  const todaysPick = visibleGames[0];
  const filteredGames = filterByMode(visibleGames, filter);
  if (!todaysPick) return null;

  return (
    <AppFrame>
      <div className="space-y-6" data-label="Play home">
        <h1 className="visually-hidden">
          <Tx v={P.allGamesHeading} />
        </h1>

        {/* Today's pick */}
        <section aria-labelledby="todays-pick-heading">
          <Sticker className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge tone="magenta">★ <Tx v={P.todaysPickBadge} /></Badge>
              <Badge tone="white" className="text-[11px]">
                <Tx v={TRANSLATIONS.modes[todaysPick.modeKey]} />
              </Badge>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[14px] border-[2.5px] border-ink bg-yellow text-ink">
                  <div className="h-[52px] w-[52px]">
                    <WallIcon kind={todaysPick.iconKind} />
                  </div>
                </div>
                <div>
                  <span id="todays-pick-heading">
                    <GameTitle
                      as="h2"
                      title={todaysPick.title}
                      teClassName="text-[26px]"
                      enClassName="text-[24px]"
                    />
                  </span>
                  <p className="m-0 mt-1 text-[14px] font-bold text-ink">
                    <Tx v={todaysPick.description} />
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <WallLinkButton href={`/play/${todaysPick.slug}`} variant="yellow">
                  <Tx v={P.playAction} /> →
                </WallLinkButton>
              </div>
            </div>
          </Sticker>
        </section>

        {/* Room-code strip */}
        <section aria-label={t(P.joinRoomRegion)}>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border-[3px] border-ink bg-cyan p-4 text-ink shadow-logo">
            <p className="m-0 text-[17px] font-extrabold text-ink">
              <Tx v={P.roomBannerTitle} />
            </p>
            <Link href="/join" className="wall-btn min-h-[46px] bg-sticker px-4 text-[14px] text-ink">
              <span className="mono-num mr-1">K7QM</span> · <Tx v={P.joinBtn} /> →
            </Link>
          </div>
        </section>

        {/* Category tabs and the 2-column grid */}
        <section aria-labelledby="all-games-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="all-games-heading"
              className="anton-title m-0 text-[28px] leading-none text-ink"
            >
              <Tx v={P.allGamesHeading} />
            </h2>
            <div
              role="group"
              aria-label={t(TRANSLATIONS.modeFilter.filterLabel)}
              className="flex flex-wrap gap-2"
            >
              {MODE_FILTERS.map((cat) => (
                <Chip
                  key={cat}
                  active={filter === cat}
                  dotColor={FILTER_DOTS[cat]}
                  onClick={() => setFilter(cat)}
                  className="px-3.5 text-[13px]"
                >
                  <Tx v={TRANSLATIONS.modeFilter[cat]} />
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <Link
                key={game.slug}
                href={`/play/${game.slug}`}
                className="wall-card-interactive wall-sticker-sm flex flex-col justify-between p-3.5 text-ink sm:p-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="mono-num text-[12px] text-ink">{game.number}</span>
                    <Badge tone={game.isOnlineOnly ? "cyan" : "white"} className="px-2 py-0.5 text-[10px]">
                      <Tx v={TRANSLATIONS.modes[game.modeKey]} />
                    </Badge>
                  </div>

                  <div
                    className="mt-2.5 flex h-[76px] items-center justify-center rounded-[12px] border-[2.5px] border-ink text-ink sm:h-[92px]"
                    style={{ backgroundColor: MODE_COLORS[panelModeKey(game)] }}
                  >
                    <div className="h-[48px] w-[48px] sm:h-[60px] sm:w-[60px]">
                      <WallIcon kind={game.iconKind} />
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <GameTitle
                      title={game.title}
                      teClassName="text-[19px] sm:text-[21px]"
                      enClassName="text-[16px] sm:text-[19px]"
                    />
                  </div>
                  <p className="m-0 mt-1 text-[12px] font-medium leading-[1.4] text-ink sm:text-[13px]">
                    <Tx v={game.description} />
                  </p>
                </div>

                <div className="mt-3">
                  <span className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[10px] border-2 border-ink bg-yellow px-2 text-[12px] font-extrabold uppercase tracking-wider text-ink shadow-logo">
                    <Tx v={P.playAction} /> →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
