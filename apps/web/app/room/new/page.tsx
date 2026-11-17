"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/app-frame";
import { useFlags } from "@/components/flags-provider";
import { Tx, useLang } from "@/components/lang-provider";
import { Badge, Sticker, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { GAMES_CATALOG, TRANSLATIONS } from "@/lib/i18n";
import { createRoomOnServer, savePendingRoomName } from "@/lib/room-client";
import { usePreferencesStore } from "@/lib/store";

const R = TRANSLATIONS.rooms;

export default function NewRoomPage() {
  const router = useRouter();
  const { lang } = useLang();
  const { enableRooms, enableReadyCheck, partykitHost } = useFlags();
  const { deviceName } = usePreferencesStore();

  const [name, setName] = useState(deviceName || "");
  const [selectedGame, setSelectedGame] = useState<string>(
    enableReadyCheck ? "ready-check" : "box-office-auction",
  );
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");

  if (!enableRooms) {
    return (
      <AppFrame>
        <Sticker className="mx-auto max-w-[520px] space-y-4 p-6">
          <Badge tone="cyan">
            <Tx v={R.onlineBadge} />
          </Badge>
          <h1 className="h2-title m-0 text-ink">
            <Tx v={R.roomsOpeningSoon} />
          </h1>
          <p className="m-0 text-[15px] font-medium text-ink/90">
            <Tx v={R.roomsOpeningSoonBody} />
          </p>
          <WallLinkButton href="/play" variant="yellow">
            ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
          </WallLinkButton>
        </Sticker>
      </AppFrame>
    );
  }

  async function handleCreate() {
    setCreating(true);
    setErr("");
    savePendingRoomName(name);
    const res = await createRoomOnServer(partykitHost, selectedGame);
    if (!res.ok) {
      setErr(R.errNoConnectionNext[lang]);
      setCreating(false);
      return;
    }
    window.dispatchEvent(
      new CustomEvent("tfi:room_created", { detail: { game: res.gameId } }),
    );
    router.push(`/room/${res.code}`);
  }

  const canCreate = selectedGame === "ready-check";

  const auctionItem = GAMES_CATALOG.find((g) => g.slug === "box-office-auction");

  return (
    <AppFrame>
      <div className="mx-auto max-w-[540px] space-y-5">
        <Sticker className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-2">
            <Badge tone="cyan">
              <Tx v={R.createRoomBadge} />
            </Badge>
            <WallLinkButton href="/play" variant="white" size="sm">
              ← <Tx v={TRANSLATIONS.common.back} />
            </WallLinkButton>
          </div>

          <div>
            <h1 className="h1-title m-0 text-ink">
              <Tx v={R.createRoomTitle} />
            </h1>
            <p className="m-0 mt-1.5 text-[15px] font-medium text-ink/85">
              <Tx v={R.createRoomSub} />
            </p>
          </div>

          {/* Game Picker */}
          <div className="space-y-2.5">
            <p className="wall-label m-0 text-ink">
              <Tx v={R.pickGameLabel} />
            </p>

            {enableReadyCheck ? (
              <button
                type="button"
                data-testid="pick-game-ready-check"
                onClick={() => setSelectedGame("ready-check")}
                aria-pressed={selectedGame === "ready-check"}
                className="flex w-full items-center justify-between gap-3 rounded-[16px] border-[2.5px] border-ink p-4 text-left transition-colors"
                style={{
                  backgroundColor: selectedGame === "ready-check" ? "#00E5FF" : "#F4F1EA",
                }}
              >
                <div>
                  <p className="h3-title m-0 text-ink">
                    <Tx v={R.readyCheckTitle} />
                  </p>
                  <p className="m-0 mt-0.5 text-[14px] font-medium text-ink/90">
                    <Tx v={R.readyCheckDesc} />
                  </p>
                </div>
                <Badge tone="white">Dev</Badge>
              </button>
            ) : null}

            <div className="flex w-full items-center justify-between gap-3 rounded-[16px] border-[2.5px] border-ink bg-card p-4 text-left opacity-80">
              <div>
                <p className="h3-title m-0 text-ink">
                  <Tx v={auctionItem?.title ?? { en: "Box Office Auction", te: "బాక్స్ ఆఫీస్ ఆక్షన్" }} />
                </p>
                <p className="m-0 mt-0.5 text-[14px] font-medium text-ink/80">
                  <Tx v={auctionItem?.description ?? { en: "Bid on films. Hidden scores pick the winner.", te: "సినిమాలపై వేలం వేయండి." }} />
                </p>
              </div>
              <Badge tone="white">
                <Tx v={TRANSLATIONS.common.comingSoon} />
              </Badge>
            </div>
          </div>

          {/* Host Name */}
          <div>
            <label htmlFor="host-name-input" className="wall-label block text-ink">
              <Tx v={R.yourNameLabel} />
            </label>
            <input
              id="host-name-input"
              data-testid="room-host-name"
              type="text"
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={R.guestPlaceholder[lang]}
              className="mt-2 min-h-[48px] w-full rounded-[14px] border-[2.5px] border-ink bg-card px-4 py-2 text-[17px] font-bold text-ink focus:bg-white focus:outline-none"
            />
          </div>

          {err ? (
            <div
              role="alert"
              className="rounded-[14px] border-2 border-ink bg-card p-3.5 text-[14px] font-bold text-ink"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-magenta mr-2" aria-hidden="true" />
              {err}
            </div>
          ) : null}

          <WallButton
            variant="yellow"
            disabled={creating || !canCreate}
            onClick={() => void handleCreate()}
            data-testid="create-room-btn"
            className="w-full"
          >
            {creating ? <Tx v={R.creating} /> : <><Tx v={R.createBtn} /> →</>}
          </WallButton>
        </Sticker>
      </div>
    </AppFrame>
  );
}
