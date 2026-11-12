export type FanIdentity = 'bhAAi' | 'Bob' | 'Darling' | 'Tarak' | 'OG' | 'Boss' | 'Natural Star';

export interface FanbaseInfo {
  id: FanIdentity;
  name: string;
  hero: string;
  title: string;
  dialogue: string;
  avatarColor: string;
  icon: string;
}

export type LanguagePref = 'te' | 'te-en';

export interface UserProfile {
  id: string;
  name: string;
  fanIdentity: FanIdentity;
  languagePref: LanguagePref;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  gamesPlayed: number;
}

export type GameId = 'head-set-go' | 'transify' | 'dumb-charades' | 'emoji-cinema' | 'box-office-auction';

export interface TeluguMovie {
  id: string;
  teluguTitle: string;
  englishTitle: string;
  year: number;
  hero: string;
  director: string;
  genre: string[];
  characters: string[];
  iconicDialogue?: {
    telugu: string;
    transliteration: string;
    character: string;
  };
  // Game 1: Head Set Go specific fields
  headSetGoCategory?: 'heroes' | 'characters' | 'dialogues' | 'blockbusters' | 'brahmi';
  headSetGoClue?: string;
  // Game 2: Transify specific fields
  transifyPrompt?: {
    brokenEnglish: string;
    category: 'titles' | 'dialogues' | 'memes';
    hint: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  // Game 3: Dumb Charades fields
  charadesDifficulty?: 'easy' | 'medium' | 'hard';
  charadesHints?: string[];
  // Game 4: Emoji Cinema fields
  emojiClue?: {
    emojis: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  // Game 5: Box Office Auction fields
  auctionLot?: {
    basePriceCr: number;
    boScore: number; // 0-100
    talkScore: number; // 0-100
    cultScore: number; // 0-100
    synergyTags: string[];
    isTrap?: boolean;
    pool: 'balanced' | 'nostalgia' | 'tier1' | 'chaos';
    tagline: string;
  };
}

// Single-device auction player
export interface AuctionPlayer {
  id: string;
  name: string;
  fanIdentity: FanIdentity;
  purseCr: number;
  initialPurseCr: number;
  wonLots: TeluguMovie[];
  totalSpentCr: number;
  isFolded?: boolean;
}

// Multiplayer Auction Room state
export interface AuctionRoomState {
  roomCode: string;
  hostId: string;
  status: 'lobby' | 'bidding' | 'lot-sold' | 'finished';
  currentLotIndex: number;
  lots: TeluguMovie[];
  currentBidCr: number;
  highestBidderId: string | null;
  highestBidderName: string | null;
  timerSeconds: number;
  players: AuctionPlayer[];
  lotHistory: {
    movie: TeluguMovie;
    soldTo: string | null;
    soldToName: string | null;
    winningBidCr: number;
    isUnsold: boolean;
  }[];
  poolType: 'balanced' | 'nostalgia' | 'tier1' | 'chaos';
  startingPurseCr: number;
  maxLots: number;
  lastUpdated: number;
}

