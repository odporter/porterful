-- Migration 014: Music Purchases Table
-- For tracking individual music/track purchases with download access
-- Created: 2026-04-24

BEGIN;

CREATE TABLE IF NOT EXISTS music_purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Buyer identity
  buyer_email TEXT NOT NULL,
  buyer_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Track details
  track_id TEXT NOT NULL,
  track_title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  
  -- Payment details
  stripe_session_id TEXT NOT NULL,
  amount_paid INTEGER NOT NULL, -- in cents
  
  -- Storage access
  storage_bucket TEXT DEFAULT 'music',
  storage_path TEXT NOT NULL, -- path in Supabase storage
  
  -- Download tracking
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  
  -- Recovery token for email access
  recovery_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  recovery_token_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  
  -- Timestamps
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS music_purchases_email_idx ON music_purchases (buyer_email);
CREATE INDEX IF NOT EXISTS music_purchases_user_idx ON music_purchases (buyer_user_id);
CREATE INDEX IF NOT EXISTS music_purchases_track_idx ON music_purchases (track_id);
CREATE INDEX IF NOT EXISTS music_purchases_session_idx ON music_purchases (stripe_session_id);
CREATE INDEX IF NOT EXISTS music_purchases_recovery_token_idx ON music_purchases (recovery_token);

-- Unique constraint: one purchase per email+track (prevents duplicates)
CREATE UNIQUE INDEX IF NOT EXISTS music_purchases_unique 
  ON music_purchases (buyer_email, track_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_music_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS music_purchases_updated_at ON music_purchases;
CREATE TRIGGER music_purchases_updated_at
  BEFORE UPDATE ON music_purchases
  FOR EACH ROW EXECUTE FUNCTION update_music_purchases_updated_at();

COMMIT;
