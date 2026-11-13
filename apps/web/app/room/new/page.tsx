import { AppFrame } from "@/components/app-frame";
import { Badge, Sticker, WallLinkButton } from "@/components/sticker-kit";

export default function NewRoomPage() {
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[520px] space-y-4 p-6">
        <Badge tone="cyan" mono>
          WAVE 2 · ONLINE ROOMS
        </Badge>
        <p className="te-script m-0 text-[26px] leading-[1.55] text-ink" lang="te">
          కొత్త ఆన్‌లైన్ రూమ్
        </p>
        <h1 className="anton-title m-0 text-[28px] text-ink">Create an Online Room</h1>
        <p className="text-sm font-bold text-ink">
          Realtime rooms powered by PartyKit Durable Objects arrive in Phase 5.
        </p>
        <WallLinkButton href="/room/K7QM" variant="yellow">
          Preview Room K7QM →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
