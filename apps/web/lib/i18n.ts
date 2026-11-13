export type Locale = "te" | "en";

export interface BilingualEntry {
  readonly te: string;
  readonly en: string;
}

export interface GameCatalogItem {
  readonly slug: string;
  readonly number: string;
  readonly category: "Cinema" | "Cricket" | "Party";
  readonly wave: 1 | 2 | 3;
  readonly iconKind:
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
  readonly modeKey: "onePhone" | "phoneOrOnline" | "online";
  readonly isOnlineOnly: boolean;
  readonly title: BilingualEntry;
  readonly description: BilingualEntry;
}

/**
 * Single side-by-side translation dictionary (Rule 8).
 * Telugu script leads on every card, title and clue, with English letters beside/under it (Rule 1).
 * Logo brand.name is English letters only ("TFI & Pitch") in one translation key (Override 2).
 */
export const TRANSLATIONS = {
  brand: {
    name: "TFI & Pitch",
    tagline: {
      te: "మన సినిమా, మన క్రికెట్, మన గ్యాంగ్",
      en: "Movies, cricket, and party games for friends, on one phone or online. Guess, act, bid, compete, repeat.",
    },
    unofficialDisclaimer: {
      te: "అనధికారిక అభిమానుల గేమ్. ఏ సినిమా, నటుడు, స్టూడియో, క్రికెట్ లీగ్ లేదా జట్టుతో సంబంధం లేదు.",
      en: "Unofficial fan-made game. Not affiliated with any film, actor, studio, cricket league or team.",
    },
  },
  nav: {
    skipToContent: {
      te: "ప్రధాన కంటెంట్‌కు వెళ్ళండి",
      en: "Skip to main content",
    },
    games: {
      te: "గేమ్స్",
      en: "Games",
    },
    howItPlays: {
      te: "ఎలా ఆడాలి",
      en: "How it plays",
    },
    auction: {
      te: "ఆక్షన్",
      en: "Auction",
    },
    playNow: {
      te: "ఇప్పుడే ఆడండి",
      en: "Play now",
    },
    playTab: {
      te: "ఆడు",
      en: "Play",
    },
    joinTab: {
      te: "చేరు",
      en: "Join",
    },
    meTab: {
      te: "నేను",
      en: "Me",
    },
    langToggleLabel: {
      te: "తె / EN భాష మార్చండి",
      en: "తె / EN Switch language",
    },
  },
  modes: {
    onePhone: {
      te: "ఒకే ఫోన్",
      en: "One phone",
    },
    phoneOrOnline: {
      te: "ఫోన్ లేదా ఆన్‌లైన్",
      en: "Phone or online",
    },
    online: {
      te: "ఆన్‌లైన్",
      en: "Online",
    },
  },
  categories: {
    All: {
      te: "అన్నీ",
      en: "All",
    },
    Cinema: {
      te: "సినిమా",
      en: "Cinema",
    },
    Cricket: {
      te: "క్రికెట్",
      en: "Cricket",
    },
    Party: {
      te: "పార్టీ",
      en: "Party",
    },
  },
  landing: {
    betaPill: {
      te: "బీటా · 10 గేమ్స్ · తెలుగు ఫస్ట్",
      en: "Beta · 10 games · Telugu first",
    },
    heroSubline: {
      te: "ఒకే ఫోన్‌లో లేదా ఆన్‌లైన్ రూమ్‌లో ఫ్రెండ్స్‌తో ఆడుకోండి.",
      en: "Party games for friends, on one phone or online. Guess, act, bid, compete, repeat.",
    },
    seeGames: {
      te: "గేమ్స్ చూడండి",
      en: "See the games",
    },
    facts: {
      noSignup: {
        te: "సైన్-అప్ అవసరం లేదు",
        en: "No sign-up",
      },
      onePhoneOrOnline: {
        te: "ఒకే ఫోన్ లేదా ఆన్‌లైన్",
        en: "One phone or online",
      },
      teluguAndEnglish: {
        te: "తెలుగు + ఇంగ్లీష్",
        en: "Telugu + English",
      },
    },
    pickYourGameHeading: {
      te: "మీ గేమ్ ఎంచుకోండి",
      en: "Pick your game",
    },
    pickYourGameSub: {
      te: "పది గేమ్స్. ఒకే ఫోన్ లేదా ఒకే రూమ్ కోడ్.",
      en: "Ten games. One phone or one room code.",
    },
    howHeading: {
      te: "మూడు స్టెప్స్. మాన్యువల్ అవసరం లేదు.",
      en: "Three steps. No manual.",
    },
    steps: [
      {
        num: "01",
        title: {
          te: "గేమ్ ఎంచుకోండి",
          en: "Pick a game",
        },
        body: {
          te: "డెక్ ఎంచుకోండి, పెద్ద ప్లస్ మైనస్ బటన్లతో టైమర్ సెట్ చేయండి, మీ గ్యాంగ్‌ని చేర్చండి.",
          en: "Choose a deck, set the timer with the big plus and minus buttons, and add your gang.",
        },
      },
      {
        num: "02",
        title: {
          te: "కలిసి ఆడండి",
          en: "Play together",
        },
        body: {
          te: "నుదుటిపై ఫోన్ పెట్టండి, జడ్జ్ చేతిలో ఫోన్ ఉంచండి, లేదా రూమ్ కోడ్‌తో వేలం వేయండి.",
          en: "Phone on the forehead, phone in the Judge's hand, or bids flying across a room code.",
        },
      },
      {
        num: "03",
        title: {
          te: "ఫలితం షేర్ చేయండి",
          en: "Share the result",
        },
        body: {
          te: "ఎవరు ఎంత స్కోర్ చేశారో చూడండి, వాట్సాప్‌లో స్టిక్కర్ షేర్ చేసి మళ్ళీ ఆడండి.",
          en: "See who scored what, send the result sticker to WhatsApp, and go again.",
        },
      },
    ],
    auctionBadge: {
      te: "ఆన్‌లైన్ · 2 నుండి 10 మంది ఫ్రెండ్స్",
      en: "Online · 2 to 10 friends",
    },
    auctionHeading: {
      te: "సినిమాలపై వేలం వేయండి. దాగి ఉన్న స్కోర్లు విజేతను నిర్ణయిస్తాయి.",
      en: "Bid on films. Hidden scores pick the winner.",
    },
    auctionBullets: [
      {
        te: "అందరికీ సమానమైన ఆట నాణేల పర్స్ వస్తుంది.",
        en: "Everyone gets the same pretend purse.",
      },
      {
        te: "బాక్స్ ఆఫీస్, టాక్ మరియు కల్ట్ విలువ చివరి వరకు దాగి ఉంటాయి.",
        en: "Box office, word of mouth and cult value stay hidden until the end.",
      },
      {
        te: "చివరి 5 సెకన్లలో వేలం వేస్తే టైమర్ రీసెట్ అవుతుంది, ఎవరూ స్నైప్ చేయలేరు.",
        en: "A late bid resets the clock, so nobody can snipe.",
      },
    ],
    noRealMoneyNote: {
      te: "ఆట నాణేలు మాత్రమే. నిజమైన డబ్బు పందెం ఎప్పుడూ ఉండదు.",
      en: "Game coins only. There is no real-money betting.",
    },
    tryAuctionBtn: {
      te: "ఆక్షన్ రూమ్ ప్రయత్నించండి",
      en: "Try the auction room",
    },
    teluguFirstHeading: {
      te: "తెలుగు ఫస్ట్. ప్రతి కార్డుపై రెండు లిపులు.",
      en: "Telugu first. Two scripts on every card.",
    },
    teluguFirstBody: {
      te: "ప్రతి సినిమా పేరు, డైలాగ్ మరియు క్లూ తెలుగు లిపిలో పెద్దగా, కింద ఇంగ్లీష్ అక్షరాలతో కనిపిస్తాయి.",
      en: "Every title, dialogue and clue shows in Telugu script with English letters underneath, so the whole room can read it.",
    },
    fanVibeLabel: {
      te: "మీ ఫ్యాన్ వైబ్ (ఐచ్ఛికం)",
      en: "YOUR FAN VIBE (OPTIONAL)",
    },
    playingAs: {
      te: "ఆడుతున్న వైబ్:",
      en: "Playing as",
    },
    closingHeading: {
      te: "ఆడుకుందాం",
      en: "Your gang is waiting.",
    },
  },
  playHome: {
    todaysPickBadge: {
      te: "ఈరోజు పిక్",
      en: "TODAY'S PICK",
    },
    roomBannerTitle: {
      te: "రూమ్ కోడ్ ఉందా? మీ ఫ్రెండ్స్‌తో చేరండి",
      en: "Got a room code? Join your friends",
    },
    roomBannerSub: {
      te: "4-అక్షరాల కోడ్ ఎంటర్ చేసి వెంటనే ఆడండి",
      en: "Enter a 4-letter code to jump right in",
    },
    joinBtn: {
      te: "కోడ్ ఎంటర్ చేయండి",
      en: "Enter code",
    },
    allGamesHeading: {
      te: "అన్ని గేమ్స్ (10)",
      en: "All 10 games",
    },
    playAction: {
      te: "ఆడు",
      en: "PLAY",
    },
  },
} as const;

