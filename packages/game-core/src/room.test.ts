import { describe, expect, it } from "vitest";
import {
  HOST_AWAY_HANDOVER_MS,
  MAX_MESSAGE_BYTES,
  MAX_ROOM_PLAYERS,
  RATE_LIMIT_BID_ACTION,
  RATE_LIMIT_GENERAL,
  READY_CHECK_PLUGIN,
  RECONNECT_GRACE_MS,
  ROOM_CODE_ALPHABET,
  ROOM_IDLE_EXPIRY_MS,
  applyRoomGameAction,
  checkRateLimit,
  cleanPlayerName,
  closeRoomByHost,
  computeClockOffsetMs,
  createInternalRoom,
  disconnectRoomPlayer,
  generateRoomCode,
  getRoomGamePlugin,
  joinRoomPlayer,
  leaveRoomPlayer,
  normalizeRoomCode,
  removeRoomPlayerByHost,
  startRoomGame,
  tickRoomTimers,
  toPublicSnapshot,
  type RateBucket,
} from "./index";
import { parseClientRoomMessage } from "./room-schemas";

describe("room protocol & name/code helpers", () => {
  it("generates unique 4-letter codes from ABCDEFGHJKLMNPQRSTUVWXYZ (no I or O)", () => {
    const active = new Set<string>();
    for (let i = 0; i < 60; i++) {
      const code = generateRoomCode(active);
      expect(code).toHaveLength(4);
      expect(code).not.toMatch(/[IO0-9]/);
      for (const ch of code) {
        expect(ROOM_CODE_ALPHABET.includes(ch)).toBe(true);
      }
      expect(active.has(code)).toBe(false);
      active.add(code);
    }
    // Exhaustion guard throws cleanly if RNG repeats one active code
    expect(() => generateRoomCode(new Set(["AAAA"]), () => 0)).toThrow(/Exhausted/);
    expect(normalizeRoomCode(" kx-q m 7 ")).toBe("KXQM");
  });

  it("cleans player names and assigns Guest defaults when blank", () => {
    expect(cleanPlayerName("  Nani   Babu  ")).toBe("Nani Babu");
    expect(cleanPlayerName("Bad\u0000\u0007Name\nHere")).toBe("BadNameHere");
    expect(cleanPlayerName("VeryLongPlayerNameExceeding16Chars")).toHaveLength(16);
    expect(cleanPlayerName("   ", 0)).toBe("Guest Tiger");
    expect(cleanPlayerName(undefined, 1)).toBe("Guest Eagle");
  });

  it("validates raw client messages and rejects oversized (>2KB) or invalid payloads", () => {
    const ok = parseClientRoomMessage(JSON.stringify({ type: "join", deviceId: "dev_1234", name: "Raju" }));
    expect(ok.ok).toBe(true);

    const tooBig = JSON.stringify({ type: "join", deviceId: "dev_1234", name: "a".repeat(MAX_MESSAGE_BYTES) });
    expect(parseClientRoomMessage(tooBig)).toEqual({
      ok: false,
      reason: "Message exceeds 2 KB limit",
    });

    expect(parseClientRoomMessage("{not json")).toEqual({ ok: false, reason: "Malformed JSON" });
    expect(parseClientRoomMessage(JSON.stringify({ type: "unknown_type" })).ok).toBe(false);
  });

  it("enforces rate limiting per window for general and bid/action messages", () => {
    const buckets = new Map<string, RateBucket>();
    for (let i = 0; i < RATE_LIMIT_GENERAL.maxCount; i++) {
      expect(checkRateLimit(buckets, "conn1", 1000, RATE_LIMIT_GENERAL)).toBe(true);
    }
    expect(checkRateLimit(buckets, "conn1", 1500, RATE_LIMIT_GENERAL)).toBe(false);
    expect(checkRateLimit(buckets, "conn1", 2001, RATE_LIMIT_GENERAL)).toBe(true);

    const actionBuckets = new Map<string, RateBucket>();
    for (let i = 0; i < RATE_LIMIT_BID_ACTION.maxCount; i++) {
      expect(checkRateLimit(actionBuckets, "conn1", 1000, RATE_LIMIT_BID_ACTION)).toBe(true);
    }
    expect(checkRateLimit(actionBuckets, "conn1", 1100, RATE_LIMIT_BID_ACTION)).toBe(false);
  });

  it("computes clock offset using lowest-RTT ping sample", () => {
    expect(computeClockOffsetMs([])).toBe(0);
    const offset = computeClockOffsetMs([
      { clientSentAt: 1000, clientReceivedAt: 1200, serverTime: 1600 }, // rtt 200 -> +500
      { clientSentAt: 2000, clientReceivedAt: 2020, serverTime: 2510 }, // rtt 20  -> +500 (lowest RTT)
      { clientSentAt: 3000, clientReceivedAt: 3400, serverTime: 3700 }, // rtt 400 -> +500
    ]);
    expect(offset).toBe(500);
  });
});

