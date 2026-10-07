-- Porterful Veteran & Minority Business Support
-- Run in Supabase SQL Editor

-- Add verification fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_veteran BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_black_owned BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_minority_owned BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '[]';

-- Add veteran/discount to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS veteran_discount DECIMAL(5,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS supports_veterans BOOLEAN DEFAULT FALSE;

-- Create veteran support fund tracking
CREATE TABLE IF NOT EXISTS veteran_fund (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  total_donations DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create badge display table
CREATE TABLE IF NOT EXISTS badge_displays (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('veteran', 'black_owned', 'minority_owned', 'artist', 'verified')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add policies
CREATE POLICY "Public can view veteran fund" ON veteran_fund FOR SELECT USING (true);
CREATE POLICY "Artists can update own veteran fund" ON veteran_fund FOR UPDATE USING (auth.uid() = artist_id);
CREATE POLICY "Public can view badges" ON badge_displays FOR SELECT USING (true);
CREATE POLICY "Users can manage own badges" ON badge_displays FOR ALL USING (auth.uid() = profile_id);

-- Enable RLS
ALTER TABLE veteran_fund ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_displays ENABLE ROW LEVEL SECURITY;