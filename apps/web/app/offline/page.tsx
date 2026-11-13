import { AppFrame } from "@/components/app-frame";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";

export default function OfflinePage() {
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[540px] space-y-4 p-6 text-center">
        <p className="te-script m-0 text-[28px] leading-[1.55] text-ink" lang="te">
          మీరు ఆఫ్‌లైన్‌లో ఉన్నారు
        </p>
        <h1 className="anton-title m-0 text-[32px] text-ink">You are offline</h1>
        <p className="text-base font-bold text-ink">
          Wave 1 pass-around phone games work without internet once cached.
        </p>
        <WallLinkButton href="/play" variant="yellow">
          Go to Play Home →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
