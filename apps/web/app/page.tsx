"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MODE_COLORS } from "@tfi/config/tokens";
import { WallIcon } from "@/components/icons";
import { GameTitle } from "@/components/game-title";
import { LangSwitch } from "@/components/lang-switch";
import { BiWord, Tx, useLang, useT } from "@/components/lang-provider";
import {
  Badge,
  BidDisplay,
  Chip,
  Sticker,
  TapeStrip,
  WallLinkButton,
} from "@/components/sticker-kit";
import { useVisibleGames } from "@/components/flags-provider";
import { MODE_FILTERS, filterByMode, panelModeKey, type ModeFilter } from "@/lib/games";
import { BRAND_NAME, FAN_VIBES, TRANSLATIONS } from "@/lib/i18n";

const FILTER_DOTS: Record<ModeFilter, string> = {
  All: "#FFFFFF",
  onePhone: MODE_COLORS.onePhone,
  online: MODE_COLORS.online,
};

const STICKER_ROTS = [-1, 0.8, -0.6, 1, -0.8] as const;
const L = TRANSLATIONS.landing;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

const FAQ_ITEMS = [
  {
    q: { en: "Do I need to sign in or create an account?", te: "సైన్-ఇన్ లేదా అకౌంట్ అవసరమా?" },
    a: {
      en: "Never. Pick a game and start playing immediately on one phone.",
      te: "అవసరం లేదు. ఆట ఎంచుకుని వెంటనే ఒక ఫోన్‌లో ఆడొచ్చు.",
    },
  },
  {
    q: { en: "Does it work without internet?", te: "ఇంటర్నెట్ లేకపోయినా పనిచేస్తుందా?" },
    a: {
      en: "Yes. Every one-phone game works offline once opened.",
      te: "అవును. ఒక ఫోన్ ఆటలన్నీ ఆఫ్‌లైన్‌లోనూ ఆడొచ్చు.",
    },
  },
  {
    q: { en: "Is there any real money involved?", te: "నిజమైన డబ్బు ఏమైనా ఉంటుందా?" },
    a: {
      en: "No. All scores, crowns, and virtual budgets are for fun only.",
      te: "లేదు. స్కోర్లు, క్రౌన్లు, బడ్జెట్లు అన్నీ సరదా కోసమే.",
    },
  },
  {
    q: { en: "Can we switch between English and Telugu?", te: "ఇంగ్లీష్ మరియు తెలుగు మధ్య మారొచ్చా?" },
    a: {
      en: "Yes. Tap the language switch in the top bar anytime, even mid-setup.",
      te: "అవును. పై బార్‌లో తె / EN నొక్కి ఎప్పుడైనా మారొచ్చు.",
    },
  },
  {
    q: { en: "How many people can play on one phone?", te: "ఒక ఫోన్‌లో ఎంతమంది ఆడొచ్చు?" },
    a: {
      en: "2 to 10 players or up to 4 teams, depending on the game.",
      te: "ఆటను బట్టి 2 నుండి 10 మంది లేదా 4 జట్లు ఆడొచ్చు.",
    },
  },
] as const;

