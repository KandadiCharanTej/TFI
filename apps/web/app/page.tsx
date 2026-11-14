"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MODE_COLORS } from "@tfi/config/tokens";
import { BrandWordmark } from "@/components/app-frame";
import { WallIcon } from "@/components/icons";
import { GameTitle } from "@/components/game-title";
import { HeroDemo } from "@/components/hero-demo";
import { LangSwitch } from "@/components/lang-switch";
import { Tx, useLang, useT } from "@/components/lang-provider";
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
  panelModeKey,
  type ModeFilter,
} from "@/lib/games";
import { BRAND_NAME, TRANSLATIONS } from "@/lib/i18n";

const L = TRANSLATIONS.landing;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

function StepMicroArt({ stepNum }: { readonly stepNum: string }) {
  if (stepNum === "1") {
    return (
      <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
        <rect x="6" y="8" width="22" height="28" rx="4" fill="#FFFFFF" stroke="#141313" strokeWidth="2.5" />
        <rect
          x="14"
          y="8"
          width="22"
          height="28"
          rx="4"
          fill="#F6BE18"
          stroke="#141313"
          strokeWidth="2.5"
          className="origin-bottom transition-transform duration-500"
        />
        <path d="M20 20h10M20 25h6" stroke="#141313" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (stepNum === "2") {
    return (
      <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
        <rect x="8" y="13" width="28" height="18" rx="4" fill="#F6BE18" stroke="#141313" strokeWidth="2.5" />
        <circle cx="31" cy="22" r="2" fill="#141313" />
        <path d="M14 22h11" stroke="#141313" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <rect x="6" y="11" width="32" height="22" rx="4" fill="#FFFFFF" stroke="#141313" strokeWidth="2.5" />
      <path d="M14 22l5 5 11-11" fill="none" stroke="#00C853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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
    const onScroll = () => setShowStickyCta(window.scrollY > 460);
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

  return (
    <div className="w-full overflow-x-hidden text-ink" data-label="Landing page">
      <a
        href="#content"
        className="visually-hidden fixed left-3 top-3 z-50 rounded-[12px] border-[2.5px] border-ink bg-yellow px-4 py-2 font-bold text-ink shadow-btn"
      >
        <Tx v={TRANSLATIONS.common.skipToContent} />
      </a>

      {/* 1. Slim sticky top bar (1px bottom line, unboxed wordmark) */}
      <header className="sticky top-0 z-20 border-b border-ink bg-concrete/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <BrandWordmark href="#top" />

          <nav
            aria-label={t(TRANSLATIONS.nav.mainNav)}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-bold md:gap-x-6"
          >
            <a href="#games" className="inline-flex min-h-[44px] items-center py-2 text-ink no-underline hover:underline">
              <Tx v={TRANSLATIONS.nav.games} />
            </a>
            <a href="#how" className="inline-flex min-h-[44px] items-center py-2 text-ink no-underline hover:underline">
              <Tx v={TRANSLATIONS.nav.howItPlays} />
            </a>
            <Link href="/about" className="inline-flex min-h-[44px] items-center py-2 text-ink no-underline hover:underline">
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
        {/* 2. Hero: 2 columns on desktop, stacked on phone */}
        <section
          id="top"
          aria-label={t(L.heroLabel)}
          className="mx-auto max-w-[1160px] px-4 pt-8 pb-16 md:px-8 md:pt-16 md:pb-24"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            {/* Left column */}
            <div>
              <p className="wall-label m-0 mb-3 inline-block rounded-full border-2 border-ink bg-card px-3.5 py-1 text-ink">
                <Tx v={L.betaPill} />
              </p>

              <h1
                className={`${
                  lang === "te"
                    ? "te-lead text-[36px] md:text-[56px]"
                    : "display-title"
                } wall-balance m-0 text-ink`}
              >
                <Tx v={L.heroHeadline} />
              </h1>

              <p className="body-lg wall-prose m-0 mt-4 text-ink/90 md:mt-5">
                <Tx v={L.heroSubline} />
              </p>

              <div className="mt-6 flex flex-wrap gap-3.5 md:mt-8">
                <WallLinkButton href="/play" variant="yellow">
                  <Tx v={TRANSLATIONS.nav.playNow} />
                </WallLinkButton>
                <WallLinkButton href="#games" variant="white">
                  <Tx v={L.seeGames} />
                </WallLinkButton>
              </div>

              {/* Small trust row: 3 true facts with icons */}
              <ul
                role="list"
                className="mt-7 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[14px] font-bold text-ink"
              >
                {[L.facts.sevenGames, L.facts.worksOffline, L.facts.noAccount].map((fact) => (
                  <li key={fact.en} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2.5 w-2.5 rotate-45 border border-ink bg-yellow"
                    />
                    <Tx v={fact} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column: Live playable Head Set Go demo + 1 tilted ticket stub */}
            <div className="flex justify-center lg:justify-end">
              <HeroDemo />
            </div>
          </div>
        </section>

        {/* 3. "How it plays" in 3 steps */}
        <section
          id="how"
          aria-labelledby="how-heading"
          className="mx-auto max-w-[1160px] px-4 py-16 md:px-8 md:py-24"
        >
          <h2 id="how-heading" className="h2-title wall-balance m-0 text-ink">
            <Tx v={L.howHeading} />
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {L.steps.map((step) => (
              <Sticker key={step.num} className="flex flex-col justify-between p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="mono-num inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-yellow text-[16px] text-ink">
                    {step.num}
                  </span>
                  <StepMicroArt stepNum={step.num} />
                </div>
                <div className="mt-4">
                  <h3 className="h3-title m-0 text-ink">
                    <Tx v={step.title} />
                  </h3>
                  <p className="m-0 mt-1.5 text-[16px] font-medium leading-[1.55] text-ink/90">
                    <Tx v={step.body} />
                  </p>
                </div>
              </Sticker>
            ))}
          </div>
        </section>

        {/* 4. "Seven games" as a Bento Grid */}
        <section
          id="games"
          aria-labelledby="pick-game-heading"
          className="mx-auto max-w-[1160px] px-4 py-16 md:px-8 md:py-24"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 id="pick-game-heading" className="h2-title wall-balance m-0 text-ink">
                <Tx v={L.pickYourGameHeading} />
              </h2>
              <p className="body-lg m-0 mt-2 text-ink/90">
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

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => {
              const displayNum = String(
                visibleGames.findIndex((g) => g.slug === game.slug) + 1,
              ).padStart(2, "0");
              const isFeatured = game.slug === "head-set-go" && filter === "All";
              const metaLine = formatGameMeta(game.slug, lang);

              return (
                <Link
                  key={game.slug}
                  href={`/play/${game.slug}`}
                  className={`wall-card-interactive wall-sticker flex flex-col justify-between p-6 text-ink no-underline ${
                    isFeatured ? "md:col-span-2" : ""
                  } ${game.isOnlineOnly ? "bg-card/90" : ""}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="mono-num text-[14px] text-ink">{displayNum}</span>
                      <Badge tone={game.isOnlineOnly ? "card" : "white"}>
                        {game.isOnlineOnly ? (
                          <Tx v={TRANSLATIONS.common.comingSoon} />
                        ) : (
                          <Tx v={TRANSLATIONS.modes.onePhone} />
                        )}
                      </Badge>
                    </div>

                    <div
                      className={`mt-4 flex items-center justify-center rounded-[16px] border-2 border-ink p-4 text-ink ${
                        isFeatured ? "min-h-[140px] gap-6" : "min-h-[128px]"
                      }`}
                      style={{
                        backgroundColor: game.isOnlineOnly
                          ? "#F4F1EA"
                          : MODE_COLORS[panelModeKey(game)],
                      }}
                    >
                      <div className="h-[96px] w-[96px] shrink-0">
                        <WallIcon kind={game.iconKind} />
                      </div>
                      {isFeatured ? (
                        <div className="hidden rounded-[12px] border-2 border-ink bg-sticker px-4 py-2.5 sm:block">
                          <span className="wall-label block text-ink/70">Forehead round</span>
                          <span className="font-display text-[20px] font-extrabold text-ink">
                            {lang === "te" ? "బాహుబలి · 0:60" : "Baahubali · 0:60"}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4">
                      <GameTitle title={game.title} />
                    </div>
                    <p className="m-0 mt-1.5 text-[15px] font-medium leading-[1.5] text-ink/90">
                      <Tx v={game.description} />
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-ink/15 pt-3.5">
                    <span className="text-[13px] font-semibold text-ink/80">{metaLine}</span>
                    {game.isOnlineOnly ? (
                      <span className="inline-flex min-h-[36px] items-center rounded-full border-2 border-ink bg-card px-3.5 text-[13px] font-bold text-ink">
                        <Tx v={TRANSLATIONS.common.comingSoon} />
                      </span>
                    ) : (
                      <span className="inline-flex min-h-[36px] items-center rounded-full border-2 border-ink bg-yellow px-4 text-[14px] font-bold text-ink">
                        <Tx v={TRANSLATIONS.playHome.playAction} /> →
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 5. "Telugu when you want it": compact 2-column block showing the SAME card in EN & TE with live switch */}
        <section
          aria-labelledby="telugu-heading"
          className="mx-auto max-w-[1160px] px-4 py-16 md:px-8 md:py-24"
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 id="telugu-heading" className="h2-title wall-balance m-0 text-ink">
                <Tx v={L.teluguHeading} />
              </h2>
              <p className="body-lg wall-prose m-0 mt-3 text-ink/90">
                <Tx v={L.teluguBody} />
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLang(lang === "en" ? "te" : "en")}
                  className="wall-btn min-h-[46px] bg-yellow px-5 text-[15px] text-ink"
                >
                  {lang === "te" ? "Switch to English (EN)" : "తెలుగులో చూడండి (తె)"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Sticker className="p-5 text-center">
                <span className="wall-label block text-ink/70">English mode</span>
                <p className="m-0 mt-3 font-display text-[32px] font-extrabold leading-tight text-ink">
                  Pokiri
                </p>
                <p className="m-0 mt-2 text-[13px] font-semibold text-ink/80">
                  2006 · Puri Jagannadh
                </p>
              </Sticker>

              <Sticker bg="yellow" className="p-5 text-center">
                <span className="wall-label block text-ink/80">Telugu mode (తె)</span>
                <p className="te-lead m-0 mt-2 text-[34px] text-ink">పోకిరి</p>
                <p className="te-sub m-0 text-[14px] text-ink">Pokiri</p>
                <p className="m-0 mt-1.5 text-[13px] font-semibold text-ink/85">
                  2006 · పూరి జగన్నాథ్
                </p>
              </Sticker>
            </div>
          </div>
        </section>

        {/* 6. Slim "Coming next" strip (replaces old dark auction block) */}
        <section
          id="auction"
          aria-label="Coming next"
          className="mx-auto max-w-[1160px] px-4 py-6 md:px-8"
        >
          <Sticker
            bg="card"
            className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
          >
            <div className="flex items-center gap-3">
              <Badge tone="cyan">Online</Badge>
              <div>
                <p className="m-0 text-[17px] font-bold text-ink">
                  <Tx v={L.comingNextStrip} />
                </p>
                <p className="m-0 text-[13px] font-medium text-ink/80">
                  <Tx v={TRANSLATIONS.common.coinsOnly} />
                </p>
              </div>
            </div>
            {feedbackUrl ? (
              <a
                href={feedbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wall-btn min-h-[44px] bg-sticker px-4 text-[15px] text-ink"
              >
                <Tx v={L.tellMeWhenOpens} /> →
              </a>
            ) : (
              <Link
                href="/play/box-office-auction"
                className="wall-btn min-h-[44px] bg-sticker px-4 text-[15px] text-ink"
              >
                <Tx v={L.tellMeWhenOpens} /> →
              </Link>
            )}
          </Sticker>

          {installPrompt ? (
            <Sticker bg="white" className="mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
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
          ) : null}
        </section>

        {/* 7. Closing block: one yellow card with "Start a game night" and "Play now" */}
        <section
          aria-labelledby="closing-heading"
          className="mx-auto max-w-[1160px] px-4 py-16 md:px-8 md:py-20"
        >
          <Sticker bg="yellow" className="px-6 py-12 text-center md:py-16">
            <h2 id="closing-heading" className="h1-title wall-balance m-0 text-ink">
              <Tx v={L.closingHeading} />
            </h2>
            <div className="mt-6">
              <WallLinkButton href="/play" variant="white">
                <Tx v={TRANSLATIONS.nav.playNow} />
              </WallLinkButton>
            </div>
          </Sticker>
        </section>
      </main>

      {/* Sticky mobile Play Now CTA after scrolling past hero */}
      {showStickyCta ? (
        <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden">
          <Link href="/play" className="wall-btn w-full bg-yellow text-[16px] text-ink">
            <Tx v={TRANSLATIONS.nav.playNow} />
          </Link>
        </div>
      ) : null}

      {/* Footer with unofficial disclaimer */}
      <footer className="border-t border-ink bg-ink text-concrete">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-8 text-[14px] leading-[1.5] md:px-8">
          <span className="keep-case font-display text-[20px] font-extrabold text-concrete">
            {BRAND_NAME}
          </span>
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
            {feedbackUrl ? (
              <a
                href={feedbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
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
