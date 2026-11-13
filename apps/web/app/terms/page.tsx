import { AppFrame } from "@/components/app-frame";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function TermsPage() {
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[680px] space-y-4 p-6">
        <p className="te-script m-0 text-[26px] leading-[1.55] text-ink" lang="te">
          నిబంధనలు · ఆట నాణేలు మాత్రమే
        </p>
        <h1 className="anton-title m-0 text-[32px] text-ink">Terms of Play</h1>
        <p className="text-base font-bold leading-relaxed text-ink">
          {TRANSLATIONS.brand.unofficialDisclaimer.en}
        </p>
        <p className="text-sm font-medium leading-relaxed text-ink">
          All games are free party games for friends. Auctions use pretend coins only—no
          real money, payments, wallets, or prizes ever exist in {TRANSLATIONS.brand.name}.
        </p>
        <WallLinkButton href="/play" variant="yellow">
          Back to Play →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
