"use client";

import { useState } from "react";
import { isValidRoomCode } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { Badge, Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";

export default function JoinRoomPage() {
  const [code, setCode] = useState("K7QM");
  const cleanCode = code.toUpperCase().trim();
  const valid = isValidRoomCode(cleanCode);

  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[480px] space-y-5 p-6">
        <Badge tone="cyan" mono>
          ONLINE ROOMS · 4-LETTER CODE
        </Badge>
        <div>
          <p className="te-script m-0 text-[26px] leading-[1.55] text-ink" lang="te">
            రూమ్ కోడ్ ఎంటర్ చేయండి
          </p>
          <h1 className="anton-title m-0 text-[28px] text-ink">Enter a 4-letter code</h1>
        </div>

        <div>
          <label
            htmlFor="room-code-input"
            className="block text-xs font-extrabold uppercase tracking-wider text-ink"
          >
            Room Code (No I, O, 0, 1)
          </label>
          <input
            id="room-code-input"
            type="text"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
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
              Enter valid 4-letter code
            </WallButton>
          )}
        </div>
      </Sticker>
    </AppFrame>
  );
}
