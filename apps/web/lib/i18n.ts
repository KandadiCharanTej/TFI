import type { Bi } from "./lang";

/**
 * THE one translation file (rule 8). Every user-facing string is a pair
 * { en, te }. English is the default; Telugu script shows only when the user
 * switches the language (see lib/lang.ts). Review the two columns side by side.
 *
 * Rules for writing strings:
 *  - `en` must never contain Telugu script. A unit test enforces this.
 *  - `te` is shown in Telugu mode with Telugu typography (no uppercase,
 *    no letter-spacing, line height 1.5+).
 *  - Names of games, films and people also keep their English letters in `en`
 *    so Telugu mode can show them small beneath the Telugu.
 */
export type BilingualEntry = Bi;

export interface GameCatalogItem {
  readonly slug: string;
  readonly number: string;
  /** "beta" games are always shown; "mvp" games only with SHOW_MVP_GAMES=true. */
  readonly release: "beta" | "mvp";
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
  readonly title: Bi;
  readonly description: Bi;
}

export const TRANSLATIONS = {
  brand: {
    /** Working name. One key, one-line change later. English letters in both languages. */
    name: { en: "TFI & Pitch", te: "TFI & Pitch" },
    tagline: {
      en: "Our movies. Our mayhem. Our gang.",
      te: "మన సినిమా, మన సరదా, మన గ్యాంగ్",
    },
    unofficialDisclaimer: {
      en: "Unofficial fan-made game. Not affiliated with any film, actor, studio or team.",
      te: "అనధికారిక అభిమానుల ఆట. ఏ సినిమా, నటుడు, స్టూడియో లేదా జట్టుతో సంబంధం లేదు.",
    },
    pageTitle: {
      en: "TFI & Pitch | Our movies. Our mayhem. Our gang.",
      te: "TFI & Pitch | మన సినిమా, మన సరదా, మన గ్యాంగ్",
    },
    pageDescription: {
      en: "Party games for friends about Telugu cinema. One phone or online. Guess, act, vote, bid, repeat.",
      te: "తెలుగు సినిమాపై ఫ్రెండ్స్ కోసం పార్టీ గేమ్స్. ఒకే ఫోన్ లేదా ఆన్‌లైన్. ఊహించండి, నటించండి, ఓటు వేయండి, వేలం వేయండి.",
    },
  },
  lang: {
    /** Language names are the one allowed exception for Telugu script in English mode. */
    switchVisibleTe: { en: "తె", te: "తె" },
    switchVisibleEn: { en: "EN", te: "EN" },
    switchHidden: { en: "Switch language", te: "భాష మార్చండి" },
    nameTelugu: { en: "తెలుగు", te: "తెలుగు" },
    nameEnglish: { en: "English", te: "English" },
  },
  common: {
    skipToContent: { en: "Skip to main content", te: "ప్రధాన కంటెంట్‌కు వెళ్ళండి" },
    back: { en: "Back", te: "వెనక్కి" },
    backToPlay: { en: "Back to Play", te: "ఆట పేజీకి వెళ్ళండి" },
    backToPlayHome: { en: "Back to Play Home", te: "ఆట హోమ్‌కు వెళ్ళండి" },
    goToPlayHome: { en: "Go to Play Home", te: "ఆట హోమ్‌కు వెళ్ళండి" },
    skip: { en: "Skip", te: "వదిలేయి" },
    correct: { en: "Correct", te: "సరైనది" },
    pass: { en: "Pass", te: "పాస్" },
    cards: { en: "{n} cards", te: "{n} కార్డులు" },
    seconds: { en: "{n} sec", te: "{n} సెకన్లు" },
    coinsOnly: {
      en: "Game coins only. There is no real-money betting.",
      te: "ఆట నాణేలు మాత్రమే. నిజమైన డబ్బుతో పందెం ఉండదు.",
    },
  },
  nav: {
    games: { en: "Games", te: "గేమ్స్" },
    howItPlays: { en: "How it plays", te: "ఎలా ఆడాలి" },
    auction: { en: "Auction", te: "ఆక్షన్" },
    playNow: { en: "Play now", te: "ఇప్పుడే ఆడండి" },
    playTab: { en: "Play", te: "ఆడు" },
    joinTab: { en: "Join", te: "చేరు" },
    meTab: { en: "Me", te: "నేను" },
    mainNav: { en: "Main", te: "ప్రధాన మెనూ" },
    appNav: { en: "App navigation", te: "యాప్ మెనూ" },
    mobileNav: { en: "Bottom navigation", te: "కింది మెనూ" },
    footerNav: { en: "Footer links", te: "ఫుటర్ లింకులు" },
    about: { en: "About", te: "మా గురించి" },
    privacy: { en: "Privacy", te: "గోప్యత" },
    terms: { en: "Terms", te: "నిబంధనలు" },
  },
  modes: {
    onePhone: { en: "One phone", te: "ఒకే ఫోన్" },
    phoneOrOnline: { en: "Phone or online", te: "ఫోన్ లేదా ఆన్‌లైన్" },
    online: { en: "Online", te: "ఆన్‌లైన్" },
  },
  modeFilter: {
    All: { en: "All", te: "అన్నీ" },
    onePhone: { en: "One phone", te: "ఒకే ఫోన్" },
    online: { en: "Online", te: "ఆన్‌లైన్" },
    filterLabel: { en: "Filter games by mode", te: "విధానం ప్రకారం గేమ్స్ వడపోయండి" },
  },
  landing: {
    betaPill: { en: "Beta · 7 games · Telugu cinema", te: "బీటా · 7 గేమ్స్ · తెలుగు సినిమా" },
    heroLine1: { en: "Movies.", te: "సినిమా." },
    heroLine2: { en: "Mayhem.", te: "సరదా." },
    heroLead: { en: "The", te: "మన" },
    heroMarker: { en: "Gang", te: "గ్యాంగ్" },
    heroSubline: {
      en: "Party games for friends, on one phone or online. Guess, act, bid, compete, repeat.",
      te: "ఫ్రెండ్స్ కోసం పార్టీ గేమ్స్, ఒకే ఫోన్‌లో లేదా ఆన్‌లైన్‌లో. ఊహించండి, నటించండి, వేలం వేయండి, పోటీ పడండి, మళ్ళీ ఆడండి.",
    },
    seeGames: { en: "See the games", te: "గేమ్స్ చూడండి" },
    heroLabel: { en: "Hero", te: "ప్రధాన భాగం" },
    facts: {
      noSignup: { en: "No sign-up", te: "సైన్-అప్ అవసరం లేదు" },
      onePhoneOrOnline: { en: "One phone or online", te: "ఒకే ఫోన్ లేదా ఆన్‌లైన్" },
      teluguAndEnglish: { en: "Telugu + English", te: "తెలుగు + ఇంగ్లీష్" },
    },
    mock: {
      score: { en: "SCORE 4/6", te: "స్కోర్ 4/6" },
      judgeReads: { en: "THE JUDGE READS", te: "జడ్జ్ చదువుతారు" },
      clue: { en: "Rogue", te: "రోగ్" },
      answerLabel: { en: "ANSWER", te: "జవాబు" },
      answerWord: { en: "Pokiri", te: "పోకిరి" },
      judgeCardLabel: { en: "Sample Judge card", te: "జడ్జ్ కార్డ్ నమూనా" },
      auctionCardLabel: { en: "Sample auction card", te: "ఆక్షన్ కార్డ్ నమూనా" },
      lot: { en: "LOT 3/10", te: "లాట్ 3/10" },
      lotLong: { en: "LOT 3 / 10", te: "లాట్ 3 / 10" },
      lotBase: { en: "MAGADHEERA · base 5 Cr", te: "మగధీర · బేస్ 5 Cr" },
      lotWord: { en: "Magadheera", te: "మగధీర" },
      lotFacts: {
        en: "2009 · S. S. Rajamouli · base 5 Cr",
        te: "2009 · ఎస్. ఎస్. రాజమౌళి · బేస్ 5 Cr",
      },
      bid25: { en: "Bid 25 Cr", te: "వేలం 25 Cr" },
      currentBid: { en: "CURRENT BID", te: "ప్రస్తుత వేలం" },
      boxOffice: { en: "BOX OFFICE", te: "బాక్స్ ఆఫీస్" },
      talk: { en: "TALK", te: "టాక్" },
      cult: { en: "CULT", te: "కల్ట్" },
    },
    pickYourGameHeading: { en: "Pick your game", te: "మీ గేమ్ ఎంచుకోండి" },
    pickYourGameSub: {
      en: "Seven games. One phone or one room code.",
      te: "ఏడు గేమ్స్. ఒకే ఫోన్ లేదా ఒకే రూమ్ కోడ్.",
    },
    howHeading: { en: "Three steps. No manual.", te: "మూడు స్టెప్స్. మాన్యువల్ అవసరం లేదు." },
    steps: [
      {
        num: "01",
        title: { en: "Pick a game", te: "గేమ్ ఎంచుకోండి" },
        body: {
          en: "Choose a deck, set the timer with the big plus and minus buttons, and add your gang.",
          te: "డెక్ ఎంచుకోండి, పెద్ద ప్లస్ మైనస్ బటన్లతో టైమర్ సెట్ చేయండి, మీ గ్యాంగ్‌ని చేర్చండి.",
        },
      },
      {
        num: "02",
        title: { en: "Play together", te: "కలిసి ఆడండి" },
        body: {
          en: "Phone on the forehead, phone in the Judge's hand, or bids flying across a room code.",
          te: "నుదుటిపై ఫోన్, జడ్జ్ చేతిలో ఫోన్, లేదా రూమ్ కోడ్‌తో వేలాల జోరు.",
        },
      },
      {
        num: "03",
        title: { en: "Share the result", te: "ఫలితం షేర్ చేయండి" },
        body: {
          en: "See who scored what, send the result sticker to WhatsApp, and go again.",
          te: "ఎవరు ఎంత స్కోర్ చేశారో చూడండి, వాట్సాప్‌కు స్టిక్కర్ పంపండి, మళ్ళీ ఆడండి.",
        },
      },
    ],
    auctionBadge: { en: "Online · 2 to 10 friends", te: "ఆన్‌లైన్ · 2 నుండి 10 మంది ఫ్రెండ్స్" },
    auctionHeading: {
      en: "Bid on films. Hidden scores pick the winner.",
      te: "సినిమాలపై వేలం వేయండి. దాగిన స్కోర్లు విజేతను తేలుస్తాయి.",
    },
    auctionBullets: [
      {
        en: "Everyone gets the same pretend purse.",
        te: "అందరికీ ఒకే విధమైన ఆట నాణేల పర్స్ ఉంటుంది.",
      },
      {
        en: "Box office, word of mouth and cult value stay hidden until the end.",
        te: "బాక్స్ ఆఫీస్, టాక్, కల్ట్ విలువ చివరి వరకు దాగి ఉంటాయి.",
      },
      {
        en: "A late bid resets the clock, so nobody can snipe.",
        te: "చివర్లో వేలం వేస్తే గడియారం రీసెట్ అవుతుంది, ఎవరూ దొంగదెబ్బ తీయలేరు.",
      },
    ],
    tryAuctionBtn: { en: "Try the auction room", te: "ఆక్షన్ రూమ్ చూడండి" },
    teluguHeading: {
      en: "Telugu when you want it.",
      te: "తెలుగు ఫస్ట్. ప్రతి కార్డుపై తెలుగు పెద్దగా.",
    },
    teluguHeadingSecond: {
      en: "One tap switches every card.",
      te: "ఒక్క నొక్కుతో అన్నీ మారతాయి.",
    },
    teluguBody: {
      en: "Tap the language switch at the top. Every title, clue and button changes to Telugu script, with the English letters small beneath each card.",
      te: "పైన ఉన్న భాష బటన్ నొక్కండి. ప్రతి పేరు, క్లూ, బటన్ తెలుగు లిపిలోకి మారుతుంది. ప్రతి కార్డు కింద ఇంగ్లీష్ అక్షరాలు చిన్నగా కనిపిస్తాయి.",
    },
    fanVibeLabel: { en: "YOUR FAN VIBE (OPTIONAL)", te: "మీ ఫ్యాన్ వైబ్ (ఐచ్ఛికం)" },
    fanVibeGroup: { en: "Fan vibe", te: "ఫ్యాన్ వైబ్" },
    playingAs: { en: "Playing as", te: "ఆడుతున్న వైబ్:" },
    pokiriFacts: { en: "2006 · Puri Jagannadh", te: "2006 · పూరి జగన్నాథ్" },
    pokiriWord: { en: "Pokiri", te: "పోకిరి" },
    closingHeading: { en: "Your gang is waiting.", te: "మీ గ్యాంగ్ ఎదురు చూస్తోంది." },
  },
  playHome: {
    todaysPickBadge: { en: "TODAY'S PICK", te: "ఈరోజు ఎంపిక" },
    roomBannerTitle: {
      en: "Got a room code? Join your friends",
      te: "రూమ్ కోడ్ ఉందా? మీ ఫ్రెండ్స్‌తో చేరండి",
    },
    joinBtn: { en: "Enter code", te: "కోడ్ ఇవ్వండి" },
    allGamesHeading: { en: "All 10 games", te: "మొత్తం 10 గేమ్స్" },
    playAction: { en: "PLAY", te: "ఆడు" },
    joinRoomRegion: { en: "Join a room", te: "రూమ్‌లో చేరండి" },
  },
  gameSetup: {
    gameNumber: { en: "GAME #{n}", te: "గేమ్ #{n}" },
    placeholder: {
      en: "Deck and timer setup arrives with this game's round engine.",
      te: "ఈ గేమ్ రౌండ్ ఇంజిన్‌తో పాటు డెక్, టైమర్ సెటప్ వస్తుంది.",
    },
    createRoom: { en: "Create online room", te: "ఆన్‌లైన్ రూమ్ తయారు చేయండి" },
  },
  hsg: {
    name: { en: "Head Set Go", te: "హెడ్ సెట్ గో" },
    rules: {
      en: "Put the phone on your forehead. Friends shout clues. Tap right when you get it, left to pass.",
      te: "ఫోన్ నుదుటిపై పెట్టుకోండి. ఫ్రెండ్స్ క్లూస్ అరుస్తారు. సరైనదైతే కుడివైపు, వదిలేయాలంటే ఎడమవైపు నొక్కండి.",
    },
    tip: {
      en: "Put the phone on your forehead, friends shout clues.",
      te: "ఫోన్ నుదుటిపై పెట్టండి, ఫ్రెండ్స్ క్లూస్ అరుస్తారు.",
    },
    pickDeck: { en: "Pick a deck", te: "డెక్ ఎంచుకోండి" },
    deckGroup: { en: "Deck", te: "డెక్" },
    deckMovies: { en: "Movies", te: "సినిమాలు" },
    deckMoviesNote: { en: "Telugu film titles", te: "తెలుగు సినిమా పేర్లు" },
    deckActors: { en: "Actors", te: "నటీనటులు" },
    deckActorsNote: { en: "Well-known Telugu film actors", te: "ప్రముఖ తెలుగు సినీ నటీనటులు" },
    timerHeading: { en: "Round time", te: "రౌండ్ సమయం" },
    timerLess: { en: "Less time", te: "సమయం తగ్గించు" },
    timerMore: { en: "More time", te: "సమయం పెంచు" },
    start: { en: "Start", te: "మొదలుపెట్టు" },
    getReady: { en: "Get ready", te: "సిద్ధంగా ఉండండి" },
    turnSideways: { en: "Turn your phone sideways", te: "మీ ఫోన్‌ను పక్కకు తిప్పండి" },
    turnSidewaysNote: { en: "Sideways is easier to play.", te: "పక్కకు తిప్పితే ఆడటం తేలిక." },
    pause: { en: "Pause", te: "ఆపు" },
    paused: { en: "Paused", te: "ఆగింది" },
    resume: { en: "Resume", te: "కొనసాగించు" },
    quit: { en: "Quit", te: "నిష్క్రమించు" },
    soundOn: { en: "Sound on", te: "శబ్దం ఉంది" },
    soundOff: { en: "Sound off", te: "శబ్దం లేదు" },
    muteAction: { en: "Turn sound off", te: "శబ్దం ఆపండి" },
    unmuteAction: { en: "Turn sound on", te: "శబ్దం పెట్టండి" },
    timeLeft: { en: "Time left", te: "మిగిలిన సమయం" },
    correctCount: { en: "Correct answers", te: "సరైన జవాబులు" },
    roundRegion: { en: "Head Set Go round", te: "హెడ్ సెట్ గో రౌండ్" },
    currentCard: { en: "Current card", te: "ప్రస్తుత కార్డ్" },
    passStamp: { en: "PASS", te: "పాస్" },
    correctStamp: { en: "CORRECT", te: "సరైనది" },
    backgroundPaused: { en: "Paused while you were away.", te: "మీరు లేనప్పుడు ఆగింది." },
    timesUp: { en: "Time's up!", te: "సమయం అయిపోయింది!" },
    deckDone: { en: "Deck finished!", te: "డెక్ పూర్తయింది!" },
    scoreLabel: { en: "Score", te: "స్కోర్" },
    gotIt: { en: "Got it", te: "సరైనవి" },
    passedList: { en: "Passed", te: "వదిలేసినవి" },
    emptyList: { en: "Nothing here", te: "ఇక్కడ ఏమీ లేవు" },
    playAgain: { en: "Play again", te: "మళ్ళీ ఆడండి" },
    changeDeck: { en: "Change deck", te: "డెక్ మార్చండి" },
    share: { en: "Share", te: "షేర్ చేయండి" },
    home: { en: "Home", te: "హోమ్" },
    shareSaved: { en: "Sticker saved to your device.", te: "స్టిక్కర్ మీ ఫోన్‌లో సేవ్ అయింది." },
    shareDone: { en: "Sticker shared.", te: "స్టిక్కర్ షేర్ అయింది." },
    shareFailed: { en: "Could not make the sticker. Try again.", te: "స్టిక్కర్ తయారు కాలేదు. మళ్ళీ ప్రయత్నించండి." },
    shareTitle: { en: "I scored {n} on Head Set Go", te: "హెడ్ సెట్ గోలో నా స్కోర్ {n}" },
    shareScoreLine: { en: "{n} correct", te: "{n} సరైనవి" },
    shareDeckLine: { en: "Deck: {deck}", te: "డెక్: {deck}" },
    noRound: { en: "No round in progress. Pick a deck first.", te: "రౌండ్ జరగడం లేదు. ముందు డెక్ ఎంచుకోండి." },
  },
  pages: {
    aboutTitle: { en: "About", te: "మా గురించి" },
    aboutBody1: {
      en: "TFI & Pitch is a set of short party games about Telugu cinema and friend-group banter.",
      te: "TFI & Pitch అంటే తెలుగు సినిమా, ఫ్రెండ్స్ కబుర్లపై చిన్న పార్టీ గేమ్స్.",
    },
    aboutBody2: {
      en: "All auctions use pretend game coins only. There are no payments, wallets, prizes or real-money wagers of any kind.",
      te: "అన్ని వేలాలు ఆట నాణేలతో మాత్రమే. చెల్లింపులు, వాలెట్లు, బహుమతులు, నిజమైన డబ్బు పందేలు ఏమీ ఉండవు.",
    },
    privacyTitle: { en: "Privacy Policy", te: "గోప్యతా విధానం" },
    privacyBody: {
      en: "There is no sign-in in the beta. A guest gets an automatic device name, for example \"Guest Tiger\", saved only on your device. No email, no password, no personal-data forms, and no tracking of children.",
      te: "బీటాలో సైన్-ఇన్ లేదు. అతిథికి \"Guest Tiger\" లాంటి ఆటోమేటిక్ పరికరం పేరు వస్తుంది, అది మీ ఫోన్‌లో మాత్రమే ఉంటుంది. ఈమెయిల్, పాస్‌వర్డ్, వ్యక్తిగత వివరాల ఫారాలు ఉండవు, పిల్లలను ట్రాక్ చేయం.",
    },
    termsTitle: { en: "Terms of Play", te: "ఆట నిబంధనలు" },
    termsBody: {
      en: "All games are free party games for friends. Auctions use pretend coins only. No real money, payments, wallets or prizes ever exist here.",
      te: "అన్ని గేమ్స్ ఫ్రెండ్స్ కోసం ఉచిత పార్టీ గేమ్స్. వేలాలు ఆట నాణేలతో మాత్రమే. నిజమైన డబ్బు, చెల్లింపులు, వాలెట్లు, బహుమతులు ఇక్కడ ఎప్పుడూ ఉండవు.",
    },
    offlineTitle: { en: "You are offline", te: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు" },
    offlineBody: {
      en: "Pass-around-phone games keep working without internet once you have opened them.",
      te: "ఒకే ఫోన్ గేమ్స్ ఒకసారి తెరిచిన తర్వాత ఇంటర్నెట్ లేకుండానే పనిచేస్తాయి.",
    },
    joinBadge: { en: "ONLINE ROOMS · 4-LETTER CODE", te: "ఆన్‌లైన్ రూమ్స్ · 4 అక్షరాల కోడ్" },
    joinTitle: { en: "Enter a 4-letter code", te: "4 అక్షరాల కోడ్ ఇవ్వండి" },
    joinLabel: { en: "Room code (no I, O, 0, 1)", te: "రూమ్ కోడ్ (I, O, 0, 1 ఉండవు)" },
    joinButton: { en: "Join room {code}", te: "{code} రూమ్‌లో చేరండి" },
    joinInvalid: { en: "Enter a valid 4-letter code", te: "సరైన 4 అక్షరాల కోడ్ ఇవ్వండి" },
    meTitle: { en: "Device profile and preferences", te: "పరికరం ప్రొఫైల్, ఇష్టాలు" },
    meNoSignIn: { en: "No sign-in needed", te: "సైన్-ఇన్ అవసరం లేదు" },
    meDeviceName: { en: "Guest device name (saved on this phone)", te: "అతిథి పరికరం పేరు (ఈ ఫోన్‌లో సేవ్ అవుతుంది)" },
    meLanguage: { en: "Language", te: "భాష" },
    meAccessibility: { en: "Accessibility and sound", te: "సౌలభ్యం, శబ్దం" },
    meSound: { en: "Sound", te: "శబ్దం" },
    meReducedMotion: { en: "Reduced motion", te: "తక్కువ కదలిక" },
    on: { en: "ON", te: "ఉంది" },
    off: { en: "OFF", te: "లేదు" },
    roomNewBadge: { en: "WAVE 2 · ONLINE ROOMS", te: "వేవ్ 2 · ఆన్‌లైన్ రూమ్స్" },
    roomNewTitle: { en: "Create an online room", te: "ఆన్‌లైన్ రూమ్ తయారు చేయండి" },
    roomNewBody: {
      en: "Online rooms arrive in a later phase.",
      te: "ఆన్‌లైన్ రూమ్స్ తర్వాతి దశలో వస్తాయి.",
    },
    roomPreview: { en: "Preview room K7QM", te: "K7QM రూమ్ చూడండి" },
    roomTitle: { en: "Box Office Auction · Room {code}", te: "బాక్స్ ఆఫీస్ ఆక్షన్ · రూమ్ {code}" },
    lotOf: { en: "LOT 3 OF 10", te: "లాట్ 3 / 10" },
    bidLabel: { en: "CURRENT BID (GAME COINS)", te: "ప్రస్తుత వేలం (ఆట నాణేలు)" },
  },
  judge: {
    theJudgeReads: { en: "THE JUDGE READS", te: "జడ్జ్ చదువుతారు" },
    answerLabel: { en: "ANSWER", te: "జవాబు" },
    acceptedAnswersLabel: { en: "ACCEPTED ANSWERS", te: "అంగీకరించిన జవాబులు" },
    clue: { en: "Clue", te: "క్లూ" },
    skip: { en: "Skip", te: "వదిలేయి" },
    correct: { en: "Correct", te: "సరైనది" },
    score: { en: "Score", te: "స్కోర్" },
    roundTime: { en: "Round time", te: "రౌండ్ సమయం" },
    players: { en: "Players", te: "ఆటగాళ్ళు" },
    addPlayer: { en: "Add player", te: "ఆటగాడిని చేర్చండి" },
    playerNamePlaceholder: { en: "Player name", te: "ఆటగాడి పేరు" },
    removePlayer: { en: "Remove", te: "తీసివేయి" },
    minPlayersWarning: { en: "At least 2 players needed", te: "కనీసం 2 మంది ఆటగాళ్ళు కావాలి" },
    startGame: { en: "Start Game", te: "ఆట ప్రారంభించండి" },
    passPhoneTo: { en: "Pass the phone to", te: "ఫోన్‌ను వీరికి ఇవ్వండి" },
    readyButton: { en: "I'm ready →", te: "నేను సిద్ధం →" },
    getReady: { en: "Get ready!", te: "సిద్ధంగా ఉండండి!" },
    turnSummary: { en: "Turn finished!", te: "టర్న్ పూర్తయింది!" },
    nextTurn: { en: "Next turn →", te: "తర్వాత టర్న్ →" },
    resultsTitle: { en: "Game Over", te: "ఆట ముగిసింది" },
    winner: { en: "Winner!", te: "విజేత!" },
    tie: { en: "It's a tie!", te: "టై అయింది!" },
    playAgain: { en: "Play again", te: "మళ్ళీ ఆడండి" },
    showNames: { en: "Show names on the image", te: "చిత్రంపై పేర్లను చూపించండి" },
    shareSticker: { en: "Share sticker", te: "స్టిక్కర్ షేర్ చేయండి" },
    shareSaved: { en: "Sticker saved to your device.", te: "స్టిక్కర్ మీ ఫోన్‌లో సేవ్ అయింది." },
    shareDone: { en: "Sticker shared.", te: "స్టిక్కర్ షేర్ అయింది." },
    shareFailed: { en: "Could not make the sticker. Try again.", te: "స్టిక్కర్ తయారు కాలేదు. మళ్ళీ ప్రయత్నించండి." },
    paused: { en: "Paused", te: "ఆగింది" },
    resume: { en: "Resume", te: "కొనసాగించు" },
    quit: { en: "Quit", te: "నిష్క్రమించు" },
    muteSound: { en: "Mute sound", te: "శబ్దం ఆపండి" },
    unmuteSound: { en: "Unmute sound", te: "శబ్దం పెట్టండి" },
    comingSoon: { en: "Coming soon!", te: "త్వరలో రానుంది!" },
    comingSoonNote: { en: "This game is currently in development.", te: "ఈ గేమ్ ప్రస్తుతం తయారవుతోంది." },
  },
  gamesMeta: {
    transifyRule: {
      en: "The Judge reads a funny literal English translation of a Telugu film title. Friends guess the real film!",
      te: "జడ్జ్ తెలుగు సినిమా పేరు యొక్క తమాషా ఇంగ్లీష్ అనువాదాన్ని చదువుతారు. స్నేహితులు అసలు సినిమాను ఊహించాలి!",
    },
    emojiCinemaRule: {
      en: "The Judge shows a string of emoji clues for a Telugu movie. Guess the movie title before time expires!",
      te: "జడ్జ్ తెలుగు సినిమా ఎమోజీ క్లూలను చూపిస్తారు. సమయం ముగిసేలోపు సినిమా పేరును ఊహించండి!",
    },
    rapidFireRule: {
      en: "Quick trivia and name-three challenges! The Judge verifies acceptable answers against the clock.",
      te: "వేగవంతమైన ప్రశ్నలు మరియు మూడింటిని చెప్పే సవాళ్ళు! జడ్జ్ సరైన జవాబులను నిర్ధారిస్తారు.",
    },
    cricketIqRule: {
      en: "Cricket trivia on iconic players, legendary records, and unforgettable moments.",
      te: "ప్రముఖ క్రికెటర్లు, రికార్డులు మరియు చారిత్రక క్షణాలపై క్విజ్.",
    },
  },
  health: {
    title: { en: "SYSTEM HEALTH", te: "సిస్టమ్ ఆరోగ్యం" },
    status: { en: "STATUS: HEALTHY", te: "స్థితి: బాగుంది" },
    backToWall: { en: "Back to the wall", te: "వాల్‌కు వెళ్ళండి" },
    tokens: { en: "1. Locked Wall color tokens (8 colors only)", te: "1. లాక్ చేసిన వాల్ రంగులు (8 రంగులు మాత్రమే)" },
    fonts: { en: "2. Self-hosted fonts", te: "2. సొంతంగా హోస్ట్ చేసిన ఫాంట్లు" },
    teluguTest: { en: "Telugu stress test", te: "తెలుగు పరీక్ష" },
    teluguOnlyNote: {
      en: "Switch the language to Telugu to see the long-conjunct stress test.",
      te: "పొడవైన సంయుక్తాక్షరాల పరీక్ష కోసం భాషను తెలుగుకు మార్చండి.",
    },
    kit: { en: "3. Sticker kit primitives", te: "3. స్టిక్కర్ కిట్ భాగాలు" },
    playNow: { en: "Play now", te: "ఇప్పుడే ఆడండి" },
    seeGames: { en: "See the games", te: "గేమ్స్ చూడండి" },
    passBid: { en: "Pass / Bid 25 Cr", te: "పాస్ / వేలం 25 Cr" },
    roundTimer: { en: "Round timer", te: "రౌండ్ టైమర్" },
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
    release: "beta",
    wave: 1,
    iconKind: "head",
    modeKey: "onePhone",
    isOnlineOnly: false,
    title: { en: "Head Set Go", te: "హెడ్ సెట్ గో" },
    description: {
      en: "Phone on your forehead. Friends shout clues.",
      te: "ఫోన్ నుదుటిపై. ఫ్రెండ్స్ క్లూస్ అరుస్తారు.",
    },
  },
  {
    slug: "transify",
    number: "02",
    release: "beta",
    wave: 1,
    iconKind: "trans",
    modeKey: "onePhone",
    isOnlineOnly: false,
    title: { en: "Transify", te: "ట్రాన్సిఫై" },
    description: {
      en: "Decode funny broken-English movie titles.",
      te: "తమాషా ఇంగ్లీష్ అనువాదాల నుండి సినిమా పేర్లు పట్టండి.",
    },
  },
  {
    slug: "dumb-charades",
    number: "03",
    release: "beta",
    wave: 1,
    iconKind: "charades",
    modeKey: "onePhone",
    isOnlineOnly: false,
    title: { en: "Dumb Charades", te: "డంబ్ షరాడ్స్" },
    description: {
      en: "Act it out. Team against team.",
      te: "నటించి చూపండి. టీమ్ వర్సెస్ టీమ్.",
    },
  },
  {
    slug: "emoji-cinema",
    number: "04",
    release: "beta",
    wave: 1,
    iconKind: "emoji",
    modeKey: "phoneOrOnline",
    isOnlineOnly: false,
    title: { en: "Emoji Cinema", te: "ఎమోజీ సినిమా" },
    description: {
      en: "Guess the film from a string of emoji.",
      te: "ఎమోజీల వరుస చూసి సినిమా పేరు చెప్పండి.",
    },
  },
  {
    slug: "box-office-auction",
    number: "05",
    release: "beta",
    wave: 2,
    iconKind: "auction",
    modeKey: "online",
    isOnlineOnly: true,
    title: { en: "Box Office Auction", te: "బాక్స్ ఆఫీస్ ఆక్షన్" },
    description: {
      en: "Bid on films. Hidden scores pick the winner.",
      te: "సినిమాలపై వేలం వేయండి. దాగిన స్కోర్లు విజేతను తేలుస్తాయి.",
    },
  },
  {
    slug: "cricket-iq",
    number: "06",
    release: "mvp",
    wave: 1,
    iconKind: "cricketiq",
    modeKey: "phoneOrOnline",
    isOnlineOnly: false,
    title: { en: "Cricket IQ", te: "క్రికెట్ ఐక్యూ" },
    description: {
      en: "Cricketers, records and iconic moments.",
      te: "క్రికెటర్లు, రికార్డులు, మరపురాని క్షణాలు.",
    },
  },
  {
    slug: "dream-xi-challenge",
    number: "07",
    release: "mvp",
    wave: 3,
    iconKind: "dream",
    modeKey: "online",
    isOnlineOnly: true,
    title: { en: "Dream XI Challenge", te: "డ్రీమ్ XI ఛాలెంజ్" },
    description: {
      en: "Pick eleven within a budget.",
      te: "బడ్జెట్‌లో పదకొండు మందిని ఎంచుకోండి.",
    },
  },
  {
    slug: "cricket-auction",
    number: "08",
    release: "mvp",
    wave: 2,
    iconKind: "cricketauction",
    modeKey: "online",
    isOnlineOnly: true,
    title: { en: "Cricket Auction", te: "క్రికెట్ ఆక్షన్" },
    description: {
      en: "Spend a pretend purse and build your side.",
      te: "ఆట నాణేల పర్స్‌తో మీ జట్టును తయారు చేసుకోండి.",
    },
  },
  {
    slug: "rapid-fire",
    number: "09",
    release: "beta",
    wave: 1,
    iconKind: "rapid",
    modeKey: "onePhone",
    isOnlineOnly: false,
    title: { en: "Rapid Fire", te: "ర్యాపిడ్ ఫైర్" },
    description: {
      en: "Quick movie questions against the clock.",
      te: "గడియారంతో పోటీ పడుతూ సినిమా ప్రశ్నలు.",
    },
  },
  {
    slug: "most-likely",
    number: "10",
    release: "beta",
    wave: 1,
    iconKind: "most",
    modeKey: "phoneOrOnline",
    isOnlineOnly: false,
    title: { en: "Most Likely", te: "మోస్ట్ లైక్లీ" },
    description: {
      en: "Vote on which friend is the biggest movie nut.",
      te: "ఫ్రెండ్స్‌లో పెద్ద సినిమా పిచ్చి ఎవరికో ఓటు వేయండి.",
    },
  },
] as const;

/** Long Telugu conjuncts used by the Telugu-mode stress test on /health. */
export const TELUGU_CONJUNCT_SAMPLES: readonly Bi[] = [
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

/** The brand always shows in English letters. */
export const BRAND_NAME = TRANSLATIONS.brand.name.en;
