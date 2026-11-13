import { AppFrame } from "@/components/app-frame";
import { Tx } from "@/components/lang-provider";
import { Badge, BidDisplay, Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const lang = await getServerLang();
  const P = TRANSLATIONS.pages;
  const upper = code.toUpperCase();

  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[520px] space-y-4 p-6">
        <div className="flex items-center justify-between">
          <span className="mono-num text-sm text-ink">
            <Tx v={P.lotOf} />
          </span>
          <Badge tone="cyan" mono>
            {upper}
          </Badge>
        </div>
        <h1 className="anton-title m-0 text-[28px] text-ink">
          <Tx v={P.roomTitle} values={{ code: upper }} />
        </h1>
        <BidDisplay currentBidCr={20} label={P.bidLabel[lang]} />
        <p className="m-0 text-xs font-bold text-ink">
          <Tx v={TRANSLATIONS.common.coinsOnly} />
        </p>
        <WallLinkButton href="/play" variant="white">
          ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
