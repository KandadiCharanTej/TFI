export type { GameCard } from "@tfi/content";

export type RoundPhase = "setup" | "ready" | "playing" | "roundEnd" | "results";

export const ROUND_PHASES: readonly RoundPhase[] = [
  "setup",
  "ready",
  "playing",
  "roundEnd",
  "results",
] as const;

export const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function isValidRoomCode(code: string): boolean {
  if (code.length !== 4) return false;
  for (const ch of code) {
    if (!ROOM_CODE_ALPHABET.includes(ch)) {
      return false;
    }
  }
  return true;
}
