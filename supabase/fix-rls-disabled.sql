-- ============================================
-- Fix RLS for tables missing row level security
-- Run this in Supabase SQL Editor
-- ============================================

-- CATEGORIES table (from marketplace.sql)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read categories" ON categories;
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);

-- TIER MILESTONES table (from competition-schema.sql)
ALTER TABLE tier_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read tier milestones" ON tier_milestones;
CREATE POLICY "Anyone can read tier milestones" ON tier_milestones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage tier milestones" ON tier_milestones;
CREATE POLICY "Service role can manage tier milestones" ON tier_milestones FOR ALL USING (true);
