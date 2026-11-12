import { NextResponse } from 'next/server';
import { startAuction, foldPlayer, advanceToNextLot } from '@/utils/auctionRoomManager';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, roomCode, playerId } = body;

    if (!action || !roomCode || !playerId) {
      return NextResponse.json({ error: 'Action, roomCode, and playerId required' }, { status: 400 });
    }

    let result: { room?: any; error?: string };

    if (action === 'start') {
      result = startAuction(roomCode, playerId);
    } else if (action === 'fold') {
      result = foldPlayer(roomCode, playerId);
    } else if (action === 'advance') {
      result = advanceToNextLot(roomCode, playerId);
    } else {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ room: result.room });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Action failed' }, { status: 500 });
  }
}