export default function LandingPage() {
  const [filter, setFilter] = useState<ModeFilter>("All");
  const [vibe, setVibe] = useState<string>("bhAAi");
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { lang } = useLang();
  const t = useT();

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 420);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  const visibleGames = useVisibleGames();
  const filteredGames = filterByMode(visibleGames, filter);
  const tapeItems = visibleGames.map((g) => g.title[lang]);

  return (
    <div className="w-full overflow-x-hidden text-ink" data-label="Landing page">
      <a
        href="#content"
        className="visually-hidden fixed left-3 top-3 z-50 rounded-[12px] border-[2.5px] border-ink bg-yellow px-4 py-2 font-extrabold text-ink shadow-btn"
      >
        <Tx v={TRANSLATIONS.common.skipToContent} />
      </a>

      {/* Sticky top bar */}
      <header className="sticky top-0 z-20 border-b-[3px] border-ink bg-concrete">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-10">
          <Link
            href="#top"
            className="flex min-h-[46px] items-center gap-2.5 rounded-[14px] border-[3px] border-ink bg-sticker py-1 pl-2 pr-4 shadow-logo"
          >
            <span className="inline-block h-[34px] w-[34px] rounded-[10px] border-[2.5px] border-ink bg-yellow p-[3px] text-ink">
              <WallIcon kind="mark" />
            </span>
            <span className="anton-title keep-case text-[26px] leading-none text-ink">
              {BRAND_NAME}
            </span>
          </Link>

          <nav
            aria-label={t(TRANSLATIONS.nav.mainNav)}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-bold md:gap-x-7"
          >
            <a href="#games" className="inline-flex min-h-[44px] items-center py-2">
              <Tx v={TRANSLATIONS.nav.games} />
            </a>
            <a href="#how" className="inline-flex min-h-[44px] items-center py-2">
              <Tx v={TRANSLATIONS.nav.howItPlays} />
            </a>
            <a href="#auction" className="inline-flex min-h-[44px] items-center py-2">
              <Tx v={TRANSLATIONS.nav.auction} />
            </a>
            <LangSwitch />
            <WallLinkButton href="/play" variant="yellow" size="sm">
              <Tx v={TRANSLATIONS.nav.playNow} /> →
            </WallLinkButton>
          </nav>
        </div>
      </header>

      <main id="content" tabIndex={-1}>
        {/* Hero */}
        <section id="top" className="relative" aria-label={t(L.heroLabel)}>
          <svg
            aria-hidden="true"
            viewBox="0 0 600 700"
            preserveAspectRatio="none"
            className="pointer-events-none absolute right-0 top-0 hidden h-full w-[46%] lg:block"
          >
            <polygon points="170,0 600,0 600,700 0,700" fill="#F6BE18" />
          </svg>

          <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-8 px-4 pb-10 pt-5 md:gap-12 md:px-10 md:pb-20 md:pt-14">
            {/* Hero left column */}
            <div className="min-w-0 flex-1 basis-[480px]">
              <p className="wall-chip mb-4 text-[12px] md:mb-6 md:text-[13px]">
                <Tx v={L.betaPill} />
              </p>

              <h1 className="anton-title wall-balance m-0 text-[clamp(42px,8.5vw,112px)] leading-[0.94] text-ink">
                <Tx v={L.heroLine1} />
                <br />
                <Tx v={L.heroLine2} />
                <br />
                <Tx v={L.heroLead} />{" "}
                <span
                  className="marker-accent inline-block rounded-[14px] border-[3px] border-ink bg-sticker px-[14px] text-[0.74em] leading-[1.25] text-magenta md:px-[18px]"
                  style={{ transform: "rotate(-1.5deg)", boxShadow: "5px 5px 0 #141313" }}
                >
                  <Tx v={L.heroMarker} />
                </span>
              </h1>

              <p className="mt-4 text-[19px] font-extrabold leading-[1.45] text-ink md:mt-6 md:text-[24px] md:leading-[1.6]">
                <Tx v={TRANSLATIONS.brand.tagline} />
              </p>
              <p className="wall-prose mt-1.5 text-[15px] font-bold leading-[1.5] text-ink md:text-[18px] md:leading-[1.55]">
                <Tx v={L.heroSubline} />
              </p>

              <div className="mt-5 flex flex-wrap gap-3.5 md:mt-7 md:gap-[18px]">
                <WallLinkButton href="/play" variant="yellow">
                  <Tx v={TRANSLATIONS.nav.playNow} /> →
                </WallLinkButton>
                <WallLinkButton href="#games" variant="white">
                  <Tx v={L.seeGames} />
                </WallLinkButton>
              </div>

              <ul
                role="list"
                className="mt-7 flex list-none flex-wrap gap-x-[26px] gap-y-2 p-0 text-[14px] font-extrabold text-ink"
              >
                {[L.facts.noSignup, L.facts.onePhoneOrOnline, L.facts.teluguAndEnglish].map((f) => (
                  <li key={f.en} className="flex items-center gap-2">
                    <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rotate-45 bg-ink" />
                    <Tx v={f} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Hero right column: Judge-round card + auction sticker */}
            <div className="relative flex min-h-[500px] min-w-0 flex-1 basis-[340px] justify-center">
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

              <div className="mt-8 flex flex-col items-end gap-4">
                <Sticker
                  tilt={1.5}
                  className="relative h-fit w-[300px] p-[18px]"
                  role="group"
                  aria-label={t(L.mock.judgeCardLabel)}
                >
                <div className="flex items-center justify-between">
                  <span className="mono-num text-[15px] text-ink">
                    <Tx v={L.mock.score} />
                  </span>
                  <span className="mono-num rounded-full border-[2.5px] border-ink bg-yellow px-3 py-0.5 text-[15px] text-ink">
                    0:42
                  </span>
                </div>

                <div className="mt-3.5 rounded-[14px] border-[2.5px] border-ink bg-card px-4 py-3.5 text-center">
                  <p className="m-0 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink">
                    <Tx v={L.mock.judgeReads} />
                  </p>
                  <p className="m-0 mt-1 text-[34px] font-extrabold leading-[1.1] text-ink">
                    &ldquo;
                    <Tx v={L.mock.clue} />
                    &rdquo;
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 rounded-[12px] border-[2.5px] border-ink bg-yellow px-3.5 py-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-ink">
                    <Tx v={L.mock.answerLabel} />
                  </span>
                  <span className="text-right text-[20px] font-extrabold text-ink">
                    <BiWord word={L.mock.answerWord} />
                  </span>
                </div>

                <div className="mt-3.5 flex gap-3">
                  <span className="wall-btn min-h-[48px] flex-1 bg-sticker px-0 text-[14px] text-ink">
                    <span aria-hidden="true">✕</span> <Tx v={TRANSLATIONS.common.skip} />
                  </span>
                  <span className="wall-btn min-h-[48px] flex-1 bg-green px-0 text-[14px] text-ink">
                    <span aria-hidden="true">✓</span> <Tx v={TRANSLATIONS.common.correct} />
                  </span>
                </div>
              </Sticker>

                <Sticker
                  tilt={-1.5}
                  className="w-[244px] self-start p-3.5"
                  role="group"
                  aria-label={t(L.mock.auctionCardLabel)}
                >
                  <div className="flex items-center justify-between">
                    <span className="mono-num text-[12px] text-ink">
                      <Tx v={L.mock.lot} />
                    </span>
                    <Badge tone="cyan" mono className="px-2.5 py-0.5 text-[12px]">
                      K7QM
                    </Badge>
                  </div>
                  <p className="m-0 mt-2 text-[13px] font-extrabold text-ink">
                    <Tx v={L.mock.lotBase} />
                  </p>
                  <div className="mt-2 rounded-[12px] border-[2.5px] border-ink bg-yellow px-3 py-1.5">
                    <span className="mono-num text-[28px] leading-[1.2] text-ink">20 Cr</span>
                  </div>
                  <span
                    className="wall-btn mt-2.5 min-h-[46px] w-full bg-magenta px-0 text-ink"
                    style={{ fontSize: "19px" }}
                  >
                    ▲ <Tx v={L.mock.bid25} />
                  </span>
                </Sticker>
              </div>
            </div>
          </div>
        </section>

        <TapeStrip items={tapeItems} label={t(L.pickYourGameHeading)} />

        {/* Pick your game */}
        <section
          id="games"
          aria-labelledby="pick-game-heading"
          className="mx-auto max-w-[1200px] px-4 pb-6 pt-16 md:px-10"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2
                id="pick-game-heading"
                className="anton-title wall-balance m-0 text-[clamp(36px,5.4vw,64px)] leading-none text-ink"
              >
                <Tx v={L.pickYourGameHeading} />
              </h2>
              <p className="m-0 mt-2 text-[18px] font-bold text-ink">
                <Tx v={L.pickYourGameSub} />
              </p>
            </div>

            <div
              role="group"
              aria-label={t(TRANSLATIONS.modeFilter.filterLabel)}
              className="flex flex-wrap gap-3"
            >
              {MODE_FILTERS.map((cat) => (
                <Chip
                  key={cat}
                  active={filter === cat}
                  dotColor={FILTER_DOTS[cat]}
                  onClick={() => setFilter(cat)}
                >
                  <Tx v={TRANSLATIONS.modeFilter[cat]} />
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-9 gap-y-10 px-2 sm:grid-cols-2 lg:grid-cols-4">
            {filteredGames.map((game, idx) => {
              const rot = STICKER_ROTS[idx % STICKER_ROTS.length] ?? 0;
              const displayNum = String(
                visibleGames.findIndex((g) => g.slug === game.slug) + 1,
              ).padStart(2, "0");
              return (
                <Link
                  key={game.slug}
                  href={`/play/${game.slug}`}
                  className="wall-card-interactive wall-sticker p-[18px] text-ink"
                  style={{ transform: `rotate(${rot}deg)` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="mono-num text-[14px] text-ink">{displayNum}</span>
                    <Badge tone={game.isOnlineOnly ? "cyan" : "white"} className="text-[11px]">
                      <Tx v={TRANSLATIONS.modes[game.modeKey]} />
                    </Badge>
                  </div>

                  <div
                    className="mt-3 flex h-[108px] items-center justify-center rounded-[14px] border-[2.5px] border-ink text-ink"
                    style={{ backgroundColor: MODE_COLORS[panelModeKey(game)] }}
                  >
                    <div className="h-[72px] w-[72px]">
                      <WallIcon kind={game.iconKind} />
                    </div>
                  </div>

                  <div className="mt-3.5">
                    <GameTitle title={game.title} />
                  </div>
                  <p className="m-0 mb-3.5 mt-1.5 text-[14px] font-medium leading-[1.45] text-ink">
                    <Tx v={game.description} />
                  </p>

                  {game.isOnlineOnly ? (
                    <span className="inline-flex min-h-[40px] items-center rounded-[10px] border-[2.5px] border-ink bg-concrete px-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-ink">
                      <Tx v={TRANSLATIONS.common.comingSoon} />
                    </span>
                  ) : (
                    <span className="inline-flex min-h-[40px] items-center rounded-[10px] border-[2.5px] border-ink bg-yellow px-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-ink shadow-logo">
                      <Tx v={TRANSLATIONS.playHome.playAction} /> →
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* How it plays */}
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
              <Tx v={L.howHeading} />
            </h2>

            <div className="mt-12 grid grid-cols-1 gap-9 px-2 md:grid-cols-3">
              {L.steps.map((step) => (
                <Sticker key={step.num} className="p-[22px]">
                  <span className="anton-title block text-[72px] leading-none text-magenta">
                    {step.num}
                  </span>
                  <h3 className="anton-title m-0 mt-1.5 text-[26px] text-ink">
                    <Tx v={step.title} />
                  </h3>
                  <p className="m-0 mt-2 text-[16px] font-medium leading-[1.55] text-ink">
                    <Tx v={step.body} />
                  </p>
                </Sticker>
              ))}
            </div>
          </div>
        </section>

        {/* Auction spotlight */}
        <section id="auction" aria-labelledby="auction-heading" className="bg-ink text-concrete">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 py-16 md:px-10 md:py-20">
            <div className="min-w-0 flex-1 basis-[420px]">
              <span className="wall-chip border-concrete bg-cyan text-[13px] text-ink">
                <Tx v={L.auctionBadge} />
              </span>
              <h2
                id="auction-heading"
                className="anton-title wall-balance m-0 mt-5 text-[clamp(30px,4.4vw,54px)] leading-[1.04] text-sticker"
              >
                <Tx v={L.auctionHeading} />
              </h2>

              <ul
                role="list"
                className="mt-6 flex list-none flex-col gap-3.5 p-0 text-[18px] font-bold leading-[1.5] text-concrete"
              >
                {L.auctionBullets.map((b) => (
                  <li key={b.en} className="flex gap-3.5">
                    <span aria-hidden="true" className="mt-2 h-3 w-3 shrink-0 rotate-45 bg-yellow" />
                    <span>
                      <Tx v={b} />
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-[14px] font-bold text-concrete">
                <Tx v={TRANSLATIONS.common.coinsOnly} />
              </p>

              <div className="mt-6">
                <span className="inline-flex min-h-[48px] items-center rounded-[14px] border-[2.5px] border-concrete bg-concrete px-6 text-[15px] font-extrabold uppercase tracking-wider text-ink">
                  <Tx v={TRANSLATIONS.common.comingSoon} />
                </span>
              </div>
            </div>

            <div className="min-w-0 max-w-[440px] flex-1 basis-[340px] p-2.5">
              <Sticker className="p-[22px] text-ink">
                <div className="flex items-center justify-between">
                  <span className="mono-num text-[14px] text-ink">
                    <Tx v={L.mock.lotLong} />
                  </span>
                  <Badge tone="cyan" mono className="text-[14px]">
                    K7QM
                  </Badge>
                </div>

                <div className="mt-3.5">
                  <GameTitle
                    as="p"
                    title={L.mock.lotWord}
                    teClassName="text-[34px]"
                    enClassName="text-[36px]"
                  />
                </div>
                <p className="m-0 mt-1 text-[14px] font-bold text-ink">
                  <Tx v={L.mock.lotFacts} />
                </p>

                <div className="mt-3.5 flex gap-2">
                  {[L.mock.boxOffice, L.mock.talk, L.mock.cult].map((label) => (
                    <div
                      key={label.en}
                      className="flex-1 rounded-[10px] border-2 border-dashed border-ink px-1 py-1.5 text-center text-[11px] font-extrabold leading-[1.3] text-ink"
                    >
                      <Tx v={label} />
                      <br />
                      <span className="mono-num text-[18px]">???</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5">
                  <BidDisplay currentBidCr={20} label={t(L.mock.currentBid)} />
                </div>

                <Link
                  href="/play/box-office-auction"
                  className="wall-btn mt-3.5 w-full bg-magenta text-ink"
                  style={{ fontSize: "20px" }}
                >
                  ▲ <Tx v={L.mock.bid25} />
                </Link>
              </Sticker>
            </div>
          </div>
        </section>

        {/* Telugu on demand */}
        <section
          aria-labelledby="telugu-heading"
          className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 pb-6 pt-20 md:px-10"
        >
          <div className="min-w-0 flex-1 basis-[420px]">
            <h2
              id="telugu-heading"
              className="anton-title wall-balance m-0 text-[clamp(30px,4.4vw,54px)] leading-[1.04] text-ink"
            >
              <Tx v={L.teluguHeading} />
              <br />
              <Tx v={L.teluguHeadingSecond} />
            </h2>
            <p className="m-0 mt-3 max-w-[520px] text-[18px] font-bold leading-[1.55] text-ink">
              <Tx v={L.teluguBody} />
            </p>

            <p className="mb-2 mt-6 text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink">
              <Tx v={L.fanVibeLabel} />
            </p>
            <div role="group" aria-label={t(L.fanVibeGroup)} className="flex flex-wrap gap-3">
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
                <Tx v={L.playingAs} /> {vibe}
              </span>
              <div className="mt-3.5 text-ink">
                <BiWord
                  as="p"
                  word={L.pokiriWord}
                  leadClassName="m-0 text-[64px] font-extrabold leading-[1.5] text-ink sm:text-[76px]"
                  subClassName="text-[32px] font-extrabold"
                />
              </div>
              <p className="m-0 mt-2.5 inline-block rounded-full border-2 border-ink bg-card px-3.5 py-1 text-[13px] font-extrabold text-ink">
                <Tx v={L.pokiriFacts} />
              </p>
            </Sticker>
          </div>
        </section>

        {/* Mini CSS-only round demo + FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="mx-auto max-w-[1200px] px-4 pt-12 md:px-10"
        >
          <div className="mb-10 grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-center">
            <Sticker bg="card" tilt={-0.8} className="p-5">
              <span className="wall-chip min-h-[32px] bg-yellow text-[11px]">
                {lang === "te" ? "ఒక రౌండ్ ఎలా ఉంటుంది?" : "How a round feels"}
              </span>
              <div className="wall-demo-card mt-4 rounded-[14px] border-[2.5px] border-ink bg-sticker p-4 shadow-[4px_4px_0_#141313]">
                <div className="flex items-center justify-between text-[12px] font-extrabold">
                  <span>{lang === "te" ? "రౌండ్ 1 / 5" : "ROUND 1 / 5"}</span>
                  <span className="mono-num rounded-full border-2 border-ink bg-yellow px-2.5 py-0.5">
                    0:45
                  </span>
                </div>
                <p className="anton-title m-0 mt-3 text-[28px] text-ink">
                  {lang === "te" ? "మగధీర" : "MAGADHEERA"}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[12px] font-extrabold">
                  <span className="rounded-lg border-2 border-ink bg-sticker py-1.5">
                    ✕ {lang === "te" ? "పాస్" : "PASS"}
                  </span>
                  <span className="rounded-lg border-2 border-ink bg-green py-1.5">
                    ✓ {lang === "te" ? "సరి" : "GOT IT"}
                  </span>
                </div>
              </div>
            </Sticker>

            <div>
              <h2
                id="faq-heading"
                className="anton-title m-0 text-[clamp(30px,5vw,48px)] leading-none text-ink"
              >
                {lang === "te" ? "తరచుగా అడిగే ప్రశ్నలు" : "Quick answers"}
              </h2>
              <div className="mt-4 space-y-2.5">
                {FAQ_ITEMS.map((item, idx) => (
                  <details
                    key={idx}
                    className="rounded-[14px] border-[2.5px] border-ink bg-sticker px-4 py-3 shadow-[3px_3px_0_#141313]"
                  >
                    <summary className="cursor-pointer text-[15px] font-extrabold text-ink">
                      {item.q[lang]}
                    </summary>
                    <p className="wall-prose m-0 mt-2 text-[14px] font-semibold text-ink/80">
                      {item.a[lang]}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {installPrompt ? (
            <Sticker bg="white" className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-cyan p-5">
              <div>
                <p className="anton-title m-0 text-[24px] text-ink">
                  {lang === "te" ? "హోమ్ స్క్రీన్‌కు జోడించండి" : "Add to home screen"}
                </p>
                <p className="m-0 text-[14px] font-bold text-ink">
                  {lang === "te"
                    ? "ఆఫ్‌లైన్ పార్టీ కోసం యాప్ లాగా సేవ్ చేయండి."
                    : "Save for instant offline party rounds."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void installPrompt.prompt()}
                className="wall-btn bg-sticker text-[14px] text-ink"
              >
                {lang === "te" ? "ఇన్‌స్టాల్" : "Install app"}
              </button>
            </Sticker>
          ) : null}
        </section>

        {/* Closing block */}
        <section
          aria-labelledby="closing-heading"
          className="mx-auto max-w-[1200px] px-4 pb-14 pt-6 md:px-10"
        >
          <Sticker bg="yellow" className="mx-2 px-6 py-12 text-center">
            <h2
              id="closing-heading"
              className="anton-title m-0 text-[clamp(40px,6vw,76px)] leading-none text-ink"
            >
              <Tx v={L.closingHeading} />
            </h2>
            <div className="mt-5">
              <WallLinkButton href="/play" variant="white">
                <Tx v={TRANSLATIONS.nav.playNow} /> →
              </WallLinkButton>
            </div>
          </Sticker>
        </section>
      </main>

      {/* Sticky mobile Play Now CTA after scrolling past hero */}
      {showStickyCta ? (
        <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden">
          <Link
            href="/play"
            className="wall-btn w-full bg-yellow text-[15px] text-ink"
          >
            <Tx v={TRANSLATIONS.nav.playNow} /> →
          </Link>
        </div>
      ) : null}

      {/* Footer with the unofficial disclaimer */}
      <footer className="bg-ink text-concrete">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-7 text-[14px] leading-[1.5] md:px-10">
          <span className="anton-title keep-case text-[22px] text-concrete">{BRAND_NAME}</span>
          <p className="m-0 max-w-[640px] text-concrete">
            <Tx v={TRANSLATIONS.brand.unofficialDisclaimer} />
          </p>
          <nav aria-label={t(TRANSLATIONS.nav.footerNav)} className="flex gap-4 font-bold">
            <Link href="/about" className="underline">
              <Tx v={TRANSLATIONS.nav.about} />
            </Link>
            <Link href="/privacy" className="underline">
              <Tx v={TRANSLATIONS.nav.privacy} />
            </Link>
            <Link href="/terms" className="underline">
              <Tx v={TRANSLATIONS.nav.terms} />
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
