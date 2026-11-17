"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFlags } from "@/components/flags-provider";
import { Tx } from "@/components/lang-provider";
import { TRANSLATIONS } from "@/lib/i18n";
import {
  readAnalyticsConsent,
  reportClientError,
  trackEvent,
  writeAnalyticsConsent,
} from "@/lib/telemetry";

export function ConsentBanner() {
  const pathname = usePathname() ?? "/";
  const { posthogKey, sentryDsn } = useFlags();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (posthogKey && readAnalyticsConsent() === null) {
      setShowBanner(true);
    }
  }, [posthogKey]);

  useEffect(() => {
    const onInstall = () => trackEvent(posthogKey, "install_clicked");
    const onLang = (e: Event) => {
      const detail = (e as CustomEvent<{ lang?: string }>).detail;
      trackEvent(posthogKey, "language_changed", detail?.lang ? { lang: detail.lang } : undefined);
    };
    const onShare = () => trackEvent(posthogKey, "share_clicked");
    const onRoomCreated = (e: Event) => {
      const detail = (e as CustomEvent<{ game?: string }>).detail;
      trackEvent(posthogKey, "room_created", detail?.game ? { game: detail.game } : undefined);
    };
    const onRoomJoined = (e: Event) => {
      const detail = (e as CustomEvent<{ game?: string }>).detail;
      trackEvent(posthogKey, "room_joined", detail?.game ? { game: detail.game } : undefined);
    };
    const onRoomStarted = (e: Event) => {
      const detail = (e as CustomEvent<{ game?: string }>).detail;
      trackEvent(posthogKey, "room_started", detail?.game ? { game: detail.game } : undefined);
    };
    window.addEventListener("tfi:install_clicked", onInstall);
    window.addEventListener("tfi:language_changed", onLang);
    window.addEventListener("tfi:share_clicked", onShare);
    window.addEventListener("tfi:room_created", onRoomCreated);
    window.addEventListener("tfi:room_joined", onRoomJoined);
    window.addEventListener("tfi:room_started", onRoomStarted);
    return () => {
      window.removeEventListener("tfi:install_clicked", onInstall);
      window.removeEventListener("tfi:language_changed", onLang);
      window.removeEventListener("tfi:share_clicked", onShare);
      window.removeEventListener("tfi:room_created", onRoomCreated);
      window.removeEventListener("tfi:room_joined", onRoomJoined);
      window.removeEventListener("tfi:room_started", onRoomStarted);
    };
  }, [posthogKey]);

  useEffect(() => {
    if (!posthogKey || !pathname) return;
    const roundMatch = /^\/play\/([a-z0-9-]+)\/round\/?$/.exec(pathname);
    if (roundMatch?.[1]) {
      trackEvent(posthogKey, "round_started", { game: roundMatch[1] });
      return;
    }
    const resultsMatch = /^\/play\/([a-z0-9-]+)\/results\/?$/.exec(pathname);
    if (resultsMatch?.[1]) {
      trackEvent(posthogKey, "round_finished", { game: resultsMatch[1] });
      return;
    }
    const gameMatch = /^\/play\/([a-z0-9-]+)\/?$/.exec(pathname);
    if (gameMatch?.[1]) {
      trackEvent(posthogKey, "game_opened", { game: gameMatch[1] });
    }
  }, [pathname, posthogKey]);

  useEffect(() => {
    if (!sentryDsn) return;
    const onErr = (e: ErrorEvent) => {
      reportClientError(sentryDsn, e.message || "Unhandled error", e.filename);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      reportClientError(sentryDsn, String(e.reason ?? "Unhandled rejection"));
    };
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [sentryDsn]);

  const isRound = pathname.endsWith("/round");
  if (!showBanner || isRound) return null;

  const choose = (choice: "yes" | "no") => {
    writeAnalyticsConsent(choice);
    setShowBanner(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Usage analytics consent"
      data-testid="consent-banner"
      className="fixed bottom-20 left-4 right-4 z-40 mx-auto flex max-w-[480px] flex-wrap items-center justify-between gap-3 rounded-[16px] border-[3px] border-ink bg-sticker p-4 text-ink shadow-sticker md:bottom-4"
    >
      <p className="m-0 flex-1 basis-[220px] text-[13px] font-bold text-ink">
        <Tx v={TRANSLATIONS.consent.question} />
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => choose("no")}
          className="wall-btn min-h-[40px] bg-concrete px-3 text-[12px] text-ink"
        >
          <Tx v={TRANSLATIONS.consent.no} />
        </button>
        <button
          type="button"
          onClick={() => choose("yes")}
          className="wall-btn min-h-[40px] bg-yellow px-3 text-[12px] text-ink"
        >
          <Tx v={TRANSLATIONS.consent.yes} />
        </button>
      </div>
    </div>
  );
}
