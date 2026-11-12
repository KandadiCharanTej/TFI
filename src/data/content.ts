import { Movie, HeadSetGoCard, TransifyItem, DumbCharadesItem, EmojiCinemaItem } from '@/types';

export const TELUGU_MOVIES: Movie[] = [
  {
    id: 'm1',
    titleTelugu: 'పోకిరి',
    titleEnglish: 'Pokiri',
    year: 2006,
    category: 'Commercial',
    director: 'Puri Jagannadh',
    hero: 'Mahesh Babu',
    heroine: 'Ileana',
    musicDirector: 'Mani Sharma',
    ratingTier: 'Industry Hit',
    trivia: 'Redefined mass commercial cinema and ran for 500+ days in Kurnool.',
    boxOfficeScore: 98,
    audienceScore: 96,
    cultScore: 99,
    basePriceCr: 15,
  },
  {
    id: 'm2',
    titleTelugu: 'మగధీర',
    titleEnglish: 'Magadheera',
    year: 2009,
    category: 'Mass Action',
    director: 'S. S. Rajamouli',
    hero: 'Ram Charan',
    heroine: 'Kajal Aggarwal',
    musicDirector: 'M. M. Keeravani',
    ratingTier: 'Industry Hit',
    trivia: 'First Telugu film to cross 100 days in over 300 centres.',
    boxOfficeScore: 99,
    audienceScore: 97,
    cultScore: 95,
    basePriceCr: 20,
  },
  {
    id: 'm3',
    titleTelugu: 'బాహుబలి: ది బిగినింగ్',
    titleEnglish: 'Baahubali: The Beginning',
    year: 2015,
    category: 'Pan-India',
    director: 'S. S. Rajamouli',
    hero: 'Prabhas',
    heroine: 'Anushka Shetty',
    musicDirector: 'M. M. Keeravani',
    ratingTier: 'Industry Hit',
    trivia: 'Put Telugu cinema firmly on the global cinematic map.',
    boxOfficeScore: 100,
    audienceScore: 98,
    cultScore: 96,
    basePriceCr: 25,
  },
  {
    id: 'm4',
    titleTelugu: 'అతడు',
    titleEnglish: 'Athadu',
    year: 2005,
    category: 'Cult Classic',
    director: 'Trivikram Srinivas',
    hero: 'Mahesh Babu',
    heroine: 'Trisha',
    musicDirector: 'Mani Sharma',
    ratingTier: 'Cult Classic',
    trivia: 'One of the highest-rated TV repeated movies in Telugu television history.',
    boxOfficeScore: 82,
    audienceScore: 96,
    cultScore: 100,
    basePriceCr: 12,
  },
  {
    id: 'm5',
    titleTelugu: 'గబ్బర్ సింగ్',
    titleEnglish: 'Gabbar Singh',
    year: 2012,
    category: 'Mass Action',
    director: 'Harish Shankar',
    hero: 'Pawan Kalyan',
    heroine: 'Shruti Haasan',
    musicDirector: 'Devi Sri Prasad',
    ratingTier: 'Blockbuster',
    trivia: 'Sensational comeback film celebrating Pawan Kalyan mania.',
    boxOfficeScore: 94,
    audienceScore: 93,
    cultScore: 92,
    basePriceCr: 15,
  },
  {
    id: 'm6',
    titleTelugu: 'ఈ నగరానికి ఏమైంది',
    titleEnglish: 'Ee Nagaraniki Emaindi',
    year: 2018,
    category: 'Comedy',
    director: 'Tharun Bhascker',
    hero: 'Vishwak Sen',
    musicDirector: 'Vivek Sagar',
    ratingTier: 'Cult Classic',
    trivia: 'The undisputed buddy-comedy anthem for Telugu youth.',
    boxOfficeScore: 78,
    audienceScore: 94,
    cultScore: 98,
    basePriceCr: 8,
  },
  {
    id: 'm7',
    titleTelugu: 'ఖుషి',
    titleEnglish: 'Kushi',
    year: 2001,
    category: 'Romantic',
    director: 'S. J. Suryah',
    hero: 'Pawan Kalyan',
    heroine: 'Bhumika Chawla',
    musicDirector: 'Mani Sharma',
    ratingTier: 'Industry Hit',
    trivia: 'Iconic romance featuring legendary interval waist scene.',
    boxOfficeScore: 95,
    audienceScore: 97,
    cultScore: 98,
    basePriceCr: 14,
  },
  {
    id: 'm8',
    titleTelugu: 'ఆర్ఆర్ఆర్',
    titleEnglish: 'RRR',
    year: 2022,
    category: 'Pan-India',
    director: 'S. S. Rajamouli',
    hero: 'NTR Jr & Ram Charan',
    heroine: 'Alia Bhatt',
    musicDirector: 'M. M. Keeravani',
    ratingTier: 'Industry Hit',
    trivia: 'Oscar winner for Best Original Song "Naatu Naatu".',
    boxOfficeScore: 100,
    audienceScore: 99,
    cultScore: 98,
    basePriceCr: 30,
  },
  {
    id: 'm9',
    titleTelugu: 'మన్మథుడు',
    titleEnglish: 'Manmadhudu',
    year: 2002,
    category: 'Comedy',
    director: 'K. Vijaya Bhaskar',
    hero: 'Nagarjuna',
    heroine: 'Sonali Bendre',
    musicDirector: 'Devi Sri Prasad',
    ratingTier: 'Super Hit',
    trivia: 'Trivikram dialogue gem with timeless comedy punches.',
    boxOfficeScore: 88,
    audienceScore: 95,
    cultScore: 97,
    basePriceCr: 10,
  },
  {
    id: 'm10',
    titleTelugu: 'పుష్ప: ది రైజ్',
    titleEnglish: 'Pushpa: The Rise',
    year: 2021,
    category: 'Pan-India',
    director: 'Sukumar',
    hero: 'Allu Arjun',
    heroine: 'Rashmika Mandanna',
    musicDirector: 'Devi Sri Prasad',
    ratingTier: 'Blockbuster',
    trivia: 'National Award-winning performance with wildfire catchphrases.',
    boxOfficeScore: 97,
    audienceScore: 95,
    cultScore: 96,
    basePriceCr: 20,
  },
  {
    id: 'm11',
    titleTelugu: 'జాతి రత్నాలు',
    titleEnglish: 'Jathi Ratnalu',
    year: 2021,
    category: 'Comedy',
    director: 'Anudeep K.V.',
    hero: 'Naveen Polishetty',
    heroine: 'Faria Abdullah',
    musicDirector: 'Radhan',
    ratingTier: 'Blockbuster',
    trivia: 'Non-stop laugh riot that conquered post-pandemic box office.',
    boxOfficeScore: 89,
    audienceScore: 91,
    cultScore: 92,
    basePriceCr: 10,
  },
  {
    id: 'm12',
    titleTelugu: 'అర్జున్ రెడ్డి',
    titleEnglish: 'Arjun Reddy',
    year: 2017,
    category: 'Cult Classic',
    director: 'Sandeep Reddy Vanga',
    hero: 'Vijay Deverakonda',
    heroine: 'Shalini Pandey',
    musicDirector: 'Radhan',
    ratingTier: 'Cult Classic',
    trivia: 'Groundbreaking raw romantic drama that sparked nationwide trends.',
    boxOfficeScore: 90,
    audienceScore: 92,
    cultScore: 96,
    basePriceCr: 14,
  }
];

