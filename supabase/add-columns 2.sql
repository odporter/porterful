-- Add missing columns to tracks table
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS play_count INTEGER DEFAULT 0;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS proud_to_pay_min DECIMAL(10,2) DEFAULT 5;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create tracks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tracks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  duration INTEGER,
  audio_url TEXT,
  cover_url TEXT,
  play_count INTEGER DEFAULT 0,
  proud_to_pay_min DECIMAL(10,2) DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can read tracks" ON tracks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert tracks" ON tracks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Artists can update own tracks" ON tracks FOR UPDATE USING (auth.uid() = artist_id);
CREATE POLICY "Artists can delete own tracks" ON tracks FOR DELETE USING (auth.uid() = artist_id);

-- ============================================
-- WALLETS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on wallets
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see/manage their own wallet
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
