import {
  HOST_AWAY_HANDOVER_MS,
  MAX_ROOM_PLAYERS,
  RECONNECT_GRACE_MS,
  ROOM_AVATAR_COLORS,
  ROOM_CODE_ALPHABET,
  ROOM_CODE_LENGTH,
  ROOM_IDLE_EXPIRY_MS,
  type RoomErrorCode,
  type RoomPlayer,
  type RoomSnapshot,
} from "./room-protocol";
import type { RoomGamePlugin } from "./room-plugin";

const GUEST_ANIMALS = [
  "Tiger",
  "Eagle",
  "Lion",
  "Falcon",
  "Cobra",
  "Fox",
  "Bear",
  "Hawk",
  "Wolf",
  "Stag",
] as const;

export interface InternalRoomState extends RoomSnapshot {
  seq: number;
  removedDeviceIds: string[];
  emptySince: number | null;
}

export function normalizeRoomCode(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, ROOM_CODE_LENGTH);
}

export function isValidRoomCode(code: string): boolean {
  if (code.length !== ROOM_CODE_LENGTH) return false;
  for (const ch of code) {
    if (!ROOM_CODE_ALPHABET.includes(ch)) {
      return false;
    }
  }
  return true;
}

/** Generates a 4-letter code avoiding active codes. */
export function generateRoomCode(
  activeCodes: ReadonlySet<string> = new Set(),
  rng: () => number = Math.random,
): string {
  for (let attempt = 0; attempt < 200; attempt++) {
    let code = "";
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      const idx = Math.floor(rng() * ROOM_CODE_ALPHABET.length) % ROOM_CODE_ALPHABET.length;
      code += ROOM_CODE_ALPHABET[idx]!;
    }
    if (!activeCodes.has(code)) return code;
  }
  throw new Error("Exhausted room code attempts");
}

/** Cleans a player name: strip control chars, collapse spaces, trim, clamp 1..16 chars. */
export function cleanPlayerName(raw: string | undefined, fallbackIndex = 0): string {
  const sanitized = (raw ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 16)
    .trim();
  if (sanitized.length >= 1) return sanitized;
  const animal = GUEST_ANIMALS[Math.abs(fallbackIndex) % GUEST_ANIMALS.length] ?? "Tiger";
  return `Guest ${animal}`.slice(0, 16);
}

export interface RateBucket {
  count: number;
  windowStart: number;
}

