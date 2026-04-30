# PORTERFUL PREVIEW + PRICE BUG REPORT

**Status:** ROOT CAUSES IDENTIFIED — ready to fix  
**Report Time:** 2026-04-29 21:00 CDT  
**Investigator:** Claw  

---

## BUG A: PREVIEW PLAYBACK DOES NOT WORK

### Reported Symptom
Artist sets track to "60-Second Preview" → saves → public playback still plays full track instead of stopping at 60 seconds.

### Root Cause

The `Track` interface in `audio-context.tsx` is **missing `playback_mode` and `preview_duration_seconds` fields**.

```tsx
// src/lib/audio-context.tsx
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  duration?: string | number;
  audio_url?: string;
  cover_url?: string;
  image?: string;
  plays?: number;
  price?: number;
  track_number?: number;
  // ❌ playback_mode missing
  // ❌ preview_duration_seconds missing
}
```

**What happens:**
1. DB track has `playback_mode = 'preview'` and `preview_duration_seconds = 60` ✅
2. Edit page saves these fields correctly ✅
3. API stores them correctly ✅
4. Public page fetches them with `select('*')` ✅
5. `mergeCanonicalTracks()` casts DB tracks to `Track` type ❌ **fields are lost**
6. `dedupeQueueTracks()` returns `Track[]` without preview fields ❌
7. Player receives tracks without `playback_mode` → never triggers preview stop ❌

**The audio-context.tsx HAS preview logic:**
```tsx
const handleTimeUpdate = () => {
  if (!audioRef.current) return
  const currentTime = audioRef.current.currentTime || 0
  setProgress(currentTime)

  const track = currentTrackRef.current
  if (track && (track as any).playback_mode === 'preview') {
    const previewDuration = (track as any).preview_duration_seconds || 60
    if (currentTime >= previewDuration) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }
}
```

The logic exists but the fields never reach the player because the `Track` type doesn't include them.

---

## BUG B: ARTIST CANNOT CHANGE TRACK PRICES

### Reported Symptom
Artist edits track price → saves → price doesn't update or doesn't reload.

### Root Cause

**Same problem: field name mismatch between DB and Track interface.**

| Source | Field Name |
|--------|-----------|
| DB schema | `proud_to_pay_min` DECIMAL(10,2) |
| Track interface | `price?: number` |
| Edit page state | `proudToPayMin` (string) |
| API accepts | `proud_to_pay_min` or `price` |
| Public page expects | `price` |

**What happens:**
1. Edit page saves `proud_to_pay_min` to API ✅
2. API stores it as `proud_to_pay_min` in DB ✅
3. Public page fetches tracks with `select('*')` ✅
4. DB returns `proud_to_pay_min` but Track interface expects `price` ❌
5. `mergeCanonicalTracks()` doesn't map `proud_to_pay_min` → `price` ❌
6. Public page shows `track.price` → undefined ❌

The edit page loads correctly because the API returns the full DB row (with `proud_to_pay_min`), and the edit page's local Track interface includes `proud_to_pay_min`:
```tsx
// src/app/(app)/dashboard/dashboard/artist/edit/track/[id]/page.tsx
interface Track {
  ...
  proud_to_pay_min: number
  price?: number  // alternate field
  ...
}
```

But when tracks are processed for public display, the `proud_to_pay_min` field is lost because `audio-context.tsx`'s `Track` type only has `price`.

---

## FILES INVOLVED

| File | Role | Issue |
|------|------|-------|
| `src/lib/audio-context.tsx` | Track interface definition | Missing `playback_mode`, `preview_duration_seconds`, `proud_to_pay_min` |
| `src/lib/track-dedupe.ts` | Track merging/deduping | Doesn't map DB fields to Track interface fields |
| `src/app/music/page.tsx` | Public music page | Reads `track.price` (undefined) instead of `track.proud_to_pay_min` |
| `src/app/(app)/artist/[slug]/page.tsx` | Artist public page | Tracks lose preview/price fields during merge |
| `src/app/(app)/dashboard/dashboard/artist/edit/track/[id]/page.tsx` | Legacy edit page | Has correct local Track interface |
| `src/app/dashboard/artist/tracks/[id]/edit/page.tsx` | Canonical edit page | Has correct local Track interface |