describe("room lifecycle rules", () => {
  it("handles join, max 10 players, reconnect within 5 minutes, and expiry after 5 minutes", () => {
    let room = createInternalRoom("ABCD", "ready-check", 1000);
    for (let i = 0; i < MAX_ROOM_PLAYERS; i++) {
      const res = joinRoomPlayer(room, { deviceId: `dev-${i}`, name: `Player ${i}`, now: 1000 + i * 10 });
      expect(res.ok).toBe(true);
      if (res.ok) room = res.room;
    }
    expect(room.players).toHaveLength(10);
    expect(room.players[0]!.isHost).toBe(true);

    // 11th player rejected
    const full = joinRoomPlayer(room, { deviceId: "dev-extra", name: "Extra", now: 2000 });
    expect(full).toEqual({ ok: false, code: "ROOM_FULL", message: "This room already has 10 players" });

    // Disconnect player 1 and reconnect within 5 min -> keeps same seat & name
    room = disconnectRoomPlayer(room, "dev-1", 3000);
    expect(room.players[1]!.connected).toBe(false);
    const reconn = joinRoomPlayer(room, { deviceId: "dev-1", name: "Updated", now: 3000 + RECONNECT_GRACE_MS - 1000 });
    expect(reconn.ok).toBe(true);
    if (reconn.ok) {
      expect(reconn.reconnected).toBe(true);
      expect(reconn.player?.seat).toBe(1);
      expect(reconn.player?.name).toBe("Updated");
      room = reconn.room;
    }

    // Disconnect player 2 for > 5 minutes -> tick drops their seat
    room = disconnectRoomPlayer(room, "dev-2", 10_000);
    const ticked = tickRoomTimers(room, READY_CHECK_PLUGIN, 10_000 + RECONNECT_GRACE_MS + 1);
    expect(ticked.changed).toBe(true);
    expect(ticked.room.players.some((p) => p.deviceId === "dev-2")).toBe(false);
    expect(toPublicSnapshot(ticked.room).players).toHaveLength(9);
  });

  it("transfers host on explicit leave or after 60s away to longest-connected player", () => {
    let room = createInternalRoom("WXYZ", "ready-check", 1000);
    const j1 = joinRoomPlayer(room, { deviceId: "host-dev", name: "Host", now: 1000 });
    if (j1.ok) room = j1.room;
    const j2 = joinRoomPlayer(room, { deviceId: "p2-dev", name: "Second", now: 2000 });
    if (j2.ok) room = j2.room;
    const j3 = joinRoomPlayer(room, { deviceId: "p3-dev", name: "Third", now: 3000 });
    if (j3.ok) room = j3.room;

    // Host disconnects at 5000 -> after 59s no handover, after 60s Second becomes host
    room = disconnectRoomPlayer(room, "host-dev", 5000);
    const before60 = tickRoomTimers(room, undefined, 5000 + HOST_AWAY_HANDOVER_MS - 1);
    expect(before60.hostChanged).toBe(false);
    const at60 = tickRoomTimers(room, undefined, 5000 + HOST_AWAY_HANDOVER_MS);
    expect(at60.hostChanged).toBe(true);
    expect(at60.room.hostId).toBe(j2.ok ? j2.player?.id : "");
    room = at60.room;

    // Second leaves explicitly -> Third becomes host
    const left = leaveRoomPlayer(room, "p2-dev", 70_000);
    expect(left.hostChanged).toBe(true);
    expect(left.room.hostId).toBe(j3.ok ? j3.player?.id : "");
  });

  it("supports host removing player, blocking rejoin, closing room, and 6h expiry", () => {
    let room = createInternalRoom("QRST", "ready-check", 1000);
    const j1 = joinRoomPlayer(room, { deviceId: "d1", name: "Host", now: 1000 });
    if (j1.ok) room = j1.room;
    const j2 = joinRoomPlayer(room, { deviceId: "d2", name: "Target", now: 1100 });
    if (!j2.ok) throw new Error("expected join");
    room = j2.room;

    // Non-host cannot remove
    expect(removeRoomPlayerByHost(room, "d2", j1.ok ? j1.player!.id : "", 1200)).toEqual({
      ok: false,
      code: "UNAUTHORIZED",
      message: "Only the host can remove players",
    });

    // Host cannot remove self
    expect(removeRoomPlayerByHost(room, "d1", j1.ok ? j1.player!.id : "", 1200).ok).toBe(false);

    // Host removes Target
    const rem = removeRoomPlayerByHost(room, "d1", j2.player!.id, 1300);
    expect(rem.ok).toBe(true);
    if (rem.ok) {
      room = rem.room;
      expect(rem.removedDeviceId).toBe("d2");
    }
    expect(joinRoomPlayer(room, { deviceId: "d2", name: "Target", now: 1400 })).toEqual({
      ok: false,
      code: "REMOVED",
      message: "You were removed by the host",
    });

    // Non-host cannot close
    expect(closeRoomByHost(room, "d2", 1500).ok).toBe(false);

    // 6-hour idle expiry closes room
    const expired = tickRoomTimers(room, undefined, 1400 + ROOM_IDLE_EXPIRY_MS);
    expect(expired.expired).toBe(true);
    expect(expired.room.status).toBe("closed");
    expect(joinRoomPlayer(expired.room, { deviceId: "d3", name: "Late", now: 99999999 }).ok).toBe(false);
  });

  it("runs the Ready check plugin via server timestamps and blocks late new joins", () => {
    const plugin = getRoomGamePlugin("ready-check")!;
    let room = createInternalRoom("MNKP", "ready-check", 1000);
    const j1 = joinRoomPlayer(room, { deviceId: "d1", name: "Host", now: 1000 });
    if (j1.ok) room = j1.room;

    // Need at least 2 players to start
    expect(startRoomGame(room, "d1", plugin, undefined, 1100)).toEqual({
      ok: false,
      code: "NOT_ENOUGH_PLAYERS",
      message: "Need at least 2 connected players to start",
    });

    const j2 = joinRoomPlayer(room, { deviceId: "d2", name: "Friend", now: 1200 });
    if (j2.ok) room = j2.room;

    // Non-host cannot start
    expect(startRoomGame(room, "d2", plugin, undefined, 1300).ok).toBe(false);

    const started = startRoomGame(room, "d1", plugin, { countdownMs: 3000 }, 1400);
    expect(started.ok).toBe(true);
    if (started.ok) room = started.room;
    expect(room.status).toBe("in_game");
    expect(room.gameState?.phase).toBe("waiting");

    // Newcomer blocked once in_game
    expect(joinRoomPlayer(room, { deviceId: "d3", name: "Stranger", now: 1500 })).toEqual({
      ok: false,
      code: "GAME_STARTED",
      message: "This game has already started",
    });

    // Both tap ready -> triggers 3-2-1 countdown driven by serverTime
    const a1 = applyRoomGameAction(room, "d1", plugin, "ready", undefined, 1600);
    if (a1.ok) room = a1.room;
    expect(room.gameState?.phase).toBe("waiting");

    const a2 = applyRoomGameAction(room, "d2", plugin, "ready", undefined, 1700);
    if (a2.ok) room = a2.room;
    expect(room.gameState?.phase).toBe("countdown");
    expect(room.gameState?.countdownEndAt).toBe(4700);

    const mid = tickRoomTimers(room, plugin, 3000);
    expect(mid.room.gameState?.phase).toBe("countdown");

    const done = tickRoomTimers(room, plugin, 4700);
    expect(done.changed).toBe(true);
    expect(done.room.gameState?.phase).toBe("done");
    expect(plugin.getResult?.(done.room.gameState!, done.room.players).winners).toEqual(["Host", "Friend"]);
  });

  it("handles host closeRoomByHost cleanly", () => {
    let room = createInternalRoom("ZZXX", "ready-check", 100);
    const j1 = joinRoomPlayer(room, { deviceId: "d1", name: "Host", now: 100 });
    if (j1.ok) room = j1.room;
    const closed = closeRoomByHost(room, "d1", 200);
    expect(closed.ok).toBe(true);
    if (closed.ok) {
      expect(closed.room.status).toBe("closed");
      expect(closed.room.closedReason).toBe("host_closed");
      expect(tickRoomTimers(closed.room, READY_CHECK_PLUGIN, 300).changed).toBe(false);
    }
  });

  it("covers edge branches: missing actors, duplicate disconnects/actions, expired grace seat, and clamped countdown", () => {
    const plugin = READY_CHECK_PLUGIN;
    let room = createInternalRoom("ABCD", "ready-check", 1000);

    // No-op disconnect & leave for unknown device
    expect(disconnectRoomPlayer(room, "ghost", 1000)).toBe(room);
    expect(leaveRoomPlayer(room, "ghost", 1000).leftPlayer).toBeNull();

    // Action before game starts fails
    expect(applyRoomGameAction(room, "d1", plugin, "ready", undefined, 1000).ok).toBe(false);

    const j1 = joinRoomPlayer(room, { deviceId: "d1", name: "H1", now: 1000 });
    const j2 = joinRoomPlayer(j1.ok ? j1.room : room, { deviceId: "d2", name: "P2", now: 1000 });
    room = j2.ok ? j2.room : room;

    // Repeated disconnect is idempotent
    room = disconnectRoomPlayer(room, "d2", 2000);
    expect(disconnectRoomPlayer(room, "d2", 2100)).toBe(room);

    // Expired reconnect grace while lobby open lets player rejoin as fresh seat
    const rejoinedLate = joinRoomPlayer(room, {
      deviceId: "d2",
      name: "P2-Fresh",
      now: 2000 + RECONNECT_GRACE_MS + 10,
    });
    expect(rejoinedLate.ok).toBe(true);
    if (rejoinedLate.ok) room = rejoinedLate.room;

    // Clamped settings (countdownMs < 500 uses 3000)
    const started = startRoomGame(room, "d1", plugin, { countdownMs: 100 }, 3000);
    expect(started.ok).toBe(true);
    if (started.ok) room = started.room;
    expect(room.gameState?.data.countdownMs).toBe(3000);

    // Unknown device action fails
    expect(applyRoomGameAction(room, "stranger", plugin, "ready", undefined, 3100).ok).toBe(false);

    // Unsupported action and duplicate ready action are safe no-ops
    const noop = applyRoomGameAction(room, "d1", plugin, "bid", undefined, 3100);
    expect(noop.ok).toBe(true);
    const r1 = applyRoomGameAction(room, "d1", plugin, "ready", undefined, 3200);
    if (r1.ok) room = r1.room;
    const dup = applyRoomGameAction(room, "d1", plugin, "ready", undefined, 3250);
    if (dup.ok) room = dup.room;
    expect(room.gameState?.readyIds).toHaveLength(1);

    // Zero-change tick & clock offset edge
    expect(tickRoomTimers(room, plugin, 3260).changed).toBe(false);
    expect(
      computeClockOffsetMs([
        { clientSentAt: 500, clientReceivedAt: 400, serverTime: 1000 },
        { clientSentAt: 500, clientReceivedAt: 600, serverTime: 1050 },
      ]),
    ).toBe(500);
  });
});
