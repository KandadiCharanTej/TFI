"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeRoomCode } from "@tfi/game-core";
import { AppFrame } from "@/components/app-frame";
import { useFlags } from "@/components/flags-provider";
import { Tx, useLang, useT } from "@/components/lang-provider";
import { Badge, Sticker, TicketStub, WallButton, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";
import { ROOMS_TRANSLATIONS as R } from "@/lib/i18n-rooms";
import { readPendingRoomName, useRoomConnection } from "@/lib/room-client";
import { usePreferencesStore } from "@/lib/store";

export default function RoomLobbyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = use(params);
  const code = normalizeRoomCode(rawCode);
  const router = useRouter();
  const { lang } = useLang();
  const t = useT();
  const { enableRooms, partykitHost } = useFlags();
  const { deviceName } = usePreferencesStore();
  const [preferredName, setPreferredName] = useState("");
  const [copiedMsg, setCopiedMsg] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    setPreferredName(readPendingRoomName() || deviceName || "");
  }, [deviceName]);

  const {
    room,
    phase,
    errorMessage,
    announcement,
    clockOffsetMs,
    deviceId,
    sendStartGame,
    sendRemovePlayer,
    sendCloseRoom,
    sendLeave,
    sendGameAction,
    retry,
  } = useRoomConnection({
    configuredHost: partykitHost,
    code,
    playerName: preferredName,
    enabled: enableRooms,
  });

  // Drive local smooth countdown display from server-calibrated clock
  useEffect(() => {
    if (room?.status !== "in_game" || room.gameState?.phase !== "countdown") return;
    const id = window.setInterval(() => setNowMs(Date.now()), 120);
    return () => window.clearInterval(id);
  }, [room?.status, room?.gameState?.phase]);

  if (!enableRooms) {
    return (
      <AppFrame>
        <Sticker className="mx-auto max-w-[520px] space-y-4 p-6">
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

  if (phase === "removed") {
    return (
      <AppFrame>
        <Sticker className="mx-auto max-w-[480px] space-y-4 p-6 text-center" data-testid="room-removed-screen">
          <Badge tone="magenta">
            <Tx v={R.removedTitle} />
          </Badge>
          <h1 className="h2-title m-0 text-ink">
            <Tx v={R.removedTitle} />
          </h1>
          <p className="m-0 text-[15px] font-medium text-ink/85">
            <Tx v={R.removedBody} />
          </p>
          <WallLinkButton href="/play" variant="yellow" className="w-full">
            ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
          </WallLinkButton>
        </Sticker>
      </AppFrame>
    );
  }

  if (phase === "room_closed") {
    return (
      <AppFrame>
        <Sticker className="mx-auto max-w-[480px] space-y-4 p-6 text-center" data-testid="room-closed-screen">
          <Badge tone="cyan" mono>
            {code}
          </Badge>
          <h1 className="h2-title m-0 text-ink">
            <Tx v={R.closedTitle} />
          </h1>
          <p className="m-0 text-[15px] font-medium text-ink/85">
            <Tx v={R.closedBody} />
          </p>
          <WallLinkButton href="/play" variant="yellow" className="w-full">
            ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
          </WallLinkButton>
        </Sticker>
      </AppFrame>
    );
  }

  if (phase === "not_found" || phase === "error") {
    return (
      <AppFrame>
        <Sticker className="mx-auto max-w-[480px] space-y-4 p-6 text-center" data-testid="room-error-screen">
          <Badge tone="magenta">
            <Tx v={R.errNotFoundTitle} />
          </Badge>
          <h1 className="h2-title m-0 text-ink">
            {errorMessage || R.errNotFoundTitle[lang]}
          </h1>
          <p className="m-0 text-[15px] font-medium text-ink/85">
            <Tx v={R.errNotFoundNext} />
          </p>
          <div className="flex flex-wrap gap-3">
            <WallLinkButton href="/join" variant="yellow" className="flex-1">
              <Tx v={R.joinBtn} />
            </WallLinkButton>
            <WallLinkButton href="/play" variant="white" className="flex-1">
              <Tx v={TRANSLATIONS.common.backToPlayHome} />
            </WallLinkButton>
          </div>
        </Sticker>
      </AppFrame>
    );
  }

  const me = room?.players.find((p) => p.deviceId === deviceId) ?? null;
  const isHost = Boolean(me && room?.hostId === me.id);
  const connectedCount = room?.players.filter((p) => p.connected).length ?? 0;

  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/r/${code}` : `/r/${code}`;

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(R.copied[lang]);
      window.setTimeout(() => setCopiedMsg(""), 1800);
    } catch {
      /* ignore clipboard deny */
    }
  }

  async function handleShare() {
    const shareText = t(R.shareInviteText, { url: inviteUrl });
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `TFI & Pitch · ${code}`,
          text: shareText,
          url: inviteUrl,
        });
        return;
      } catch {
        /* fallback to copy */
      }
    }
    await copyText(shareText);
  }

  const countdownSec =
    room?.gameState?.countdownEndAt !== null && room?.gameState?.countdownEndAt !== undefined
      ? Math.max(0, Math.ceil((room.gameState.countdownEndAt - (nowMs + clockOffsetMs)) / 1000))
      : null;

  return (
    <AppFrame>
      <div className="mx-auto max-w-[540px] space-y-5" data-testid="room-lobby-page">
        {/* Screen-reader live region for join/leave announcements */}
        <div className="visually-hidden" aria-live="polite" data-testid="room-live-announcer">
          {announcement}
        </div>

        {/* Offline / reconnect banners (only shown if connection drops after load) */}
        {phase === "reconnecting" ? (
          <div
            role="status"
            data-testid="room-reconnecting-banner"
            className="rounded-[14px] border-2 border-ink bg-yellow px-4 py-3 text-center text-[14px] font-bold text-ink"
          >
            <Tx v={R.reconnecting} />
          </div>
        ) : null}

        {phase === "offline" ? (
          <div
            role="alert"
            data-testid="room-offline-banner"
            className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border-2 border-ink bg-magenta px-4 py-3 text-white"
          >
            <span className="text-[19px] font-bold">
              <Tx v={R.offlineBanner} />
            </span>
            <WallButton variant="white" size="sm" onClick={retry}>
              <Tx v={R.retryBtn} />
            </WallButton>
          </div>
        ) : null}

        {/* Cyan TicketStub centerpiece with 4-letter Room Code */}
        <TicketStub
          bg="cyan"
          className="bg-stripes"
          header={
            <div className="flex items-center justify-between gap-2">
              <Badge tone="white">
                <Tx v={R.onlineBadge} />
              </Badge>
              {phase === "connecting" ? (
                <span role="status" data-testid="room-connecting-banner" className="wall-label text-ink">
                  <Tx v={R.connecting} />
                </span>
              ) : (
                <span className="wall-label text-ink">
                  <Tx v={R.roomCodeHeading} />
                </span>
              )}
            </div>
          }
          footer={
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <WallButton
                variant="white"
                size="sm"
                data-testid="copy-code-btn"
                onClick={() => void copyText(code)}
              >
                <Tx v={R.copyCode} />
              </WallButton>
              <WallButton
                variant="white"
                size="sm"
                data-testid="copy-link-btn"
                onClick={() => void copyText(inviteUrl)}
              >
                <Tx v={R.copyLink} />
              </WallButton>
              <WallButton
                variant="yellow"
                size="sm"
                data-testid="share-room-btn"
                onClick={() => void handleShare()}
              >
                <Tx v={R.shareBtn} />
              </WallButton>
              {copiedMsg ? (
                <span role="status" className="text-[13px] font-bold text-ink">
                  {copiedMsg}
                </span>
              ) : null}
            </div>
          }
        >
          <h1
            className="mono-num m-0 text-center text-[52px] font-bold leading-none tracking-[0.16em] text-ink"
            data-testid="room-code-display"
          >
            {code}
          </h1>
        </TicketStub>

        {/* Active Ready Check Game Panel (when game started) */}
        {room?.status === "in_game" && room.gameState ? (
          <Sticker className="space-y-4 p-6 text-center" data-testid="ready-check-panel">
            <Badge tone="yellow">
              <Tx v={R.readyCheckTitle} />
            </Badge>

            {room.gameState.phase === "waiting" ? (
              <>
                <h2 className="h2-title m-0 text-ink">
                  <Tx v={R.readyCheckDesc} />
                </h2>
                <WallButton
                  variant={me && room.gameState.readyIds.includes(me.id) ? "green" : "yellow"}
                  disabled={!me || room.gameState.readyIds.includes(me.id)}
                  onClick={() => sendGameAction("ready")}
                  data-testid="ready-check-btn"
                  className="w-full"
                >
                  {me && room.gameState.readyIds.includes(me.id) ? (
                    <>✓ <Tx v={R.readyDone} /></>
                  ) : (
                    <Tx v={R.imReady} />
                  )}
                </WallButton>
              </>
            ) : null}

            {room.gameState.phase === "countdown" ? (
              <>
                <p className="wall-label m-0 text-ink">
                  <Tx v={R.everyoneReady} />
                </p>
                <p
                  className="mono-num m-0 text-[88px] font-bold leading-none text-ink"
                  data-testid="ready-countdown"
                >
                  {Math.max(1, countdownSec ?? 3)}
                </p>
              </>
            ) : null}

            {room.gameState.phase === "done" ? (
              <div className="space-y-3" data-testid="ready-done">
                <p className="h2-title m-0 text-ink">
                  <Tx v={R.readyComplete} />
                </p>
                <WallLinkButton href="/play" variant="yellow" className="w-full">
                  ← <Tx v={TRANSLATIONS.common.backToPlayHome} />
                </WallLinkButton>
              </div>
            ) : null}
          </Sticker>
        ) : null}

        {/* Player List (2 to 10 players) */}
        <Sticker className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="h3-title m-0 text-ink">
              <Tx v={R.playersHeading} /> ({room?.players.length ?? 0}/10)
            </h2>
            <Badge tone="white" mono>
              {connectedCount}/10
            </Badge>
          </div>

          <ul role="list" className="max-h-[42dvh] min-h-[64px] space-y-2.5 overflow-y-auto pr-1" data-testid="room-player-list">
            {(room?.players ?? []).map((p) => {
              const isDarkMagentaCircle = p.color === "#EC1276";
              const isReady = room?.gameState?.readyIds.includes(p.id) ?? false;
              return (
                <li
                  key={p.id}
                  data-testid={`player-row-${p.id}`}
                  className="v4-avatar-pop flex items-center justify-between gap-3 rounded-[16px] border-[2.5px] border-ink bg-card px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink text-[19px] font-bold ${
                        isDarkMagentaCircle ? "text-white" : "text-ink"
                      }`}
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[16px] font-bold text-ink">{p.name}</span>
                        {p.isHost ? (
                          <span
                            data-testid="host-badge"
                            className="inline-flex items-center gap-1 rounded-full border border-ink bg-yellow px-2 py-0.5 text-[12px] font-bold text-ink"
                          >
                            <span aria-hidden="true">👑</span>
                            <Tx v={R.hostTag} />
                          </span>
                        ) : null}
                        {room?.status === "in_game" && isReady ? (
                          <span className="inline-flex items-center rounded-full border border-ink bg-green px-2 py-0.5 text-[12px] font-bold text-ink">
                            ✓ <Tx v={R.readyDone} />
                          </span>
                        ) : null}
                      </div>
                      <p className="m-0 flex items-center gap-1.5 text-[12px] font-semibold text-ink/80">
                        <span
                          aria-hidden="true"
                          className="inline-block h-2.5 w-2.5 rounded-full border border-ink"
                          style={{ backgroundColor: p.connected ? "#00C853" : "#F4F1EA" }}
                        />
                        {p.connected ? <Tx v={R.connected} /> : <Tx v={R.away} />}
                      </p>
                    </div>
                  </div>

                  {isHost && !p.isHost ? (
                    <button
                      type="button"
                      data-testid={`remove-player-${p.id}`}
                      onClick={() => sendRemovePlayer(p.id)}
                      className="min-h-[44px] min-w-[44px] rounded-[10px] border-2 border-ink bg-white px-3 text-[13px] font-bold text-ink hover:bg-card"
                    >
                      <Tx v={R.removePlayer} />
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Sticker>

        {/* Host or Guest Controls (sticky Start on phones) */}
        {!room || room.status === "lobby" ? (
          <Sticker className="min-h-[144px] space-y-3 p-5">
            {!room ? (
              <p className="m-0 rounded-[12px] border-2 border-ink bg-card px-4 py-3 text-center text-[16px] font-bold text-ink">
                <Tx v={R.connecting} />
              </p>
            ) : isHost ? (
              <>
                <div>
                  <WallButton
                    variant="yellow"
                    disabled={connectedCount < 2 || room.gameId === "box-office-auction"}
                    onClick={() => sendStartGame(room.gameId)}
                    data-testid="room-start-btn"
                    className={`w-full ${
                      connectedCount >= 2 && room.gameId !== "box-office-auction"
                        ? "v4-host-pulse"
                        : ""
                    }`}
                  >
                    <Tx v={R.startGame} /> →
                  </WallButton>
                </div>
                {connectedCount < 2 ? (
                  <p className="m-0 text-center text-[13px] font-semibold text-ink/80">
                    <Tx v={R.needTwoPlayers} />
                  </p>
                ) : null}
                <WallButton
                  variant="magenta"
                  onClick={sendCloseRoom}
                  data-testid="room-close-btn"
                  className="w-full"
                >
                  <Tx v={R.closeRoom} />
                </WallButton>
              </>
            ) : (
              <p
                className="m-0 rounded-[12px] border-2 border-ink bg-card px-4 py-3 text-center text-[15px] font-bold text-ink"
                data-testid="waiting-for-host"
              >
                <Tx v={R.waitingForHost} />
              </p>
            )}
            {room ? (
              <WallButton
                variant="white"
                onClick={() => {
                  sendLeave();
                  router.push("/play");
                }}
                data-testid="room-leave-btn"
                className="w-full"
              >
                <Tx v={R.leaveRoom} />
              </WallButton>
            ) : null}
          </Sticker>
        ) : null}
      </div>
    </AppFrame>
  );
}
