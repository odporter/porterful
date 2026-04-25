-- ============================================
-- MIGRATION: Add accent color preference to profiles
-- Controlled accent personalization for Porterful
-- Only hue (0-360) is stored; saturation and lightness are locked
-- ============================================

-- Add accent_hue column to profiles (nullable = use default)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS accent_hue INTEGER 
CHECK (accent_hue >= 0 AND accent_hue <= 360);

-- Add comment for documentation
COMMENT ON COLUMN profiles.accent_hue IS 'User accent color hue (0-360). Saturation and lightness are locked at 95%/53% for design system integrity.';

-- Create index for potential future use (e.g., analytics on color preferences)
CREATE INDEX IF NOT EXISTS idx_profiles_accent_hue ON profiles(accent_hue);

-- ============================================
-- STORED FUNCTION: Get accent CSS variable
-- ============================================
CREATE OR REPLACE FUNCTION get_accent_css(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  hue INTEGER;
BEGIN
  SELECT accent_hue INTO hue FROM profiles WHERE id = user_id;
  
  -- Return default orange if no preference set
  IF hue IS NULL THEN
    hue := 24; -- Default orange
  END IF;
  
  RETURN hue::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
