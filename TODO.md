# Porterful Site Improvements — Batch 1 (2026-05-06)

## Checked Items

1. **Rob Soule artist data fix** — Already correct in `src/lib/artists.ts`:
   - Genre: `'Hip-Hop / R&B / Blues'`
   - Bio reflects St. Louis hip-hop and R&B artist blending blues into a soulful sound

2. **Social media buttons on artist profile** — Already implemented in `src/app/(app)/artist/artist/[id]/page.tsx`:
   - Instagram, Twitter/X, YouTube, TikTok icons imported from `@/lib/artist-social`
   - Render conditionally when social fields are filled
   - Placed near artist name in profile header

3. **Featured Singles before Albums** — Already correct:
   - Singles section renders first in the Music tab
   - Albums section renders after

## Result
No code changes needed — all three improvements were already in place. No commit or deploy made.
