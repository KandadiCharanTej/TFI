import { NextResponse } from 'next/server';
import { joinRoom } from '@/utils/auctionRoomManager';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomCode, player } = body;

    if (!roomCode || !player || !player.id) {
      return NextResponse.json({ error: 'Room code and player details required' }, { status: 400 });
    }

    const result = joinRoom(roomCode, player);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ room: result.room });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to join room' }, { status: 500 });
  }
}

