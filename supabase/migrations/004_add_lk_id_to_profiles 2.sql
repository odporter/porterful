-- Migration 004: Add lk_id to profiles for LikenessVerified identity bridge
-- Phase 2: Identity chain completion
-- Created: 2026-04-15

BEGIN;

-- Add lk_id column to profiles for LikenessVerified identity
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lk_id TEXT UNIQUE;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS profiles_lk_id_idx ON profiles (lk_id);

COMMIT;