export const HEAD_SET_GO_DATA: HeadSetGoCard[] = [
  {
    id: 'hsg1',
    type: 'Movie',
    telugu: 'పోకిరి',
    english: 'Pokiri',
    clues: ['Mahesh Babu', 'Ileana', 'Puri Jagannadh', 'Evadu Kodithe Dhimma Thirigi'],
    era: '2000s',
    difficulty: 'Easy'
  },
  {
    id: 'hsg2',
    type: 'Dialogue',
    telugu: 'ఒక్కసారి కమిట్ అయితే నా మాట నేనే వినను',
    english: 'Okkasari commit ayithe na maata nene vinanu',
    clues: ['Pokiri', 'Mahesh Babu dialogue', 'Station scene', 'Pandu'],
    era: '2000s',
    difficulty: 'Easy'
  },
  {
    id: 'hsg3',
    type: 'Actor',
    telugu: 'పవన్ కళ్యాణ్',
    english: 'Pawan Kalyan',
    clues: ['Power Star', 'Kushi', 'Gabbar Singh', 'Jana Sena'],
    era: 'All-time',
    difficulty: 'Easy'
  },
  {
    id: 'hsg4',
    type: 'Character',
    telugu: 'కట్టప్ప',
    english: 'Kattappa',
    clues: ['Baahubali', 'Sathyaraj', 'Why did he kill Baahubali?', 'Mahishmati slave'],
    era: '2010s',
    difficulty: 'Easy'
  },
  {
    id: 'hsg5',
    type: 'Movie',
    telugu: 'ఈ నగరానికి ఏమైంది',
    english: 'Ee Nagaraniki Emaindi',
    clues: ['Goa trip', 'Vivek Sagar music', 'Kaushik, Vivek, Karthik, Upen', 'Tharun Bhascker'],
    era: '2010s',
    difficulty: 'Medium'
  },
  {
    id: 'hsg6',
    type: 'Dialogue',
    telugu: 'తగ్గేదే లే!',
    english: 'Thaggedhe Le!',
    clues: ['Pushpa', 'Allu Arjun signature gesture', 'Red sanders', 'Beard rubbing'],
    era: '2020s',
    difficulty: 'Easy'
  },
  {
    id: 'hsg7',
    type: 'Character',
    telugu: 'భళ్ళాలదేవ',
    english: 'Bhallaladeva',
    clues: ['Rana Daggubati', 'Baahubali brother', 'Mace weapon', 'Chariot with blades'],
    era: '2010s',
    difficulty: 'Medium'
  },
  {
    id: 'hsg8',
    type: 'Movie',
    telugu: 'మాయాబజార్',
    english: 'Mayabazar',
    clues: ['S.V. Ranga Rao', 'NTR as Krishna', 'Ghatotkacha', 'Laddus flying into mouth'],
    era: 'Vintage',
    difficulty: 'Medium'
  },
  {
    id: 'hsg9',
    type: 'Actor',
    telugu: 'చిరంజీవి',
    english: 'Chiranjeevi',
    clues: ['Megastar', 'Indra', 'Gang Leader', 'Break dance icon'],
    era: 'All-time',
    difficulty: 'Easy'
  },
  {
    id: 'hsg10',
    type: 'Movie',
    telugu: 'అల వైకుంఠపురములో',
    english: 'Ala Vaikunthapurramuloo',
    clues: ['Allu Arjun', 'Samajavaragamana', 'Boardroom dance', 'Trivikram'],
    era: '2020s',
    difficulty: 'Easy'
  }
];