export const FAN_VIBES: readonly string[] = [
  "bhAAi",
  "Bob",
  "Darling",
  "Tarak",
  "OG",
  "Boss",
  "Nani",
] as const;

export const GAMES_CATALOG: readonly GameCatalogItem[] = [
  {
    slug: "head-set-go",
    number: "01",
    category: "Cinema",
    wave: 1,
    iconKind: "head",
    modeKey: "onePhone",
    isOnlineOnly: false,
    title: {
      te: "హెడ్ సెట్ గో",
      en: "Head Set Go",
    },
    description: {
      te: "ఫోన్ నుదుటిపై పెట్టండి. ఫ్రెండ్స్ క్లూస్ అరుస్తారు.",
      en: "Phone on your forehead. Friends shout clues.",
    },
  },
  {
    slug: "transify",
    number: "02",
    category: "Cinema",
    wave: 1,
    iconKind: "trans",
    modeKey: "onePhone",
    isOnlineOnly: false,
    title: {
      te: "ట్రాన్సిఫై",
      en: "Transify",
    },
    description: {
      te: "తమాషా ఇంగ్లీష్ అనువాదం నుండి తెలుగు సినిమా పట్టండి.",
      en: "Decode funny broken-English movie titles.",
    },
  },
  {
    slug: "dumb-charades",
    number: "03",
    category: "Cinema",
    wave: 1,
    iconKind: "charades",
    modeKey: "onePhone",
    isOnlineOnly: false,
    title: {
      te: "డంబ్ షరాడ్స్",
      en: "Dumb Charades",
    },
    description: {
      te: "మాటలు లేకుండా నటించండి. టీమ్ వర్సెస్ టీమ్.",
      en: "Act it out. Team against team.",
    },
  },
  {
    slug: "emoji-cinema",
    number: "04",
    category: "Cinema",
    wave: 1,
    iconKind: "emoji",
    modeKey: "phoneOrOnline",
    isOnlineOnly: false,
    title: {
      te: "ఎమోజీ సినిమా",
      en: "Emoji Cinema",
    },
    description: {
      te: "ఎమోజీల వరుస చూసి సినిమా పేరు చెప్పుకోండి.",
      en: "Guess the film from a string of emoji.",
    },
  },
  {
    slug: "box-office-auction",
    number: "05",
    category: "Cinema",
    wave: 2,
    iconKind: "auction",
    modeKey: "online",
    isOnlineOnly: true,
    title: {
      te: "బాక్స్ ఆఫీస్ ఆక్షన్",
      en: "Box Office Auction",
    },
    description: {
      te: "సినిమాలపై వేలం వేయండి. దాగి ఉన్న స్కోర్లు విజేతను నిర్ణయిస్తాయి.",
      en: "Bid on films. Hidden scores pick the winner.",
    },
  },
  {
    slug: "cricket-iq",
    number: "06",
    category: "Cricket",
    wave: 1,
    iconKind: "cricketiq",
    modeKey: "phoneOrOnline",
    isOnlineOnly: false,
    title: {
      te: "క్రికెట్ ఐక్యూ",
      en: "Cricket IQ",
    },
    description: {
      te: "క్రికెటర్లు, రికార్డులు మరియు మరపురాని క్షణాలు.",
      en: "Cricketers, records and iconic moments.",
    },
  },
  {
    slug: "dream-xi-challenge",
    number: "07",
    category: "Cricket",
    wave: 3,
    iconKind: "dream",
    modeKey: "online",
    isOnlineOnly: true,
    title: {
      te: "డ్రీమ్ XI ఛాలెంజ్",
      en: "Dream XI Challenge",
    },
    description: {
      te: "బడ్జెట్‌లో 11 మంది ఆటగాళ్లను ఎంచుకోండి.",
      en: "Pick eleven within a budget.",
    },
  },
  {
    slug: "cricket-auction",
    number: "08",
    category: "Cricket",
    wave: 2,
    iconKind: "cricketauction",
    modeKey: "online",
    isOnlineOnly: true,
    title: {
      te: "క్రికెట్ ఆక్షన్",
      en: "Cricket Auction",
    },
    description: {
      te: "ఆట నాణేలతో వేలం వేసి మీ జట్టును నిర్మించుకోండి.",
      en: "Spend a pretend purse and build your side.",
    },
  },
  {
    slug: "rapid-fire",
    number: "09",
    category: "Party",
    wave: 1,
    iconKind: "rapid",
    modeKey: "onePhone",
    isOnlineOnly: false,
    title: {
      te: "ర్యాపిడ్ ఫైర్",
      en: "Rapid Fire",
    },
    description: {
      te: "గడియారంతో పోటీ పడుతూ సరదా తెలుగు ప్రశ్నలు.",
      en: "Funny Telugu questions against the clock.",
    },
  },
  {
    slug: "most-likely",
    number: "10",
    category: "Party",
    wave: 1,
    iconKind: "most",
    modeKey: "phoneOrOnline",
    isOnlineOnly: false,
    title: {
      te: "మోస్ట్ లైక్లీ",
      en: "Most Likely",
    },
    description: {
      te: "ఎవరు అత్యంత ఫన్నీ పని చేస్తారో ఓటు వేయండి.",
      en: "Vote on which friend would do the silliest thing.",
    },
  },
] as const;

export const TELUGU_CONJUNCT_SAMPLES: readonly BilingualEntry[] = [
  {
    te: "శ్రీ సీతారాముల కళ్యాణం చూతము రారండి",
    en: "Sri Seetharamula Kalyanam Choothamu Rarandi",
  },
  {
    te: "క్షణం క్షణం భయం భయం · స్త్ర · ప్రేమదేశం",
    en: "Kshanam Kshanam Bhayam Bhayam · Stra · Premadesam",
  },
  {
    te: "శ్రీకృష్ణార్జున విజయం · శస్త్రచికిత్స · ప్రేక్షకులు",
    en: "Sri Krishnarjuna Vijayam · Shastrachikitsa · Prekshakulu",
  },
] as const;
