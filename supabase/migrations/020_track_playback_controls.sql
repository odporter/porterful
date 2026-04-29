-- Migration: Add playback controls for track preview/unlock
-- Date: 2026-04-29

-- Add playback_mode field to tracks
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS playback_mode TEXT DEFAULT 'full';

-- Add preview duration (seconds)
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS preview_duration_seconds INTEGER DEFAULT 60;

-- Add unlock required flag
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS unlock_required BOOLEAN DEFAULT false;

-- Add constraint for valid playback modes
ALTER TABLE tracks DROP CONSTRAINT IF EXISTS valid_playback_modes;
ALTER TABLE tracks ADD CONSTRAINT valid_playback_modes 
  CHECK (playback_mode IN ('full', 'preview', 'locked'));

-- Ensure preview_duration is reasonable (5-300 seconds)
ALTER TABLE tracks DROP CONSTRAINT IF EXISTS valid_preview_duration;
ALTER TABLE tracks ADD CONSTRAINT valid_preview_duration 
  CHECK (preview_duration_seconds BETWEEN 5 AND 300);

-- Index for fast lookup by playback mode
CREATE INDEX IF NOT EXISTS idx_tracks_playback_mode ON tracks(playback_mode);

-- Update comment
COMMENT ON COLUMN tracks.playback_mode IS 'full = full track playable, preview = limited seconds, locked = requires unlock';
COMMENT ON COLUMN tracks.preview_duration_seconds IS 'Seconds of preview available (default 60)';
COMMENT ON COLUMN tracks.unlock_required IS 'Whether track requires purchase/unlock to play full';
