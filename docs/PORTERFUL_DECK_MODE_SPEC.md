# Porterful Deck Mode — Specification

**Status:** Approved as a future feature. Implementation paused.
**Date:** 2026-04-29
**Owner:** OD Porter
**Scope:** Documentation only. No source/player code is authorized to change as a result of this spec.

---

## 1. Final Decision

Deck Mode is **approved as a future feature** of Porterful. It is **not** approved for implementation today. All Deck Mode work — including the AudioContext/analyser plumbing it depends on — is **paused** until the player stability gate (Section 5) is met.

This document exists so that any agent (Codex, Claude, or otherwise) picking up Porterful work understands:

- Deck Mode is a real, intended feature.
- It is **not** the next thing to build.
- The player must be stable before any audio-graph work begins.

---

## 2. Current Priority

**Player stability comes first.** Nothing else.

Until the global/mobile player is reliably playing the right track, in the right order, on the right devices, no work should be done on:

- Visualizers (Classic Bars, Butterchurn, Fullscreen Deck Mode)
- AudioContext / AnalyserNode wiring
- EQ
- Loudness normalization
- Hi-Fi / lossless tier
- Any feature flag scaffolding for the above

If a task is not directly fixing a player bug listed in Section 3, it is out of scope right now.

---

## 3. Approved Sequence

Work must happen in this order. Do not skip ahead. Do not parallelize the "later" block with the stability block.

### Stability block (do now)

1. **Fix mobile/global player bugs** — playback failures, state desync between mobile and global player, transport controls not responding.
2. **Fix track order** — the playing queue must reflect the displayed album/playlist order. No silent re-sorts.
3. **Fix duplicate handling** — duplicate tracks in a queue must not break navigation, "now playing," or progress state.
4. **Fix missing/invalid audio** — graceful handling of 404s, malformed files, and tracks with no playable source. No infinite spinners, no crashes.
5. **Verify playback across browsers and devices:**
   - iOS Safari
   - Chrome on Android
   - desktop Safari
   - desktop Chrome
   - desktop Firefox
6. **Audit existing visualizer/audio usage** — catalog every place in the codebase that already touches `<audio>`, `AudioContext`, or analyser nodes, so future work doesn't create a second graph or duplicate singletons.

### Later block (do **not** start until Section 5 gate is met)

7. Add feature flags for Deck Mode and related visual/audio features.
8. Expose the shared audio element ref from the global player.
9. Add a singleton `AudioContext` (one per page lifetime).
10. Bind a single `AnalyserNode` to the shared audio element.
11. Verify CORS for any remote audio sources used by the analyser path.
12. Implement **Classic Bars** visualizer.
13. Implement **Fullscreen Deck Mode**.
14. Integrate **Butterchurn**.
15. Implement **EQ**.
16. Implement **loudness normalization**.
17. Roll out **Hi-Fi / lossless tier**.

Each "later" item assumes the previous one shipped and was verified. Do not batch them.

---

## 4. Red Flags Codex Must Avoid

Any agent working on Porterful — Codex especially — must treat the following as hard stops. If a task or PR involves any of these while the stability gate (Section 5) is unmet, **stop and surface it to OD before proceeding.**

- Editing `src/lib/audio-context.tsx`.
- Editing `src/lib/features.ts`.
- Editing `src/components/GlobalPlayer.tsx`.
- Editing `src/components/Visualizer.tsx`.
- Editing any other player code.
- Creating a **second** `AudioContext`, a second analyser, or a parallel audio element.
- Calling `createMediaElementSource` on an element that already has one (the browser will throw, and the audio element becomes unusable for the rest of the page lifetime).
- Adding visualizer or analyser code that runs before user gesture / before the audio element is ready.
- Skipping the feature-flag step and shipping Deck Mode behind a route or a hidden toggle.
- "Quick wins" that touch the audio graph without the full stability checklist being green.
- Refactors of player code bundled into an unrelated PR.
- Removing or renaming existing visualizer / audio scaffolding before Section 3 step 6 (the audit) is done.

If any of these are tempting, the answer is: **not yet.**

---

## 5. Stability Gate (Required Before Any AudioContext / Analyser Work)

No work on items 7–17 may begin until **all** of the following are true:

- All Section 3 items 1–5 are fixed and verified.
- Section 3 item 6 (audit of existing visualizer/audio usage) is written down and reviewed.
- Playback has been smoke-tested on all five target browsers (iOS Safari, Chrome Android, desktop Safari, Chrome, Firefox) against a real catalog — not just a dev fixture.
- There is no open P0/P1 player bug.
- OD has explicitly said "green light Deck Mode."

Until every box above is checked, the audio graph is **frozen**. This includes adding "harmless" scaffolding, type stubs, or feature flags "in preparation."

---

## 6. Authorization Status

**No implementation is authorized today.**

This document records intent only. It does not authorize:

- Code changes to the files listed in Section 4.
- New files that introduce an `AudioContext`, `AnalyserNode`, or visualizer surface.
- Feature-flag scaffolding for Deck Mode, Classic Bars, Butterchurn, EQ, loudness normalization, or the Hi-Fi tier.
- Any UI affordance (button, route, menu item) that exposes Deck Mode to users or testers.

When OD is ready to start the "later" block, this spec will be updated with an explicit authorization line and a dated sign-off.
