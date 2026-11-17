"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFlags } from "./flags-provider";
import { NavIcon } from "./nav-icon";
import { LangSwitch } from "./lang-switch";
import { PublicFooter } from "./public-footer";
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

/**
 * Wordmark: "TFI & Pitch" set in Bricolage Grotesque 800 with a small yellow diamond mark.
 * No outline box around the logo.
 */
export function BrandWordmark({ href = "/" }: { readonly href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[44px] items-center gap-2.5 py-1 text-ink no-underline"
    >
      <span
        aria-hidden="true"
        className="inline-block h-3.5 w-3.5 rotate-45 border-2 border-ink bg-yellow"
      />
      <span className="keep-case font-display text-[21px] font-extrabold tracking-[-0.02em] text-ink">
        {BRAND_NAME}
      </span>
    </Link>
  );
}

export function AppFrame({ children }: AppFrameProps) {
  const pathname = usePathname() ?? "/play";
  const { enableRooms } = useFlags();
  const visibleNav = enableRooms
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => item.href !== "/join");

  // The live round hides all frame chrome (no app bar, no bottom bar).
  if (pathname.endsWith("/round")) {
    return (
      <main id="content" tabIndex={-1} className="min-h-[100dvh] w-full">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full text-ink">
      <a
        href="#content"
        className="visually-hidden fixed left-3 top-3 z-50 rounded-[12px] border-[2.5px] border-ink bg-yellow px-4 py-2 font-bold text-ink shadow-btn"
      >
        <Tx v={TRANSLATIONS.common.skipToContent} />
      </a>

      {/* Slim sticky top bar with 3px ink bottom border */}
      <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-concrete">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-3 px-4 py-2.5 md:px-8">
          <BrandWordmark href="/" />
          <LangSwitch />
        </div>
      </header>

      {/* Phone: content only. Large screen: left rail + content no wider than 1160px. */}
      <div className="mx-auto flex max-w-[1160px] flex-col md:flex-row md:gap-8 md:px-8 md:py-8">
        <nav
          aria-label="App navigation"
          className="hidden md:flex md:w-[208px] md:shrink-0 md:flex-col md:gap-3"
        >
          {visibleNav.map((item) => {
            const isActive = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                aria-current={isActive ? "page" : undefined}
                className="flex min-h-[52px] items-center gap-3 rounded-full border-[3px] border-ink px-4 py-2 font-extrabold text-ink transition-transform"
                style={{
                  backgroundColor: isActive ? "#F6BE18" : "#FFFFFF",
                  boxShadow: isActive ? "0 4px 0 #141313" : "0 2px 0 #141313",
                }}
              >
                <span className="h-6 w-6 shrink-0 text-ink">
                  <NavIcon kind={item.icon} />
                </span>
                <span className="text-[17px]">
                  <Tx v={item.label} />
                </span>
              </Link>
            );
          })}
        </nav>

        <main
          id="content"
          tabIndex={-1}
          className="v4-page-enter w-full flex-1 px-4 pb-28 pt-5 md:px-0 md:pb-12 md:pt-0"
        >
          {children}
          <PublicFooter className="mt-12 rounded-[20px] border-[3px] border-ink" />
        </main>
      </div>

      {/* Phone bottom bar: chunky icons, yellow pill with ink border for active item. */}
      <nav
        aria-label="Bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-30 border-t-[3px] border-ink bg-concrete px-3 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] md:hidden"
      >
        <ul
          role="list"
          className={`mx-auto grid gap-2 ${
            visibleNav.length === 2 ? "max-w-[320px] grid-cols-2" : "max-w-[420px] grid-cols-3"
          }`}
        >
          {visibleNav.map((item) => {
            const isActive = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  aria-current={isActive ? "page" : undefined}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-full px-3 py-1.5 font-extrabold text-ink transition-colors"
                  style={{
                    backgroundColor: isActive ? "#F6BE18" : "transparent",
                    border: isActive ? "2.5px solid #141313" : "2.5px solid transparent",
                    boxShadow: isActive ? "0 3px 0 #141313" : "none",
                  }}
                >
                  <span className="h-6 w-6 shrink-0 text-ink">
                    <NavIcon kind={item.icon} />
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
