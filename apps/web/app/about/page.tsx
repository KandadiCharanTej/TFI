import { AppFrame } from "@/components/app-frame";
import { Tx } from "@/components/lang-provider";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function AboutPage() {
  const P = TRANSLATIONS.pages;
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[680px] space-y-4 p-6">
        <h1 className="h1-title m-0 text-ink">
          <Tx v={P.aboutTitle} />
        </h1>
        <p className="m-0 text-base font-bold leading-relaxed text-ink">
          <Tx v={P.aboutBody1} />
        </p>
        <p className="m-0 text-base font-bold leading-relaxed text-ink">
          <Tx v={TRANSLATIONS.brand.unofficialDisclaimer} />
        </p>
        <p className="m-0 text-sm font-medium leading-relaxed text-ink">
          <Tx v={P.aboutBody2} />
        </p>
        <p className="m-0 text-sm font-extrabold text-ink">
          <Tx v={P.aboutMadeBy} />
        </p>
        <WallLinkButton href="/play" variant="yellow">
          <Tx v={TRANSLATIONS.common.backToPlay} /> →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
