/** 24 unambiguous uppercase letters (excludes I and O). */
export const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const ROOM_CODE_LENGTH = 4;

export const MAX_MESSAGE_BYTES = 2048;
export const MIN_ROOM_PLAYERS = 2;
export const MAX_ROOM_PLAYERS = 10;
export const HOST_AWAY_HANDOVER_MS = 60_000;
export const RECONNECT_GRACE_MS = 5 * 60_000;
export const ROOM_IDLE_EXPIRY_MS = 6 * 60 * 60_000;

export const ROOM_AVATAR_COLORS = ["#F6BE18", "#EC1276", "#00C853", "#00E5FF"] as const;

export const RATE_LIMIT_GENERAL = { maxCount: 20, windowMs: 1000 } as const;
export const RATE_LIMIT_BID_ACTION = { maxCount: 5, windowMs: 1000 } as const;
export const RATE_LIMIT_WRONG_CODE = { maxCount: 5, windowMs: 30_000 } as const;

export interface RoomPlayer {
  id: string;
  deviceId: string;
  name: string;
  color: string;
  seat: number;
  isHost: boolean;
  connected: boolean;
  joinedAt: number;
  connectedAt: number;
  disconnectedAt: number | null;
}

export interface RoomGameState {
  gameId: string;
  phase: "waiting" | "countdown" | "active" | "done";
  readyIds: string[];
  startedAt: number;
  countdownEndAt: number | null;
  data: Record<string, unknown>;
}

export type RoomStatus = "lobby" | "in_game" | "closed";

export interface RoomSnapshot {
  code: string;
  gameId: string;
  status: RoomStatus;
  hostId: string | null;
  players: RoomPlayer[];
  createdAt: number;
  lastActivityAt: number;
  closedReason: "host_closed" | "expired" | "none";
  gameState: RoomGameState | null;
}

export type RoomErrorCode =
  | "ROOM_NOT_FOUND"
  | "ROOM_FULL"
  | "GAME_STARTED"
  | "INVALID_MESSAGE"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "REMOVED"
  | "ROOM_CLOSED"
  | "NOT_ENOUGH_PLAYERS";

export interface RoomEvent {
  kind:
    | "joined"
    | "reconnected"
    | "disconnected"
    | "left"
    | "removed"
    | "host_changed"
    | "game_started"
    | "game_updated"
    | "room_closed";
  actorName?: string;
}

export type ClientRoomMessage =
  | { type: "join"; deviceId: string; name?: string }
  | { type: "ping"; clientTime: number }
  | { type: "sync" }
  | { type: "start_game"; gameId: string; settings?: Record<string, unknown> }
  | { type: "remove_player"; targetId: string }
  | { type: "close_room" }
  | { type: "leave" }
  | { type: "game_action"; action: string; payload?: Record<string, unknown> };

export type ServerRoomMessage =
  | { type: "snapshot"; seq: number; serverTime: number; room: RoomSnapshot }
  | { type: "delta"; seq: number; serverTime: number; room: RoomSnapshot; event?: RoomEvent }
  | { type: "pong"; clientTime: number; serverTime: number }
  | { type: "error"; serverTime: number; code: RoomErrorCode; message: string };
