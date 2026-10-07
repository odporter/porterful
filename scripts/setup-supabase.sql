-- Porterful Wallet Database Setup
-- Run this once to initialize the wallets table

CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  balance bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own wallet
CREATE POLICY "Users can view own wallet" ON wallets
  FOR SELECT USING (true);

-- Allow updates to own wallet
CREATE POLICY "Users can update own wallet" ON wallets
  FOR UPDATE USING (true);

-- Allow insert on conflict do update (upsert)
CREATE POLICY "Users can insert own wallet" ON wallets
  FOR INSERT WITH CHECK (true);

COMMENT ON TABLE wallets IS 'Porterful user wallet balances';
