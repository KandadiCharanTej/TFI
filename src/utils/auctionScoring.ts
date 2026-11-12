import { TeluguMovie, AuctionPlayer } from '@/types';

export interface MovieScoreBreakdown {
  movieId: string;
  movieTitle: string;
  year: number;
  hero: string;
  purchasePriceCr: number;
  boScore: number;
  talkScore: number;
  cultScore: number;
  basePoints: number; // 0.4*bo + 0.3*talk + 0.3*cult
  synergyBonus: number;
  penalty: number;
  totalMoviePoints: number;
  tags: string[];
}

export interface PlayerFinalScore {
  player: AuctionPlayer;
  rank: number;
  collectionScore: number;
  rawMoviePoints: number;
  synergyBonuses: number;
  penalties: number;
  budgetEfficiencyScore: number; // Score / Spent ratio
  remainingPurseCr: number;
  totalSpentCr: number;
  lotsWonCount: number;
  breakdowns: MovieScoreBreakdown[];
  achievements: string[];
}

export function calculateAuctionScores(players: AuctionPlayer[]): PlayerFinalScore[] {
  const scoredPlayers: PlayerFinalScore[] = players.map(p => {
    let rawMoviePoints = 0;
    let synergyBonuses = 0;
    let penalties = 0;
    const achievements: string[] = [];

    // Analyze movie lots
    const breakdowns: MovieScoreBreakdown[] = p.wonLots.map(movie => {
      const lot = movie.auctionLot || {
        boScore: 70,
        talkScore: 70,
        cultScore: 70,
        synergyTags: [],
        basePriceCr: 10,
        pool: 'balanced',
        tagline: '',
      };

      // 40% BO + 30% Talk + 30% Cult
      const basePoints = Math.round(lot.boScore * 0.4 + lot.talkScore * 0.3 + lot.cultScore * 0.3);
      rawMoviePoints += basePoints;

      let movieSynergy = 0;
      let moviePenalty = 0;

      // Check for disaster traps
      if (lot.isTrap) {
        moviePenalty += 15;
        penalties += 15;
      }

      return {
        movieId: movie.id,
        movieTitle: movie.englishTitle,
        year: movie.year,
        hero: movie.hero,
        purchasePriceCr: 0, // Assigned per player lot
        boScore: lot.boScore,
        talkScore: lot.talkScore,
        cultScore: lot.cultScore,
        basePoints,
        synergyBonus: movieSynergy,
        penalty: moviePenalty,
        totalMoviePoints: basePoints + movieSynergy - moviePenalty,
        tags: lot.synergyTags,
      };
    });

    // Synergies detection across won collection
    const allTags = p.wonLots.flatMap(m => m.auctionLot?.synergyTags || []);
    const directors = p.wonLots.map(m => m.director);
    const heroes = p.wonLots.map(m => m.hero);

    // SSR Titan Synergy (+20 pts if 2+ Rajamouli movies)
    const ssrCount = allTags.filter(t => t.includes('SSR')).length;
    if (ssrCount >= 2) {
      synergyBonuses += 20;
      achievements.push('🦅 SSR Titan Combo (+20 pts)');
    }

    // Trivikram-Bob Synergy
    const hasTrivikram = directors.some(d => d.includes('Trivikram'));
    const hasBob = heroes.some(h => h.includes('Mahesh'));
    if (hasTrivikram && hasBob) {
      synergyBonuses += 15;
      achievements.push('☕ Trivikram × Bob Synergy (+15 pts)');
    }

    // Sukumar-AlluArjun Synergy
    const hasSukumar = directors.some(d => d.includes('Sukumar'));
    const hasAA = heroes.some(h => h.includes('Allu Arjun'));
    if (hasSukumar && hasAA) {
      synergyBonuses += 15;
      achievements.push('🔥 Pushpa Raj × Sukumar Syndicate (+15 pts)');
    }

    // Brahmi Comic King Synergy
    const brahmiCount = allTags.filter(t => t.includes('Brahmi')).length;
    if (brahmiCount >= 2) {
      synergyBonuses += 15;
      achievements.push('👑 King of Comedy Brahmi Pack (+15 pts)');
    }

    // Meme Lord Bonus: If player won 2 or more meme traps!
    const trapCount = p.wonLots.filter(m => m.auctionLot?.isTrap).length;
    if (trapCount >= 2) {
      // Offset penalties and reward boldness
      synergyBonuses += 30;
      achievements.push('🤡 Cult Meme Lord: Collected Disasters (+30 pts)');
    }

    // Big Budget remaining bonus
    const budgetBonus = Math.floor(p.purseCr / 10);
    if (budgetBonus > 0) {
      achievements.push(`💰 Smart Treasury: ₹${p.purseCr} Cr left (+${budgetBonus} pts)`);
    }

    const collectionScore = Math.max(0, rawMoviePoints + synergyBonuses - penalties + budgetBonus);
    const budgetEfficiencyScore = p.totalSpentCr > 0 ? Number((collectionScore / p.totalSpentCr).toFixed(2)) : 0;

    return {
      player: p,
      rank: 1, // Will be sorted below
      collectionScore,
      rawMoviePoints,
      synergyBonuses,
      penalties,
      budgetEfficiencyScore,
      remainingPurseCr: p.purseCr,
      totalSpentCr: p.totalSpentCr,
      lotsWonCount: p.wonLots.length,
      breakdowns,
      achievements,
    };
  });

  // Sort descending by collection score
  scoredPlayers.sort((a, b) => b.collectionScore - a.collectionScore);

  // Assign ranks
  scoredPlayers.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  return scoredPlayers;
}
