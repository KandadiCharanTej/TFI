"use client";

import { AppFrame } from "@/components/app-frame";
import { InstallSticker } from "@/components/install-sticker";
import { LangSwitch } from "@/components/lang-switch";
import { Tx, useLang } from "@/components/lang-provider";
import { Chip, Sticker } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { usePreferencesStore } from "@/lib/store";

export default function MePage() {
  const { deviceName, soundEnabled, reducedMotion, setDeviceName, setSoundEnabled, setReducedMotion } =
    usePreferencesStore();
  const { lang } = useLang();

  return (
    <AppFrame>
      <div className="mx-auto max-w-[540px] space-y-5">
      <InstallSticker />
      <Sticker className="space-y-6 p-6">
        <div>
          <h1 className="anton-title m-0 text-[28px] text-ink">
            <Tx v={TRANSLATIONS.pages.meTitle} />
          </h1>
          <p className="m-0 mt-1 text-sm font-bold text-ink opacity-70">
            <Tx v={TRANSLATIONS.pages.meNoSignIn} />
          </p>
        </div>

        {/* Device Name */}
        <div>
          <label
            htmlFor="guest-name-input"
            className="block text-xs font-extrabold uppercase tracking-wider text-ink"
          >
            <Tx v={TRANSLATIONS.pages.meDeviceName} />
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
            Language / {lang === "te" ? "భాష" : "Language"}
          </p>
          <LangSwitch />
        </div>

        {/* Sound & Motion */}
        <div className="space-y-2">
          <p className="m-0 text-xs font-extrabold uppercase tracking-wider text-ink">
            <Tx v={TRANSLATIONS.pages.meAccessibility} />
          </p>
          <div className="flex flex-wrap gap-3">
            <Chip active={soundEnabled} onClick={() => setSoundEnabled(!soundEnabled)}>
              Sound: {soundEnabled ? "ON" : "OFF"}
            </Chip>
            <Chip active={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}>
              Reduced Motion: {reducedMotion ? "ON" : "OFF"}
            </Chip>
          </div>
        </div>
      </Sticker>
      </div>
    </AppFrame>
  );
}
