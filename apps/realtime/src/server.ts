import type * as Party from "partykit/server";
import {
  HOST_AWAY_HANDOVER_MS,
  RATE_LIMIT_BID_ACTION,
  RATE_LIMIT_GENERAL,
  RECONNECT_GRACE_MS,
  ROOM_IDLE_EXPIRY_MS,
  applyRoomGameAction,
  checkRateLimit,
  closeRoomByHost,
  createInternalRoom,
  disconnectRoomPlayer,
  getRoomGamePlugin,
  isValidRoomCode,
  joinRoomPlayer,
  leaveRoomPlayer,
  normalizeRoomCode,
  removeRoomPlayerByHost,
  startRoomGame,
  tickRoomTimers,
  toPublicSnapshot,
  type InternalRoomState,
  type RateBucket,
  type RoomErrorCode,
  type RoomEvent,
  type ServerRoomMessage,
} from "@tfi/game-core";
import { parseClientRoomMessage } from "@tfi/game-core/room-schemas";

function sendMsg(conn: Party.Connection, msg: ServerRoomMessage): void {
  try {
    conn.send(JSON.stringify(msg));
  } catch {
    /* ignore closing socket */
  }
}

function sendError(conn: Party.Connection, code: RoomErrorCode, message: string): void {
  sendMsg(conn, {
    type: "error",
    serverTime: Date.now(),
    code,
    message,
  });
}

