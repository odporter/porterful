# Porterful Site Improvements — Batch 1 (COMPLETE)

**Date:** 2026-05-01  
**Status:** All changes already present — no edits required.

## 1. Rob Soule Artist Data Fix ✓
- **File:** `src/lib/artists.ts`
- **Genre:** `Hip-Hop / R&B / Blues` (line 135)
- **Bio:** "Rob Soule is a St. Louis hip-hop and R&B artist blending blues into a soulful sound. From the heart of the city, Rob brings together smooth R&B melodies, hard-hitting hip-hop beats, and the raw emotional truth of blues to create something uniquely STL."

## 2. Social Media Buttons on Artist Profile ✓
- **File:** `src/components/artist/ArtistHero.tsx`
- Inline SVG icons: Instagram, Twitter/X, YouTube, TikTok
- Rendered conditionally below artist name in the hero header
- Also present in `src/app/(app)/artist/artist/[id]/page.tsx` as fallback

## 3. Featured Singles Before Albums ✓
- **File:** `src/components/artist/ArtistTabs.tsx`
- "Featured Singles" section rendered before "Albums & Projects"
- **File:** `src/app/(app)/artist/artist/[id]/page.tsx`
- Featured Singles block with "show FIRST" comment appears above Albums block

## Action Log
- 2026-05-01 00:55 CDT — Verified all three changes already in working tree
- No diff produced, no edits needed
- Nothing staged, committed, or deployed

## Porterful Deck Mode Backlog (2026-04-29)

Documented only for now. This is the experience-layer foundation for Porterful Deck Mode / Dock Mode on top of the existing GlobalPlayer and audio-context system.

- Real analyser-backed visualizers: Classic Bars, Circular Spectrum, Waveform, Artwork fallback
- Full-screen deck overlay with browser fullscreen toggle, minimal transport controls, and visual mode switcher
- Dock Mode use cases: sideways phone, Bluetooth speaker, tablet counter display, car-style screen, merch booth / event display
- Future EQ backlog: Flat, Bass Boost, Clear Vocals, Night Mode, Car Mode, Bass, Mid, Treble, then 10-band EQ
- Loudness normalization backlog: loudness analysis, metadata storage, normalized playback version, preserve original masters
- Guardrails: no fake waveform data, no heavy WebGL default on mobile, respect prefers-reduced-motion, keep mobile playback stable before expanding the feature set
