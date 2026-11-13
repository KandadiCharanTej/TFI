"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WallIcon } from "./icons";
import { LangSwitch } from "./lang-switch";
import { Tx } from "./lang-provider";
import { BRAND_NAME, TRANSLATIONS } from "@/lib/i18n";

export interface AppFrameProps {
  readonly children: ReactNode;
}

const NAV_ITEMS = [
  { href: "/play", icon: "play" as const, label: TRANSLATIONS.nav.playTab },
  { href: "/join", icon: "join" as const, label: TRANSLATIONS.nav.joinTab },
  { href: "/me", icon: "me" as const, label: TRANSLATIONS.nav.meTab },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || (href === "/play" && pathname.startsWith("/play"));
}

export function AppFrame({ children }: AppFrameProps) {
  const pathname = usePathname() ?? "/play";

  // The live round hides all frame chrome (no app bar, no bottom bar).
  if (pathname.endsWith("/round")) {
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
        <Tx v={TRANSLATIONS.common.skipToContent} />
      </a>

      {/* Slim sticky top bar */}
      <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-concrete">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-2.5 md:px-8">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-[14px] border-[3px] border-ink bg-sticker px-3 py-1 shadow-logo"
          >
            <span className="inline-block h-[30px] w-[30px] rounded-[9px] border-[2.5px] border-ink bg-yellow p-[3px] text-ink">
              <WallIcon kind="mark" />
            </span>
            <span className="anton-title keep-case text-[22px] leading-none text-ink">
              {BRAND_NAME}
            </span>
          </Link>
          <LangSwitch />
        </div>
      </header>

      {/* Phone: content only. Large screen: left rail + content no wider than 1200px. */}
      <div className="mx-auto flex max-w-[1200px] flex-col md:flex-row md:gap-8 md:px-8 md:py-6">
        <nav
          aria-label="App navigation"
          className="hidden md:flex md:w-[210px] md:shrink-0 md:flex-col md:gap-3"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="flex min-h-[54px] items-center gap-3 rounded-[14px] border-[2.5px] border-ink px-4 py-2 font-extrabold text-ink shadow-btn transition-transform"
                style={{ backgroundColor: isActive ? "#F6BE18" : "#FFFFFF" }}
              >
                <span className="h-7 w-7 shrink-0 text-ink">
                  <WallIcon kind={item.icon} />
                </span>
                <span className="text-[16px]">
                  <Tx v={item.label} />
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

      {/* Phone bottom bar: Play, Join, Me. The active item is yellow. */}
      <nav
        aria-label="Bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-30 border-t-[3px] border-ink bg-concrete px-3 py-2 md:hidden"
      >
        <ul role="list" className="mx-auto grid max-w-[440px] grid-cols-3 gap-2.5">
          {NAV_ITEMS.map((item) => {
            const isActive = isActivePath(pathname, item.href);
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
                  <span className="text-[15px]">
                    <Tx v={item.label} />
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
