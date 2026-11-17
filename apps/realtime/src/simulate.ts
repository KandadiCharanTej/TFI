import { spawn } from "node:child_process";
import PartySocket from "partysocket";
import { type RoomSnapshot, type ServerRoomMessage } from "@tfi/game-core";
import { parseClientRoomMessage } from "@tfi/game-core/room-schemas";

const PORT = 1998;
const HOST = process.env.PARTYKIT_HOST ?? `127.0.0.1:${PORT}`;
const HTTP_BASE = `http://${HOST}`;

async function waitForPartyKit(timeoutMs = 15_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${HTTP_BASE}/parties/registry/global?code=ZZZZ`);
      if (res.status === 404 || res.status === 200) return;
    } catch {
      /* waiting */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("PartyKit dev server did not start in time");
}

interface SimClient {
  idx: number;
  deviceId: string;
  socket: PartySocket;
  latestRoom: RoomSnapshot | null;
  latestSeq: number;
  pongs: number;
  errors: string[];
}

function connectClient(code: string, idx: number, deviceId: string, name: string): Promise<SimClient> {
  return new Promise((resolve, reject) => {
    const client: SimClient = {
      idx,
      deviceId,
      latestRoom: null,
      latestSeq: -1,
      pongs: 0,
      errors: [],
      socket: new PartySocket({
        host: HOST,
        party: "main",
        room: code,
        maxRetries: 2,
      }),
    };

    const timer = setTimeout(() => reject(new Error(`Timeout joining client ${idx}`)), 10_000);

    client.socket.addEventListener("open", () => {
      client.socket.send(JSON.stringify({ type: "join", deviceId, name }));
      client.socket.send(JSON.stringify({ type: "ping", clientTime: Date.now() }));
    });

    client.socket.addEventListener("message", (ev) => {
      const msg = JSON.parse(String(ev.data)) as ServerRoomMessage;
      if (msg.type === "pong") {
        client.pongs += 1;
        return;
      }
      if (msg.type === "error") {
        client.errors.push(msg.code);
        return;
      }
      if (msg.type === "snapshot" || msg.type === "delta") {
        if (msg.seq >= client.latestSeq) {
          client.latestSeq = msg.seq;
          client.latestRoom = msg.room;
        } else if (msg.type === "delta" && msg.seq > client.latestSeq + 1) {
          client.socket.send(JSON.stringify({ type: "sync" }));
        }
        if (msg.type === "snapshot") {
          clearTimeout(timer);
          resolve(client);
        }
      }
    });
  });
}

async function main() {
  const startedAt = Date.now();
  const useExternal = Boolean(process.env.PARTYKIT_HOST);
  const proc = useExternal
    ? null
    : spawn("./node_modules/.bin/partykit", ["dev", "--port", String(PORT)], {
        cwd: process.cwd(),
        stdio: "ignore",
      });

  const sockets: PartySocket[] = [];
  try {
    if (!useExternal) {
      await waitForPartyKit();
    }

    // 1. Create room
    const createRes = await fetch(`${HTTP_BASE}/parties/registry/global`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: "ready-check" }),
    });
    if (!createRes.ok) throw new Error(`Create failed: ${createRes.status}`);
    const { code } = (await createRes.json()) as { code: string };

    // 2. Connect 10 fake players
    const clients: SimClient[] = [];
    for (let i = 0; i < 10; i++) {
      const c = await connectClient(code, i, `sim-device-${i}`, `Sim Player ${i}`);
      clients.push(c);
      sockets.push(c.socket);
    }

    // 3. Player 2 & 3 refresh (disconnect + reconnect same deviceId)
    const seat2Before = clients[2]!.latestRoom?.players.find((p) => p.deviceId === "sim-device-2")?.seat;
    clients[2]!.socket.close();
    await new Promise((r) => setTimeout(r, 200));
    clients[2] = await connectClient(code, 2, "sim-device-2", "Sim Player 2");
    sockets.push(clients[2]!.socket);
    const seat2After = clients[2]!.latestRoom?.players.find((p) => p.deviceId === "sim-device-2")?.seat;
    if (seat2Before !== seat2After) {
      throw new Error(`Seat changed across refresh: ${seat2Before} -> ${seat2After}`);
    }

    // 4. Player 9 leaves cleanly
    clients[9]!.socket.send(JSON.stringify({ type: "leave" }));
    await new Promise((r) => setTimeout(r, 200));

    // 5. Send one oversized (>2KB) invalid message to verify server drops & counts it
    const badRaw = JSON.stringify({ type: "join", deviceId: "x".repeat(3000) });
    if (parseClientRoomMessage(badRaw).ok) throw new Error("Expected local parser rejection");
    clients[0]!.socket.send(badRaw);
    await new Promise((r) => setTimeout(r, 150));

    // 6. Host starts Ready check and all 9 remaining players tap ready
    clients[0]!.socket.send(
      JSON.stringify({ type: "start_game", gameId: "ready-check", settings: { countdownMs: 600 } }),
    );
    await new Promise((r) => setTimeout(r, 250));
    for (let i = 0; i < 9; i++) {
      clients[i]!.socket.send(JSON.stringify({ type: "game_action", action: "ready" }));
    }
    await new Promise((r) => setTimeout(r, 900));

    // Check GET room endpoint and consensus across active clients
    const infoRes = await fetch(`${HTTP_BASE}/parties/main/${code}`);
    const info = (await infoRes.json()) as {
      exists: boolean;
      room: RoomSnapshot;
      droppedInvalidCount: number;
    };

    const elapsedMs = Date.now() - startedAt;
    const expectedPlayers = 9;
    const allMatch = clients
      .slice(0, 9)
      .every((c) => c.latestRoom?.players.length === expectedPlayers && c.latestRoom?.status === "in_game");

    if (!allMatch) {
      throw new Error(
        `Inconsistent final state across clients: ${clients
          .slice(0, 9)
          .map((c) => `${c.idx}:${c.latestRoom?.players.length}/${c.latestRoom?.status}`)
          .join(", ")}`,
      );
    }

    console.log(
      JSON.stringify({
        ok: true,
        code,
        playersSimulated: 10,
        finalActivePlayers: info.room.players.length,
        finalStatus: info.room.status,
        gamePhase: info.room.gameState?.phase,
        droppedInvalidMessages: info.droppedInvalidCount,
        elapsedMs,
      }),
    );
  } finally {
    for (const s of sockets) {
      try {
        s.close();
      } catch {}
    }
    proc?.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
