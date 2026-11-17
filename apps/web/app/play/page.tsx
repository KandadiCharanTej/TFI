"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGameColor, getGameColorKey } from "@tfi/config/tokens";
import { AppFrame } from "@/components/app-frame";
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
        <div>
          <h1 className="h1-title m-0 text-ink">
            <Tx v={P.greeting} />
          </h1>
        </div>

        {/* Today's pick rendered as a Film Ticket Stub colored with its game color */}
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
                <span className="text-[13px] font-bold text-ink">
                  {formatGameMeta(todaysPick.slug, lang)}
                </span>
                <WallLinkButton href={`/play/${todaysPick.slug}`} variant="white" size="sm">
                  <Tx v={P.playAction} /> →
                </WallLinkButton>
              </div>
            }
          >
            <div className="flex items-center gap-4">
              <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-[16px] border-2 border-ink bg-sticker text-ink">
                <div className="h-[64px] w-[64px]">
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
                <p className="m-0 mt-1 text-[15px] font-medium text-ink">
                  <Tx v={todaysPick.description} />
                </p>
              </div>
            </div>
          </TicketStub>
        </section>

        {/* Recently played row (when history exists) */}
        {recentGames.length > 0 ? (
          <section aria-labelledby="recent-games-heading" data-testid="recently-played-section">
            <h2 id="recent-games-heading" className="h3-title m-0 text-ink">
              <Tx v={P.recentlyPlayed} />
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {recentGames.map((game) => (
                <Link
                  key={game.slug}
                  href={`/play/${game.slug}`}
                  prefetch={false}
                  className="wall-card-interactive wall-sticker-sm flex items-center justify-between gap-3 p-3.5 text-ink no-underline"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border-2 border-ink"
                      style={{ backgroundColor: getGameColor(game.slug) }}
                    >
                      <div className="h-8 w-8">
                        <WallIcon kind={game.iconKind} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-ink"
                          style={{ backgroundColor: getGameColor(game.slug) }}
                        />
                        <GameTitle title={game.title} enClassName="text-[17px]" teClassName="text-[18px]" />
                      </div>
                      <span className="text-[12px] font-medium text-ink/75">
                        {formatGameMeta(game.slug, lang)}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full border-2 border-ink bg-yellow px-3 py-1 text-[13px] font-bold text-ink">
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
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
          >
            <p className="m-0 text-[16px] font-bold text-ink">
              <Tx v={P.roomBannerTitle} />
            </p>
            <Link href="/join" className="wall-btn min-h-[44px] bg-sticker px-4 text-[14px] text-ink">
              <span className="mono-num mr-1">K7QM</span> · <Tx v={P.joinBtn} /> →
            </Link>
          </Sticker>
        </section>

        {/* Segmented mode filter and equal-height 2-3 column grid */}
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

          <div className="mt-5 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => {
              const displayNum = String(
                visibleGames.findIndex((g) => g.slug === game.slug) + 1,
              ).padStart(2, "0");
              const metaLine = formatGameMeta(game.slug, lang);
              const gameColor = getGameColor(game.slug);
              return (
                <Link
                  key={game.slug}
                  href={`/play/${game.slug}`}
                  prefetch={false}
                  className="wall-card-interactive wall-sticker flex h-full flex-col justify-between p-5 text-ink no-underline"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="mono-num text-[13px] text-ink">{displayNum}</span>
                      <Badge tone={game.isOnlineOnly ? "card" : "white"}>
                        {game.isOnlineOnly ? (
                          <Tx v={TRANSLATIONS.common.comingSoon} />
                        ) : (
                          <Tx v={TRANSLATIONS.modes.onePhone} />
                        )}
                      </Badge>
                    </div>

                    <div
                      className="mt-3 flex h-[112px] items-center justify-center rounded-[14px] border-2 border-ink text-ink"
                      style={{ backgroundColor: gameColor }}
                    >
                      <div className="h-[80px] w-[80px]">
                        <WallIcon kind={game.iconKind} />
                      </div>
                    </div>

                    <div className="mt-3.5 flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-ink"
                        style={{ backgroundColor: gameColor }}
                      />
                      <GameTitle
                        title={game.title}
                        teClassName="text-[21px]"
                        enClassName="text-[20px]"
                      />
                    </div>
                    <p className="m-0 mt-1 text-[14px] font-medium leading-[1.45] text-ink/90">
                      <Tx v={game.description} />
                    </p>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[12px] font-semibold text-ink/75">{metaLine}</span>
                      {!game.isOnlineOnly && offlineSlugs.has(game.slug) ? (
                        <span
                          data-testid={`offline-ready-${game.slug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-ink bg-green px-2.5 py-0.5 text-[11px] font-bold text-ink"
                        >
                          ✓ <Tx v={TRANSLATIONS.pwa.readyOffline} />
                        </span>
                      ) : null}
                    </div>
                    {game.isOnlineOnly ? (
                      <span className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[12px] border-2 border-ink bg-card px-3 text-[14px] font-bold text-ink">
                        <Tx v={TRANSLATIONS.common.comingSoon} />
                      </span>
                    ) : (
                      <span className="inline-flex min-h-[44px] w-full items-center justify-center rounded-[12px] border-2 border-ink bg-yellow px-3 text-[15px] font-bold text-ink">
                        <Tx v={P.playAction} /> →
                      </span>
                    )}
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
