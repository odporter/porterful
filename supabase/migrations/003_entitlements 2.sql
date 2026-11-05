-- Migration 003: Entitlements Table
-- Phase 2: Post-payment access layer
-- Creates the source-of-truth for product access after purchase
-- Created: 2026-04-15
-- Run this in Supabase dashboard SQL editor

BEGIN;

CREATE TABLE IF NOT EXISTS entitlements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Identity
  buyer_email TEXT NOT NULL,
  buyer_user_id UUID, -- profiles(id) — may be null for guest buyers initially
  
  -- Product/offer binding
  product_id TEXT NOT NULL,
  offer_id TEXT,
  referrer_id UUID, -- profiles(id) — superfan who referred this purchase
  order_id UUID, -- links to orders(id) financial ledger
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired', 'pending')),
  
  -- Timestamps
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = lifetime access
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- One active entitlement per email+product (prevents duplicate active access)
CREATE UNIQUE INDEX IF NOT EXISTS entitlements_unique_active 
  ON entitlements (buyer_email, product_id) 
  WHERE status = 'active';

-- Indexes for common lookup patterns
CREATE INDEX IF NOT EXISTS entitlements_email_idx ON entitlements (buyer_email);
CREATE INDEX IF NOT EXISTS entitlements_user_idx ON entitlements (buyer_user_id);
CREATE INDEX IF NOT EXISTS entitlements_product_idx ON entitlements (product_id);
CREATE INDEX IF NOT EXISTS entitlements_status_idx ON entitlements (status);
CREATE INDEX IF NOT EXISTS entitlements_order_idx ON entitlements (order_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_entitlements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS entitlements_updated_at ON entitlements;
CREATE TRIGGER entitlements_updated_at
  BEFORE UPDATE ON entitlements
  FOR EACH ROW EXECUTE FUNCTION update_entitlements_updated_at();

COMMIT;
