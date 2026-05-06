# Porterful Site Improvements — Batch 1 (2026-05-05)

## Status: No changes needed — already implemented in codebase

### 1. Rob Soule artist data fix
- **Location:** `src/lib/artists.ts`
- **Status:** Already correct
- `genre`: `Hip-Hop / R&B / Blues`
- `bio`: "Rob Soule is a St. Louis hip-hop and R&B artist blending blues into a soulful sound. From the heart of the city, Rob brings together smooth R&B melodies, hard-hitting hip-hop beats, and the raw emotional truth of blues to create something uniquely STL."

### 2. Social media buttons on artist profile page
- **Location:** `src/app/(app)/artist/artist/[id]/page.tsx`
- **Status:** Already implemented
- Instagram, Twitter/X, YouTube, and TikTok icons are displayed inline with the artist name in the profile header when the artist has those social fields populated.
- Each icon links to the correct social profile via `normalizeSocialUrl()`.

### 3. Featured Singles before Albums
- **Location:** `src/app/(app)/artist/artist/[id]/page.tsx`
- **Status:** Already correct
- The "Featured Singles" section renders first (above "Albums") in the Music tab.
- The comment in the code even says: `Featured Singles — show FIRST`.

---

## Note
None of the three tasks required code changes. The requested improvements were already present in the codebase.
