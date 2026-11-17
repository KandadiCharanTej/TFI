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
    comingSoon: { en: "Coming soon", te: "త్వరలో వస్తుంది" },
    skip: { en: "Skip", te: "వదిలేయి" },
    correct: { en: "Correct!", te: "సరైనది!" },
    pass: { en: "Pass", te: "పాస్" },
    cards: { en: "{n} cards", te: "{n} కార్డులు" },
    seconds: { en: "{n} sec", te: "{n} సెకన్లు" },
    coinsOnly: {
      en: "Game coins only. There is no real-money betting.",
      te: "ఆట నాణేలు మాత్రమే. నిజమైన డబ్బుతో పందెం ఉండదు.",
    },
    betaPill: { en: "Free · No sign-up · Works offline", te: "ఉచితం · సైన్-అప్ లేదు · ఆఫ్‌లైన్‌లో ఆడొచ్చు" },
    admitOneGang: { en: "Admit one gang", te: "గ్యాంగ్ ప్రవేశం" },
  },
  nav: {
    games: { en: "Games", te: "గేమ్స్" },
    howItPlays: { en: "How it works", te: "ఎలా ఆడాలి" },
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
    feedback: { en: "Feedback", te: "అభిప్రాయం" },
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
  playHome: {
    greeting: { en: "Ready for game night?", te: "గేమ్ నైట్‌కి సిద్ధమా?" },
    todaysPickBadge: { en: "Today's pick", te: "ఈరోజు ఎంపిక" },
    recentlyPlayed: { en: "Recently played", te: "ఇటీవల ఆడినవి" },
    roomBannerTitle: {
      en: "Got a room code? Join your friends",
      te: "రూమ్ కోడ్ ఉందా? మీ ఫ్రెండ్స్‌తో చేరండి",
    },
    joinBtn: { en: "Enter code", te: "కోడ్ ఇవ్వండి" },
    allGamesHeading: { en: "Seven games", te: "ఏడు గేమ్స్" },
    playAction: { en: "Play", te: "ఆడు" },
    joinRoomRegion: { en: "Join a room", te: "రూమ్‌లో చేరండి" },
  },
  gameSetup: {
    gameNumber: { en: "Game #{n}", te: "గేమ్ #{n}" },
    stepFlow: { en: "Deck · Players · Time", te: "డెక్ · ఆటగాళ్ళు · సమయం" },
    placeholder: {
      en: "Deck and timer setup arrives with this game's round engine.",
      te: "ఈ గేమ్ రౌండ్ ఇంజిన్‌తో పాటు డెక్, టైమర్ సెటప్ వస్తుంది.",
    },
    createRoom: { en: "Create online room", te: "ఆన్‌లైన్ రూమ్ తయారు చేయండి" },
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
    aboutMadeBy: {
      en: "Made by the TFI & Pitch team.",
      te: "TFI & Pitch బృందం తయారు చేసింది.",
    },
    privacyTitle: { en: "Privacy Policy (Draft)", te: "గోప్యతా విధానం (డ్రాఫ్ట్)" },
    privacyBody: {
      en: "There is no sign-in in the beta. A guest gets an automatic device name, for example \"Guest Tiger\", saved only on your device. No email, no password, no personal-data forms, and no tracking of children.",
      te: "బీటాలో సైన్-ఇన్ లేదు. అతిథికి \"Guest Tiger\" లాంటి ఆటోమేటిక్ పరికరం పేరు వస్తుంది, అది మీ ఫోన్‌లో మాత్రమే ఉంటుంది. ఈమెయిల్, పాస్‌వర్డ్, వ్యక్తిగత వివరాల ఫారాలు ఉండవు, పిల్లలను ట్రాక్ చేయం.",
    },
    privacyHeadingStored: { en: "What stays on your phone", te: "మీ ఫోన్‌లో ఉండేవి" },
    privacyStored: {
      en: "Your device name, language, sound, vibration, motion, and text-size preferences are stored in localStorage only.",
      te: "మీ పరికరం పేరు, భాష, శబ్దం, వైబ్రేషన్, కదలిక, అక్షరాల పరిమాణం ఇష్టాలు మాత్రమే మీ ఫోన్‌లో సేవ్ అవుతాయి.",
    },
    privacyHeadingAnalytics: { en: "Optional anonymous counts", te: "ఐచ్ఛిక అనామక గణాంకాలు" },
    privacyAnalytics: {
      en: "Only if you tap Yes on the consent sticker do we count anonymous events (game opened, round started, round finished). No names, cards, or device IDs are ever sent.",
      te: "మీరు అంగీకార స్టిక్కర్‌లో అవును అని నొక్కితే మాత్రమే అనామక గణాంకాలు (ఆట తెరిచినవి, రౌండ్ మొదలైనవి, పూర్తయినవి) లెక్కిస్తాము. పేర్లు, కార్డులు, పరికరపు ఐడీలు ఎప్పుడూ పంపబడవు.",
    },
    privacyHeadingRights: { en: "Clear your data anytime", te: "ఎప్పుడైనా మీ డేటాను తొలగించండి" },
    privacyRights: {
      en: "Open Me → Clear my data on this device to wipe all saved preferences immediately.",
      te: "నేను పేజీలోకి వెళ్ళి 'ఈ ఫోన్‌లోని నా డేటాను తొలగించు' నొక్కితే అన్ని ఇష్టాలు వెంటనే చెరిగిపోతాయి.",
    },
    termsTitle: { en: "Terms of Play (Draft)", te: "ఆట నిబంధనలు (డ్రాఫ్ట్)" },
    termsBody: {
      en: "All games are free party games for friends. Auctions use pretend coins only. No real money, payments, wallets or prizes ever exist here.",
      te: "అన్ని గేమ్స్ ఫ్రెండ్స్ కోసం ఉచిత పార్టీ గేమ్స్. వేలాలు ఆట నాణేలతో మాత్రమే. నిజమైన డబ్బు, చెల్లింపులు, వాలెట్లు, బహుమతులు ఇక్కడ ఎప్పుడూ ఉండవు.",
    },
    termsHeadingRules: { en: "Fair play and fan content", te: "నిజాయితీ ఆట, అభిమాన కంటెంట్" },
    termsRules: {
      en: "Film titles, actor names, and clues are used purely for friendly trivia and party charades.",
      te: "సినిమా పేర్లు, నటుల పేర్లు, క్లూస్ కేవలం స్నేహితుల సరదా ఆటల కోసం మాత్రమే.",
    },
    termsHeadingLiability: { en: "As-is beta service", te: "బీటా సేవ" },
    termsLiability: {
      en: "This beta is provided as-is for entertainment. Play safely and avoid looking at your phone while driving.",
      te: "ఈ బీటా వినోదం కోసం అందించబడింది. సురక్షితంగా ఆడండి, డ్రైవింగ్ చేస్తూ ఫోన్ చూడకండి.",
    },
    offlineTitle: { en: "You are offline", te: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు" },
    offlineBody: {
      en: "Pass-around-phone games keep working without internet once you have opened them.",
      te: "ఒకే ఫోన్ గేమ్స్ ఒకసారి తెరిచిన తర్వాత ఇంటర్నెట్ లేకుండానే పనిచేస్తాయి.",
    },
    joinBadge: { en: "Online rooms · 4-letter code", te: "ఆన్‌లైన్ రూమ్స్ · 4 అక్షరాల కోడ్" },
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
    meVibration: { en: "Vibration", te: "వైబ్రేషన్" },
    meReducedMotion: { en: "Calm mode", te: "కామ్ మోడ్" },
    meCalmHint: {
      en: "Turns off auto-playing demos, confetti and sounds. Follows Reduced Motion automatically.",
      te: "ఆటో-ప్లే డెమో, కాన్ఫెట్టి, శబ్దాలను ఆపుతుంది. ఫోన్ కదలిక సెట్టింగ్‌ను అనుసరిస్తుంది.",
    },
    meLargeText: { en: "Large text", te: "పెద్ద అక్షరాలు" },
    meClearData: { en: "Clear my data on this device", te: "ఈ ఫోన్‌లోని నా డేటాను తొలగించు" },
    meClearConfirmTitle: { en: "Clear all device data?", te: "ఫోన్‌లోని డేటా అంతా తొలగించాలా?" },
    meClearConfirmBody: {
      en: "This resets your device name, language, sound, vibration, motion, and text-size preferences.",
      te: "ఇది మీ పరికరం పేరు, భాష, శబ్దం, వైబ్రేషన్, కదలిక, అక్షరాల పరిమాణం ఇష్టాలను రీసెట్ చేస్తుంది.",
    },
    meClearConfirmBtn: { en: "Yes, clear data", te: "అవును, తొలగించు" },
    meClearCancelBtn: { en: "Cancel", te: "రద్దు చేయి" },
    meCleared: { en: "Device data cleared.", te: "ఫోన్ డేటా తొలగించబడింది." },
    meVersion: { en: "App version", te: "యాప్ వెర్షన్" },
    notFoundTitle: { en: "Page not found", te: "పేజీ దొరకలేదు" },
    notFoundBody: {
      en: "That card isn't in the deck. Let's head back to the games.",
      te: "ఈ కార్డ్ డెక్‌లో లేదు. తిరిగి ఆటల దగ్గరకు వెళ్దాం.",
    },
    errorTitle: { en: "Something went wrong", te: "ఏదో తప్పు జరిగింది" },
    errorBody: {
      en: "The round hit a snag. Try again or return to Play Home.",
      te: "రౌండ్‌లో చిన్న ఆటంకం వచ్చింది. మళ్ళీ ప్రయత్నించండి లేదా ఆట హోమ్‌కు వెళ్ళండి.",
    },
    errorRetry: { en: "Try again", te: "మళ్ళీ ప్రయత్నించండి" },
    sendFeedback: { en: "Send feedback", te: "అభిప్రాయం పంపండి" },
    on: { en: "On", te: "ఉంది" },
    off: { en: "Off", te: "లేదు" },
    roomNewBadge: { en: "Wave 2 · Online rooms", te: "వేవ్ 2 · ఆన్‌లైన్ రూమ్స్" },
    roomNewTitle: { en: "Create an online room", te: "ఆన్‌లైన్ రూమ్ తయారు చేయండి" },
    roomNewBody: {
      en: "Online rooms arrive in a later phase.",
      te: "ఆన్‌లైన్ రూమ్స్ తర్వాతి దశలో వస్తాయి.",
    },
    roomPreview: { en: "Preview room K7QM", te: "K7QM రూమ్ చూడండి" },
    roomTitle: { en: "Box Office Auction · Room {code}", te: "బాక్స్ ఆఫీస్ ఆక్షన్ · రూమ్ {code}" },
    lotOf: { en: "Lot 3 of 10", te: "లాట్ 3 / 10" },
    bidLabel: { en: "Current bid (game coins)", te: "ప్రస్తుత వేలం (ఆట నాణేలు)" },
  },
  consent: {
    question: {
      en: "Help us improve: share anonymous usage counts?",
      te: "యాప్ మెరుగుపరచడానికి సహాయం చేయండి: అనామక వినియోగ గణాంకాలు పంచుకోవాలా?",
    },
    yes: { en: "Yes", te: "అవును" },
    no: { en: "No", te: "వద్దు" },
  },
  pwa: {
    installTitle: { en: "Add to home screen", te: "హోమ్ స్క్రీన్‌కు జోడించండి" },
    installBody: {
      en: "Play offline anytime like an app.",
      te: "యాప్ లాగా ఎప్పుడైనా ఆఫ్‌లైన్‌లో ఆడండి.",
    },
    installBtn: { en: "Add to home screen", te: "జోడించండి" },
    notNow: { en: "Not now", te: "ఇప్పుడు కాదు" },
    iosTitle: { en: "Add on iPhone", te: "ఐఫోన్‌లో జోడించండి" },
    iosStep1: {
      en: "1. Tap the Share button at the bottom of Safari.",
      te: "1. Safari కింద ఉన్న Share బటన్‌ను నొక్కండి.",
    },
    iosStep2: {
      en: "2. Scroll and tap 'Add to Home Screen'.",
      te: "2. కిందికి స్క్రోల్ చేసి 'Add to Home Screen' నొక్కండి.",
    },
    iosClose: { en: "Got it", te: "అర్థమైంది" },
    readyOffline: { en: "Ready offline", te: "ఆఫ్‌లైన్‌లో సిద్ధం" },
    offlineSavedHeading: { en: "Games saved offline", te: "ఆఫ్‌లైన్‌లో సేవ్ చేసిన ఆటలు" },
    offlineNoneSaved: {
      en: "Open any game once while online to save it for offline play.",
      te: "ఆఫ్‌లైన్‌లో ఆడటానికి ఆన్‌లైన్‌లో ఉన్నప్పుడు ఒకసారి ఏదైనా ఆటను తెరవండి.",
    },
    swUpdateBanner: { en: "New version ready.", te: "కొత్త వెర్షన్ సిద్ధంగా ఉంది." },
    swRefreshBtn: { en: "Refresh", te: "రిఫ్రెష్" },
  },
  health: {
    title: { en: "System health", te: "సిస్టమ్ ఆరోగ్యం" },
    status: { en: "Status: Healthy", te: "స్థితి: బాగుంది" },
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
    modeKey: "onePhone",
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
    modeKey: "onePhone",
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
