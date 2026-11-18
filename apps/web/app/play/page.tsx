"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGameColor, getGameColorKey } from "@tfi/config/tokens";
import { AppFrame } from "@/components/app-frame";
import { Starburst } from "@/components/art-kit";
import { GameTitle } from "@/components/game-title";
import { WallIcon } from "@/components/icons";
import { InstallSticker } from "@/components/install-sticker";
import { Tx, useLang, useT } from "@/components/lang-provider";
import {
  Badge,
  SegmentedControl,
  Sticker,
  TicketStub,
  WallLinkButton,
} from "@/components/sticker-kit";
import { useOfflineReadyGames } from "@/components/sw-manager";
import { useVisibleGames } from "@/components/flags-provider";
import {
  MODE_FILTERS,
  filterByMode,
  formatGameMeta,
  readRecentlyPlayed,
  type ModeFilter,
} from "@/lib/games";
import { TRANSLATIONS } from "@/lib/i18n";

const P = TRANSLATIONS.playHome;

export default function PlayHomePage() {
  const [filter, setFilter] = useState<ModeFilter>("All");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const { lang } = useLang();
  const t = useT();
  const visibleGames = useVisibleGames();
  const offlineSlugs = useOfflineReadyGames();

  useEffect(() => {
    setRecentSlugs(readRecentlyPlayed());
  }, []);

  const todaysPick = visibleGames[0];
  const filteredGames = filterByMode(visibleGames, filter);
  const recentGames = recentSlugs
    .map((slug) => visibleGames.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  if (!todaysPick) return null;

  const filterOptions = MODE_FILTERS.map((cat) => ({
    value: cat,
    label: <Tx v={TRANSLATIONS.modeFilter[cat]} />,
    testId: `play-filter-${cat}`,
  }));

  return (
    <AppFrame>
      <div className="space-y-8" data-label="Play home">
        {/* Greeting Header on a Yellow Halftone Party Block */}
        <div className="bg-halftone relative overflow-hidden rounded-[20px] border-[3px] border-ink bg-yellow px-5 py-6 shadow-[0_6px_0_#141313] md:px-7 md:py-8">
          <div className="pointer-events-none absolute -right-4 -top-4 hidden sm:block" aria-hidden="true">
            <Starburst color="white" size={64} />
          </div>
          <p className="wall-label m-0 text-ink">
            <Tx v={TRANSLATIONS.common.betaPill} />
          </p>
          <h1 className="h1-title m-0 mt-1 text-ink">
            <Tx v={P.greeting} />
          </h1>
        </div>

        {/* Today's pick TicketStub in its game color with oversized Play CTA */}
        <section aria-labelledby="todays-pick-heading">
          <TicketStub
            bg={getGameColorKey(todaysPick.slug)}
            data-testid="todays-pick-ticket"
            header={
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge tone="white">
                  <Tx v={P.todaysPickBadge} />
                </Badge>
                <Badge tone="white">
                  <Tx v={TRANSLATIONS.modes[todaysPick.modeKey]} />
                </Badge>
              </div>
            }
            footer={
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[14px] font-bold text-ink">
                  {formatGameMeta(todaysPick.slug, lang)}
                </span>
                <WallLinkButton href={`/play/${todaysPick.slug}`} variant="white" size="lg">
                  <Tx v={P.playAction} /> →
                </WallLinkButton>
              </div>
            }
          >
            <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
              <div className="flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-[18px] border-[3px] border-ink bg-sticker text-ink">
                <div className="h-[80px] w-[80px]">
                  <WallIcon kind={todaysPick.iconKind} />
                </div>
              </div>
              <div className="rounded-[16px] border-[2.5px] border-ink bg-white px-4 py-3 flex-1">
                <span id="todays-pick-heading">
                  <GameTitle
                    as="h2"
                    title={todaysPick.title}
                    teClassName="text-[28px]"
                    enClassName="text-[26px]"
                  />
                </span>
                <p className="m-0 mt-1 text-[16px] font-medium text-ink">
                  <Tx v={todaysPick.description} />
                </p>
              </div>
            </div>
          </TicketStub>
        </section>

        {/* Horizontally scrolling Recently played row (when history exists) */}
        {recentGames.length > 0 ? (
          <section aria-labelledby="recent-games-heading" data-testid="recently-played-section">
            <h2 id="recent-games-heading" className="h3-title m-0 text-ink">
              <Tx v={P.recentlyPlayed} />
            </h2>
            <div className="mt-3 flex snap-x gap-4 overflow-x-auto pb-2">
              {recentGames.map((game) => (
                <Link
                  key={game.slug}
                  href={`/play/${game.slug}`}
                  prefetch={false}
                  className="wall-card-interactive wall-sticker-sm flex min-w-[260px] snap-start items-center justify-between gap-3 p-3.5 text-ink no-underline"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border-[2.5px] border-ink"
                      style={{ backgroundColor: getGameColor(game.slug) }}
                    >
                      <div className="h-9 w-9">
                        <WallIcon kind={game.iconKind} />
                      </div>
                    </div>
                    <div>
                      <GameTitle title={game.title} enClassName="text-[17px]" teClassName="text-[18px]" />
                      <span className="text-[12px] font-semibold text-ink/80">
                        {formatGameMeta(game.slug, lang)}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full border-2 border-ink bg-yellow px-3 py-1 text-[13px] font-extrabold text-ink">
                    <Tx v={P.playAction} /> →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <InstallSticker />

        {/* Room-code strip: online = cyan */}
        <section aria-label={t(P.joinRoomRegion)}>
          <Sticker
            bg="cyan"
            className="bg-stripes flex flex-wrap items-center justify-between gap-3 px-5 py-4"
          >
            <p className="m-0 rounded-[12px] border-2 border-ink bg-white px-3.5 py-1.5 text-[16px] font-bold text-ink">
              <Tx v={P.roomBannerTitle} />
            </p>
            <Link href="/join" className="wall-btn min-h-[46px] bg-white px-4 text-[15px] text-ink">
              <span className="mono-num mr-1">KXQM</span> · <Tx v={P.joinBtn} /> →
            </Link>
          </Sticker>
        </section>

        {/* Color-blocked Game Tiles (2 cols on phone, 3 on desktop) */}
        <section aria-labelledby="all-games-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="all-games-heading" className="h2-title m-0 text-ink">
              {lang === "te"
                ? `మొత్తం ${visibleGames.length} ఆటలు`
                : `All ${visibleGames.length} games`}
            </h2>
            <SegmentedControl
              label={t(TRANSLATIONS.modeFilter.filterLabel)}
              options={filterOptions}
              value={filter}
              onChange={setFilter}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 items-stretch gap-4 min-[360px]:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {filteredGames.map((game) => {
              const displayNum = String(
                visibleGames.findIndex((g) => g.slug === game.slug) + 1,
              ).padStart(2, "0");
              const metaLine = formatGameMeta(game.slug, lang);
              const gameColor = getGameColor(game.slug);
              const wideOnPhone =
                filteredGames.length === 7 && game.slug === "box-office-auction"
                  ? "min-[360px]:col-span-2 lg:col-span-1"
                  : "";
              return (
                <Link
                  key={game.slug}
                  href={`/play/${game.slug}`}
                  prefetch={false}
                  className={`wall-card-interactive wall-sticker flex h-full flex-col justify-between p-3 text-ink no-underline sm:p-4 ${wideOnPhone}`}
                  style={{ backgroundColor: gameColor }}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="mono-num rounded-full border-2 border-ink bg-white px-2 py-0.5 text-[12px] text-ink">
                        {displayNum}
                      </span>
                      <Badge tone={game.isOnlineOnly ? "card" : "white"} className="!px-2 !py-0.5 !text-[12px]">
                        {game.isOnlineOnly ? (
                          <Tx v={TRANSLATIONS.common.comingSoon} />
                        ) : (
                          <Tx v={TRANSLATIONS.modes.onePhone} />
                        )}
                      </Badge>
                    </div>

                    <div className="my-3 flex h-[96px] items-center justify-center sm:h-[116px]">
                      <div className="wall-tile-art h-[88px] w-[88px] sm:h-[108px] sm:w-[108px]">
                        <WallIcon kind={game.iconKind} />
                      </div>
                    </div>
                  </div>

                  {/* White card keeps title, description, offline tick & button cleanly legible (A3) */}
                  <div className="mt-auto rounded-[14px] border-[2.5px] border-ink bg-white p-3 sm:p-3.5">
                    <GameTitle
                      title={game.title}
                      teClassName="text-[19px]"
                      enClassName="text-[18px]"
                    />
                    <p className="m-0 mt-1 text-[16px] font-medium leading-[1.4] text-ink/90">
                      <Tx v={game.description} />
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5">
                      <span className="text-[12px] font-bold text-ink/75">{metaLine}</span>
                      {!game.isOnlineOnly && offlineSlugs.has(game.slug) ? (
                        <span
                          data-testid={`offline-ready-${game.slug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-ink bg-green px-2 py-0.5 text-[12px] font-bold text-ink"
                        >
                          ✓ <Tx v={TRANSLATIONS.pwa.readyOffline} />
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2.5">
                      {game.isOnlineOnly ? (
                        <span className="inline-flex min-h-[40px] w-full items-center justify-center rounded-[12px] border-2 border-ink bg-card px-2 text-[13px] font-bold text-ink">
                          <Tx v={TRANSLATIONS.common.comingSoon} />
                        </span>
                      ) : (
                        <span className="inline-flex min-h-[40px] w-full items-center justify-center rounded-[12px] border-2 border-ink bg-yellow px-2 text-[14px] font-extrabold text-ink">
                          <Tx v={P.playAction} /> →
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
