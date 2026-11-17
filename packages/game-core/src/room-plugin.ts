import type { RoomGameState, RoomPlayer } from "./room-protocol";

export interface RoomGamePlugin {
  readonly id: string;
  readonly name: { readonly en: string; readonly te: string };
  readonly minPlayers: number;
  readonly maxPlayers: number;
  readonly devOnly?: boolean;
  readonly defaultSettings: Record<string, unknown>;
  createInitialState(
    players: readonly RoomPlayer[],
    settings: Record<string, unknown> | undefined,
    now: number,
  ): RoomGameState;
  onAction(
    state: RoomGameState,
    playerId: string,
    action: string,
    payload: Record<string, unknown> | undefined,
    now: number,
    players: readonly RoomPlayer[],
  ): RoomGameState;
  onTick?(state: RoomGameState, now: number): RoomGameState;
  getResult?(
    state: RoomGameState,
    players: readonly RoomPlayer[],
  ): { readonly summary: string; readonly winners: readonly string[] };
}

export const READY_CHECK_PLUGIN: RoomGamePlugin = {
  id: "ready-check",
  name: { en: "Ready check", te: "రెడీ చెక్" },
  minPlayers: 2,
  maxPlayers: 10,
  devOnly: true,
  defaultSettings: { countdownMs: 3000 },
  createInitialState(_players, settings, now) {
    const countdownMs =
      typeof settings?.countdownMs === "number" && settings.countdownMs >= 500
        ? Math.min(10_000, settings.countdownMs)
        : 3000;
    return {
      gameId: "ready-check",
      phase: "waiting",
      readyIds: [],
      startedAt: now,
      countdownEndAt: null,
      data: { countdownMs },
    };
  },
  onAction(state, playerId, action, _payload, now, players) {
    if (action !== "ready" || state.phase !== "waiting") return state;
    const readyIds = state.readyIds.includes(playerId)
      ? state.readyIds
      : [...state.readyIds, playerId];
    const connectedIds = players.filter((p) => p.connected).map((p) => p.id);
    const allReady =
      connectedIds.length >= 2 && connectedIds.every((id) => readyIds.includes(id));

    const countdownMs =
      typeof state.data.countdownMs === "number" ? state.data.countdownMs : 3000;

    if (allReady) {
      return {
        ...state,
        phase: "countdown",
        readyIds,
        countdownEndAt: now + countdownMs,
      };
    }
    return {
      ...state,
      readyIds,
    };
  },
  onTick(state, now) {
    if (state.phase === "countdown" && state.countdownEndAt !== null && now >= state.countdownEndAt) {
      return {
        ...state,
        phase: "done",
      };
    }
    return state;
  },
  getResult(state, players) {
    const readyNames = players
      .filter((p) => state.readyIds.includes(p.id))
      .map((p) => p.name);
    return {
      summary: `${readyNames.length} players ready`,
      winners: readyNames,
    };
  },
};

export const ROOM_GAME_PLUGINS: Record<string, RoomGamePlugin> = {
  "ready-check": READY_CHECK_PLUGIN,
};

export function getRoomGamePlugin(gameId: string): RoomGamePlugin | undefined {
  return ROOM_GAME_PLUGINS[gameId];
}
