import { AppFrame } from "@/components/app-frame";
import { Starburst } from "@/components/art-kit";
import { Tx } from "@/components/lang-provider";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function PrivacyPage() {
  const P = TRANSLATIONS.pages;
  return (
    <AppFrame>
      <Sticker className="relative mx-auto max-w-[680px] space-y-5 p-6">
        <div className="pointer-events-none absolute right-5 top-5 hidden sm:block" aria-hidden="true">
          <Starburst color="cyan" size={44} />
        </div>
        <h1 className="h1-title m-0 text-ink pr-12">
          <Tx v={P.privacyTitle} />
        </h1>
        <p className="m-0 text-base font-bold leading-relaxed text-ink">
          <Tx v={P.privacyBody} />
        </p>
        <div className="space-y-1">
          <h2 className="m-0 text-base font-extrabold text-ink">
            <Tx v={P.privacyHeadingStored} />
          </h2>
          <p className="m-0 text-sm font-medium leading-relaxed text-ink">
            <Tx v={P.privacyStored} />
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="m-0 text-base font-extrabold text-ink">
            <Tx v={P.privacyHeadingAnalytics} />
          </h2>
          <p className="m-0 text-sm font-medium leading-relaxed text-ink">
            <Tx v={P.privacyAnalytics} />
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="m-0 text-base font-extrabold text-ink">
            <Tx v={P.privacyHeadingRights} />
          </h2>
          <p className="m-0 text-sm font-medium leading-relaxed text-ink">
            <Tx v={P.privacyRights} />
          </p>
        </div>
        <WallLinkButton href="/play" variant="yellow">
          <Tx v={TRANSLATIONS.common.backToPlay} /> →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
