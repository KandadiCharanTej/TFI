export interface Movie {
  id: string;
  titleTelugu: string;
  titleEnglish: string;
  year: number;
  category: 'Commercial' | 'Mass Action' | 'Comedy' | 'Romantic' | 'Cult Classic' | 'Pan-India';
  director: string;
  hero: string;
  heroine?: string;
  musicDirector: string;
  trivia?: string;
  ratingTier: 'Blockbuster' | 'Industry Hit' | 'Super Hit' | 'Cult Classic' | 'Average';
  // Auction specific metrics (1 to 100)
  boxOfficeScore: number; // 40% weight
  audienceScore: number;  // 30% weight
  cultScore: number;      // 30% weight
  basePriceCr: number;    // Starting bid in Crores
}

export interface HeadSetGoCard {
  id: string;
  type: 'Movie' | 'Actor' | 'Dialogue' | 'Character';
  telugu: string;
  english: string;
  clues: string[];
  era: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TransifyItem {
  id: string;
  funnyTranslation: string;
  actualMovieTelugu: string;
  actualMovieEnglish: string;
  hint: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface DumbCharadesItem {
  id: string;
  movieTelugu: string;
  movieEnglish: string;
  year: number;
  hero: string;
  hint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface EmojiCinemaItem {
  id: string;
  emojis: string;
  options: {
    telugu: string;
    english: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AuctionLot extends Movie {
  lotNumber: number;
  currentBid: number;
  highestBidderId: string | null;
  highestBidderName: string | null;
  status: 'upcoming' | 'bidding' | 'sold' | 'unsold';
}
