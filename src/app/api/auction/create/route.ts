import { NextResponse } from 'next/server';
import { createRoom } from '@/utils/auctionRoomManager';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { host, options } = body;

    if (!host || !host.id) {
      return NextResponse.json({ error: 'Host player information required' }, { status: 400 });
    }

    const room = createRoom(host, {
      poolType: options?.poolType || 'balanced',
      startingPurseCr: options?.startingPurseCr || 100,
      maxLots: options?.maxLots || 10,
    });

    return NextResponse.json({ room });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create room' }, { status: 500 });
  }
}