export const TRANSIFY_DATA: TransifyItem[] = [
  {
    id: 'tr1',
    funnyTranslation: 'The Federal Rogue / The Uncontrollable Thug',
    actualMovieTelugu: 'పోకిరి',
    actualMovieEnglish: 'Pokiri',
    hint: 'Mahesh Babu & Puri Jagannadh blockbuster.',
    explanation: 'Pokiri literally means a rogue, scoundrel or hooligan.',
    difficulty: 'Easy'
  },
  {
    id: 'tr2',
    funnyTranslation: 'That Guy (Him)',
    actualMovieTelugu: 'అతడు',
    actualMovieEnglish: 'Athadu',
    hint: 'Mani Sharma music, Trisha, Mahesh Babu as assassin.',
    explanation: 'Athadu translates directly to "Him" or "That Guy".',
    difficulty: 'Easy'
  },
  {
    id: 'tr3',
    funnyTranslation: 'Great Brave Warrior of Heroism',
    actualMovieTelugu: 'మగధీర',
    actualMovieEnglish: 'Magadheera',
    hint: '100 warriors battle scene by Rajamouli.',
    explanation: 'Maga (valour/manly) + Dheera (brave soul) = Magadheera.',
    difficulty: 'Medium'
  },
  {
    id: 'tr4',
    funnyTranslation: 'God of Love / Cupidity Charmer',
    actualMovieTelugu: 'మన్మథుడు',
    actualMovieEnglish: 'Manmadhudu',
    hint: 'Nagarjuna advertising agency manager who claims to hate women.',
    explanation: 'Manmadhudu is Kamadeva / God of love in Hindu folklore.',
    difficulty: 'Medium'
  },
  {
    id: 'tr5',
    funnyTranslation: 'Jewels of the Nation / Gemstones of the Race',
    actualMovieTelugu: 'జాతి రత్నాలు',
    actualMovieEnglish: 'Jathi Ratnalu',
    hint: 'Jogipet boys in Chanchalguda jail with chicken 65.',
    explanation: 'Jathi = Nation/kind, Ratnalu = Jewels.',
    difficulty: 'Easy'
  },
  {
    id: 'tr6',
    funnyTranslation: 'What Happened to this Metropolis?',
    actualMovieTelugu: 'ఈ నగరానికి ఏమైంది',
    actualMovieEnglish: 'Ee Nagaraniki Emaindi',
    hint: 'Smoking warning ad title turned into a youth cult cinema title.',
    explanation: 'Derived directly from the famous anti-smoking PSA.',
    difficulty: 'Easy'
  },
  {
    id: 'tr7',
    funnyTranslation: 'The Man with One Hundred Arms / The Mighty Armed',
    actualMovieTelugu: 'బాహుబలి',
    actualMovieEnglish: 'Baahubali',
    hint: 'Why Kattappa killed him is world famous.',
    explanation: 'Baahu = Arms, Bali = Mighty / Powerful.',
    difficulty: 'Easy'
  },
  {
    id: 'tr8',
    funnyTranslation: 'The Flower / Red Sanders Smuggler',
    actualMovieTelugu: 'పుష్ప',
    actualMovieEnglish: 'Pushpa',
    hint: '"Pushpa means flower? No, Fire!"',
    explanation: 'Pushpa means flower in Telugu/Sanskrit.',
    difficulty: 'Easy'
  }
];

