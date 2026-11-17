"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  computeClockOffsetMs,
  normalizeRoomCode,
  type RoomErrorCode,
  type RoomSnapshot,
  type ServerRoomMessage,
} from "@tfi/game-core";

const DEVICE_ID_KEY = "tfi.room.deviceId";
const PENDING_NAME_KEY = "tfi.room.pendingName";

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server-device";
  try {
    const existing = window.localStorage.getItem(DEVICE_ID_KEY);
    if (existing && existing.length >= 8) return existing;
    const created = `dev_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    window.localStorage.setItem(DEVICE_ID_KEY, created);
    return created;
  } catch {
    return `dev_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function savePendingRoomName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PENDING_NAME_KEY, name.trim().slice(0, 16));
  } catch {
    /* ignore */
  }
}

export function readPendingRoomName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(PENDING_NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function resolvePartyKitHost(configuredHost: string): string {
  const cleaned = configuredHost.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  if (cleaned) return cleaned;
  if (typeof window !== "undefined") {
    return `${window.location.hostname}:1999`;
  }
  return "127.0.0.1:1999";
}

function isLocalHost(host: string): boolean {
  return (
    host.startsWith("localhost") ||
    host.startsWith("127.") ||
    host.startsWith("192.168.") ||
    host.startsWith("10.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
}

export function resolvePartyKitHttpBase(configuredHost: string): string {
  const host = resolvePartyKitHost(configuredHost);
  return `${isLocalHost(host) ? "http" : "https"}://${host}`;
}

export function resolvePartyKitWsUrl(configuredHost: string, code: string): string {
  const host = resolvePartyKitHost(configuredHost);
  const proto = isLocalHost(host) ? "ws" : "wss";
  return `${proto}://${host}/parties/main/${encodeURIComponent(code)}`;
}

export async function createRoomOnServer(
  configuredHost: string,
  gameId: string,
): Promise<{ ok: true; code: string; gameId: string } | { ok: false; message: string }> {
  const base = resolvePartyKitHttpBase(configuredHost);
  try {
    const res = await fetch(`${base}/parties/registry/global`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    });
    if (!res.ok) {
      return { ok: false, message: `Server returned ${res.status}` };
    }
    const data = (await res.json()) as { code: string; gameId: string };
    return { ok: true, code: data.code, gameId: data.gameId };
  } catch {
    return { ok: false, message: "NO_CONNECTION" };
  }
}

export type LookupResult =
  | { exists: true; code: string; gameId: string; status: string; playerCount: number }
  | { exists: false; code: RoomErrorCode | "NO_CONNECTION"; message: string };

export async function lookupRoomOnServer(
  configuredHost: string,
  rawCode: string,
): Promise<LookupResult> {
  const base = resolvePartyKitHttpBase(configuredHost);
  const code = normalizeRoomCode(rawCode);
  try {
    const res = await fetch(`${base}/parties/registry/global?code=${encodeURIComponent(code)}`);
    const data = (await res.json().catch(() => ({}))) as {
      exists?: boolean;
      code?: RoomErrorCode;
      gameId?: string;
      status?: string;
      playerCount?: number;
      message?: string;
    };
    if (res.ok && data.exists) {
      return {
        exists: true,
        code,
        gameId: data.gameId ?? "ready-check",
        status: data.status ?? "lobby",
        playerCount: data.playerCount ?? 0,
      };
    }
    return {
      exists: false,
      code: data.code ?? "ROOM_NOT_FOUND",
      message: data.message ?? "No room found for that code",
    };
  } catch {
    return {
      exists: false,
      code: "NO_CONNECTION",
      message: "Could not reach the room server",
    };
  }
}

export type ConnectionPhase =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "offline"
  | "removed"
  | "room_closed"
  | "not_found"
  | "error";

export function useRoomConnection({
  configuredHost,
  code,
  playerName,
  enabled,
}: {
  configuredHost: string;
  code: string;
  playerName: string;
  enabled: boolean;
}) {
  const [room, setRoom] = useState<RoomSnapshot | null>(null);
  const [phase, setPhase] = useState<ConnectionPhase>("connecting");
  const [errorCode, setErrorCode] = useState<RoomErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [announcement, setAnnouncement] = useState<string>("");
  const [clockOffsetMs, setClockOffsetMs] = useState<number>(0);
  const [attempt, setAttempt] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);
  const lastSeqRef = useRef<number>(-1);
  const joinedEmittedRef = useRef(false);
  const startedEmittedRef = useRef(false);
  const pingSamplesRef = useRef<
    { clientSentAt: number; clientReceivedAt: number; serverTime: number }[]
  >([]);
  const deviceIdRef = useRef<string>("");
  const playerNameRef = useRef<string>(playerName);
  playerNameRef.current = playerName;

  useEffect(() => {
    deviceIdRef.current = getOrCreateDeviceId();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setPhase("offline");
    }

    const onOnline = () => {
      setAttempt((a) => a + 1);
    };
    const onOffline = () => {
      setPhase("offline");
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const normalized = normalizeRoomCode(code);
    if (normalized.length !== 4) {
      setPhase("not_found");
      setErrorCode("ROOM_NOT_FOUND");
      return;
    }

    const deviceId = getOrCreateDeviceId();
    deviceIdRef.current = deviceId;
    const wsUrl = resolvePartyKitWsUrl(configuredHost, normalized);
    lastSeqRef.current = -1;
    pingSamplesRef.current = [];

    let stopped = false;
    let retries = 0;
    let reconnectTimer: number | null = null;
    let activeSocket: WebSocket | null = null;

    const connect = () => {
      if (stopped) return;
      setPhase(retries > 0 ? "reconnecting" : "connecting");
      const ws = new WebSocket(wsUrl);
      activeSocket = ws;
      socketRef.current = ws;

      ws.addEventListener("open", () => {
        retries = 0;
        setPhase("connected");
        setErrorCode(null);
        setErrorMessage("");
        const preferredName = playerNameRef.current.trim() || readPendingRoomName();
        ws.send(JSON.stringify({ type: "join", deviceId, name: preferredName || undefined }));
        for (let i = 0; i < 3; i++) {
          window.setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping", clientTime: Date.now() }));
            }
          }, i * 120);
        }
      });

      ws.addEventListener("close", (ev) => {
        if (stopped) return;
        if (ev.code === 4001) {
          setPhase("removed");
          return;
        }
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          setPhase("offline");
          return;
        }
        setPhase((prev) => {
          if (prev === "removed" || prev === "room_closed" || prev === "not_found" || prev === "error") {
            return prev;
          }
          if (retries < 5) {
            retries += 1;
            const delayMs = Math.min(3000, 400 * retries);
            reconnectTimer = window.setTimeout(connect, delayMs);
            return "reconnecting";
          }
          return "offline";
        });
      });

      ws.addEventListener("message", (ev) => {
        let msg: ServerRoomMessage;
        try {
          msg = JSON.parse(String(ev.data)) as ServerRoomMessage;
        } catch {
          return;
        }

        if (msg.type === "pong") {
          const samples = [
            ...pingSamplesRef.current,
            { clientSentAt: msg.clientTime, clientReceivedAt: Date.now(), serverTime: msg.serverTime },
          ].slice(-5);
          pingSamplesRef.current = samples;
          setClockOffsetMs(computeClockOffsetMs(samples));
          return;
        }

        if (msg.type === "error") {
          setErrorCode(msg.code);
          setErrorMessage(msg.message);
          if (msg.code === "REMOVED") {
            stopped = true;
            setPhase("removed");
          } else if (msg.code === "ROOM_CLOSED") {
            stopped = true;
            setPhase("room_closed");
          } else if (msg.code === "ROOM_NOT_FOUND") {
            stopped = true;
            setPhase("not_found");
          } else if (
            msg.code === "ROOM_FULL" ||
            msg.code === "GAME_STARTED" ||
            msg.code === "UNAUTHORIZED" ||
            msg.code === "NOT_ENOUGH_PLAYERS"
          ) {
            setPhase("error");
          }
          return;
        }

        if (msg.type === "snapshot" || msg.type === "delta") {
          if (msg.type === "delta" && lastSeqRef.current >= 0 && msg.seq > lastSeqRef.current + 1) {
            ws.send(JSON.stringify({ type: "sync" }));
            return;
          }
          lastSeqRef.current = msg.seq;
          setRoom(msg.room);
          setPhase(msg.room.status === "closed" ? "room_closed" : "connected");

          if (!joinedEmittedRef.current) {
            joinedEmittedRef.current = true;
            window.dispatchEvent(
              new CustomEvent("tfi:room_joined", { detail: { game: msg.room.gameId } }),
            );
          }
          if (msg.room.status === "in_game" && !startedEmittedRef.current) {
            startedEmittedRef.current = true;
            window.dispatchEvent(
              new CustomEvent("tfi:room_started", { detail: { game: msg.room.gameId } }),
            );
          }

          if (msg.type === "delta" && msg.event) {
            const actor = msg.event.actorName ?? "A player";
            if (msg.event.kind === "joined") setAnnouncement(`${actor} joined the room`);
            else if (msg.event.kind === "reconnected") setAnnouncement(`${actor} reconnected`);
            else if (msg.event.kind === "disconnected") setAnnouncement(`${actor} lost connection`);
            else if (msg.event.kind === "left") setAnnouncement(`${actor} left the room`);
            else if (msg.event.kind === "removed") setAnnouncement(`${actor} was removed`);
            else if (msg.event.kind === "host_changed") setAnnouncement("Host changed");
          }
        }
      });
    };

    connect();

    return () => {
      stopped = true;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      if (activeSocket) {
        if (activeSocket.readyState === WebSocket.OPEN) {
          activeSocket.close(1000, "Unmount");
        } else if (activeSocket.readyState === WebSocket.CONNECTING) {
          const sock = activeSocket;
          sock.addEventListener(
            "open",
            () => {
              sock.close(1000, "Unmount");
            },
            { once: true },
          );
        }
      }
      socketRef.current = null;
    };
  }, [code, configuredHost, enabled, attempt]);

  const sendPayload = useCallback((obj: unknown) => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(obj));
    }
  }, []);

  const sendStartGame = useCallback(
    (gameId: string) => sendPayload({ type: "start_game", gameId }),
    [sendPayload],
  );
  const sendRemovePlayer = useCallback(
    (targetId: string) => sendPayload({ type: "remove_player", targetId }),
    [sendPayload],
  );
  const sendCloseRoom = useCallback(
    () => sendPayload({ type: "close_room" }),
    [sendPayload],
  );
  const sendLeave = useCallback(() => sendPayload({ type: "leave" }), [sendPayload]);
  const sendGameAction = useCallback(
    (action: string, payload?: Record<string, unknown>) =>
      sendPayload({ type: "game_action", action, payload }),
    [sendPayload],
  );

  const retry = useCallback(() => {
    setAttempt((a) => a + 1);
  }, []);

  return {
    room,
    phase,
    errorCode,
    errorMessage,
    announcement,
    clockOffsetMs,
    deviceId: deviceIdRef.current,
    sendStartGame,
    sendRemovePlayer,
    sendCloseRoom,
    sendLeave,
    sendGameAction,
    retry,
  };
}
