"use client";

import { useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { useFlags } from "@/components/flags-provider";
import { InstallSticker } from "@/components/install-sticker";
import { LangSwitch } from "@/components/lang-switch";
import { Tx, useT } from "@/components/lang-provider";
import { Chip, Sticker } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { usePreferencesStore } from "@/lib/store";

const APP_VERSION = "0.4.0-beta";

export default function MePage() {
  const {
    deviceName,
    soundEnabled,
    vibrationEnabled,
    reducedMotion,
    largeText,
    setDeviceName,
    setSoundEnabled,
    setVibrationEnabled,
    setReducedMotion,
    setLargeText,
    clearDeviceData,
  } = usePreferencesStore();
  const { feedbackUrl } = useFlags();
  const t = useT();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const P = TRANSLATIONS.pages;
  const onLabel = t(P.on);
  const offLabel = t(P.off);

  const handleConfirmClear = () => {
    clearDeviceData();
    setConfirmOpen(false);
    setClearedNotice(true);
  };

  return (
    <AppFrame>
      <div className="mx-auto max-w-[540px] space-y-5">
        <InstallSticker />
        <Sticker className="space-y-6 p-6">
          <div>
            <h1 className="anton-title m-0 text-[28px] text-ink">
              <Tx v={P.meTitle} />
            </h1>
            <p className="m-0 mt-1 text-sm font-bold text-ink">
              <Tx v={P.meNoSignIn} />
            </p>
          </div>

          {/* Device Name */}
          <div>
            <label
              htmlFor="guest-name-input"
              className="block text-xs font-extrabold uppercase tracking-wider text-ink"
            >
              <Tx v={P.meDeviceName} />
            </label>
            <input
              id="guest-name-input"
              type="text"
              maxLength={24}
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="mt-2 w-full rounded-[14px] border-[2.5px] border-ink bg-card px-4 py-3 text-lg font-extrabold text-ink"
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <p className="m-0 text-xs font-extrabold uppercase tracking-wider text-ink">
              <Tx v={P.meLanguage} />
            </p>
            <LangSwitch />
          </div>

          {/* Sound, Vibration, Motion & Text size */}
          <div className="space-y-2">
            <p className="m-0 text-xs font-extrabold uppercase tracking-wider text-ink">
              <Tx v={P.meAccessibility} />
            </p>
            <div className="flex flex-wrap gap-3">
              <Chip active={soundEnabled} onClick={() => setSoundEnabled(!soundEnabled)}>
                {t(P.meSound)}: {soundEnabled ? onLabel : offLabel}
              </Chip>
              <Chip active={vibrationEnabled} onClick={() => setVibrationEnabled(!vibrationEnabled)}>
                {t(P.meVibration)}: {vibrationEnabled ? onLabel : offLabel}
              </Chip>
              <Chip active={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}>
                {t(P.meReducedMotion)}: {reducedMotion ? onLabel : offLabel}
              </Chip>
              <Chip active={largeText} onClick={() => setLargeText(!largeText)}>
                {t(P.meLargeText)}: {largeText ? onLabel : offLabel}
              </Chip>
            </div>
          </div>

          {/* Clear my data */}
          <div className="space-y-2 border-t-2 border-ink pt-4">
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="wall-btn min-h-[44px] bg-concrete px-4 text-[13px] text-ink"
            >
              <Tx v={P.meClearData} />
            </button>
            {clearedNotice ? (
              <p role="status" className="m-0 text-sm font-bold text-ink">
                <Tx v={P.meCleared} />
              </p>
            ) : null}
            {feedbackUrl ? (
              <div>
                <a
                  href={feedbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wall-btn inline-flex min-h-[44px] items-center bg-yellow px-4 text-[13px] text-ink"
                >
                  <Tx v={P.sendFeedback} /> →
                </a>
              </div>
            ) : null}
            <p className="m-0 pt-2 font-mono text-xs font-bold text-ink">
              <Tx v={P.meVersion} />: {APP_VERSION}
            </p>
          </div>
        </Sticker>

        {confirmOpen ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-data-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
          >
            <Sticker className="max-w-[400px] space-y-4 p-5">
              <h2 id="clear-data-title" className="m-0 text-lg font-extrabold text-ink">
                <Tx v={P.meClearConfirmTitle} />
              </h2>
              <p className="m-0 text-sm font-medium text-ink">
                <Tx v={P.meClearConfirmBody} />
              </p>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="wall-btn min-h-[44px] bg-sticker px-4 text-[13px] text-ink"
                >
                  <Tx v={P.meClearCancelBtn} />
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="wall-btn min-h-[44px] bg-magenta px-4 text-[13px] text-white"
                >
                  <Tx v={P.meClearConfirmBtn} />
                </button>
              </div>
            </Sticker>
          </div>
        ) : null}
      </div>
    </AppFrame>
  );
}