export const DUMB_CHARADES_DATA: DumbCharadesItem[] = [
  {
    id: 'dc1',
    movieTelugu: 'అరుంధతి',
    movieEnglish: 'Arundhati',
    year: 2009,
    hero: 'Anushka Shetty',
    hint: 'Pasupathi, evil spirit, mirror scenes and trishool.',
    difficulty: 'Easy'
  },
  {
    id: 'dc2',
    movieTelugu: 'సీతమ్మ వాకిట్లో సిరిమల్లె చెట్టు',
    movieEnglish: 'Seethamma Vakitlo Sirimalle Chettu',
    year: 2013,
    hero: 'Venkatesh & Mahesh Babu',
    hint: 'Very long title, multi-starrer, family smile, godavari slang.',
    difficulty: 'Hard'
  },
  {
    id: 'dc3',
    movieTelugu: 'అహ నా పెళ్ళంట!',
    movieEnglish: 'Aha Naa Pellanta!',
    year: 1987,
    hero: 'Rajendra Prasad / Kota Srinivasa Rao',
    hint: 'Frugal miser hanging dry fish for dinner aroma.',
    difficulty: 'Medium'
  },
  {
    id: 'dc4',
    movieTelugu: 'గబ్బర్ సింగ్',
    movieEnglish: 'Gabbar Singh',
    year: 2012,
    hero: 'Pawan Kalyan',
    hint: 'Police mustache, antakshari police station, belt swing.',
    difficulty: 'Easy'
  },
  {
    id: 'dc5',
    movieTelugu: 'కిక్',
    movieEnglish: 'Kick',
    year: 2009,
    hero: 'Ravi Teja',
    hint: 'Searching for excitement/kick in every mundane job.',
    difficulty: 'Easy'
  },
  {
    id: 'dc6',
    movieTelugu: 'చంటి',
    movieEnglish: 'Chanti',
    year: 1992,
    hero: 'Venkatesh',
    hint: 'Innocent childish hero with parrot and sling bag.',
    difficulty: 'Medium'
  },
  {
    id: 'dc7',
    movieTelugu: 'మగధీర',
    movieEnglish: 'Magadheera',
    year: 2009,
    hero: 'Ram Charan',
    hint: '100 warriors cliff fight, horse jumping over helicopter.',
    difficulty: 'Easy'
  },
  {
    id: 'dc8',
    movieTelugu: 'ఆర్ఆర్ఆర్',
    movieEnglish: 'RRR',
    year: 2022,
    hero: 'NTR Jr & Ram Charan',
    hint: 'Tiger fight, bridge rescue, suspenders Naatu dance.',
    difficulty: 'Easy'
  }
];

