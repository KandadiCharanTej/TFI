import { Movie, AuctionLot } from '@/types';
export type { AuctionLot };

export interface AuctionPlayer {
  id: string;
  name: string;
  initialBudget: number;
  remainingBudget: number;
  acquiredLots: AuctionLot[];
  totalScore: number;
}

export interface AuctionConfig {
  budgetPresetCr: number;
  bidIncrementCr: number;
  antiSnipSeconds: number;
  timerDurationSeconds: number;
  lotCount: number;
}

/**
 * Calculates the collection score for an auction winner based on:
 * - 40% Box Office Performance
 * - 30% Audience Reception
 * - 30% Cult Repeat Value
 * Plus bonus points for genre diversity and director variety!
 */
export function calculateMovieScore(movie: Movie): number {
  const base =
    movie.boxOfficeScore * 0.4 +
    movie.audienceScore * 0.3 +
    movie.cultScore * 0.3;
  return Math.round(base);
}

export function calculatePlayerCollectionScore(player: AuctionPlayer): {
  baseScore: number;
  diversityBonus: number;
  totalScore: number;
  valueForMoney: number;
} {
  if (player.acquiredLots.length === 0) {
    return { baseScore: 0, diversityBonus: 0, totalScore: 0, valueForMoney: 0 };
  }

  const baseScore = player.acquiredLots.reduce(
    (sum, lot) => sum + calculateMovieScore(lot),
    0
  );

  // Genre diversity bonus: +5 pts per unique category beyond 1
  const uniqueGenres = new Set(player.acquiredLots.map((l) => l.category));
  const diversityBonus = Math.max(0, (uniqueGenres.size - 1) * 5);

  const totalScore = baseScore + diversityBonus;

  // Value for money: score per crore spent
  const totalSpent = player.initialBudget - player.remainingBudget;
  const valueForMoney = totalSpent > 0 ? Number((totalScore / totalSpent).toFixed(2)) : 0;

  return {
    baseScore,
    diversityBonus,
    totalScore,
    valueForMoney,
  };
}

/**
 * Validates a submitted bid.
 * Returns { valid: boolean, error?: string }
 */
export function validateBid(
  bidAmount: number,
  currentHighestBid: number,
  minIncrement: number,
  playerRemainingBudget: number,
  lotBasePrice: number
): { valid: boolean; error?: string } {
  if (bidAmount > playerRemainingBudget) {
    return { valid: false, error: 'Bid exceeds remaining purse budget!' };
  }

  const minRequiredBid = currentHighestBid > 0 ? currentHighestBid + minIncrement : lotBasePrice;
  if (bidAmount < minRequiredBid) {
    return {
      valid: false,
      error: `Bid must be at least ₹${minRequiredBid} Cr (min increment ₹${minIncrement} Cr).`,
    };
  }

  return { valid: true };
}
