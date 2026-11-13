import { AppFrame } from "@/components/app-frame";
import { Tx } from "@/components/lang-provider";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function OfflinePage() {
  const P = TRANSLATIONS.pages;
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[540px] space-y-4 p-6 text-center">
        <h1 className="anton-title m-0 text-[32px] text-ink">
          <Tx v={P.offlineTitle} />
        </h1>
        <p className="m-0 text-base font-bold text-ink">
          <Tx v={P.offlineBody} />
        </p>
        <WallLinkButton href="/play" variant="yellow">
          <Tx v={TRANSLATIONS.common.goToPlayHome} /> →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
