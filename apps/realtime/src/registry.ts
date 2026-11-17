import type * as Party from "partykit/server";
import {
  RATE_LIMIT_WRONG_CODE,
  ROOM_IDLE_EXPIRY_MS,
  checkRateLimit,
  generateRoomCode,
  isValidRoomCode,
  normalizeRoomCode,
  type RateBucket,
} from "@tfi/game-core";

interface RegistryEntry {
  code: string;
  gameId: string;
  createdAt: number;
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

export default class RegistryParty implements Party.Server {
  private readonly wrongCodeBuckets = new Map<string, RateBucket>();

  constructor(readonly room: Party.Room) {}

  private async loadEntries(): Promise<Map<string, RegistryEntry>> {
    const raw = (await this.room.storage.get<Record<string, RegistryEntry>>("codes")) ?? {};
    const now = Date.now();
    const map = new Map<string, RegistryEntry>();
    let pruned = false;
    for (const [code, entry] of Object.entries(raw)) {
      if (now - entry.createdAt >= ROOM_IDLE_EXPIRY_MS) {
        pruned = true;
        continue;
      }
      map.set(code, entry);
    }
    if (pruned) {
      await this.saveEntries(map);
    }
    return map;
  }

  private async saveEntries(map: Map<string, RegistryEntry>): Promise<void> {
    await this.room.storage.put("codes", Object.fromEntries(map.entries()));
  }

  async onRequest(req: Party.Request): Promise<Response> {
    const headers = getCorsHeaders(req, this.room.env);
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(req.url);

    if (req.method === "GET") {
      const rawCode = url.searchParams.get("code") ?? "";
      const code = normalizeRoomCode(rawCode);
      const clientKey =
        req.headers.get("cf-connecting-ip") ??
        req.headers.get("x-forwarded-for") ??
        "local-client";

      if (!isValidRoomCode(code)) {
        const ok = checkRateLimit(this.wrongCodeBuckets, clientKey, Date.now(), RATE_LIMIT_WRONG_CODE);
        return new Response(
          JSON.stringify({
            exists: false,
            code: ok ? "ROOM_NOT_FOUND" : "RATE_LIMITED",
            message: ok ? "Room code must be 4 letters" : "Too many invalid attempts. Wait a moment.",
          }),
          { status: ok ? 200 : 429, headers },
        );
      }

      const entries = await this.loadEntries();
      const entry = entries.get(code);
      if (!entry) {
        const ok = checkRateLimit(this.wrongCodeBuckets, clientKey, Date.now(), RATE_LIMIT_WRONG_CODE);
        return new Response(
          JSON.stringify({
            exists: false,
            code: ok ? "ROOM_NOT_FOUND" : "RATE_LIMITED",
            message: ok
              ? "No room found for that code"
              : "Too many wrong room codes. Please wait 30 seconds.",
          }),
          { status: ok ? 200 : 429, headers },
        );
      }

      // Query live status from main room Durable Object
      const mainStub = this.room.context.parties["main"]?.get(code);
      if (mainStub) {
        const roomRes = await mainStub.fetch(new Request(`http://internal/parties/main/${code}`));
        if (roomRes.ok) {
          const data = (await roomRes.json()) as {
            exists: boolean;
            room: { status: string; players: unknown[]; gameId: string } | null;
          };
          if (!data.exists || !data.room || data.room.status === "closed") {
            entries.delete(code);
            await this.saveEntries(entries);
            return new Response(
              JSON.stringify({ exists: false, code: "ROOM_NOT_FOUND", message: "Room has ended" }),
              { status: 200, headers },
            );
          }
          return new Response(
            JSON.stringify({
              exists: true,
              code,
              gameId: data.room.gameId,
              status: data.room.status,
              playerCount: data.room.players.length,
            }),
            { status: 200, headers },
          );
        }
      }

      return new Response(
        JSON.stringify({
          exists: true,
          code,
          gameId: entry.gameId,
          status: "lobby",
          playerCount: 0,
        }),
        { status: 200, headers },
      );
    }

    if (req.method === "POST") {
      let body: { action?: string; gameId?: string; code?: string } = {};
      try {
        body = (await req.json()) as typeof body;
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers });
      }

      const entries = await this.loadEntries();

      if (body.action === "unregister" && body.code) {
        entries.delete(normalizeRoomCode(body.code));
        await this.saveEntries(entries);
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
      }

      const gameId =
        typeof body.gameId === "string" && body.gameId.trim().length > 0
          ? body.gameId.trim().slice(0, 40)
          : "ready-check";

      const activeCodes = new Set(entries.keys());
      const code = generateRoomCode(activeCodes);
      const entry: RegistryEntry = { code, gameId, createdAt: Date.now() };

      const mainStub = this.room.context.parties["main"]?.get(code);
      if (mainStub) {
        await mainStub.fetch(
          new Request(`http://internal/parties/main/${code}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "init", code, gameId }),
          }),
        );
      }

      entries.set(code, entry);
      await this.saveEntries(entries);

      return new Response(JSON.stringify({ code, gameId }), { status: 201, headers });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }
}
