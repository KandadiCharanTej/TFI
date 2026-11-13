export type GameTemplate = "Forehead" | "Judge" | "Charades" | "Vote" | "Auction";
export type GameCategory = "Cinema" | "Cricket" | "Party";
export type GameMode = "One phone" | "Phone or online" | "Online";
export type GameStatus = "ready" | "coming-soon";
export type GameRelease = "beta" | "mvp";

export interface GameRegistryEntry {
  readonly id: string; // slug, e.g. "transify"
  readonly nameKey: string; // e.g. "games.transify.name"
  readonly ruleKey: string; // e.g. "games.transify.rule"
  readonly category: GameCategory;
  readonly mode: GameMode;
  readonly template: GameTemplate;
  readonly deckIds: readonly string[];
  readonly playerMin: number;
  readonly playerMax: number;
  readonly defaultTimerSec: number;
  readonly timerOptions: readonly number[];
  readonly iconId:
    | "head"
    | "trans"
    | "charades"
    | "emoji"
    | "auction"
    | "cricketiq"
    | "dream"
    | "cricketauction"
    | "rapid"
    | "most";
  readonly status: GameStatus;
  readonly release: GameRelease;
  readonly wave: 1 | 2 | 3;
  readonly number: string;
}

export const GAME_REGISTRY: readonly GameRegistryEntry[] = [
  {
    id: "head-set-go",
    number: "01",
    nameKey: "games.headSetGo.name",
    ruleKey: "games.headSetGo.rule",
    category: "Cinema",
    mode: "One phone",
    template: "Forehead",
    deckIds: ["head-set-go-movies", "head-set-go-actors"],
    playerMin: 2,
    playerMax: 10,
    defaultTimerSec: 60,
    timerOptions: [30, 60, 90, 120, 150, 180],
    iconId: "head",
    status: "ready",
    release: "beta",
    wave: 1,
  },
  {
    id: "transify",
    number: "02",
    nameKey: "games.transify.name",
    ruleKey: "games.transify.rule",
    category: "Cinema",
    mode: "One phone",
    template: "Judge",
    deckIds: ["transify-movies"],
    playerMin: 2,
    playerMax: 8,
    defaultTimerSec: 60,
    timerOptions: [30, 45, 60, 90],
    iconId: "trans",
    status: "ready",
    release: "beta",
    wave: 1,
  },
  {
    id: "dumb-charades",
    number: "03",
    nameKey: "games.dumbCharades.name",
    ruleKey: "games.dumbCharades.rule",
    category: "Cinema",
    mode: "One phone",
    template: "Charades",
    deckIds: ["dumb-charades-movies"],
    playerMin: 4,
    playerMax: 10,
    defaultTimerSec: 60,
    timerOptions: [45, 60, 90],
    iconId: "charades",
    status: "coming-soon",
    release: "beta",
    wave: 1,
  },
  {
    id: "emoji-cinema",
    number: "04",
    nameKey: "games.emojiCinema.name",
    ruleKey: "games.emojiCinema.rule",
    category: "Cinema",
    mode: "Phone or online",
    template: "Judge",
    deckIds: ["emoji-cinema-movies"],
    playerMin: 2,
    playerMax: 8,
    defaultTimerSec: 60,
    timerOptions: [30, 45, 60, 90],
    iconId: "emoji",
    status: "ready",
    release: "beta",
    wave: 1,
  },
  {
    id: "box-office-auction",
    number: "05",
    nameKey: "games.boxOfficeAuction.name",
    ruleKey: "games.boxOfficeAuction.rule",
    category: "Cinema",
    mode: "Online",
    template: "Auction",
    deckIds: ["box-office-auction-films"],
    playerMin: 2,
    playerMax: 10,
    defaultTimerSec: 30,
    timerOptions: [30, 45, 60],
    iconId: "auction",
    status: "coming-soon",
    release: "beta",
    wave: 2,
  },
  {
    id: "cricket-iq",
    number: "06",
    nameKey: "games.cricketIq.name",
    ruleKey: "games.cricketIq.rule",
    category: "Cricket",
    mode: "Phone or online",
    template: "Judge",
    deckIds: ["cricket-iq-trivia"],
    playerMin: 2,
    playerMax: 8,
    defaultTimerSec: 60,
    timerOptions: [30, 45, 60, 90],
    iconId: "cricketiq",
    status: "ready",
    release: "mvp",
    wave: 1,
  },
  {
    id: "dream-xi-challenge",
    number: "07",
    nameKey: "games.dreamXiChallenge.name",
    ruleKey: "games.dreamXiChallenge.rule",
    category: "Cricket",
    mode: "Online",
    template: "Auction",
    deckIds: ["dream-xi-players"],
    playerMin: 1,
    playerMax: 1,
    defaultTimerSec: 300,
    timerOptions: [180, 300],
    iconId: "dream",
    status: "coming-soon",
    release: "mvp",
    wave: 3,
  },
  {
    id: "cricket-auction",
    number: "08",
    nameKey: "games.cricketAuction.name",
    ruleKey: "games.cricketAuction.rule",
    category: "Cricket",
    mode: "Online",
    template: "Auction",
    deckIds: ["cricket-auction-players"],
    playerMin: 2,
    playerMax: 10,
    defaultTimerSec: 30,
    timerOptions: [30, 45, 60],
    iconId: "cricketauction",
    status: "coming-soon",
    release: "mvp",
    wave: 2,
  },
  {
    id: "rapid-fire",
    number: "09",
    nameKey: "games.rapidFire.name",
    ruleKey: "games.rapidFire.rule",
    category: "Party",
    mode: "One phone",
    template: "Judge",
    deckIds: ["rapid-fire-party"],
    playerMin: 2,
    playerMax: 8,
    defaultTimerSec: 30,
    timerOptions: [20, 30, 45, 60],
    iconId: "rapid",
    status: "ready",
    release: "beta",
    wave: 1,
  },
  {
    id: "most-likely",
    number: "10",
    nameKey: "games.mostLikely.name",
    ruleKey: "games.mostLikely.rule",
    category: "Party",
    mode: "Phone or online",
    template: "Vote",
    deckIds: ["most-likely-party"],
    playerMin: 3,
    playerMax: 10,
    defaultTimerSec: 30,
    timerOptions: [30, 45],
    iconId: "most",
    status: "coming-soon",
    release: "beta",
    wave: 1,
  },
] as const;

export function getGameById(id: string): GameRegistryEntry | undefined {
  return GAME_REGISTRY.find((g) => g.id === id);
}

export function getGamesByStatus(status: GameStatus): readonly GameRegistryEntry[] {
  return GAME_REGISTRY.filter((g) => g.status === status);
}

export function getGamesByCategory(category: GameCategory): readonly GameRegistryEntry[] {
  return GAME_REGISTRY.filter((g) => g.category === category);
}

export function getGameRoute(id: string): string {
  return `/play/${id}`;
}


/**
 * Games visible in the UI. Beta shows only release:"beta" games.
 * Pass showMvp=true (driven by SHOW_MVP_GAMES=true) to include MVP games.
 */
export function getVisibleGames(showMvp = false): readonly GameRegistryEntry[] {
  return GAME_REGISTRY.filter((g) => showMvp || g.release === "beta");
}

export function getGamesByRelease(release: GameRelease): readonly GameRegistryEntry[] {
  return GAME_REGISTRY.filter((g) => g.release === release);
}