function getCorsHeaders(req: Party.Request, env: Record<string, unknown>): Record<string, string> {
  const allowedRaw = typeof env.ALLOWED_ORIGINS === "string" ? env.ALLOWED_ORIGINS.trim() : "";
  const origin = req.headers.get("origin") ?? "*";
  let allowOrigin = "*";
  if (allowedRaw && allowedRaw !== "*") {
    const allowedList = allowedRaw.split(",").map((s) => s.trim()).filter(Boolean);
    allowOrigin = allowedList.includes(origin) ? origin : allowedList[0] ?? "";
  }
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

export default class RoomServer implements Party.Server {
  private roomState: InternalRoomState | null = null;
  private loaded = false;
  private readonly connDeviceIds = new Map<string, string>();
  private readonly generalRate = new Map<string, RateBucket>();
  private readonly actionRate = new Map<string, RateBucket>();
  public droppedInvalidCount = 0;

  constructor(readonly room: Party.Room) {}

  private async ensureLoaded(): Promise<InternalRoomState | null> {
    if (!this.loaded) {
      const stored = await this.room.storage.get<InternalRoomState>("state");
      this.roomState = stored ?? null;
      this.loaded = true;
    }
    return this.roomState;
  }

  private async persistAndSchedule(): Promise<void> {
    if (!this.roomState) return;
    await this.room.storage.put("state", this.roomState);

    const now = Date.now();
    const deadlines: number[] = [];

    if (this.roomState.status !== "closed") {
      deadlines.push(this.roomState.lastActivityAt + ROOM_IDLE_EXPIRY_MS);
    }
    for (const p of this.roomState.players) {
      if (!p.connected && p.disconnectedAt !== null) {
        deadlines.push(p.disconnectedAt + RECONNECT_GRACE_MS);
        if (p.id === this.roomState.hostId) {
          deadlines.push(p.disconnectedAt + HOST_AWAY_HANDOVER_MS);
        }
      }
    }
    if (this.roomState.status === "in_game" && this.roomState.gameState?.countdownEndAt) {
      deadlines.push(this.roomState.gameState.countdownEndAt);
    }

    const futureDeadlines = deadlines.filter((d) => d > now);
    if (futureDeadlines.length > 0) {
      await this.room.storage.setAlarm(Math.min(...futureDeadlines));
    }
  }

  private broadcastDelta(event?: RoomEvent): void {
    if (!this.roomState) return;
    const payload = JSON.stringify({
      type: "delta",
      seq: this.roomState.seq,
      serverTime: Date.now(),
      room: toPublicSnapshot(this.roomState),
      event,
    } satisfies ServerRoomMessage);
    for (const conn of this.room.getConnections()) {
      try {
        conn.send(payload);
      } catch {
        /* ignore closing socket */
      }
    }
  }

  private async notifyRegistryClosed(): Promise<void> {
    const registryStub = this.room.context.parties["registry"]?.get("global");
    if (!registryStub || !this.roomState) return;
    try {
      await registryStub.fetch(
        new Request("http://internal/parties/registry/global", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "unregister", code: this.roomState.code }),
        }),
      );
    } catch {
      /* ignore */
    }
  }

  async onRequest(req: Party.Request): Promise<Response> {
    const headers = getCorsHeaders(req, this.room.env);
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    await this.ensureLoaded();
    const code = normalizeRoomCode(this.room.id);

    if (req.method === "POST") {
      let body: { action?: string; gameId?: string } = {};
      try {
        body = (await req.json()) as typeof body;
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers });
      }
      if (!isValidRoomCode(code)) {
        return new Response(JSON.stringify({ error: "Invalid room code" }), { status: 400, headers });
      }
      if (this.roomState && this.roomState.status !== "closed") {
        return new Response(JSON.stringify({ error: "Room already active" }), { status: 409, headers });
      }
      const gameId =
        typeof body.gameId === "string" && body.gameId.trim().length > 0
          ? body.gameId.trim().slice(0, 40)
          : "ready-check";
      this.roomState = createInternalRoom(code, gameId, Date.now());
      await this.persistAndSchedule();
      return new Response(JSON.stringify({ ok: true, code, gameId }), { status: 201, headers });
    }

    if (req.method === "GET") {
      if (!this.roomState) {
        return new Response(
          JSON.stringify({ exists: false, room: null, droppedInvalidCount: this.droppedInvalidCount }),
          { status: 404, headers },
        );
      }
      return new Response(
        JSON.stringify({
          exists: true,
          room: toPublicSnapshot(this.roomState),
          droppedInvalidCount: this.droppedInvalidCount,
        }),
        { status: 200, headers },
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  async onConnect(conn: Party.Connection): Promise<void> {
    const state = await this.ensureLoaded();
    if (!state) {
      sendError(conn, "ROOM_NOT_FOUND", "No active room found for this code");
      return;
    }
    if (state.status === "closed") {
      sendError(conn, "ROOM_CLOSED", "This room has been closed");
    }
  }

  async onMessage(raw: string | ArrayBuffer | ArrayBufferView, sender: Party.Connection): Promise<void> {
    const text = typeof raw === "string" ? raw : new TextDecoder().decode(raw);
    const now = Date.now();

    if (!checkRateLimit(this.generalRate, sender.id, now, RATE_LIMIT_GENERAL)) {
      sendError(sender, "RATE_LIMITED", "Rate limit exceeded (20/sec)");
      return;
    }

    const parsed = parseClientRoomMessage(text);
    if (!parsed.ok) {
      this.droppedInvalidCount += 1;
      sendError(sender, "INVALID_MESSAGE", parsed.reason);
      return;
    }

    const msg = parsed.data;
    if (msg.type === "ping") {
      sendMsg(sender, { type: "pong", clientTime: msg.clientTime, serverTime: now });
      return;
    }

    const state = await this.ensureLoaded();
    if (!state) {
      sendError(sender, "ROOM_NOT_FOUND", "No room found for this code");
      return;
    }

    if (msg.type === "sync") {
      sendMsg(sender, {
        type: "snapshot",
        seq: state.seq,
        serverTime: now,
        room: toPublicSnapshot(state),
      });
      return;
    }

    if (msg.type === "join") {
      const res = joinRoomPlayer(state, { deviceId: msg.deviceId, name: msg.name, now });
      if (!res.ok) {
        sendError(sender, res.code, res.message);
        return;
      }
      this.roomState = res.room;
      this.connDeviceIds.set(sender.id, msg.deviceId);
      await this.persistAndSchedule();

      sendMsg(sender, {
        type: "snapshot",
        seq: this.roomState.seq,
        serverTime: now,
        room: toPublicSnapshot(this.roomState),
      });
      this.broadcastDelta({
        kind: res.reconnected ? "reconnected" : "joined",
        actorName: res.player?.name,
      });
      return;
    }

    const deviceId = this.connDeviceIds.get(sender.id);
    if (!deviceId) {
      sendError(sender, "UNAUTHORIZED", "Send join before room actions");
      return;
    }

    if (msg.type === "start_game" || msg.type === "game_action") {
      if (!checkRateLimit(this.actionRate, sender.id, now, RATE_LIMIT_BID_ACTION)) {
        sendError(sender, "RATE_LIMITED", "Action rate limit exceeded (5/sec)");
        return;
      }
    }

    if (msg.type === "start_game") {
      const plugin = getRoomGamePlugin(msg.gameId);
      if (!plugin) {
        sendError(sender, "INVALID_MESSAGE", `Unsupported game plugin: ${msg.gameId}`);
        return;
      }
      const res = startRoomGame(state, deviceId, plugin, msg.settings, now);
      if (!res.ok) {
        sendError(sender, res.code, res.message);
        return;
      }
      this.roomState = res.room;
      await this.persistAndSchedule();
      this.broadcastDelta({ kind: "game_started" });
      return;
    }

    if (msg.type === "game_action") {
      const plugin = getRoomGamePlugin(state.gameId);
      if (!plugin) {
        sendError(sender, "INVALID_MESSAGE", "No active game plugin");
        return;
      }
      const res = applyRoomGameAction(state, deviceId, plugin, msg.action, msg.payload, now);
      if (!res.ok) {
        sendError(sender, res.code, res.message);
        return;
      }
      this.roomState = res.room;
      await this.persistAndSchedule();
      this.broadcastDelta({ kind: "game_updated" });
      return;
    }

    if (msg.type === "remove_player") {
      const res = removeRoomPlayerByHost(state, deviceId, msg.targetId, now);
      if (!res.ok) {
        sendError(sender, res.code, res.message);
        return;
      }
      this.roomState = res.room;
      await this.persistAndSchedule();

      // Notify and close target connection(s)
      for (const conn of this.room.getConnections()) {
        if (this.connDeviceIds.get(conn.id) === res.removedDeviceId) {
          sendError(conn, "REMOVED", "You were removed by the host");
          conn.close(4001, "Removed by host");
        }
      }
      this.broadcastDelta({ kind: "removed", actorName: res.player?.name });
      return;
    }

    if (msg.type === "close_room") {
      const res = closeRoomByHost(state, deviceId, now);
      if (!res.ok) {
        sendError(sender, res.code, res.message);
        return;
      }
      this.roomState = res.room;
      await this.persistAndSchedule();
      await this.notifyRegistryClosed();
      this.broadcastDelta({ kind: "room_closed" });
      return;
    }

    if (msg.type === "leave") {
      const { room: nextRoom, leftPlayer, hostChanged } = leaveRoomPlayer(state, deviceId, now);
      this.roomState = nextRoom;
      this.connDeviceIds.delete(sender.id);
      await this.persistAndSchedule();
      if (leftPlayer) {
        this.broadcastDelta({
          kind: hostChanged ? "host_changed" : "left",
          actorName: leftPlayer.name,
        });
      }
      sender.close(1000, "Left room");
    }
  }

  async onClose(conn: Party.Connection): Promise<void> {
    const deviceId = this.connDeviceIds.get(conn.id);
    this.connDeviceIds.delete(conn.id);
    if (!deviceId) return;

    const state = await this.ensureLoaded();
    if (!state || state.status === "closed") return;

    // Only mark disconnected if no other live socket shares the same deviceId
    for (const activeConn of this.room.getConnections()) {
      if (activeConn.id !== conn.id && this.connDeviceIds.get(activeConn.id) === deviceId) {
        return;
      }
    }

    const disconnected = disconnectRoomPlayer(state, deviceId, Date.now());
    if (disconnected !== state) {
      const target = state.players.find((p) => p.deviceId === deviceId);
      this.roomState = disconnected;
      await this.persistAndSchedule();
      this.broadcastDelta({ kind: "disconnected", actorName: target?.name });
    }
  }

  async onAlarm(): Promise<void> {
    const state = await this.ensureLoaded();
    if (!state || state.status === "closed") return;
    const plugin = getRoomGamePlugin(state.gameId);
    const ticked = tickRoomTimers(state, plugin, Date.now());
    if (ticked.changed) {
      this.roomState = ticked.room;
      await this.persistAndSchedule();
      if (ticked.expired) {
        await this.notifyRegistryClosed();
        this.broadcastDelta({ kind: "room_closed" });
      } else if (ticked.hostChanged) {
        this.broadcastDelta({ kind: "host_changed" });
      } else {
        this.broadcastDelta({ kind: "game_updated" });
      }
    } else {
      await this.persistAndSchedule();
    }
  }
}