export const EMOJI_CINEMA_DATA: EmojiCinemaItem[] = [
  {
    id: 'ec1',
    emojis: '🌺 🔥 🪓 🌲 💰',
    options: [
      { telugu: 'పుష్ప: ది రైజ్', english: 'Pushpa: The Rise', isCorrect: true },
      { telugu: 'అడవి రాముడు', english: 'Adavi Ramudu', isCorrect: false },
      { telugu: 'రంగస్థలం', english: 'Rangasthalam', isCorrect: false },
      { telugu: 'కాంతార', english: 'Kantara', isCorrect: false }
    ],
    explanation: 'Flower (Pushpa) + Fire (Thaggedhe le) + Axe + Red Sandalwood Trees!',
    difficulty: 'Easy'
  },
  {
    id: 'ec2',
    emojis: '💪 👑 🗡️ 🐘 🩸',
    options: [
      { telugu: 'మగధీర', english: 'Magadheera', isCorrect: false },
      { telugu: 'బాహుబలి', english: 'Baahubali', isCorrect: true },
      { telugu: 'రుద్రమదేవి', english: 'Rudramadevi', isCorrect: false },
      { telugu: 'సైరా నరసింహారెడ్డి', english: 'Sye Raa', isCorrect: false }
    ],
    explanation: 'Biceps/Strength (Baahu) + King Crown + Sword + Royal Elephant = Baahubali.',
    difficulty: 'Easy'
  },
  {
    id: 'ec3',
    emojis: '🍺 🚗 🏖️ 🎬 🍻',
    options: [
      { telugu: 'ఈ నగరానికి ఏమైంది', english: 'Ee Nagaraniki Emaindi', isCorrect: true },
      { telugu: 'పెళ్లి చూపులు', english: 'Pelli Choopulu', isCorrect: false },
      { telugu: 'జాతి రత్నాలు', english: 'Jathi Ratnalu', isCorrect: false },
      { telugu: 'హ్యాపీ డేస్', english: 'Happy Days', isCorrect: false }
    ],
    explanation: 'Goa road trip + Car ride + Beach + Short film directing = ENE!',
    difficulty: 'Medium'
  },
  {
    id: 'ec4',
    emojis: '👮 🕶️ 🔫 🥊 🏢',
    options: [
      { telugu: 'దూకుడు', english: 'Dookudu', isCorrect: false },
      { telugu: 'పోకిరి', english: 'Pokiri', isCorrect: true },
      { telugu: 'సింగం', english: 'Singam', isCorrect: false },
      { telugu: 'గబ్బర్ సింగ్', english: 'Gabbar Singh', isCorrect: false }
    ],
    explanation: 'Undercover cop disguised as local goon Pandu in mafia real estate = Pokiri.',
    difficulty: 'Easy'
  },
  {
    id: 'ec5',
    emojis: '🌾 👂 📻 🪓 🚜',
    options: [
      { telugu: 'రంగస్థలం', english: 'Rangasthalam', isCorrect: true },
      { telugu: 'మహర్షి', english: 'Maharshi', isCorrect: false },
      { telugu: 'శ్రీమంతుడు', english: 'Srimanthudu', isCorrect: false },
      { telugu: 'దసరా', english: 'Dasara', isCorrect: false }
    ],
    explanation: 'Village fields + Hearing impairment (Chitti Babu) + Retro radio + Water motor!',
    difficulty: 'Medium'
  },
  {
    id: 'ec6',
    emojis: '🕺 💃 🌾 🪢 🚂',
    options: [
      { telugu: 'ఖుషి', english: 'Kushi', isCorrect: true },
      { telugu: 'తమ్ముడు', english: 'Thammudu', isCorrect: false },
      { telugu: 'బద్రి', english: 'Badri', isCorrect: false },
      { telugu: 'జల్సా', english: 'Jalsa', isCorrect: false }
    ],
    explanation: 'Pawan Kalyan & Bhumika Kolkata station, waist gap incident and epic romance = Kushi.',
    difficulty: 'Medium'
  }
];
