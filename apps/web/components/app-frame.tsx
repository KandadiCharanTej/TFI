"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WallIcon } from "./icons";
import { TRANSLATIONS } from "@/lib/i18n";
import { usePreferencesStore } from "@/lib/store";

export interface AppFrameProps {
  readonly children: ReactNode;
}

const NAV_ITEMS = [
  {
    href: "/play",
    icon: "play" as const,
    labelTe: TRANSLATIONS.nav.playTab.te,
    labelEn: TRANSLATIONS.nav.playTab.en,
  },
  {
    href: "/join",
    icon: "join" as const,
    labelTe: TRANSLATIONS.nav.joinTab.te,
    labelEn: TRANSLATIONS.nav.joinTab.en,
  },
  {
    href: "/me",
    icon: "me" as const,
    labelTe: TRANSLATIONS.nav.meTab.te,
    labelEn: TRANSLATIONS.nav.meTab.en,
  },
] as const;

export function AppFrame({ children }: AppFrameProps) {
  const pathname = usePathname() ?? "/play";
  const locale = usePreferencesStore((s) => s.locale);
  const toggleLocale = usePreferencesStore((s) => s.toggleLocale);

  // Hide all frame chrome during live rounds (/play/[game]/round)
  const isLiveRound = pathname.endsWith("/round");
  if (isLiveRound) {
    return (
      <main id="content" tabIndex={-1} className="min-h-screen w-full">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full text-ink">
      <a
        href="#content"
        className="visually-hidden fixed left-3 top-3 z-50 rounded-[12px] border-[2.5px] border-ink bg-yellow px-4 py-2 font-extrabold text-ink shadow-btn"
      >
        <span className="te-script mr-2 text-base" lang="te">
          {TRANSLATIONS.nav.skipToContent.te}
        </span>
        <span>{TRANSLATIONS.nav.skipToContent.en}</span>
      </a>

      {/* Slim Sticky Top Bar */}
      <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-concrete">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-2.5 md:px-8">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-[14px] border-[3px] border-ink bg-sticker px-3 py-1 shadow-logo"
          >
            <span className="inline-block h-[30px] w-[30px] rounded-[9px] border-[2.5px] border-ink bg-yellow p-[3px] text-ink">
              <WallIcon kind="mark" />
            </span>
            <span className="anton-title text-[22px] leading-none text-ink">
              {TRANSLATIONS.brand.name}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={
                locale === "te"
                  ? TRANSLATIONS.nav.langToggleLabel.te
                  : TRANSLATIONS.nav.langToggleLabel.en
              }
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-[2.5px] border-ink bg-sticker px-3.5 py-1 text-sm font-extrabold text-ink shadow-logo"
            >
              <span
                className={`te-script rounded-full px-2 py-0.5 text-[15px] leading-none ${
                  locale === "te" ? "border-2 border-ink bg-yellow" : ""
                }`}
                lang="te"
              >
                తె
              </span>
              <span aria-hidden="true">/</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[13px] font-extrabold leading-none ${
                  locale === "en" ? "border-2 border-ink bg-yellow" : ""
                }`}
              >
                EN
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Left rail on desktop (md+), content capped at 1200px */}
      <div className="mx-auto flex max-w-[1200px] flex-col md:flex-row md:gap-8 md:px-8 md:py-6">
        <nav
          aria-label="App Navigation"
          className="hidden md:flex md:w-[210px] md:shrink-0 md:flex-col md:gap-3"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/play" && pathname.startsWith("/play"));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="flex min-h-[54px] items-center gap-3 rounded-[14px] border-[2.5px] border-ink px-4 py-2 font-extrabold text-ink shadow-btn transition-transform"
                style={{
                  backgroundColor: isActive ? "#F6BE18" : "#FFFFFF",
                }}
              >
                <span className="h-7 w-7 shrink-0 text-ink">
                  <WallIcon kind={item.icon} />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="te-script text-[16px]" lang="te">
                    {item.labelTe}
                  </span>
                  <span className="text-[12px] font-extrabold uppercase tracking-wider">
                    {item.labelEn}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <main
          id="content"
          tabIndex={-1}
          className="w-full flex-1 px-4 pb-28 pt-4 md:px-0 md:pb-12 md:pt-0"
        >
          {children}
        </main>
      </div>

      {/* Phone Bottom Bar (Play, Join, Me; active item is yellow) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 border-t-[3px] border-ink bg-concrete px-3 py-2 md:hidden"
      >
        <ul role="list" className="mx-auto grid max-w-[440px] grid-cols-3 gap-2.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/play" && pathname.startsWith("/play"));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-[14px] border-[2.5px] border-ink px-2 py-1.5 font-extrabold text-ink"
                  style={{
                    backgroundColor: isActive ? "#F6BE18" : "#FFFFFF",
                    boxShadow: isActive ? "2px 2px 0 #141313" : "none",
                  }}
                >
                  <span className="h-6 w-6 shrink-0 text-ink">
                    <WallIcon kind={item.icon} />
                  </span>
                  <span className="flex flex-col items-start leading-none">
                    <span className="te-script text-[15px]" lang="te">
                      {item.labelTe}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider">
                      {item.labelEn}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
