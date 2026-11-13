import { AppFrame } from "@/components/app-frame";
import { Badge, BidDisplay, Sticker, WallLinkButton } from "@/components/sticker-kit";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[520px] space-y-4 p-6">
        <div className="flex items-center justify-between">
          <span className="mono-num text-sm text-ink">LOT 3 OF 10</span>
          <Badge tone="cyan" mono>
            {code.toUpperCase()}
          </Badge>
        </div>
        <p className="te-script m-0 text-[28px] leading-[1.55] text-ink" lang="te">
          బాక్స్ ఆఫీస్ ఆక్షన్ రూమ్
        </p>
        <h1 className="anton-title m-0 text-[28px] text-ink">
          Box Office Auction · Room {code.toUpperCase()}
        </h1>
        <BidDisplay currentBidCr={20} />
        <p className="text-xs font-bold text-ink">
          Game coins only. There is no real-money betting.
        </p>
        <WallLinkButton href="/play" variant="white">
          ← Back to Play Home
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
