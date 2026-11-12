import { AuctionRoomState, AuctionPlayer, TeluguMovie } from '@/types';
import { getAuctionLotsPool } from '@/data/teluguCinemaDatabase';
import { calculateAuctionScores } from '@/utils/auctionScoring';

// Global in-memory storage for active multiplayer rooms
declare global {
  // eslint-disable-next-line no-var
  var __TFI_AUCTION_ROOMS__: Map<string, AuctionRoomState> | undefined;
}

if (!global.__TFI_AUCTION_ROOMS__) {
  global.__TFI_AUCTION_ROOMS__ = new Map<string, AuctionRoomState>();
}

const rooms = global.__TFI_AUCTION_ROOMS__;

// Helper to generate 5-character alphanumeric room codes
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createRoom(
  hostPlayer: { id: string; name: string; fanIdentity: string },
  options: {
    poolType: 'balanced' | 'nostalgia' | 'tier1' | 'chaos';
    startingPurseCr: number;
    maxLots: number;
  }
): AuctionRoomState {
  let roomCode = generateRoomCode();
  while (rooms.has(roomCode)) {
    roomCode = generateRoomCode();
  }

  const lots = getAuctionLotsPool(options.poolType, options.maxLots);

  const initialPlayer: AuctionPlayer = {
    id: hostPlayer.id,
    name: hostPlayer.name || 'Host Producer',
    fanIdentity: (hostPlayer.fanIdentity as any) || 'bhAAi',
    purseCr: options.startingPurseCr,
    initialPurseCr: options.startingPurseCr,
    wonLots: [],
    totalSpentCr: 0,
    isFolded: false,
  };

  const room: AuctionRoomState = {
    roomCode,
    hostId: hostPlayer.id,
    status: 'lobby',
    currentLotIndex: 0,
    lots,
    currentBidCr: lots[0]?.auctionLot?.basePriceCr || 10,
    highestBidderId: null,
    highestBidderName: null,
    timerSeconds: 15,
    players: [initialPlayer],
    lotHistory: [],
    poolType: options.poolType,
    startingPurseCr: options.startingPurseCr,
    maxLots: options.maxLots,
    lastUpdated: Date.now(),
  };

  rooms.set(roomCode, room);
  return room;
}

export function joinRoom(
  roomCode: string,
  player: { id: string; name: string; fanIdentity: string }
): { room?: AuctionRoomState; error?: string } {
  const code = roomCode.trim().toUpperCase();
  const room = rooms.get(code);

  if (!room) {
    return { error: 'Room not found. Check code and try again!' };
  }

  if (room.status !== 'lobby') {
    // Check if player is rejoining
    const existing = room.players.find(p => p.id === player.id);
    if (existing) {
      return { room };
    }
    return { error: 'Auction already in progress!' };
  }

  if (room.players.length >= 10) {
    return { error: 'Room is already full (Max 10 players)!' };
  }

  const existingIdx = room.players.findIndex(p => p.id === player.id);
  if (existingIdx === -1) {
    const newPlayer: AuctionPlayer = {
      id: player.id,
      name: player.name || `Player ${room.players.length + 1}`,
      fanIdentity: (player.fanIdentity as any) || 'Bob',
      purseCr: room.startingPurseCr,
      initialPurseCr: room.startingPurseCr,
      wonLots: [],
      totalSpentCr: 0,
      isFolded: false,
    };
    room.players.push(newPlayer);
  } else {
    room.players[existingIdx].name = player.name;
    room.players[existingIdx].fanIdentity = (player.fanIdentity as any) || room.players[existingIdx].fanIdentity;
  }

  room.lastUpdated = Date.now();
  return { room };
}

export function getRoom(roomCode: string): AuctionRoomState | undefined {
  const code = roomCode.trim().toUpperCase();
  const room = rooms.get(code);
  if (!room) return undefined;

  // Process server-side timer ticks if bidding is active
  if (room.status === 'bidding') {
    const now = Date.now();
    const elapsed = Math.floor((now - room.lastUpdated) / 1000);
    if (elapsed >= 1) {
      room.timerSeconds = Math.max(0, room.timerSeconds - elapsed);
      room.lastUpdated = now;

      // When timer hits 0: resolve current lot
      if (room.timerSeconds === 0) {
        resolveCurrentLot(room);
      }
    }
  }

  return room;
}

