import { isValidRoomCode } from "@tfi/game-core";

export function checkRealtimeHealth(code: string): { ok: boolean; validCode: boolean } {
  return {
    ok: true,
    validCode: isValidRoomCode(code),
  };
}
