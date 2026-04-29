-- Migration 020: Track Playback Controls (Rerun-Safe)
-- Date: 2026-04-29
-- Purpose: Add preview/locked playback modes for tracks
-- Run in Supabase SQL Editor only

-- 1. Add columns if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tracks' AND column_name = 'playback_mode'
  ) THEN
    ALTER TABLE tracks ADD COLUMN playback_mode TEXT DEFAULT 'full';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tracks' AND column_name = 'preview_duration_seconds'
  ) THEN
    ALTER TABLE tracks ADD COLUMN preview_duration_seconds INTEGER DEFAULT 60;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tracks' AND column_name = 'unlock_required'
  ) THEN
    ALTER TABLE tracks ADD COLUMN unlock_required BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 2. Update defaults for existing rows (only if columns were just added)
UPDATE tracks SET playback_mode = 'full' WHERE playback_mode IS NULL;
UPDATE tracks SET preview_duration_seconds = 60 WHERE preview_duration_seconds IS NULL;
UPDATE tracks SET unlock_required = false WHERE unlock_required IS NULL;

-- 3. Add constraints safely (drop first if exists)
ALTER TABLE tracks DROP CONSTRAINT IF EXISTS valid_playback_modes;
DO $$
BEGIN
  ALTER TABLE tracks ADD CONSTRAINT valid_playback_modes 
    CHECK (playback_mode IN ('full', 'preview', 'locked'));
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

ALTER TABLE tracks DROP CONSTRAINT IF EXISTS valid_preview_duration;
DO $$
BEGIN
  ALTER TABLE tracks ADD CONSTRAINT valid_preview_duration 
    CHECK (preview_duration_seconds BETWEEN 5 AND 300);
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- 4. Index for playback mode lookups
CREATE INDEX IF NOT EXISTS idx_tracks_playback_mode ON tracks(playback_mode);

-- VERIFICATION QUERIES:
-- Check columns exist: SELECT column_name FROM information_schema.columns WHERE table_name = 'tracks' AND column_name IN ('playback_mode', 'preview_duration_seconds', 'unlock_required');
-- Check constraint: SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'tracks'::regclass AND conname LIKE 'valid%';
-- Sample data: SELECT id, title, playback_mode, preview_duration_seconds FROM tracks LIMIT 5;
