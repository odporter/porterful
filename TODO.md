# TODO - Site Improvements Batch 1 (Rob Soule fix + social buttons)

**Date:** 2026-04-14
**Status:** Already implemented — no changes needed

## Items Reviewed

### 1. Rob Soule artist data (src/lib/artists.ts)
- ✅ `genre` is already `'Hip-Hop / R&B / Blues'`
- ✅ `bio` already reflects St. Louis hip-hop and R&B artist blending blues into a soulful sound

### 2. Social media buttons (src/app/(app)/artist/artist/[id]/page.tsx)
- ✅ Instagram, Twitter/X, YouTube, TikTok icons already present
- ✅ Small icons in header next to artist name/verified badge
- ✅ Larger icons in artist info card section
- ✅ All conditional on artist having those social fields filled

### 3. Featured Singles BEFORE Albums
- ✅ Featured Singles section already renders before Albums section in the music tab
- ✅ Singles use `displayTracks.filter(t => t.album === 'Singles')`
- ✅ Albums use `albumNames.filter(n => n !== 'Singles')`

## Conclusion
All requested improvements were already in place. No code changes required.