export function checkRateLimit(
  buckets: Map<string, RateBucket>,
  key: string,
  now: number,
  limit: { readonly maxCount: number; readonly windowMs: number },
): boolean {
  const existing = buckets.get(key);
  if (!existing || now - existing.windowStart >= limit.windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (existing.count >= limit.maxCount) {
    return false;
  }
  existing.count += 1;
  return true;
}

export function createInternalRoom(
  code: string,
  gameId = "box-office-auction",
  now = Date.now(),
): InternalRoomState {
  return {
    code,
    gameId,
    status: "lobby",
    hostId: null,
    players: [],
    createdAt: now,
    lastActivityAt: now,
    closedReason: "none",
    gameState: null,
    seq: 0,
    removedDeviceIds: [],
    emptySince: now,
  };
}

export function toPublicSnapshot(room: InternalRoomState): RoomSnapshot {
  return {
    code: room.code,
    gameId: room.gameId,
    status: room.status,
    hostId: room.hostId,
    players: room.players,
    createdAt: room.createdAt,
    lastActivityAt: room.lastActivityAt,
    closedReason: room.closedReason,
    gameState: room.gameState,
  };
}

function findNextFreeSeat(players: readonly RoomPlayer[]): number | null {
  const taken = new Set(players.map((p) => p.seat));
  for (let i = 0; i < MAX_ROOM_PLAYERS; i++) {
    if (!taken.has(i)) return i;
  }
  return null;
}

function pickLongestConnectedHost(players: readonly RoomPlayer[]): RoomPlayer | null {
  const connected = players
    .filter((p) => p.connected)
    .sort((a, b) => a.connectedAt - b.connectedAt || a.seat - b.seat);
  return connected[0] ?? null;
}

export type RoomOpResult =
  | {
      ok: true;
      room: InternalRoomState;
      player?: RoomPlayer;
      reconnected?: boolean;
      removedDeviceId?: string;
      hostChanged?: boolean;
    }
  | { ok: false; code: RoomErrorCode; message: string };

export function joinRoomPlayer(
  room: InternalRoomState,
  input: { deviceId: string; name?: string; now: number },
): RoomOpResult {
  const { deviceId, name, now } = input;
  if (room.status === "closed") {
    return { ok: false, code: "ROOM_CLOSED", message: "This room has been closed" };
  }
  if (room.removedDeviceIds.includes(deviceId)) {
    return { ok: false, code: "REMOVED", message: "You were removed by the host" };
  }

  // Reconnect existing seat within 5-minute window
  const existingIdx = room.players.findIndex((p) => p.deviceId === deviceId);
  if (existingIdx >= 0) {
    const existing = room.players[existingIdx]!;
    const withinGrace =
      existing.connected ||
      existing.disconnectedAt === null ||
      now - existing.disconnectedAt <= RECONNECT_GRACE_MS;

    if (withinGrace) {
      const cleanedName = name?.trim()
        ? cleanPlayerName(name, existing.seat)
        : existing.name;
      const updatedPlayer: RoomPlayer = {
        ...existing,
        name: cleanedName,
        connected: true,
        connectedAt: existing.connected ? existing.connectedAt : now,
        disconnectedAt: null,
      };
      const players = room.players.map((p, idx) => (idx === existingIdx ? updatedPlayer : p));
      const hostId = room.hostId ?? updatedPlayer.id;
      const normalizedPlayers = players.map((p) => ({
        ...p,
        isHost: p.id === hostId,
      }));
      return {
        ok: true,
        reconnected: true,
        player: normalizedPlayers[existingIdx],
        room: {
          ...room,
          players: normalizedPlayers,
          hostId,
          lastActivityAt: now,
          emptySince: null,
          seq: room.seq + 1,
        },
      };
    }
  }

  if (room.status === "in_game") {
    return { ok: false, code: "GAME_STARTED", message: "This game has already started" };
  }

  if (room.players.length >= MAX_ROOM_PLAYERS) {
    return { ok: false, code: "ROOM_FULL", message: "This room already has 10 players" };
  }

  const freeSeat = findNextFreeSeat(room.players);
  if (freeSeat === null) {
    return { ok: false, code: "ROOM_FULL", message: "This room already has 10 players" };
  }

  const newPlayerId = `p_${freeSeat}_${Math.floor(now % 100000)}`;
  const isFirstOrNoHost = room.hostId === null || !room.players.some((p) => p.id === room.hostId);
  const player: RoomPlayer = {
    id: newPlayerId,
    deviceId,
    name: cleanPlayerName(name, freeSeat),
    color: ROOM_AVATAR_COLORS[freeSeat % ROOM_AVATAR_COLORS.length]!,
    seat: freeSeat,
    isHost: isFirstOrNoHost,
    connected: true,
    joinedAt: now,
    connectedAt: now,
    disconnectedAt: null,
  };

  const hostId = isFirstOrNoHost ? player.id : room.hostId;
  return {
    ok: true,
    reconnected: false,
    player,
    room: {
      ...room,
      hostId,
      players: [...room.players, player],
      lastActivityAt: now,
      emptySince: null,
      seq: room.seq + 1,
    },
  };
}

export function disconnectRoomPlayer(
  room: InternalRoomState,
  deviceId: string,
  now: number,
): InternalRoomState {
  const idx = room.players.findIndex((p) => p.deviceId === deviceId);
  if (idx < 0) return room;
  const target = room.players[idx]!;
  if (!target.connected) return room;

  const players = room.players.map((p, i) =>
    i === idx ? { ...p, connected: false, disconnectedAt: now } : p,
  );
  const anyConnected = players.some((p) => p.connected);

  return {
    ...room,
    players,
    emptySince: anyConnected ? null : now,
    seq: room.seq + 1,
  };
}

export function leaveRoomPlayer(
  room: InternalRoomState,
  deviceId: string,
  now: number,
): { room: InternalRoomState; leftPlayer: RoomPlayer | null; hostChanged: boolean } {
  const leaving = room.players.find((p) => p.deviceId === deviceId) ?? null;
  if (!leaving) return { room, leftPlayer: null, hostChanged: false };

  let remaining = room.players.filter((p) => p.deviceId !== deviceId);
  let hostId = room.hostId;
  let hostChanged = false;

  if (hostId === leaving.id) {
    const nextHost = pickLongestConnectedHost(remaining) ?? remaining[0] ?? null;
    hostId = nextHost?.id ?? null;
    hostChanged = hostId !== null;
    remaining = remaining.map((p) => ({ ...p, isHost: p.id === hostId }));
  }

  const anyConnected = remaining.some((p) => p.connected);
  return {
    leftPlayer: leaving,
    hostChanged,
    room: {
      ...room,
      players: remaining,
      hostId,
      lastActivityAt: now,
      emptySince: anyConnected ? null : now,
      seq: room.seq + 1,
    },
  };
}

export function removeRoomPlayerByHost(
  room: InternalRoomState,
  hostDeviceId: string,
  targetPlayerId: string,
  now: number,
): RoomOpResult {
  if (room.status === "closed") {
    return { ok: false, code: "ROOM_CLOSED", message: "Room is closed" };
  }
  const actor = room.players.find((p) => p.deviceId === hostDeviceId);
  if (!actor || actor.id !== room.hostId) {
    return { ok: false, code: "UNAUTHORIZED", message: "Only the host can remove players" };
  }
  const target = room.players.find((p) => p.id === targetPlayerId);
  if (!target || target.id === actor.id) {
    return { ok: false, code: "INVALID_MESSAGE", message: "Cannot remove this player" };
  }

  const players = room.players.filter((p) => p.id !== targetPlayerId);
  return {
    ok: true,
    player: target,
    removedDeviceId: target.deviceId,
    room: {
      ...room,
      players,
      removedDeviceIds: [...room.removedDeviceIds, target.deviceId],
      lastActivityAt: now,
      seq: room.seq + 1,
    },
  };
}

export function closeRoomByHost(
  room: InternalRoomState,
  hostDeviceId: string,
  now: number,
): RoomOpResult {
  const actor = room.players.find((p) => p.deviceId === hostDeviceId);
  if (!actor || actor.id !== room.hostId) {
    return { ok: false, code: "UNAUTHORIZED", message: "Only the host can close the room" };
  }
  return {
    ok: true,
    room: {
      ...room,
      status: "closed",
      closedReason: "host_closed",
      lastActivityAt: now,
      seq: room.seq + 1,
    },
  };
}

export function startRoomGame(
  room: InternalRoomState,
  hostDeviceId: string,
  plugin: RoomGamePlugin,
  settings: Record<string, unknown> | undefined,
  now: number,
): RoomOpResult {
  if (room.status === "closed") {
    return { ok: false, code: "ROOM_CLOSED", message: "Room is closed" };
  }
  const actor = room.players.find((p) => p.deviceId === hostDeviceId);
  if (!actor || actor.id !== room.hostId) {
    return { ok: false, code: "UNAUTHORIZED", message: "Only the host can start the game" };
  }
  const connectedCount = room.players.filter((p) => p.connected).length;
  if (connectedCount < plugin.minPlayers) {
    return {
      ok: false,
      code: "NOT_ENOUGH_PLAYERS",
      message: `Need at least ${plugin.minPlayers} connected players to start`,
    };
  }
  const gameState = plugin.createInitialState(room.players, settings ?? plugin.defaultSettings, now);
  return {
    ok: true,
    room: {
      ...room,
      gameId: plugin.id,
      status: "in_game",
      gameState,
      lastActivityAt: now,
      seq: room.seq + 1,
    },
  };
}

export function applyRoomGameAction(
  room: InternalRoomState,
  deviceId: string,
  plugin: RoomGamePlugin,
  action: string,
  payload: Record<string, unknown> | undefined,
  now: number,
): RoomOpResult {
  if (room.status !== "in_game" || !room.gameState) {
    return { ok: false, code: "INVALID_MESSAGE", message: "No active game in this room" };
  }
  const player = room.players.find((p) => p.deviceId === deviceId);
  if (!player) {
    return { ok: false, code: "UNAUTHORIZED", message: "Player is not in this room" };
  }
  const nextGameState = plugin.onAction(room.gameState, player.id, action, payload, now, room.players);
  if (nextGameState === room.gameState) {
    return { ok: true, room };
  }
  return {
    ok: true,
    room: {
      ...room,
      gameState: nextGameState,
      lastActivityAt: now,
      seq: room.seq + 1,
    },
  };
}

export function tickRoomTimers(
  room: InternalRoomState,
  plugin: RoomGamePlugin | undefined,
  now: number,
): { room: InternalRoomState; changed: boolean; hostChanged: boolean; expired: boolean } {
  if (room.status === "closed") {
    return { room, changed: false, hostChanged: false, expired: false };
  }

  // 1. Check 6-hour idle expiry
  if (now - room.lastActivityAt >= ROOM_IDLE_EXPIRY_MS) {
    return {
      changed: true,
      hostChanged: false,
      expired: true,
      room: {
        ...room,
        status: "closed",
        closedReason: "expired",
        seq: room.seq + 1,
      },
    };
  }

  let changed = false;
  let hostChanged = false;

  // 2. Drop seats disconnected for > 5 minutes
  let players = room.players.filter((p) => {
    if (!p.connected && p.disconnectedAt !== null && now - p.disconnectedAt > RECONNECT_GRACE_MS) {
      changed = true;
      return false;
    }
    return true;
  });

  // 3. Host away handover after 60 seconds disconnected
  let hostId = room.hostId;
  const currentHost = players.find((p) => p.id === hostId) ?? null;
  if (
    !currentHost ||
    (!currentHost.connected &&
      currentHost.disconnectedAt !== null &&
      now - currentHost.disconnectedAt >= HOST_AWAY_HANDOVER_MS)
  ) {
    const candidate = pickLongestConnectedHost(players);
    if (candidate && candidate.id !== hostId) {
      hostId = candidate.id;
      players = players.map((p) => ({ ...p, isHost: p.id === hostId }));
      changed = true;
      hostChanged = true;
    }
  }

  // 4. Advance plugin timer ticks if game active
  let gameState = room.gameState;
  if (room.status === "in_game" && gameState && plugin?.onTick) {
    const nextGs = plugin.onTick(gameState, now);
    if (nextGs !== gameState) {
      gameState = nextGs;
      changed = true;
    }
  }

  if (!changed) {
    return { room, changed: false, hostChanged: false, expired: false };
  }

  return {
    changed: true,
    hostChanged,
    expired: false,
    room: {
      ...room,
      hostId,
      players,
      gameState,
      seq: room.seq + 1,
    },
  };
}

/**
 * Estimates client-to-server clock offset (serverTime - clientNow) from 3 ping samples.
 * Selects the sample with the lowest round-trip time for highest accuracy.
 */
export function computeClockOffsetMs(
  samples: readonly { clientSentAt: number; clientReceivedAt: number; serverTime: number }[],
): number {
  if (samples.length === 0) return 0;
  let best = samples[0]!;
  let bestRtt = Math.max(0, best.clientReceivedAt - best.clientSentAt);
  for (let i = 1; i < samples.length; i++) {
    const s = samples[i]!;
    const rtt = Math.max(0, s.clientReceivedAt - s.clientSentAt);
    if (rtt < bestRtt) {
      best = s;
      bestRtt = rtt;
    }
  }
  const midpoint = best.clientSentAt + bestRtt / 2;
  return Math.round(best.serverTime - midpoint);
}
