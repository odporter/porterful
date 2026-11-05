-- Referral earnings tracking (migration 012)
-- Schema matches live DB: CREATE TABLE referral_earnings (superfan_id, order_id, amount DECIMAL, status)
-- from supabase/schema.sql lines 258-266

-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS referral_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  superfan_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast superfan lookups
CREATE INDEX IF NOT EXISTS idx_referral_earnings_superfan ON referral_earnings(superfan_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_status ON referral_earnings(status) WHERE status = 'pending';

-- Verify
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'referral_earnings' ORDER BY ordinal_position;