---

## SMALLEST SAFE FIX

### Option A: Update Track interface (RECOMMENDED)

**File:** `src/lib/audio-context.tsx`

```tsx
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  duration?: string | number;
  audio_url?: string;
  cover_url?: string;
  image?: string;
  plays?: number;
  price?: number;
  proud_to_pay_min?: number;  // ← ADD
  track_number?: number;
  playback_mode?: 'full' | 'preview' | 'locked';  // ← ADD
  preview_duration_seconds?: number;  // ← ADD
  unlock_required?: boolean;  // ← ADD
}
```

**Then update `mergeCanonicalTracks()` in `src/lib/track-dedupe.ts` to preserve these fields:**

```ts
// In the merge logic, when creating the final track object:
return {
  ...dbTrack,  // preserve all DB fields including new ones
  ...staticTrack, // static overrides for basic fields
  // Ensure DB-specific fields are preserved:
  playback_mode: dbTrack.playback_mode || staticTrack.playback_mode || 'full',
  preview_duration_seconds: dbTrack.preview_duration_seconds || staticTrack.preview_duration_seconds || 60,
  proud_to_pay_min: dbTrack.proud_to_pay_min || staticTrack.proud_to_pay_min || staticTrack.price || 1,
  price: dbTrack.proud_to_pay_min || dbTrack.price || staticTrack.price || 1,
}
```

**Wait — actually the simplest fix is to just update the Track interface.** Since `mergeCanonicalTracks` uses `...dbTrack` spread, if the DB track has extra fields and the Track interface allows them, they'll be preserved.

Actually, looking more carefully at `mergeCanonicalTracks`, the merged tracks are typed as `Track` from `audio-context.tsx`. TypeScript will strip unknown fields. So we need to update the Track interface.

### Option B: Update music page to read correct DB fields

In `src/app/music/page.tsx`, update TrackRow to read `proud_to_pay_min`:
```tsx
// Instead of: ${track.price || 0}
// Use: ${(track as any).proud_to_pay_min || track.price || 0}
```

This is a hack. Not recommended.

---

## RECOMMENDED FIX

**Step 1:** Update `Track` interface in `src/lib/audio-context.tsx`

```tsx
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  duration?: string | number;
  audio_url?: string;
  cover_url?: string;
  image?: string;
  plays?: number;
  price?: number;
  proud_to_pay_min?: number;
  track_number?: number;
  playback_mode?: 'full' | 'preview' | 'locked';
  preview_duration_seconds?: number;
  unlock_required?: boolean;
}
```

**Step 2:** Update `mergeCanonicalTracks` in `src/lib/track-dedupe.ts` to map `proud_to_pay_min` → `price`:

```ts
// After merging, ensure price is populated from DB field
if (!mergedTrack.price && dbTrack.proud_to_pay_min) {
  mergedTrack.price = dbTrack.proud_to_pay_min
}
```

**No DB migration needed.** Columns already exist from migration 020.

---

## VERIFICATION PLAN

After fix:
1. `/dashboard/artist/tracks/[id]/edit` — set preview mode + 60s → save → success
2. `/artist/od-porter` — play preview track → stops at 60s
3. `/music` — play preview track → stops at 60s
4. Edit page — change price → save → reload → price persists
5. Public page — shows correct price
6. Full track mode — plays normally without stopping
7. Build passes

---

## SUMMARY

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Preview not working | `Track` interface missing `playback_mode` / `preview_duration_seconds` | Add fields to interface |
| Price not updating | DB field `proud_to_pay_min` not mapped to `price` in Track interface | Add `proud_to_pay_min` field + mapping |
| DB migration needed | ❌ NO — fields already exist |
| Code files to touch | 2 (`audio-context.tsx`, `track-dedupe.ts`) |

---

**PASS — bugs identified. Fix ready for approval.**
