# Site Improvements — April 14, 2026

## Batch 1: Rob Soule fix + social buttons

**Status: Already implemented — no code changes needed**

### 1. Rob Soule artist data (`src/lib/artists.ts`)
- Genre: `Hip-Hop / R&B / Blues` ✓ (already correct)
- Bio: correctly describes him as "a St. Louis hip-hop and R&B artist who blends the blues into a soulful sound" ✓ (already correct)

### 2. Social media buttons (`src/app/(app)/artist/artist/[id]/page.tsx`)
- Instagram, Twitter/X, YouTube, TikTok icons are already rendered inline next to the artist name ✓
- Additional standalone social icon buttons also present in the profile header ✓
- Both sets only render when the artist has those social fields filled in ✓

### 3. Featured Singles before Albums
- The music tab already renders "Featured Singles" section first, followed by "Albums" section below ✓

**No changes were necessary — all requested features were already present in the codebase.**
