import { AppFrame } from "@/components/app-frame";
import { Tx } from "@/components/lang-provider";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function TermsPage() {
  const P = TRANSLATIONS.pages;
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[680px] space-y-5 p-6">
        <h1 className="anton-title m-0 text-[32px] text-ink">
          <Tx v={P.termsTitle} />
        </h1>
        <p className="m-0 text-base font-bold leading-relaxed text-ink">
          <Tx v={TRANSLATIONS.brand.unofficialDisclaimer} />
        </p>
        <p className="m-0 text-sm font-medium leading-relaxed text-ink">
          <Tx v={P.termsBody} />
        </p>
        <div className="space-y-1">
          <h2 className="m-0 text-base font-extrabold text-ink">
            <Tx v={P.termsHeadingRules} />
          </h2>
          <p className="m-0 text-sm font-medium leading-relaxed text-ink">
            <Tx v={P.termsRules} />
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="m-0 text-base font-extrabold text-ink">
            <Tx v={P.termsHeadingLiability} />
          </h2>
          <p className="m-0 text-sm font-medium leading-relaxed text-ink">
            <Tx v={P.termsLiability} />
          </p>
        </div>
        <WallLinkButton href="/play" variant="yellow">
          <Tx v={TRANSLATIONS.common.backToPlay} /> →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
