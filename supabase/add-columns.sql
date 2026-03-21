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
CREATE POLICY "Artists can insert tracks" ON tracks FOR INSERT WITH CHECK (auth.uid() = artist_id);
CREATE POLICY "Artists can update own tracks" ON tracks FOR UPDATE USING (auth.uid() = artist_id);
CREATE POLICY "Artists can delete own tracks" ON tracks FOR DELETE USING (auth.uid() = artist_id);
