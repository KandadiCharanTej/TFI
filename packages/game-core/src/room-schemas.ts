import { z } from "zod";
import { MAX_MESSAGE_BYTES, MAX_ROOM_PLAYERS, type ClientRoomMessage } from "./room-protocol";

export const RoomPlayerSchema = z.object({
  id: z.string().min(1).max(40),
  deviceId: z.string().min(4).max(80),
  name: z.string().min(1).max(16),
  color: z.string().min(4).max(16),
  seat: z.number().int().min(0).max(MAX_ROOM_PLAYERS - 1),
  isHost: z.boolean(),
  connected: z.boolean(),
  joinedAt: z.number(),
  connectedAt: z.number(),
  disconnectedAt: z.number().nullable(),
});

export const RoomGameStateSchema = z.object({
  gameId: z.string().min(1).max(40),
  phase: z.enum(["waiting", "countdown", "active", "done"]),
  readyIds: z.array(z.string()),
  startedAt: z.number(),
  countdownEndAt: z.number().nullable(),
  data: z.record(z.unknown()),
});

export const RoomStatusSchema = z.enum(["lobby", "in_game", "closed"]);

export const RoomSnapshotSchema = z.object({
  code: z.string().length(4),
  gameId: z.string().min(1).max(40),
  status: RoomStatusSchema,
  hostId: z.string().nullable(),
  players: z.array(RoomPlayerSchema),
  createdAt: z.number(),
  lastActivityAt: z.number(),
  closedReason: z.enum(["host_closed", "expired", "none"]).default("none"),
  gameState: RoomGameStateSchema.nullable(),
});

export const RoomErrorCodeSchema = z.enum([
  "ROOM_NOT_FOUND",
  "ROOM_FULL",
  "GAME_STARTED",
  "INVALID_MESSAGE",
  "RATE_LIMITED",
  "UNAUTHORIZED",
  "REMOVED",
  "ROOM_CLOSED",
  "NOT_ENOUGH_PLAYERS",
]);

export const RoomEventSchema = z.object({
  kind: z.enum([
    "joined",
    "reconnected",
    "disconnected",
    "left",
    "removed",
    "host_changed",
    "game_started",
    "game_updated",
    "room_closed",
  ]),
  actorName: z.string().optional(),
});

export const ClientRoomMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("join"),
    deviceId: z.string().min(4).max(80),
    name: z.string().max(48).optional(),
  }),
  z.object({
    type: z.literal("ping"),
    clientTime: z.number().finite(),
  }),
  z.object({
    type: z.literal("sync"),
  }),
  z.object({
    type: z.literal("start_game"),
    gameId: z.string().min(1).max(40),
    settings: z.record(z.unknown()).optional(),
  }),
  z.object({
    type: z.literal("remove_player"),
    targetId: z.string().min(1).max(40),
  }),
  z.object({
    type: z.literal("close_room"),
  }),
  z.object({
    type: z.literal("leave"),
  }),
  z.object({
    type: z.literal("game_action"),
    action: z.string().min(1).max(40),
    payload: z.record(z.unknown()).optional(),
  }),
]);

export const ServerRoomMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("snapshot"),
    seq: z.number().int().min(0),
    serverTime: z.number(),
    room: RoomSnapshotSchema,
  }),
  z.object({
    type: z.literal("delta"),
    seq: z.number().int().min(1),
    serverTime: z.number(),
    room: RoomSnapshotSchema,
    event: RoomEventSchema.optional(),
  }),
  z.object({
    type: z.literal("pong"),
    clientTime: z.number(),
    serverTime: z.number(),
  }),
  z.object({
    type: z.literal("error"),
    serverTime: z.number(),
    code: RoomErrorCodeSchema,
    message: z.string(),
  }),
]);

/** Parses and validates a raw incoming message string within the 2 KB ceiling. */
export function parseClientRoomMessage(
  raw: string,
): { ok: true; data: ClientRoomMessage } | { ok: false; reason: string } {
  const byteLength = new TextEncoder().encode(raw).length;
  if (byteLength > MAX_MESSAGE_BYTES) {
    return { ok: false, reason: "Message exceeds 2 KB limit" };
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "Malformed JSON" };
  }
  const result = ClientRoomMessageSchema.safeParse(parsedJson);
  if (!result.success) {
    return { ok: false, reason: result.error.issues[0]?.message ?? "Invalid message schema" };
  }
  return { ok: true, data: result.data };
}
