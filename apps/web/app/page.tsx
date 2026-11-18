"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BrandWordmark } from "@/components/app-frame";
import {
  HalftoneBlock,
  PopBadge,
  SpotlightBeam,
} from "@/components/art-kit";
import { DoodleCrown, DoodleScribbleOval } from "@/components/hero-inline-doodles";
import { HeroDemo } from "@/components/hero-demo";
import { LangSwitch } from "@/components/lang-switch";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { WallLinkButton } from "@/components/sticker-kit";
import { useFlags } from "@/components/flags-provider";
import { BRAND_NAME, TRANSLATIONS } from "@/lib/i18n";
import { LANDING_TRANSLATIONS } from "@/lib/i18n-landing";

const HeroDoodles = dynamic(
  () => import("@/components/hero-doodles").then((m) => m.HeroDoodles),
  { ssr: false },
);

const LandingBelowFold = dynamic(
  () => import("@/components/landing-below-fold").then((m) => m.LandingBelowFold),
);

const L = LANDING_TRANSLATIONS;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export default function LandingPage() {
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [heroBtnVisible, setHeroBtnVisible] = useState(true);
  const [boltPulse, setBoltPulse] = useState(0);
  const [xShake, setXShake] = useState(0);
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

    const heroBtn = document.querySelector("[data-testid='hero-play-btn']");
    let io: IntersectionObserver | null = null;
    if (heroBtn && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          setHeroBtnVisible(Boolean(entries[0]?.isIntersecting));
        },
        { threshold: 0.05 },
      );
      io.observe(heroBtn);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      io?.disconnect();
    };
  }, []);

  const { feedbackUrl } = useFlags();

  return (
    <div className="w-full overflow-x-clip text-ink" data-label="Landing page">
      <a
        href="#content"
        className="visually-hidden fixed left-3 top-3 z-50 rounded-[12px] border-[3px] border-ink bg-yellow px-4 py-2 font-extrabold text-ink shadow-btn"
      >
        <Tx v={TRANSLATIONS.common.skipToContent} />
      </a>

      {/* 1. Slim sticky top bar (56px, safe-area aware, hides Play now while hero CTA visible) */}
      <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-concrete pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex min-h-[56px] max-w-[1200px] items-center justify-between gap-2 px-4 py-1.5 min-[430px]:px-5 md:px-8">
          <BrandWordmark href="#top" />

          <nav
            aria-label={t(TRANSLATIONS.nav.mainNav)}
            className="flex items-center gap-x-2 text-[15px] font-bold sm:gap-x-3 md:gap-x-5"
          >
            <a href="#games" className="hidden min-h-[44px] min-w-[44px] items-center justify-center px-1.5 text-ink no-underline hover:underline sm:inline-flex">
              <Tx v={TRANSLATIONS.nav.games} />
            </a>
            <a href="#how" className="hidden min-h-[44px] min-w-[44px] items-center justify-center px-1.5 text-ink no-underline hover:underline md:inline-flex">
              <Tx v={TRANSLATIONS.nav.howItPlays} />
            </a>
            <Link href="/about" prefetch={false} className="hidden min-h-[44px] min-w-[44px] items-center justify-center px-1.5 text-ink no-underline hover:underline md:inline-flex">
              <Tx v={TRANSLATIONS.nav.about} />
            </Link>
            <LangSwitch />
            {!heroBtnVisible ? (
              <WallLinkButton href="/play" variant="yellow" size="sm" data-testid="header-play-btn">
                <Tx v={TRANSLATIONS.nav.playNow} />
              </WallLinkButton>
            ) : null}
          </nav>
        </div>
      </header>

      <main id="content" tabIndex={-1}>
        {/* 2. HERO: Full-bleed Yellow + halftone + street-poster doodle layer + Headline Plate */}
        <HalftoneBlock
          id="top"
          bg="yellow"
          pattern="halftone"
          aria-label={t(L.heroLabel)}
          className="relative overflow-hidden border-b-[3px] border-ink pb-14 pt-5 sm:pt-7 md:py-14 lg:py-16 xl:pb-20"
        >
          <SpotlightBeam />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-8 -top-8 z-[1] h-20 w-24 rotate-[-28deg] border-[3px] border-ink bg-yellow shadow-[0_4px_0_#141313] md:h-28 md:w-36"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -right-8 z-[1] h-24 w-28 rotate-[-28deg] border-[3px] border-ink bg-yellow ring-4 ring-white md:h-32 md:w-44"
          />
          <HeroDoodles correctPulse={boltPulse} passShake={xShake} />
          <div className="relative z-10 mx-auto max-w-[1200px] px-4 min-[430px]:px-5 md:px-8">
            <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
              {/* Left column: Label, chunky Yellow Headline Plate w/ Crown + tilted accent pill, Scribble subline, CTAs */}
              <div data-hero-text="true">
                <PopBadge tone="white" className="mb-3">
                  <Tx v={L.betaPill} />
                </PopBadge>

                <div className="relative rounded-[22px] border-[3px] border-ink bg-yellow px-4 py-3 shadow-[0_6px_0_#141313] ring-4 ring-white sm:px-6 sm:py-4">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-6 sm:-right-3 sm:-top-7"
                  >
                    <DoodleCrown size={40} />
                  </div>
                  <h1
                    className={`${
                      lang === "te"
                        ? "te-lead text-[clamp(28px,8.2vw,44px)] leading-[1.22] md:text-[58px]"
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
                          <span className="inline-block rotate-[-1.5deg] rounded-[14px] border-[3px] border-ink bg-magenta px-3 py-0.5 text-white shadow-[0_4px_0_#141313]">
                            {pill}
                          </span>
                          {after}
                        </>
                      );
                    })()}
                  </h1>
                </div>

                <p className="body-lg wall-prose m-0 mt-4 font-semibold text-ink">
                  {(() => {
                    const sub = L.heroSubline[lang];
                    const target = lang === "te" ? "ఫేవరెట్ సినిమాలను" : "favourite films";
                    const pos = sub.indexOf(target);
                    if (pos === -1) return sub;
                    return (
                      <>
                        {sub.slice(0, pos)}
                        <span className="relative inline-block">
                          <span className="relative z-10">{target}</span>
                          <DoodleScribbleOval className="absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+10px)] w-[calc(100%+16px)]" />
                        </span>
                        {sub.slice(pos + target.length)}
                      </>
                    );
                  })()}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 sm:mt-6 sm:gap-4">
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
                  className="mt-4 flex list-none flex-wrap gap-2.5 p-0 text-[13px] font-bold text-ink sm:mt-6 sm:gap-3 sm:text-[14px]"
                >
                  {[
                    { fact: L.facts.sevenGames, dotBg: "#00C853" },
                    { fact: L.facts.worksOffline, dotBg: "#EC1276" },
                    { fact: L.facts.noAccount, dotBg: "#00E5FF" },
                  ].map(({ fact, dotBg }) => (
                    <li
                      key={fact.en}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-1 sm:px-3.5 sm:py-1.5"
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
                <HeroDemo
                  onActionFeedback={(kind) => {
                    if (kind === "correct") setBoltPulse((n) => n + 1);
                    else setXShake((n) => n + 1);
                  }}
                />
              </div>
            </div>
          </div>
        </HalftoneBlock>

        <LandingBelowFold installPrompt={installPrompt} />
      </main>

      {/* Sticky mobile Play Now CTA after scrolling past hero (safe-area aware) */}
      {showStickyCta ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t-[3px] border-ink bg-concrete px-4 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden">
          <Link href="/play" className="wall-btn w-full bg-yellow text-[18px] text-ink">
            <Tx v={TRANSLATIONS.nav.playNow} /> →
          </Link>
        </div>
      ) : null}

      {/* 9. FOOTER: Ink background with unofficial fan-made line (>=44px link targets, 16px body) */}
      <footer className="border-t-[3px] border-ink bg-ink pb-[max(24px,env(safe-area-inset-bottom))] text-concrete">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-8 text-[16px] leading-[1.5] min-[430px]:px-5 md:px-8">
          <span className="keep-case text-[22px] font-extrabold text-yellow">
            {BRAND_NAME}
          </span>
          <p className="m-0 max-w-[640px] text-[16px] text-concrete">
            <Tx v={TRANSLATIONS.brand.unofficialDisclaimer} />
          </p>
          <nav aria-label={t(TRANSLATIONS.nav.footerNav)} className="flex flex-wrap gap-2 font-bold">
            <Link href="/about" prefetch={false} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-concrete underline">
              <Tx v={TRANSLATIONS.nav.about} />
            </Link>
            <Link href="/privacy" prefetch={false} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-concrete underline">
              <Tx v={TRANSLATIONS.nav.privacy} />
            </Link>
            <Link href="/terms" prefetch={false} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-concrete underline">
              <Tx v={TRANSLATIONS.nav.terms} />
            </Link>
            {feedbackUrl ? (
              <a
                href={feedbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-concrete underline"
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
