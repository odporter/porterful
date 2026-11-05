// Artist Payout System - Database Schema (Supabase/PostgreSQL)

/*
 * This defines the structure for tracking artist earnings and payouts.
 * Copy this into Supabase SQL Editor to create the tables.
 */

// Artist Earnings Table
CREATE TABLE IF NOT EXISTS artist_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  // Earnings tracking
  total_sales DECIMAL(10,2) DEFAULT 0.00,
  total_paid_out DECIMAL(10,2) DEFAULT 0.00,
  current_balance DECIMAL(10,2) DEFAULT 0.00,
  
  // Tier system
  tier VARCHAR(20) DEFAULT 'new', -- 'new', 'growing', 'established'
  tier_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  // Probationary period
  probation_ends_at TIMESTAMP WITH TIME ZONE, -- NULL after probation
  
  // Payout settings
  payout_method VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'biweekly', 'weekly', 'on_demand'
  minimum_payout DECIMAL(10,2) DEFAULT 10.00,
  
  // Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

// Individual Sale Records
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID,
  
  // Sale details
  amount DECIMAL(10,2) NOT NULL,
  artist_cut DECIMAL(10,2) NOT NULL, -- 67% for artists
  platform_fee DECIMAL(10,2) NOT NULL, -- 10%
  artist_fund_fee DECIMAL(10,2) NOT NULL, -- 20%
  superfan_fee DECIMAL(10,2) NOT NULL, -- 3%
  
  // Status
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'refunded'
  payout_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid'
  
  // Dates
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payout_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

// Payout History
CREATE TABLE IF NOT EXISTS payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  // Payout details
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL, -- 'bank_transfer', 'stripe_connect', 'paypal'
  
  // Status
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  
  // External references
  stripe_transfer_id VARCHAR(255),
  
  // Dates
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  // Metadata
  notes TEXT
);

// Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_artist_earnings_artist_id ON artist_earnings(artist_id);
CREATE INDEX IF NOT EXISTS idx_sales_artist_id ON sales(artist_id);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);
CREATE INDEX IF NOT EXISTS idx_payouts_artist_id ON payouts(artist_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);

// Function to update artist tier automatically
CREATE OR REPLACE FUNCTION update_artist_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if artist should be upgraded
  IF NEW.total_sales >= 500 THEN
    NEW.tier := 'established';
    NEW.payout_method := 'weekly';
    NEW.minimum_payout := 0;
  ELSIF NEW.total_sales >= 100 THEN
    NEW.tier := 'growing';
    NEW.payout_method := 'biweekly';
    NEW.minimum_payout := 0;
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

// Trigger to auto-update tier
CREATE TRIGGER update_tier_on_earnings
AFTER UPDATE ON artist_earnings
FOR EACH ROW
EXECUTE FUNCTION update_artist_tier();