-- TFI & PITCH — Database Schema (PostgreSQL / Supabase)
-- Telugu Cultural Gaming Platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name TEXT NOT NULL DEFAULT 'TFI Fan',
  fan_identity TEXT NOT NULL DEFAULT 'bhAAi',
  language_pref TEXT NOT NULL DEFAULT 'te-en',
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  haptics_enabled BOOLEAN NOT NULL DEFAULT true,
  games_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Telugu Cinema Movies & Content Table
CREATE TABLE IF NOT EXISTS public.movies (
  id TEXT PRIMARY KEY,
  telugu_title TEXT NOT NULL,
  english_title TEXT NOT NULL,
  release_year INTEGER NOT NULL,
  hero TEXT NOT NULL,
  director TEXT NOT NULL,
  genre TEXT[] DEFAULT '{}',
  characters TEXT[] DEFAULT '{}',
  iconic_dialogue JSONB,
  head_set_go_category TEXT,
  head_set_go_clue TEXT,
  transify_prompt JSONB,
  charades_difficulty TEXT,
  charades_hints TEXT[] DEFAULT '{}',
  emoji_clue JSONB,
  auction_lot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Auction Multiplayer Rooms Table
CREATE TABLE IF NOT EXISTS public.auction_rooms (
  room_code VARCHAR(6) PRIMARY KEY,
  host_id TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'lobby', -- 'lobby', 'bidding', 'lot-sold', 'finished'
  pool_type VARCHAR(20) NOT NULL DEFAULT 'balanced',
  starting_purse_cr INTEGER NOT NULL DEFAULT 100,
  max_lots INTEGER NOT NULL DEFAULT 10,
  current_lot_index INTEGER NOT NULL DEFAULT 0,
  current_bid_cr INTEGER NOT NULL DEFAULT 10,
  highest_bidder_id TEXT,
  highest_bidder_name TEXT,
  timer_seconds INTEGER NOT NULL DEFAULT 15,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  lots JSONB NOT NULL DEFAULT '[]'::jsonb,
  lot_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on room_code and status
CREATE INDEX IF NOT EXISTS idx_auction_rooms_status ON public.auction_rooms(status);

