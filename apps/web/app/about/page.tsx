import { AppFrame } from "@/components/app-frame";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function AboutPage() {
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[680px] space-y-4 p-6">
        <p className="te-script m-0 text-[26px] leading-[1.55] text-ink" lang="te">
          మా గురించి · అనధికారిక అభిమానుల గేమ్
        </p>
        <h1 className="anton-title m-0 text-[32px] text-ink">
          About {TRANSLATIONS.brand.name}
        </h1>
        <p className="text-base font-bold leading-relaxed text-ink">
          {TRANSLATIONS.brand.unofficialDisclaimer.en}
        </p>
        <p className="te-script text-lg leading-[1.6] text-ink" lang="te">
          {TRANSLATIONS.brand.unofficialDisclaimer.te}
        </p>
        <p className="text-sm font-medium leading-relaxed text-ink">
          All auctions use pretend game coins only. There are no payments, wallets, prizes,
          or real-money stakes of any kind.
        </p>
        <WallLinkButton href="/play" variant="yellow">
          Back to Play →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
