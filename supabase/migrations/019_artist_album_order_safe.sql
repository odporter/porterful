-- Migration 019: Artist Album Order (Rerun-Safe)
-- Date: 2026-04-29
-- Purpose: Store custom album display order for artist pages
-- Run in Supabase SQL Editor only

-- 1. Create table if not exists
CREATE TABLE IF NOT EXISTS artist_album_order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  album_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artist_id, album_name)
);

-- 2. Indexes (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_artist_album_order_artist ON artist_album_order(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_album_order_sort ON artist_album_order(artist_id, sort_order);

-- 3. Enable RLS (idempotent)
ALTER TABLE artist_album_order ENABLE ROW LEVEL SECURITY;

-- 4. Drop and recreate policies to avoid duplicates
DROP POLICY IF EXISTS "Artists can read own album order" ON artist_album_order;
DROP POLICY IF EXISTS "Artists can update own album order" ON artist_album_order;
DROP POLICY IF EXISTS "Artists can insert own album order" ON artist_album_order;
DROP POLICY IF EXISTS "Artists can delete own album order" ON artist_album_order;

CREATE POLICY "Artists can read own album order"
  ON artist_album_order FOR SELECT
  USING (artist_id IN (
    SELECT id FROM artists WHERE user_id = auth.uid()
  ));

CREATE POLICY "Artists can update own album order"
  ON artist_album_order FOR UPDATE
  USING (artist_id IN (
    SELECT id FROM artists WHERE user_id = auth.uid()
  ));

CREATE POLICY "Artists can insert own album order"
  ON artist_album_order FOR INSERT
  WITH CHECK (artist_id IN (
    SELECT id FROM artists WHERE user_id = auth.uid()
  ));

CREATE POLICY "Artists can delete own album order"
  ON artist_album_order FOR DELETE
  USING (artist_id IN (
    SELECT id FROM artists WHERE user_id = auth.uid()
  ));

-- 5. Auto-update trigger (safe creation)
DROP TRIGGER IF EXISTS artist_album_order_updated_at ON artist_album_order;
DROP FUNCTION IF EXISTS update_artist_album_order_updated_at();

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

-- VERIFICATION QUERY:
-- SELECT * FROM artist_album_order LIMIT 1;
