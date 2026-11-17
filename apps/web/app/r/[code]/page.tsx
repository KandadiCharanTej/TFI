"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isValidRoomCode, normalizeRoomCode } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { useFlags } from "@/components/flags-provider";
import { Tx, useLang } from "@/components/lang-provider";
import { Badge, Sticker, TicketStub, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { lookupRoomOnServer, savePendingRoomName } from "@/lib/room-client";
import { usePreferencesStore } from "@/lib/store";

const R = TRANSLATIONS.rooms;

export default function InviteConfirmPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = use(params);
  const code = normalizeRoomCode(rawCode);
  const valid = isValidRoomCode(code);
  const router = useRouter();
  const { lang } = useLang();
  const { enableRooms, partykitHost } = useFlags();
  const { deviceName } = usePreferencesStore();

  const [name, setName] = useState(deviceName || "");
  const [statusNote, setStatusNote] = useState("");
  const [errNext, setErrNext] = useState("");

  useEffect(() => {
    if (!enableRooms || !valid) return;
    let cancelled = false;
    void lookupRoomOnServer(partykitHost, code).then((res) => {
      if (cancelled) return;
      if (!res.exists) {
        setStatusNote(R.errNotFoundTitle[lang]);
        setErrNext(R.errNotFoundNext[lang]);
      } else if (res.status === "in_game") {
        setStatusNote(R.errStartedTitle[lang]);
        setErrNext(R.errStartedNext[lang]);
      } else if (res.playerCount >= 10) {
        setStatusNote(R.errFullTitle[lang]);
        setErrNext(R.errFullNext[lang]);
      } else {
        setStatusNote("");
        setErrNext("");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [enableRooms, valid, code, partykitHost, lang]);

  if (!enableRooms) {
    return (
      <AppFrame>
        <Sticker className="mx-auto max-w-[480px] space-y-4 p-6">
          <Badge tone="cyan" mono>
            {code || "----"}
          </Badge>
          <h1 className="h2-title m-0 text-ink">
            <Tx v={R.roomsOpeningSoon} />
          </h1>
          <p className="m-0 text-[15px] font-medium text-ink/85">
            <Tx v={R.roomsOpeningSoonBody} />
          </p>
          <WallLinkButton href="/play" variant="yellow">
            ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
          </WallLinkButton>
        </Sticker>
      </AppFrame>
    );
  }

  function handleJoin() {
    savePendingRoomName(name);
    router.push(`/room/${code}`);
  }

  return (
    <AppFrame>
      <div className="mx-auto max-w-[480px] space-y-5">
        <TicketStub
          bg="cyan"
          header={
            <div className="flex items-center justify-between gap-2">
              <Badge tone="white">
                <Tx v={R.onlineBadge} />
              </Badge>
              <span className="wall-label text-ink">
                <Tx v={R.roomCodeHeading} />
              </span>
            </div>
          }
        >
          <p className="mono-num m-0 text-center text-[44px] font-bold tracking-[0.14em] text-ink">
            {valid ? code : "----"}
          </p>
        </TicketStub>

        <Sticker className="space-y-4 p-6">
          <h1 className="h1-title m-0 text-ink">
            <Tx v={R.inviteTitle} />
          </h1>
          <p className="m-0 text-[15px] font-medium text-ink/85">
            <Tx v={R.inviteBody} />
          </p>

          <div>
            <label htmlFor="invite-name-input" className="wall-label block text-ink">
              <Tx v={R.yourNameLabel} />
            </label>
            <input
              id="invite-name-input"
              data-testid="invite-name-input"
              type="text"
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={R.guestPlaceholder[lang]}
              className="mt-2 min-h-[48px] w-full rounded-[14px] border-[2.5px] border-ink bg-card px-4 py-2 text-[17px] font-bold text-ink focus:bg-white focus:outline-none"
            />
          </div>

          {statusNote ? (
            <div role="alert" className="rounded-[14px] border-2 border-ink bg-card p-3.5">
              <p className="m-0 text-[15px] font-bold text-ink">{statusNote}</p>
              <p className="m-0 mt-1 text-[13px] font-medium text-ink/85">{errNext}</p>
            </div>
          ) : null}

          <WallButton
            variant="yellow"
            disabled={!valid}
            onClick={handleJoin}
            data-testid="invite-join-btn"
            className="w-full"
          >
            <Tx v={R.joinBtn} /> →
          </WallButton>
        </Sticker>
      </div>
    </AppFrame>
  );
}
