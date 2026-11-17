import { AppFrame } from "@/components/app-frame";
import { Starburst } from "@/components/art-kit";
import { Tx } from "@/components/lang-provider";
import { Badge, Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function NotFoundPage() {
  const P = TRANSLATIONS.pages;
  return (
    <AppFrame>
      <Sticker className="relative mx-auto max-w-[540px] space-y-4 p-6 text-center">
        <div className="pointer-events-none absolute right-4 top-4" aria-hidden="true">
          <Starburst color="magenta" size={40} />
        </div>
        <Badge tone="yellow" className="mx-auto font-mono text-[14px]">
          404
        </Badge>
        <h1 className="h1-title m-0 text-ink">
          <Tx v={P.notFoundTitle} />
        </h1>
        <p className="m-0 text-base font-bold text-ink">
          <Tx v={P.notFoundBody} />
        </p>
        <WallLinkButton href="/play" variant="yellow">
          <Tx v={TRANSLATIONS.common.goToPlayHome} /> →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
