"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORY_COLORS } from "@tfi/config/tokens";
import { WallIcon } from "@/components/icons";
import {
  Badge,
  BidDisplay,
  Chip,
  Sticker,
  TapeStrip,
  WallLinkButton,
} from "@/components/sticker-kit";
import { FAN_VIBES, GAMES_CATALOG, TRANSLATIONS } from "@/lib/i18n";

type CategoryFilter = "All" | "Cinema" | "Cricket" | "Party";

const FILTER_DOTS: Record<CategoryFilter, string> = {
  All: "#FFFFFF",
  Cinema: CATEGORY_COLORS.Cinema,
  Cricket: CATEGORY_COLORS.Cricket,
  Party: CATEGORY_COLORS.Party,
};

const STICKER_ROTS = [-1, 0.8, -0.6, 1, -0.8] as const;

export default function LandingPage() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [vibe, setVibe] = useState<string>("bhAAi");

  const filteredGames = GAMES_CATALOG.filter(
    (g) => filter === "All" || g.category === filter,
  );

  return (
    <div className="w-full overflow-x-hidden text-ink" data-label="Landing page">
      <a
        href="#content"
        className="visually-hidden fixed left-3 top-3 z-50 rounded-[12px] border-[2.5px] border-ink bg-yellow px-4 py-2 font-extrabold text-ink shadow-btn"
      >
        <span className="te-script mr-2 text-base" lang="te">
          {TRANSLATIONS.nav.skipToContent.te}
        </span>
        <span>{TRANSLATIONS.nav.skipToContent.en}</span>
      </a>

      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-20 border-b-[3px] border-ink bg-concrete">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-10">
          <Link
            href="#top"
            className="flex min-h-[46px] items-center gap-2.5 rounded-[14px] border-[3px] border-ink bg-sticker py-1 pl-2 pr-4 shadow-logo"
          >
            <span className="inline-block h-[34px] w-[34px] rounded-[10px] border-[2.5px] border-ink bg-yellow p-[3px] text-ink">
              <WallIcon kind="mark" />
            </span>
            <span className="anton-title text-[26px] leading-none text-ink">
              {TRANSLATIONS.brand.name}
            </span>
          </Link>

          <nav
            aria-label="Main"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-bold md:gap-x-7"
          >
            <a href="#games" className=" inline-flex min-h-[44px] items-center py-2">
              {TRANSLATIONS.nav.games.en}
            </a>
            <a href="#how" className="inline-flex min-h-[44px] items-center py-2">
              {TRANSLATIONS.nav.howItPlays.en}
            </a>
            <a href="#auction" className="inline-flex min-h-[44px] items-center py-2">
              {TRANSLATIONS.nav.auction.en}
            </a>
            <WallLinkButton href="/play" variant="yellow" size="sm">
              {TRANSLATIONS.nav.playNow.en} →
            </WallLinkButton>
          </nav>
        </div>
      </header>

      <main id="content" tabIndex={-1}>
        {/* Hero */}
        <section id="top" className="relative" aria-label="Hero">
          <svg
            aria-hidden="true"
            viewBox="0 0 600 700"
            preserveAspectRatio="none"
            className="pointer-events-none absolute right-0 top-0 hidden h-full w-[46%] lg:block"
          >
            <polygon points="170,0 600,0 600,700 0,700" fill="#F6BE18" />
          </svg>

          <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-4 pb-16 pt-10 md:px-10 md:pb-20 md:pt-16">
            {/* Hero Left Column */}
            <div className="min-w-0 flex-1 basis-[480px]">
              <p className="wall-chip mb-6 text-[13px]">
                {TRANSLATIONS.landing.betaPill.en}
              </p>

              <h1 className="anton-title m-0 text-[clamp(56px,9.6vw,124px)] leading-[0.94] text-ink">
                Movies.
                <br />
                Cricket.
                <br />
                The{" "}
                <span
                  className="marker-accent inline-block rounded-[14px] border-[3px] border-ink bg-sticker px-[18px] text-[0.74em] leading-[1.25] text-magenta"
                  style={{
                    transform: "rotate(-1.5deg)",
                    boxShadow: "5px 5px 0 #141313",
                  }}
                >
                  Gang
                </span>
              </h1>

              <p
                className="te-script mt-6 text-[24px] leading-[1.6] text-ink"
                lang="te"
              >
                {TRANSLATIONS.brand.tagline.te}
              </p>
              <p className="mt-1.5 max-w-[500px] text-[18px] font-bold leading-[1.55] text-ink">
                {TRANSLATIONS.landing.heroSubline.en}
              </p>

              <div className="mt-7 flex flex-wrap gap-[18px]">
                <WallLinkButton href="/play" variant="yellow">
                  {TRANSLATIONS.nav.playNow.en} →
                </WallLinkButton>
                <WallLinkButton href="#games" variant="white">
                  {TRANSLATIONS.landing.seeGames.en}
                </WallLinkButton>
              </div>

              <ul
                role="list"
                className="mt-7 flex list-none flex-wrap gap-x-[26px] gap-y-2 p-0 text-[14px] font-extrabold text-ink"
              >
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2.5 w-2.5 rotate-45 bg-ink"
                  />
                  {TRANSLATIONS.landing.facts.noSignup.en}
                </li>
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2.5 w-2.5 rotate-45 bg-ink"
                  />
                  {TRANSLATIONS.landing.facts.onePhoneOrOnline.en}
                </li>
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2.5 w-2.5 rotate-45 bg-ink"
                  />
                  {TRANSLATIONS.landing.facts.teluguAndEnglish.en}
                </li>
              </ul>
            </div>

            {/* Hero Right Column: Judge & Auction Preview Stickers */}
            <div className="relative flex min-h-[500px] min-w-0 flex-1 basis-[340px] justify-center">
              {/* Decorative X & Star doodles */}
              <svg
                aria-hidden="true"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                className="absolute left-[2%] top-0"
              >
                <path
                  d="M10 10L54 54M54 10L10 54"
                  stroke="#141313"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                aria-hidden="true"
                width="70"
                height="70"
                viewBox="0 0 70 70"
                className="absolute -top-1.5 right-0 rotate-12"
              >
                <path
                  d="M35 5l8 20 22 2-17 14 6 22-19-12-19 12 6-22L5 27l22-2z"
                  fill="#FFFFFF"
                  stroke="#141313"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Main Sticker: Judge-round card (Transify) */}
              <Sticker
                tilt={1.5}
                className="relative mt-8 h-fit w-[300px] p-[18px]"
                aria-label="Sample Judge Card: Transify"
              >
                <div className="flex items-center justify-between">
                  <span className="mono-num text-[15px] text-ink">SCORE 4/6</span>
                  <span className="mono-num rounded-full border-[2.5px] border-ink bg-yellow px-3 py-0.5 text-[15px] text-ink">
                    0:42
                  </span>
                </div>

                <div className="mt-3.5 rounded-[14px] border-[2.5px] border-ink bg-card px-4 py-3.5 text-center">
                  <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink">
                    THE JUDGE READS
                  </p>
                  <p
                    className="te-script m-0 mt-1 text-[22px] leading-[1.55] text-ink"
                    lang="te"
                  >
                    &ldquo;రోగ్&rdquo;
                  </p>
                  <p className="m-0 text-[34px] font-extrabold leading-[1.1] text-ink">
                    &ldquo;Rogue&rdquo;
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-[12px] border-[2.5px] border-ink bg-yellow px-3.5 py-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-ink">
                    ANSWER
                  </span>
                  <span className="text-right">
                    <span
                      className="te-script block text-[22px] leading-[1.55] text-ink"
                      lang="te"
                    >
                      పోకిరి
                    </span>
                    <span className="block text-[16px] font-extrabold text-ink">
                      Pokiri
                    </span>
                  </span>
                </div>

                <div className="mt-3.5 flex gap-3">
                  <span className="wall-btn min-h-[48px] flex-1 bg-sticker px-0 text-[14px] text-ink">
                    <span aria-hidden="true">✕</span> Skip
                  </span>
                  <span className="wall-btn min-h-[48px] flex-1 bg-green px-0 text-[14px] text-ink">
                    <span aria-hidden="true">✓</span> Correct
                  </span>
                </div>
              </Sticker>

              {/* Second Sticker: Auction lot card */}
              <Sticker
                tilt={-1.5}
                className="absolute bottom-1.5 left-0 w-[236px] p-3.5"
                aria-label="Sample Auction Card"
              >
                <div className="flex items-center justify-between">
                  <span className="mono-num text-[12px] text-ink">LOT 3/10</span>
                  <Badge tone="cyan" mono className="px-2.5 py-0.5 text-[12px]">
                    K7QM
                  </Badge>
                </div>
                <p
                  className="te-script m-0 mt-2 text-[18px] leading-[1.55] text-ink"
                  lang="te"
                >
                  జెర్సీ
                </p>
                <p className="m-0 text-[13px] font-extrabold text-ink">
                  JERSEY · base 5 Cr
                </p>
                <div className="mt-2 rounded-[12px] border-[2.5px] border-ink bg-yellow px-3 py-1.5">
                  <span className="mono-num text-[28px] leading-[1.2] text-ink">
                    20 Cr
                  </span>
                </div>
                <span
                  className="wall-btn mt-2.5 min-h-[46px] w-full bg-magenta px-0 text-ink"
                  style={{ fontSize: "19px" }}
                >
                  ▲ Bid 25 Cr
                </span>
              </Sticker>
            </div>
          </div>
        </section>

        {/* Scrolling Tape Strip */}
        <TapeStrip
          items={[
            "Head Set Go",
            "Transify",
            "Dumb Charades",
            "Emoji Cinema",
            "Box Office Auction",
            "Cricket IQ",
            "Dream XI",
            "Cricket Auction",
            "Rapid Fire",
            "Most Likely",
          ]}
        />

        {/* Pick Your Game Wall */}
        <section
          id="games"
          aria-labelledby="pick-game-heading"
          className="mx-auto max-w-[1200px] px-4 pb-6 pt-16 md:px-10"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2
                id="pick-game-heading"
                className="anton-title m-0 text-[clamp(40px,6vw,72px)] leading-none text-ink"
              >
                {TRANSLATIONS.landing.pickYourGameHeading.en}
              </h2>
              <p
                className="te-script m-0 mt-2 text-[22px] leading-[1.55] text-ink"
                lang="te"
              >
                {TRANSLATIONS.landing.pickYourGameHeading.te}
              </p>
              <p className="m-0 mt-1 text-[18px] font-bold text-ink">
                {TRANSLATIONS.landing.pickYourGameSub.en}
              </p>
            </div>

            <div
              role="group"
              aria-label="Filter games by category"
              className="flex flex-wrap gap-3"
            >
              {(["All", "Cinema", "Cricket", "Party"] as const).map((cat) => (
                <Chip
                  key={cat}
                  active={filter === cat}
                  dotColor={FILTER_DOTS[cat]}
                  onClick={() => setFilter(cat)}
                >
                  <span className="te-script text-[15px]" lang="te">
                    {TRANSLATIONS.categories[cat].te}
                  </span>
                  <span>{TRANSLATIONS.categories[cat].en}</span>
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-9 gap-y-10 px-2 sm:grid-cols-2 lg:grid-cols-4">
            {filteredGames.map((game, idx) => {
              const rot = STICKER_ROTS[idx % STICKER_ROTS.length] ?? 0;
              const panelColor = CATEGORY_COLORS[game.category];
              const modeLabel = TRANSLATIONS.modes[game.modeKey].en;

              return (
                <Link
                  key={game.slug}
                  href={`/play/${game.slug}`}
                  className="wall-card-interactive wall-sticker p-[18px] text-ink"
                  style={{ transform: `rotate(${rot}deg)` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="mono-num text-[14px] text-ink">{game.number}</span>
                    <Badge
                      tone={game.isOnlineOnly ? "cyan" : "white"}
                      className="text-[11px]"
                    >
                      {modeLabel}
                    </Badge>
                  </div>

                  <div
                    className="mt-3 flex h-[108px] items-center justify-center rounded-[14px] border-[2.5px] border-ink text-ink"
                    style={{ backgroundColor: panelColor }}
                  >
                    <div className="h-[72px] w-[72px]">
                      <WallIcon kind={game.iconKind} />
                    </div>
                  </div>

                  {/* Rule 1: Telugu script leads on every card & title (~10% larger than English beside/under it) */}
                  <p
                    className="te-script m-0 mt-3.5 text-[24px] leading-[1.55] text-ink"
                    lang="te"
                  >
                    {game.title.te}
                  </p>
                  <h3 className="anton-title m-0 mt-0.5 text-[22px] leading-[1.05] text-ink">
                    {game.title.en}
                  </h3>
                  <p
                    className="te-script m-0 mt-2 text-[16px] leading-[1.55] text-ink"
                    lang="te"
                  >
                    {game.description.te}
                  </p>
                  <p className="m-0 mb-3.5 mt-0.5 text-[14px] font-medium leading-[1.45] text-ink">
                    {game.description.en}
                  </p>

                  <span className="inline-flex min-h-[40px] items-center rounded-[10px] border-[2.5px] border-ink bg-yellow px-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-ink shadow-logo">
                    {TRANSLATIONS.playHome.playAction.en} →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How It Plays ("Three steps. No manual.") */}
        <section
          id="how"
          aria-labelledby="how-heading"
          className="mt-20 border-b-[3px] border-t-[3px] border-ink bg-yellow"
        >
          <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-10 md:py-20">
            <h2
              id="how-heading"
              className="anton-title m-0 text-[clamp(40px,6vw,72px)] leading-none text-ink"
            >
              {TRANSLATIONS.landing.howHeading.en}
            </h2>
            <p
              className="te-script m-0 mt-2 text-[22px] leading-[1.55] text-ink"
              lang="te"
            >
              {TRANSLATIONS.landing.howHeading.te}
            </p>

            <div className="mt-12 grid grid-cols-1 gap-9 px-2 md:grid-cols-3">
              {TRANSLATIONS.landing.steps.map((step) => (
                <Sticker key={step.num} className="p-[22px]">
                  <span className="anton-title block text-[72px] leading-none text-magenta">
                    {step.num}
                  </span>
                  <p
                    className="te-script m-0 mt-2 text-[22px] leading-[1.55] text-ink"
                    lang="te"
                  >
                    {step.title.te}
                  </p>
                  <h3 className="anton-title m-0 mt-0.5 text-[26px] text-ink">
                    {step.title.en}
                  </h3>
                  <p className="m-0 mt-2 text-[16px] font-medium leading-[1.55] text-ink">
                    {step.body.en}
                  </p>
                </Sticker>
              ))}
            </div>
          </div>
        </section>

        {/* Dark Ink Section: Box Office Auction Spotlight */}
        <section
          id="auction"
          aria-labelledby="auction-heading"
          className="bg-ink text-concrete"
        >
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 py-16 md:px-10 md:py-20">
            <div className="min-w-0 flex-1 basis-[420px]">
              <span className="wall-chip border-concrete bg-cyan text-[13px] text-ink">
                {TRANSLATIONS.landing.auctionBadge.en}
              </span>
              <h2
                id="auction-heading"
                className="anton-title m-0 mt-5 text-[clamp(40px,5.6vw,68px)] leading-none text-sticker"
              >
                {TRANSLATIONS.landing.auctionHeading.en}
              </h2>
              <p
                className="te-script m-0 mt-3 text-[22px] leading-[1.55] text-concrete"
                lang="te"
              >
                {TRANSLATIONS.landing.auctionHeading.te}
              </p>

              <ul
                role="list"
                className="mt-6 flex list-none flex-col gap-3.5 p-0 text-[18px] font-bold leading-[1.5] text-concrete"
              >
                {TRANSLATIONS.landing.auctionBullets.map((b, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-3 w-3 shrink-0 rotate-45 bg-yellow"
                    />
                    <span>{b.en}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-[14px] font-bold text-concrete">
                {TRANSLATIONS.landing.noRealMoneyNote.en}
              </p>

              <div className="mt-6">
                <WallLinkButton
                  href="/play/box-office-auction"
                  variant="yellow"
                  lightBorder
                >
                  {TRANSLATIONS.landing.tryAuctionBtn.en} →
                </WallLinkButton>
              </div>
            </div>

            <div className="min-w-0 max-w-[440px] flex-1 basis-[340px] p-2.5">
              <Sticker className="p-[22px] text-ink">
                <div className="flex items-center justify-between">
                  <span className="mono-num text-[14px] text-ink">LOT 3 / 10</span>
                  <Badge tone="cyan" mono className="text-[14px]">
                    K7QM
                  </Badge>
                </div>

                <p
                  className="te-script m-0 mt-3.5 text-[34px] leading-[1.5] text-ink"
                  lang="te"
                >
                  జెర్సీ
                </p>
                <p className="anton-title m-0 text-[36px] leading-none text-ink">
                  Jersey
                </p>
                <p className="m-0 mt-1 text-[14px] font-bold text-ink">
                  2019 · Gowtam Tinnanuri · base 5 Cr
                </p>

                <div className="mt-3.5 flex gap-2">
                  {[
                    { label: "BOX OFFICE", val: "???" },
                    { label: "TALK", val: "???" },
                    { label: "CULT", val: "???" },
                  ].map((box) => (
                    <div
                      key={box.label}
                      className="flex-1 rounded-[10px] border-2 border-dashed border-ink px-1 py-1.5 text-center text-[11px] font-extrabold leading-[1.3] text-ink"
                    >
                      {box.label}
                      <br />
                      <span className="mono-num text-[18px]">{box.val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5">
                  <BidDisplay currentBidCr={20} label="CURRENT BID" />
                </div>

                <Link
                  href="/play/box-office-auction"
                  className="wall-btn mt-3.5 w-full bg-magenta text-ink"
                  style={{ fontSize: "20px" }}
                >
                  ▲ Bid 25 Cr
                </Link>
              </Sticker>
            </div>
          </div>
        </section>

        {/* Telugu First Section */}
        <section
          aria-labelledby="telugu-first-heading"
          className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 pb-6 pt-20 md:px-10"
        >
          <div className="min-w-0 flex-1 basis-[420px]">
            <h2
              id="telugu-first-heading"
              className="anton-title m-0 text-[clamp(40px,5.6vw,68px)] leading-none text-ink"
            >
              Telugu first.
              <br />
              Two scripts on every card.
            </h2>
            <p
              className="te-script m-0 mt-3 text-[22px] leading-[1.55] text-ink"
              lang="te"
            >
              {TRANSLATIONS.landing.teluguFirstHeading.te}
            </p>
            <p className="m-0 mt-3 max-w-[520px] text-[18px] font-bold leading-[1.55] text-ink">
              {TRANSLATIONS.landing.teluguFirstBody.en}
            </p>

            <p className="mb-2 mt-6 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink">
              {TRANSLATIONS.landing.fanVibeLabel.en}
            </p>
            <div
              role="group"
              aria-label="Fan vibe"
              className="flex flex-wrap gap-3"
            >
              {FAN_VIBES.map((v) => (
                <Chip key={v} active={vibe === v} onClick={() => setVibe(v)}>
                  {v}
                </Chip>
              ))}
            </div>
          </div>

          <div className="min-w-0 max-w-[440px] flex-1 basis-[340px] p-2.5">
            <Sticker tilt={-1.5} className="p-6 text-center">
              <span className="wall-chip min-h-[34px] bg-yellow text-[12px] text-ink">
                {TRANSLATIONS.landing.playingAs.en} {vibe}
              </span>
              <p
                className="te-script m-0 mt-3.5 text-[64px] leading-[1.5] text-ink sm:text-[76px]"
                lang="te"
              >
                పోకిరి
              </p>
              <p className="m-0 text-[32px] font-extrabold text-ink">Pokiri</p>
              <p className="m-0 mt-2.5 inline-block rounded-full border-2 border-ink bg-card px-3.5 py-1 text-[13px] font-extrabold text-ink">
                2006 · Puri Jagannadh
              </p>
            </Sticker>
          </div>
        </section>

        {/* Closing Block */}
        <section
          aria-labelledby="closing-heading"
          className="mx-auto max-w-[1200px] px-4 pb-14 pt-16 md:px-10"
        >
          <Sticker bg="yellow" className="mx-2 px-6 py-12 text-center">
            <h2
              id="closing-heading"
              className="anton-title m-0 text-[clamp(40px,6vw,76px)] leading-none text-ink"
            >
              {TRANSLATIONS.landing.closingHeading.en}
            </h2>
            <p
              className="te-script m-0 mt-2.5 text-[26px] leading-[1.6] text-ink"
              lang="te"
            >
              {TRANSLATIONS.landing.closingHeading.te}
            </p>
            <div className="mt-5">
              <WallLinkButton href="/play" variant="white">
                {TRANSLATIONS.nav.playNow.en} →
              </WallLinkButton>
            </div>
          </Sticker>
        </section>
      </main>

      {/* Footer with Unofficial & Legal Disclaimer (Rule 3) */}
      <footer className="bg-ink text-concrete">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-7 text-[14px] leading-[1.5] md:px-10">
          <span className="anton-title text-[22px] text-concrete">
            {TRANSLATIONS.brand.name}
          </span>
          <p className="m-0 max-w-[640px] text-concrete">
            {TRANSLATIONS.brand.unofficialDisclaimer.en}
          </p>
          <nav aria-label="Footer legal links" className="flex gap-4 font-bold">
            <Link href="/about" className="underline">
              About
            </Link>
            <Link href="/privacy" className="underline">
              Privacy
            </Link>
            <Link href="/terms" className="underline">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
