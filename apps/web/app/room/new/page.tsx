import { AppFrame } from "@/components/app-frame";
import { Tx } from "@/components/lang-provider";
import { Badge, Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function NewRoomPage() {
  const P = TRANSLATIONS.pages;
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[520px] space-y-4 p-6">
        <Badge tone="cyan" mono>
          <Tx v={P.roomNewBadge} />
        </Badge>
        <h1 className="anton-title m-0 text-[28px] text-ink">
          <Tx v={P.roomNewTitle} />
        </h1>
        <p className="m-0 text-sm font-bold text-ink">
          <Tx v={P.roomNewBody} />
        </p>
        <WallLinkButton href="/room/K7QM" variant="yellow">
          <Tx v={P.roomPreview} /> →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
