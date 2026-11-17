"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGameColor } from "@tfi/config/tokens";
import { BrandWordmark } from "@/components/app-frame";
import {
  HalftoneBlock,
  PopBadge,
  SpotlightBeam,
  Squiggle,
  Starburst,
  XMark,
} from "@/components/art-kit";
import { GameTitle } from "@/components/game-title";
import { HeroDemo } from "@/components/hero-demo";
import { WallIcon } from "@/components/icons";
import { LangSwitch } from "@/components/lang-switch";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { MarqueeTape, Reveal } from "@/components/motion-kit";
import {
  Badge,
  SegmentedControl,
  Sticker,
  WallLinkButton,
} from "@/components/sticker-kit";
import { useFlags, useVisibleGames } from "@/components/flags-provider";
import {
  MODE_FILTERS,
  filterByMode,
  formatGameMeta,
  type ModeFilter,
} from "@/lib/games";
import { BRAND_NAME, TRANSLATIONS } from "@/lib/i18n";
import { LANDING_TRANSLATIONS } from "@/lib/i18n-landing";

const L = LANDING_TRANSLATIONS;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

function StepMicroArt({ stepNum }: { readonly stepNum: string }) {
  if (stepNum === "1") {
    return (
      <svg aria-hidden="true" width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
        <rect x="6" y="10" width="22" height="28" rx="5" fill="#EAE6DF" stroke="#141313" strokeWidth="3" />
        <rect x="16" y="8" width="24" height="30" rx="5" fill="#F6BE18" stroke="#141313" strokeWidth="3" />
        <path d="M23 20h10M23 27h7" stroke="#141313" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (stepNum === "2") {
    return (
      <svg aria-hidden="true" width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
        <rect x="6" y="13" width="32" height="22" rx="6" fill="#EC1276" stroke="#141313" strokeWidth="3" />
        <circle cx="32" cy="24" r="2.5" fill="#FFFFFF" />
        <path d="M13 24h12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <path d="M36 9l5 4-5 4" fill="none" stroke="#141313" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
      <rect x="6" y="10" width="36" height="28" rx="6" fill="#00C853" stroke="#141313" strokeWidth="3" />
      <path d="M15 24l6 6 12-12" fill="none" stroke="#141313" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LandingPage() {
  const [filter, setFilter] = useState<ModeFilter>("All");
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { lang, setLang } = useLang();
  const t = useT();

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 520);
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
  const { feedbackUrl } = useFlags();
  const filteredGames = filterByMode(visibleGames, filter);

  const filterOptions = MODE_FILTERS.map((cat) => ({
    value: cat,
    label: <Tx v={TRANSLATIONS.modeFilter[cat]} />,
    testId: `filter-${cat}`,
  }));

  const marqueeStrings = L.marqueeItems.map((item) => item[lang]);

  return (
    <div className="w-full overflow-x-clip text-ink" data-label="Landing page">
      <a
        href="#content"
        className="visually-hidden fixed left-3 top-3 z-50 rounded-[12px] border-[3px] border-ink bg-yellow px-4 py-2 font-extrabold text-ink shadow-btn"
      >
        <Tx v={TRANSLATIONS.common.skipToContent} />
      </a>

      {/* 1. Slim sticky top bar (concrete) */}
      <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-concrete">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 md:px-8">
          <BrandWordmark href="#top" />

          <nav
            aria-label={t(TRANSLATIONS.nav.mainNav)}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] font-bold md:gap-x-5"
          >
            <a href="#games" className="inline-flex min-h-[44px] items-center px-1.5 text-ink no-underline hover:underline">
              <Tx v={TRANSLATIONS.nav.games} />
            </a>
            <a href="#how" className="hidden min-h-[44px] items-center px-1.5 text-ink no-underline hover:underline sm:inline-flex">
              <Tx v={TRANSLATIONS.nav.howItPlays} />
            </a>
            <Link href="/about" className="hidden min-h-[44px] items-center px-1.5 text-ink no-underline hover:underline md:inline-flex">
              <Tx v={TRANSLATIONS.nav.about} />
            </Link>
            <LangSwitch />
            <WallLinkButton href="/play" variant="yellow" size="sm">
              <Tx v={TRANSLATIONS.nav.playNow} />
            </WallLinkButton>
          </nav>
        </div>
      </header>

      <main id="content" tabIndex={-1}>
        {/* 2. HERO: Full-bleed Yellow with halftone dots + diagonal spotlight */}
        <HalftoneBlock
          id="top"
          bg="yellow"
          pattern="halftone"
          aria-label={t(L.heroLabel)}
          className="relative overflow-hidden border-b-[3px] border-ink py-10 md:py-16 lg:py-20"
        >
          <SpotlightBeam />
          <div className="relative z-10 mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
              {/* Left column: Giant Display headline, one word pill, subline, 2 big buttons, 3 true facts */}
              <div>
                <PopBadge tone="white" className="mb-4">
                  <Tx v={L.betaPill} />
                </PopBadge>

                <h1
                  className={`${
                    lang === "te"
                      ? "te-lead text-[44px] leading-[1.22] md:text-[64px]"
                      : "display-title"
                  } wall-balance m-0 text-ink`}
                >
                  {(() => {
                    const full = L.heroHeadline[lang];
                    const pill = L.heroAccentWord[lang];
                    const idx = full.indexOf(pill);
                    if (idx === -1) return full;
                    const before = full.slice(0, idx);
                    const after = full.slice(idx + pill.length);
                    return (
                      <>
                        {before}
                        <span className="inline-block rounded-[14px] border-[3px] border-ink bg-magenta px-3.5 py-0.5 text-white shadow-[0_4px_0_#141313]">
                          {pill}
                        </span>
                        {after}
                      </>
                    );
                  })()}
                </h1>

                <p className="body-lg wall-prose m-0 mt-5 font-semibold text-ink">
                  <Tx v={L.heroSubline} />
                </p>

                <div className="mt-7 flex flex-wrap gap-4">
                  <WallLinkButton href="/play" variant="ink" size="lg" data-testid="hero-play-btn">
                    <Tx v={TRANSLATIONS.nav.playNow} /> →
                  </WallLinkButton>
                  <WallLinkButton href="#games" variant="white" size="lg">
                    <Tx v={L.seeGames} />
                  </WallLinkButton>
                </div>

                {/* Trust row: 3 true facts */}
                <ul
                  role="list"
                  className="mt-8 flex list-none flex-wrap gap-3 p-0 text-[14px] font-bold text-ink"
                >
                  {[
                    { fact: L.facts.sevenGames, dotBg: "#00C853" },
                    { fact: L.facts.worksOffline, dotBg: "#EC1276" },
                    { fact: L.facts.noAccount, dotBg: "#00E5FF" },
                  ].map(({ fact, dotBg }) => (
                    <li
                      key={fact.en}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3.5 py-1.5"
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block h-2.5 w-2.5 rounded-full border border-ink"
                        style={{ backgroundColor: dotBg }}
                      />
                      <Tx v={fact} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right column: Live Playable Phone Frame */}
              <div className="relative flex justify-center lg:justify-end">
                <HeroDemo />
              </div>
            </div>
          </div>
        </HalftoneBlock>

        {/* 3. MARQUEE TAPES: Opposite-direction Ink & Yellow strips */}
        <MarqueeTape
          items={marqueeStrings}
          label={t(L.marqueeLabel)}
          pauseLabel={t(L.marqueePause)}
          playLabel={t(L.marqueePlay)}
        />

        {/* 4. HOW IT PLAYS: Full-bleed Magenta block + 3 chunky White numbered cards */}
        <HalftoneBlock
          id="how"
          bg="magenta"
          pattern="halftone"
          aria-labelledby="how-heading"
          className="relative overflow-hidden border-y-[3px] border-ink py-16 md:py-24"
        >
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="how-heading" className="h1-title wall-balance m-0 text-white">
                <Tx v={L.howHeading} />
              </h2>
              <div className="hidden md:block" aria-hidden="true">
                <Squiggle color="yellow" width={92} />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {L.steps.map((step, i) => {
                const badgeBg =
                  step.num === "2" ? "#00E5FF" : step.num === "3" ? "#00C853" : "#F6BE18";
                return (
                  <Reveal key={step.num} staggerIndex={i}>
                    <Sticker className="flex h-full flex-col justify-between p-6 text-ink">
                      <div className="flex items-center justify-between gap-4">
                        <span
                          className="mono-num inline-flex h-12 w-12 items-center justify-center rounded-[14px] border-[3px] border-ink text-[20px] font-bold text-ink"
                          style={{ backgroundColor: badgeBg }}
                        >
                          {step.num.padStart(2, "0")}
                        </span>
                        <StepMicroArt stepNum={step.num} />
                      </div>
                      <div className="mt-5">
                        <h3 className="h3-title m-0 text-ink">
                          <Tx v={step.title} />
                        </h3>
                        <p className="m-0 mt-2 text-[16px] font-medium leading-[1.55] text-ink">
                          <Tx v={step.body} />
                        </p>
                      </div>
                    </Sticker>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </HalftoneBlock>

        {/* 5. SEVEN GAMES: Concrete block + Filter + Color Bento Grid */}
        <section
          id="games"
          aria-labelledby="pick-game-heading"
          className="bg-concrete py-16 md:py-24"
        >
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <h2 id="pick-game-heading" className="h1-title wall-balance m-0 text-ink">
                  <Tx v={L.pickYourGameHeading} />
                </h2>
                <p className="body-lg m-0 mt-2 text-ink">
                  <Tx v={L.pickYourGameSub} />
                </p>
              </div>

              <SegmentedControl
                label={t(TRANSLATIONS.modeFilter.filterLabel)}
                options={filterOptions}
                value={filter}
                onChange={setFilter}
              />
            </div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-6">
              {filteredGames.map((game, idx) => {
                const displayNum = String(
                  visibleGames.findIndex((g) => g.slug === game.slug) + 1,
                ).padStart(2, "0");
                const isFeatured = game.slug === "head-set-go" && filter === "All";
                const spanClass =
                  filter === "All" && filteredGames.length === 7
                    ? idx === 0
                      ? "md:col-span-2 lg:col-span-4"
                      : idx >= 5
                        ? "lg:col-span-3"
                        : "lg:col-span-2"
                    : filteredGames.length === 1
                      ? "md:col-span-2 lg:col-span-3"
                      : "lg:col-span-2";
                const metaLine = formatGameMeta(game.slug, lang);
                const gameColor = getGameColor(game.slug);

                return (
                  <Link
                    key={game.slug}
                    href={`/play/${game.slug}`}
                    className={`wall-card-interactive wall-sticker group relative flex h-full flex-col justify-between overflow-hidden p-4 text-ink no-underline md:p-5 ${spanClass}`}
                    style={{ backgroundColor: gameColor }}
                  >
                    {/* Top strip: number, mode badge, hover Play ribbon */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="mono-num rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-[13px] text-ink">
                          {displayNum}
                        </span>
                        <Badge tone={game.isOnlineOnly ? "card" : "white"}>
                          {game.isOnlineOnly ? (
                            <Tx v={TRANSLATIONS.common.comingSoon} />
                          ) : (
                            <Tx v={TRANSLATIONS.modes.onePhone} />
                          )}
                        </Badge>
                      </div>
                      {!game.isOnlineOnly ? (
                        <span
                          aria-hidden="true"
                          className="wall-tile-ribbon rounded-full border-2 border-ink bg-ink px-3 py-1 text-[13px] font-extrabold text-yellow"
                        >
                          <Tx v={L.playRibbon} />
                        </span>
                      ) : null}
                    </div>

                    {/* Oversized 120px illustration + optional live preview for featured tile */}
                    <div
                      className={`my-4 flex items-center justify-center gap-6 ${
                        isFeatured ? "min-h-[170px] flex-wrap sm:flex-nowrap" : "min-h-[126px]"
                      }`}
                    >
                      <div
                        className={`wall-tile-art shrink-0 ${
                          isFeatured ? "h-[132px] w-[132px]" : "h-[116px] w-[116px]"
                        }`}
                      >
                        <WallIcon kind={game.iconKind} />
                      </div>
                      {isFeatured ? (
                        <div className="hidden rounded-[16px] border-[3px] border-ink bg-white px-5 py-4 text-center shadow-[0_4px_0_#141313] sm:block">
                          <span className="block font-mono text-[11px] font-bold text-ink/80">2006</span>
                          <span className="block text-[26px] font-extrabold text-ink">
                            {lang === "te" ? "పోకిరి" : "Pokiri"}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Body copy always sits cleanly on pure white inner panel (Guardrail A3) */}
                    <div className="mt-auto rounded-[16px] border-[2.5px] border-ink bg-white p-4">
                      <GameTitle title={game.title} />
                      <p className="m-0 mt-1 text-[15px] font-medium leading-[1.45] text-ink/90">
                        <Tx v={game.description} />
                      </p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-2 border-ink/10 pt-2.5">
                        <span className="text-[13px] font-bold text-ink/80">{metaLine}</span>
                        {game.isOnlineOnly ? (
                          <span className="rounded-full border-2 border-ink bg-card px-3 py-0.5 text-[13px] font-bold text-ink">
                            <Tx v={TRANSLATIONS.common.comingSoon} />
                          </span>
                        ) : (
                          <span className="rounded-full border-2 border-ink bg-yellow px-3.5 py-0.5 text-[14px] font-extrabold text-ink">
                            <Tx v={TRANSLATIONS.playHome.playAction} /> →
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. TELUGU SWITCH BLOCK: Neutral Card background + Giant two-position toggle */}
        <HalftoneBlock
          bg="card"
          pattern="none"
          aria-labelledby="telugu-heading"
          data-testid="bilingual-demo"
          className="border-t-[3px] border-ink py-16 md:py-24"
        >
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 id="telugu-heading" className="h2-title wall-balance m-0 text-ink">
                  <Tx v={L.teluguHeading} />
                </h2>
                <p className="body-lg wall-prose m-0 mt-3 text-ink">
                  <Tx v={L.teluguBody} />
                </p>

                {/* Giant two-position live switch: English | తెలుగు */}
                <div
                  role="group"
                  aria-label={t(TRANSLATIONS.lang.switchHidden)}
                  className="mt-6 inline-flex rounded-[18px] border-[3px] border-ink bg-white p-1.5 shadow-[0_5px_0_#141313]"
                >
                  <button
                    type="button"
                    aria-pressed={lang === "en"}
                    onClick={() => setLang("en")}
                    className="min-h-[48px] rounded-[12px] px-5 text-[18px] font-extrabold text-ink transition-colors"
                    style={{
                      backgroundColor: lang === "en" ? "#F6BE18" : "transparent",
                      border: lang === "en" ? "2.5px solid #141313" : "2.5px solid transparent",
                    }}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    aria-pressed={lang === "te"}
                    onClick={() => setLang("te")}
                    className="lang-switch-te min-h-[48px] rounded-[12px] px-5 text-[19px] font-bold text-ink transition-colors"
                    style={{
                      backgroundColor: lang === "te" ? "#F6BE18" : "transparent",
                      border: lang === "te" ? "2.5px solid #141313" : "2.5px solid transparent",
                    }}
                  >
                    తెలుగు
                  </button>
                </div>
              </div>

              {/* Sample Card changing live with language */}
              <Sticker bg="white" className="p-6 text-center">
                <div className="flex items-center justify-between gap-2 border-b-2 border-ink/15 pb-3">
                  <Badge tone="cyan">
                    {lang === "te" ? "తెలుగు కార్డ్" : "Sample card"}
                  </Badge>
                  <span className="mono-num text-[14px] text-ink">2006</span>
                </div>
                <p
                  className={
                    lang === "te"
                      ? "te-lead m-0 mt-6 text-[56px] leading-tight text-ink"
                      : "m-0 mt-6 font-display text-[56px] font-extrabold leading-none text-ink"
                  }
                >
                  {lang === "te" ? "పోకిరి" : "Pokiri"}
                </p>
                <p className="m-0 mt-2 text-[16px] font-bold text-ink/80">
                  {lang === "te" ? "Pokiri · పూరి జగన్నాథ్" : "Puri Jagannadh"}
                </p>
              </Sticker>
            </div>
          </div>
        </HalftoneBlock>

        {/* 7. COMING NEXT: Full-bleed Cyan strip */}
        <HalftoneBlock
          id="auction"
          bg="cyan"
          pattern="stripes"
          aria-label="Coming next"
          className="border-y-[3px] border-ink py-10 md:py-14"
        >
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-5 px-4 md:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="white">Online</Badge>
              <div>
                <p className="h3-title m-0 text-ink">
                  <Tx v={L.comingNextStrip} />
                </p>
                <p className="m-0 mt-0.5 text-[15px] font-bold text-ink/90">
                  <Tx v={TRANSLATIONS.common.coinsOnly} />
                </p>
              </div>
            </div>
            {feedbackUrl ? (
              <a
                href={feedbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wall-btn min-h-[48px] bg-white px-5 text-[17px] text-ink"
              >
                <Tx v={L.tellMeWhenOpens} /> →
              </a>
            ) : (
              <WallLinkButton href="/play/box-office-auction" variant="white">
                <Tx v={L.tellMeWhenOpens} /> →
              </WallLinkButton>
            )}
          </div>
        </HalftoneBlock>

        {installPrompt ? (
          <div className="bg-concrete py-6">
            <div className="mx-auto max-w-[1200px] px-4 md:px-8">
              <Sticker bg="white" className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="h3-title m-0 text-ink">
                    <Tx v={TRANSLATIONS.pwa.installTitle} />
                  </p>
                  <p className="m-0 text-[14px] font-medium text-ink/80">
                    <Tx v={TRANSLATIONS.pwa.installBody} />
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void installPrompt.prompt()}
                  className="wall-btn min-h-[44px] bg-yellow px-4 text-[15px] text-ink"
                >
                  <Tx v={TRANSLATIONS.pwa.installBtn} />
                </button>
              </Sticker>
            </div>
          </div>
        ) : null}

        {/* 8. CLOSING: Full-bleed Yellow with decorative confetti shapes + giant Play now */}
        <HalftoneBlock
          bg="yellow"
          pattern="halftone"
          aria-labelledby="closing-heading"
          className="relative overflow-hidden py-16 md:py-24"
        >
          <div aria-hidden="true" className="pointer-events-none absolute left-8 top-8 hidden md:block">
            <Starburst color="white" size={64} />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute bottom-8 right-10 hidden md:block">
            <XMark color="magenta" size={44} tilt={-14} />
          </div>

          <div className="relative z-10 mx-auto max-w-[1200px] px-4 text-center md:px-8">
            <h2
              id="closing-heading"
              className={`${
                lang === "te" ? "te-lead text-[40px] md:text-[60px]" : "display-title"
              } wall-balance m-0 text-ink`}
            >
              <Tx v={L.closingHeading} />
            </h2>
            <div className="mt-8">
              <WallLinkButton href="/play" variant="ink" size="lg">
                <Tx v={TRANSLATIONS.nav.playNow} /> →
              </WallLinkButton>
            </div>
          </div>
        </HalftoneBlock>
      </main>

      {/* Sticky mobile Play Now CTA after scrolling past hero */}
      {showStickyCta ? (
        <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden">
          <Link href="/play" className="wall-btn w-full bg-yellow text-[18px] text-ink">
            <Tx v={TRANSLATIONS.nav.playNow} /> →
          </Link>
        </div>
      ) : null}

      {/* 9. FOOTER: Ink background with unofficial fan-made line */}
      <footer className="border-t-[3px] border-ink bg-ink text-concrete">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-10 text-[14px] leading-[1.5] md:px-8">
          <span className="keep-case text-[22px] font-extrabold text-yellow">
            {BRAND_NAME}
          </span>
          <p className="m-0 max-w-[640px] text-concrete">
            <Tx v={TRANSLATIONS.brand.unofficialDisclaimer} />
          </p>
          <nav aria-label={t(TRANSLATIONS.nav.footerNav)} className="flex gap-5 font-bold">
            <Link href="/about" className="text-concrete underline">
              <Tx v={TRANSLATIONS.nav.about} />
            </Link>
            <Link href="/privacy" className="text-concrete underline">
              <Tx v={TRANSLATIONS.nav.privacy} />
            </Link>
            <Link href="/terms" className="text-concrete underline">
              <Tx v={TRANSLATIONS.nav.terms} />
            </Link>
            {feedbackUrl ? (
              <a
                href={feedbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-concrete underline"
              >
                <Tx v={TRANSLATIONS.nav.feedback} />
              </a>
            ) : null}
          </nav>
        </div>
      </footer>
    </div>
  );
}
