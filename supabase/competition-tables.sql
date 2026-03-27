-- RUN THIS FIRST - Tables only

-- Artist Competition Progress
CREATE TABLE competition_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL,
  current_tier TEXT DEFAULT 'Bronze' CHECK (current_tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  total_earnings NUMERIC DEFAULT 0,
  highest_milestone_hit NUMERIC DEFAULT 0,
  is_founding_artist BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestone Wins
CREATE TABLE competition_wins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL,
  milestone_amount NUMERIC NOT NULL,
  bonus_amount NUMERIC NOT NULL,
  tier TEXT NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prize Pool
CREATE TABLE prize_pool (
  id INTEGER PRIMARY KEY DEFAULT 1,
  balance NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  total_paid_out NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO prize_pool (id, balance) VALUES (1, 0);

-- Tier Milestones
CREATE TABLE tier_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier TEXT NOT NULL,
  threshold_amount NUMERIC NOT NULL,
  bonus_amount NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO tier_milestones (tier, threshold_amount, bonus_amount) VALUES
  ('Bronze', 100, 150),
  ('Bronze', 500, 250),
  ('Silver', 2500, 500),
  ('Silver', 5000, 1000),
  ('Gold', 10000, 2500),
  ('Gold', 25000, 5000),
  ('Platinum', 50000, 10000),
  ('Platinum', 100000, 25000);

-- Founding Window
CREATE TABLE founding_window (
  id INTEGER PRIMARY KEY DEFAULT 1,
  artist_limit INTEGER DEFAULT 50,
  artists_joined INTEGER DEFAULT 0,
  competition_launched BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO founding_window (id, artist_limit) VALUES (1, 50);
