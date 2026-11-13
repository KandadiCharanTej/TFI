"use client";

import { AppFrame } from "@/components/app-frame";
import { Chip, Sticker } from "@/components/sticker-kit";
import { usePreferencesStore } from "@/lib/store";

export default function MePage() {
  const {
    deviceName,
    locale,
    soundEnabled,
    reducedMotion,
    setDeviceName,
    setLocale,
    setSoundEnabled,
    setReducedMotion,
  } = usePreferencesStore();

  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[540px] space-y-6 p-6">
        <div>
          <p className="te-script m-0 text-[26px] leading-[1.55] text-ink" lang="te">
            నా సెట్టింగ్స్ (సైన్-ఇన్ అవసరం లేదు)
          </p>
          <h1 className="anton-title m-0 text-[28px] text-ink">
            Device Profile &amp; Preferences
          </h1>
        </div>

        <div>
          <label
            htmlFor="guest-name-input"
            className="block text-xs font-extrabold uppercase tracking-wider text-ink"
          >
            Guest Device Name (Saved on this phone)
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

        <div className="space-y-2">
          <p className="m-0 text-xs font-extrabold uppercase tracking-wider text-ink">
            Language / భాష
          </p>
          <div className="flex gap-3">
            <Chip active={locale === "te"} onClick={() => setLocale("te")}>
              <span className="te-script text-base" lang="te">
                తెలుగు (Default)
              </span>
            </Chip>
            <Chip active={locale === "en"} onClick={() => setLocale("en")}>
              English
            </Chip>
          </div>
        </div>

        <div className="space-y-2">
          <p className="m-0 text-xs font-extrabold uppercase tracking-wider text-ink">
            Accessibility &amp; Sound
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
    </AppFrame>
  );
}
