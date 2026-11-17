export type { GameCard } from "@tfi/content";

export type RoundPhase = "setup" | "ready" | "playing" | "roundEnd" | "results";

export const ROUND_PHASES: readonly RoundPhase[] = [
  "setup",
  "ready",
  "playing",
  "roundEnd",
  "results",
] as const;

export * from "./registry";
export * from "./judge-machine";
export * from "./hsg-machine";
export * from "./charades-machine";
export * from "./vote-machine";
export * from "./room-protocol";
export * from "./room-plugin";
export * from "./room-engine";
