-- Migration: Create artist_album_order table for public album display ordering
-- Date: 2026-04-29

CREATE TABLE IF NOT EXISTS artist_album_order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  album_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artist_id, album_name)
);

-- Index for fast lookup by artist
CREATE INDEX idx_artist_album_order_artist ON artist_album_order(artist_id);

-- Index for sorting
CREATE INDEX idx_artist_album_order_sort ON artist_album_order(artist_id, sort_order);

-- Enable RLS
ALTER TABLE artist_album_order ENABLE ROW LEVEL SECURITY;

-- Artists can read their own album order
CREATE POLICY "Artists can read own album order"
  ON artist_album_order
  FOR SELECT
  USING (artist_id IN (
    SELECT id FROM artists WHERE user_id = auth.uid()
  ));

-- Artists can update their own album order
CREATE POLICY "Artists can update own album order"
  ON artist_album_order
  FOR ALL
  USING (artist_id IN (
    SELECT id FROM artists WHERE user_id = auth.uid()
  ));

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_artist_album_order_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artist_album_order_updated_at
  BEFORE UPDATE ON artist_album_order
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_album_order_updated_at();
