-- Migration 015: Add description column to tracks table
-- For track editing functionality
-- Created: 2026-04-27

BEGIN;

-- Add description column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tracks' AND column_name = 'description'
    ) THEN
        ALTER TABLE tracks ADD COLUMN description TEXT;
    END IF;
END $$;

-- Add updated_at column if not exists (for tracking edits)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tracks' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE tracks ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Create or replace trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_tracks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS tracks_updated_at ON tracks;

CREATE TRIGGER tracks_updated_at
  BEFORE UPDATE ON tracks
  FOR EACH ROW EXECUTE FUNCTION update_tracks_updated_at();

COMMIT;
