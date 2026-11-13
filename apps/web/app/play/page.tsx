"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORY_COLORS } from "@tfi/config/tokens";
import { AppFrame } from "@/components/app-frame";
import { WallIcon } from "@/components/icons";
import { Badge, Chip, Sticker, WallLinkButton } from "@/components/sticker-kit";
import { GAMES_CATALOG, TRANSLATIONS } from "@/lib/i18n";

type CategoryFilter = "All" | "Cinema" | "Cricket" | "Party";

const FILTER_DOTS: Record<CategoryFilter, string> = {
  All: "#FFFFFF",
  Cinema: CATEGORY_COLORS.Cinema,
  Cricket: CATEGORY_COLORS.Cricket,
  Party: CATEGORY_COLORS.Party,
};

export default function PlayHomePage() {
  const [filter, setFilter] = useState<CategoryFilter>("All");

  const todaysPick = GAMES_CATALOG[0]!; // Head Set Go
  const filteredGames = GAMES_CATALOG.filter(
    (g) => filter === "All" || g.category === filter,
  );

  return (
    <AppFrame>
      <div className="space-y-6" data-label="Play home">
        <h1 className="visually-hidden">
          {TRANSLATIONS.brand.name} — {TRANSLATIONS.playHome.allGamesHeading.en}
        </h1>

        {/* 1. Today's Pick Sticker */}
        <section aria-labelledby="todays-pick-heading">
          <Sticker className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge tone="magenta">
                ★ {TRANSLATIONS.playHome.todaysPickBadge.te} ·{" "}
                {TRANSLATIONS.playHome.todaysPickBadge.en}
              </Badge>
              <Badge tone="white" className="text-[11px]">
                {TRANSLATIONS.modes[todaysPick.modeKey].en}
              </Badge>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[14px] border-[2.5px] border-ink bg-yellow text-ink"
                >
                  <div className="h-[52px] w-[52px]">
                    <WallIcon kind={todaysPick.iconKind} />
                  </div>
                </div>
                <div>
                  <p
                    className="te-script m-0 text-[26px] leading-[1.5] text-ink"
                    lang="te"
                  >
                    {todaysPick.title.te}
                  </p>
                  <h2
                    id="todays-pick-heading"
                    className="anton-title m-0 text-[24px] leading-tight text-ink"
                  >
                    {todaysPick.title.en}
                  </h2>
                  <p
                    className="te-script m-0 mt-1 text-[16px] leading-[1.5] text-ink"
                    lang="te"
                  >
                    {todaysPick.description.te}
                  </p>
                  <p className="m-0 text-[14px] font-bold text-ink">
                    {todaysPick.description.en}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <WallLinkButton href={`/play/${todaysPick.slug}`} variant="yellow">
                  <span className="te-script mr-1 text-[18px]" lang="te">
                    {TRANSLATIONS.playHome.playAction.te}
                  </span>
                  <span>{TRANSLATIONS.playHome.playAction.en} →</span>
                </WallLinkButton>
              </div>
            </div>
          </Sticker>
        </section>

        {/* 2. Cyan Room-Code Strip */}
        <section aria-label="Join a room">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border-[3px] border-ink bg-cyan p-4 text-ink shadow-logo">
            <div>
              <p
                className="te-script m-0 text-[19px] leading-[1.5] text-ink"
                lang="te"
              >
                {TRANSLATIONS.playHome.roomBannerTitle.te}
              </p>
              <p className="m-0 text-[15px] font-extrabold text-ink">
                {TRANSLATIONS.playHome.roomBannerTitle.en}
              </p>
            </div>

            <Link
              href="/join"
              className="wall-btn min-h-[46px] bg-sticker px-4 text-[14px] text-ink"
            >
              <span className="mono-num mr-1">K7QM</span> ·{" "}
              {TRANSLATIONS.playHome.joinBtn.en} →
            </Link>
          </div>
        </section>

        {/* 3. Category Tabs / Chips with Colored Dots */}
        <section aria-labelledby="all-games-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="all-games-heading"
              className="anton-title m-0 text-[28px] leading-none text-ink"
            >
              {TRANSLATIONS.playHome.allGamesHeading.en}
            </h2>
            <div
              role="group"
              aria-label="Filter games by category"
              className="flex flex-wrap gap-2"
            >
              {(["All", "Cinema", "Cricket", "Party"] as const).map((cat) => (
                <Chip
                  key={cat}
                  active={filter === cat}
                  dotColor={FILTER_DOTS[cat]}
                  onClick={() => setFilter(cat)}
                  className="px-3.5 text-[13px]"
                >
                  <span className="te-script text-[15px]" lang="te">
                    {TRANSLATIONS.categories[cat].te}
                  </span>
                  <span>{TRANSLATIONS.categories[cat].en}</span>
                </Chip>
              ))}
            </div>
          </div>

          {/* 4. 2-Column Game Stickers on Phone, 3-Column on Large Screen */}
          <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {filteredGames.map((game) => {
              const panelColor = CATEGORY_COLORS[game.category];
              const modeLabel = TRANSLATIONS.modes[game.modeKey].en;

              return (
                <Link
                  key={game.slug}
                  href={`/play/${game.slug}`}
                  className="wall-card-interactive wall-sticker-sm flex flex-col justify-between p-3.5 text-ink sm:p-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="mono-num text-[12px] text-ink">
                        {game.number}
                      </span>
                      <Badge
                        tone={game.isOnlineOnly ? "cyan" : "white"}
                        className="px-2 py-0.5 text-[10px]"
                      >
                        {modeLabel}
                      </Badge>
                    </div>

                    <div
                      className="mt-2.5 flex h-[76px] items-center justify-center rounded-[12px] border-[2.5px] border-ink text-ink sm:h-[92px]"
                      style={{ backgroundColor: panelColor }}
                    >
                      <div className="h-[48px] w-[48px] sm:h-[60px] sm:w-[60px]">
                        <WallIcon kind={game.iconKind} />
                      </div>
                    </div>

                    {/* Rule 1: Telugu leads on every card (~10% larger than English beside/under it) */}
                    <p
                      className="te-script m-0 mt-2.5 text-[18px] leading-[1.55] text-ink sm:text-[21px]"
                      lang="te"
                    >
                      {game.title.te}
                    </p>
                    <h3 className="anton-title m-0 text-[16px] leading-[1.1] text-ink sm:text-[19px]">
                      {game.title.en}
                    </h3>
                    <p className="m-0 mt-1 text-[12px] font-medium leading-[1.4] text-ink sm:text-[13px]">
                      {game.description.en}
                    </p>
                  </div>

                  <div className="mt-3">
                    <span className="inline-flex min-h-[38px] w-full items-center justify-center rounded-[10px] border-[2px] border-ink bg-yellow px-2 text-[12px] font-extrabold uppercase tracking-wider text-ink shadow-logo">
                      {TRANSLATIONS.playHome.playAction.en} →
                    </span>
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
