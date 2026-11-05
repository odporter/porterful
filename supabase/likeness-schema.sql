-- ============================================
-- LIKENESS VERIFICATION SCHEMA
-- Adds ownership verification to Porterful artists
-- Run in Supabase SQL Editor
-- ============================================

-- Add likeness verification fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likeness_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likeness_registry_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likeness_verified_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likeness_name_match BOOLEAN;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_profiles_likeness ON profiles(likeness_verified) WHERE likeness_verified = TRUE;
CREATE INDEX IF NOT EXISTS idx_profiles_likeness_id ON profiles(likeness_registry_id) WHERE likeness_registry_id IS NOT NULL;

-- Add RLS policies for likeness fields
-- Users can read their own likeness data
CREATE POLICY "Users can read own likeness fields" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Artists can read likeness_verified status of their own profile (for gate logic)
CREATE POLICY "Artists can update own likeness fields" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Add live slot tracking to tracks table
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS is_early_release BOOLEAN DEFAULT FALSE;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Policy: only owner can archive/unarchive tracks
CREATE POLICY "Artists can update own track status" ON tracks
  FOR UPDATE USING (auth.uid() = artist_id);

-- ============================================
-- LIVE SLOTS CONFIGURATION
-- ============================================
-- Artists are limited to:
--   3 live (is_active=true, archived_at=null) tracks
--   1 featured (is_featured=true) track among live tracks
--   3 live products
-- This is enforced in the upload API, not the DB
