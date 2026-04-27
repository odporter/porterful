-- Migration 017: Add track_number column to tracks table
-- For album track ordering
-- Created: 2026-04-27

BEGIN;

-- Add track_number column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tracks' AND column_name = 'track_number'
    ) THEN
        ALTER TABLE tracks ADD COLUMN track_number INTEGER;
    END IF;
END $$;

COMMIT;
