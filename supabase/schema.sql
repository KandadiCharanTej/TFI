-- Database Schema for TFI & Pitch (PostgreSQL / Supabase)

-- 1. Movies Table
CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  title_telugu TEXT NOT NULL,
  title_english TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  director TEXT NOT NULL,
  hero TEXT NOT NULL,
  heroine TEXT,
  music_director TEXT NOT NULL,
  trivia TEXT,
  rating_tier TEXT NOT NULL,
  box_office_score INTEGER NOT NULL,
  audience_score INTEGER NOT NULL,
  cult_score INTEGER NOT NULL,
  base_price_cr INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Auction Rooms Table
CREATE TABLE IF NOT EXISTS auction_rooms (
  code TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,
  initial_budget_cr INTEGER DEFAULT 100,
  min_increment_cr INTEGER DEFAULT 2,
  status TEXT DEFAULT 'lobby', -- 'lobby', 'bidding', 'completed'
  current_lot_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Room Players Table
CREATE TABLE IF NOT EXISTS room_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT REFERENCES auction_rooms(code) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  remaining_budget_cr INTEGER NOT NULL,
  total_score INTEGER DEFAULT 0,
  is_host BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Auction Bids Table
CREATE TABLE IF NOT EXISTS auction_bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT REFERENCES auction_rooms(code) ON DELETE CASCADE,
  lot_number INTEGER NOT NULL,
  player_id UUID REFERENCES room_players(id),
  bid_amount_cr INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
