'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WoodenGavelIllustration, DoodleStar } from '@/components/ui/EditorialArt';
import { ArrowLeft, KeyRound, Plus, ArrowRight } from 'lucide-react';

export default function RoomsHubPage() {
  const router = useRouter();
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);

  const handleCreateRoom = () => {
    const codes = ['TFI123', 'POKIRI', 'RANGAM', 'GABBAR', 'PUSHPA'];
    const generated = codes[Math.floor(Math.random() * codes.length)];
    setCreatedRoomCode(generated);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = roomCodeInput.trim().toUpperCase();
    if (!cleanCode) return;
    router.push(`/rooms/${cleanCode}`);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      <div className="flex items-center justify-between px-1">
        <Link href="/" className="p-1 hover:bg-[#FFCB45]/30 rounded-lg">
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </Link>
        <h1 className="text-xl font-black text-[#171717]">Auction Rooms</h1>
        <div className="w-5" />
      </div>

      {/* Join Room Card */}
      <div className="bg-white border-2 border-[#171717] rounded-3xl p-5 shadow-[3px_3px_0_#171717] space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#D2C2F8] rounded-xl border-2 border-[#171717]">
            <KeyRound className="w-5 h-5 text-[#171717]" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#171717]">Join Existing Room</h2>
            <p className="text-xs text-neutral-600">Enter a 6-character room code from your friends</p>
          </div>
        </div>

        <form onSubmit={handleJoinRoom} className="space-y-2 pt-1">
          <input
            type="text"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
            placeholder="e.g. TFI123"
            maxLength={10}
            className="w-full px-4 py-3 border-2 border-[#171717] rounded-2xl font-black text-center text-lg uppercase tracking-wider shadow-[2px_2px_0_#171717] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!roomCodeInput.trim()}
            className="w-full py-3.5 bg-[#FF9E80] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2px_2px_0_#171717] hover:bg-[#ff8a68] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <span>Enter Room</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>
      </div>

      {/* Create Room Card */}
      <div className="bg-white border-2 border-[#171717] rounded-3xl p-5 shadow-[3px_3px_0_#171717] space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#FFCB45] rounded-xl border-2 border-[#171717]">
            <Plus className="w-5 h-5 text-[#171717]" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#171717]">Create New Room</h2>
            <p className="text-xs text-neutral-600">Host your own live Telugu Box Office Auction</p>
          </div>
        </div>

        {createdRoomCode ? (
          <div className="p-4 bg-[#FFF8E9] border-2 border-[#171717] rounded-2xl text-center space-y-2">
            <span className="text-xs font-bold text-neutral-600">Your Room Code is Ready:</span>
            <div className="text-3xl font-black text-[#FF704D] tracking-widest">{createdRoomCode}</div>
            <Link href={`/rooms/${createdRoomCode}`} className="block pt-1">
              <button className="w-full py-3 bg-[#88D49E] border-2 border-[#171717] rounded-xl font-black text-xs shadow-[2px_2px_0_#171717]">
                Go to Lobby 🚀
              </button>
            </Link>
          </div>
        ) : (
          <button
            onClick={handleCreateRoom}
            className="w-full py-3.5 bg-[#FFCB45] border-2 border-[#171717] rounded-2xl font-black text-sm text-[#171717] shadow-[2px_2px_0_#171717] hover:bg-[#ffd45e] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Generate Room Code</span>
          </button>
        )}
      </div>
    </div>
  );
}
