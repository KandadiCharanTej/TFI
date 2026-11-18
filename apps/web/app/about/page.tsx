import { AppFrame } from "@/components/app-frame";
import { Starburst } from "@/components/art-kit";
import { Tx } from "@/components/lang-provider";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function AboutPage() {
  const P = TRANSLATIONS.pages;
  return (
    <AppFrame>
      <Sticker className="relative mx-auto max-w-[680px] space-y-4 p-6">
        <div className="pointer-events-none absolute right-5 top-5 hidden sm:block" aria-hidden="true">
          <Starburst color="yellow" size={44} />
        </div>
        <h1 className="h1-title m-0 text-ink pr-12">
          <Tx v={P.aboutTitle} />
        </h1>
        <p className="m-0 text-base font-bold leading-relaxed text-ink">
          <Tx v={P.aboutBody1} />
        </p>
        <p className="m-0 text-base font-bold leading-relaxed text-ink">
          <Tx v={TRANSLATIONS.brand.unofficialDisclaimer} />
        </p>
        <p className="m-0 text-base font-medium leading-relaxed text-ink">
          <Tx v={P.aboutBody2} />
        </p>
        <p className="m-0 text-base font-extrabold text-ink">
          <Tx v={P.aboutMadeBy} />
        </p>
        <WallLinkButton href="/play" variant="yellow">
          <Tx v={TRANSLATIONS.common.backToPlay} /> →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
