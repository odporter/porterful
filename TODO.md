# Porterful Site Improvements — Batch 1 (2026-04-29)

## Requested Changes
1. Fix Rob Soule genre + bio
2. Add social media buttons (IG, X, YouTube, TikTok) to artist profile header
3. Move Featured Singles section above Albums on artist pages

## Verified 2026-04-29 21:10 CDT
Re-checked all three changes. Already in place — no edits needed.

- `src/lib/artists.ts` — Rob Soule genre: `Hip-Hop / R&B / Blues` ✓
- `src/lib/artists.ts` — Rob Soule bio: "Rob Soule is a St. Louis hip-hop and R&B artist blending blues into a soulful sound." ✓
- `src/components/artist/ArtistHero.tsx` — Social icon buttons (Instagram, Twitter/X SVG, YouTube, TikTok) rendered conditionally below artist name in hero header ✓
- `src/components/artist/ArtistTabs.tsx` — "Featured Singles" section positioned before "Albums & Projects" ✓

Nothing staged, committed, or deployed.

## Porterful Deck Mode Backlog (2026-04-29)

Documented only for now. This is the experience-layer foundation for Porterful Deck Mode / Dock Mode on top of the existing GlobalPlayer and audio-context system.

- Real analyser-backed visualizers: Classic Bars, Circular Spectrum, Waveform, Artwork fallback
- Full-screen deck overlay with browser fullscreen toggle, minimal transport controls, and visual mode switcher
- Dock Mode use cases: sideways phone, Bluetooth speaker, tablet counter display, car-style screen, merch booth / event display
- Future EQ backlog: Flat, Bass Boost, Clear Vocals, Night Mode, Car Mode, Bass, Mid, Treble, then 10-band EQ
- Loudness normalization backlog: loudness analysis, metadata storage, normalized playback version, preserve original masters
- Guardrails: no fake waveform data, no heavy WebGL default on mobile, respect prefers-reduced-motion, keep mobile playback stable before expanding the feature set
