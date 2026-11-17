"use client";

import { AppFrame } from "@/components/app-frame";
import { Tx } from "@/components/lang-provider";
import { Badge, Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function GlobalErrorPage({ reset }: { readonly reset: () => void }) {
  const P = TRANSLATIONS.pages;
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[540px] space-y-4 p-6 text-center">
        <Badge tone="magenta" className="mx-auto font-mono">
          Error
        </Badge>
        <h1 className="h1-title m-0 text-ink">
          <Tx v={P.errorTitle} />
        </h1>
        <p className="m-0 text-base font-bold text-ink">
          <Tx v={P.errorBody} />
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="wall-btn min-h-[48px] bg-yellow px-5 text-[14px] text-ink"
          >
            <Tx v={P.errorRetry} />
          </button>
          <WallLinkButton href="/play" variant="white">
            <Tx v={TRANSLATIONS.common.goToPlayHome} /> →
          </WallLinkButton>
        </div>
      </Sticker>
    </AppFrame>
  );
}
