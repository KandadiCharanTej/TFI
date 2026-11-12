import { NextResponse } from 'next/server';
import { placeBid } from '@/utils/auctionRoomManager';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomCode, playerId, incrementCr } = body;

    if (!roomCode || !playerId || typeof incrementCr !== 'number') {
      return NextResponse.json({ error: 'Invalid bid request parameters' }, { status: 400 });
    }

    const result = placeBid(roomCode, playerId, incrementCr);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ room: result.room });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to place bid' }, { status: 500 });
  }
}
