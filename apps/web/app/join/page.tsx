"use client";

import { useState } from "react";
import { isValidRoomCode } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { Tx } from "@/components/lang-provider";
import { Badge, Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function JoinRoomPage() {
  const [code, setCode] = useState("");
  const cleanCode = code.toUpperCase().trim();
  const valid = isValidRoomCode(cleanCode);

  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[480px] space-y-5 p-6">
        <Badge tone="cyan" mono>
          ONLINE ROOMS · 4-LETTER CODE
        </Badge>
        <div>
          <h1 className="anton-title m-0 text-[28px] text-ink">
            <Tx v={TRANSLATIONS.pages.joinTitle} />
          </h1>
        </div>

        <div>
          <label
            htmlFor="room-code-input"
            className="block text-xs font-extrabold uppercase tracking-wider text-ink"
          >
            <Tx v={TRANSLATIONS.pages.joinLabel} />
          </label>
          <input
            id="room-code-input"
            type="text"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. K7QM"
            className="mono-num mt-2 w-full rounded-[14px] border-[3px] border-ink bg-card px-4 py-3 text-center text-3xl uppercase tracking-[0.2em] text-ink"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {valid ? (
            <WallLinkButton href={`/room/${cleanCode}`} variant="yellow" className="w-full">
              Join Room {cleanCode} →
            </WallLinkButton>
          ) : (
            <WallButton variant="white" disabled className="w-full opacity-60">
              <Tx v={TRANSLATIONS.pages.joinInvalid} />
            </WallButton>
          )}
        </div>
      </Sticker>
    </AppFrame>
  );
}