export function startAuction(roomCode: string, hostId: string): { room?: AuctionRoomState; error?: string } {
  const code = roomCode.trim().toUpperCase();
  const room = rooms.get(code);
  if (!room) return { error: 'Room not found' };
  if (room.hostId !== hostId) return { error: 'Only the host can start the auction' };

  room.status = 'bidding';
  room.currentLotIndex = 0;
  const currentLot = room.lots[0];
  room.currentBidCr = currentLot?.auctionLot?.basePriceCr || 10;
  room.highestBidderId = null;
  room.highestBidderName = null;
  room.timerSeconds = 15;
  room.lastUpdated = Date.now();
  room.players.forEach(p => {
    p.isFolded = false;
  });

  return { room };
}

export function placeBid(
  roomCode: string,
  playerId: string,
  incrementCr: number
): { room?: AuctionRoomState; error?: string } {
  const code = roomCode.trim().toUpperCase();
  const room = rooms.get(code);
  if (!room) return { error: 'Room not found' };
  if (room.status !== 'bidding') return { error: 'Bidding is not active for this lot' };

  const player = room.players.find(p => p.id === playerId);
  if (!player) return { error: 'Player not in room' };
  if (player.isFolded) return { error: 'You have folded for this lot' };

  const nextBid = room.currentBidCr + incrementCr;

  if (nextBid > player.purseCr) {
    return { error: `Insufficient budget! You only have ₹${player.purseCr} Cr remaining.` };
  }

  // Update room state
  room.currentBidCr = nextBid;
  room.highestBidderId = player.id;
  room.highestBidderName = player.name;

  // Anti-sniping: If bid placed in final 5 seconds, reset timer to 5s!
  if (room.timerSeconds < 5) {
    room.timerSeconds = 5;
  }

  room.lastUpdated = Date.now();
  return { room };
}

export function foldPlayer(roomCode: string, playerId: string): { room?: AuctionRoomState; error?: string } {
  const code = roomCode.trim().toUpperCase();
  const room = rooms.get(code);
  if (!room) return { error: 'Room not found' };

  const player = room.players.find(p => p.id === playerId);
  if (!player) return { error: 'Player not in room' };

  player.isFolded = true;

  // If all players except highest bidder folded, end lot early
  const activeBidders = room.players.filter(p => !p.isFolded);
  if (activeBidders.length <= 1 && room.highestBidderId) {
    resolveCurrentLot(room);
  }

  room.lastUpdated = Date.now();
  return { room };
}

export function advanceToNextLot(roomCode: string, hostId: string): { room?: AuctionRoomState; error?: string } {
  const code = roomCode.trim().toUpperCase();
  const room = rooms.get(code);
  if (!room) return { error: 'Room not found' };
  if (room.hostId !== hostId) return { error: 'Only the host can advance lots' };

  const nextIdx = room.currentLotIndex + 1;
  if (nextIdx >= room.lots.length) {
    room.status = 'finished';
  } else {
    room.currentLotIndex = nextIdx;
    const nextLot = room.lots[nextIdx];
    room.currentBidCr = nextLot?.auctionLot?.basePriceCr || 10;
    room.highestBidderId = null;
    room.highestBidderName = null;
    room.timerSeconds = 15;
    room.status = 'bidding';
    room.players.forEach(p => {
      p.isFolded = false;
    });
  }

  room.lastUpdated = Date.now();
  return { room };
}

function resolveCurrentLot(room: AuctionRoomState) {
  const currentLot = room.lots[room.currentLotIndex];
  if (!currentLot) return;

  if (room.highestBidderId) {
    const winner = room.players.find(p => p.id === room.highestBidderId);
    if (winner) {
      winner.purseCr -= room.currentBidCr;
      winner.totalSpentCr += room.currentBidCr;
      winner.wonLots.push(currentLot);

      room.lotHistory.push({
        movie: currentLot,
        soldTo: winner.id,
        soldToName: winner.name,
        winningBidCr: room.currentBidCr,
        isUnsold: false,
      });
    }
  } else {
    // Unsold
    room.lotHistory.push({
      movie: currentLot,
      soldTo: null,
      soldToName: null,
      winningBidCr: 0,
      isUnsold: true,
    });
  }

  // Check if all lots completed
  if (room.currentLotIndex + 1 >= room.lots.length) {
    room.status = 'finished';
  } else {
    room.status = 'lot-sold';
  }
}
