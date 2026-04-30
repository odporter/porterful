# PORTERFUL RIGHTS DECLARATION GATE — AUDIT REPORT

**Status:** AUDIT COMPLETE — Ready for v0.1 implementation  
**Auditor:** Claw  
**Report Time:** 2026-04-29 20:40 CDT  
**Scope:** Upload flow, track edit, DB schema, public publishing logic

---

## EXECUTIVE SUMMARY

No spec files found (`PORTERFUL_RIGHTS_DECLARATION_GATE_IMPLEMENTATION_PLAN.md` or `PORTERFUL_MARKETPLACE_RIGHTS_SPLITS_PLAYER_ONBOARDING_SPEC.md` do not exist in repo). Conducted codebase audit instead.

**Current State:**
- Upload form has NO rights declaration gate
- Track edit page has NO rights declaration section
- DB `tracks` table has NO rights-related fields
- Artist application form HAS `agree_rights` checkbox (for artist signup, not per-track)
- Artist application form HAS `music_license_type` (non_exclusive / porterful_exclusive)
- No per-track rights verification exists

**v0.1 Recommendation:** Add a lightweight rights declaration checkbox to the upload flow + track edit page, store it on the `tracks` table. This is the smallest safe scope before payments, splits, samples, or covers.

---

## 1. UPLOAD PAGE AUDIT

**File:** `src/app/(app)/dashboard/dashboard/upload/page.tsx` (canonical)

### Current Form Fields
| Field | Type | Required |
|-------|------|----------|
| Audio file | File upload | ✅ Yes |
| Cover art | File upload | ❌ Optional |
| Track title | Text input | ✅ Yes |
| Price (USD) | Number | ❌ Defaults to $1 |
| Album / Project | Text | ❌ Optional |
| Description | Textarea | ❌ Optional |

### What's Missing
- ❌ Rights declaration checkbox
- ❌ "I own the rights to this track" confirmation
- ❌ Original work vs cover/sample disclosure
- ❌ Producer split declaration
- ❌ Sample clearance status

### Upload API Call
```tsx
const res = await fetch('/api/tracks', {
  method: 'POST',
  body: JSON.stringify({
    title,
    audio_url,
    cover_url,
    album,
    price,
    description,
  })
})
```
**Note:** No rights fields passed to API.

---

## 2. TRACK EDIT PAGE AUDIT

**File:** `src/app/dashboard/artist/tracks/[id]/edit/page.tsx` (canonical)

### Current Edit Form Fields
| Field | Type |
|-------|------|
| Track Title | Text |
| Playback Access | Radio: full / preview / locked |
| Preview Duration | Number (seconds) |
| Track is visible | Checkbox |

### What's Missing
- ❌ Rights declaration section
- ❌ Ownership verification
- ❌ Producer/collaborator splits
- ❌ Sample/cover disclosure
- ❌ License type selector (per-track)

---

## 3. TRACKS TABLE SCHEMA AUDIT

**File:** `supabase/schema.sql`

```sql
CREATE TABLE tracks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  duration INTEGER,
  audio_url TEXT,
  cover_url TEXT,
  play_count INTEGER DEFAULT 0,
  proud_to_pay_min DECIMAL(10,2) DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Existing Fields (from migrations)
- `playback_mode` TEXT DEFAULT 'full' — added in migration 020
- `preview_duration_seconds` INTEGER DEFAULT 60 — added in migration 020
- `unlock_required` BOOLEAN DEFAULT false — added in migration 020
- `track_number` INTEGER — added in migration 017
- `featured` BOOLEAN — added in migration 016
- `description` TEXT — added in migration 015

### Missing Fields (needed for rights gate)
- ❌ `rights_declaration_verified` BOOLEAN DEFAULT false
- ❌ `original_work` BOOLEAN DEFAULT true
- ❌ `contains_samples` BOOLEAN DEFAULT false
- ❌ `sample_cleared` BOOLEAN DEFAULT false
- ❌ `cover_song` BOOLEAN DEFAULT false
- ❌ `producer_splits` JSONB DEFAULT '[]'
- ❌ `license_type` TEXT DEFAULT 'non_exclusive'

---

## 4. ARTIST APPLICATION FORM (EXISTS)

**File:** `src/app/(app)/apply/form/page.tsx`

### Existing Rights-Related Fields
| Field | Type | Context |
|-------|------|---------|
| `agree_terms` | Checkbox | Artist agrees to platform Terms of Service |
| `agree_rights` | Checkbox | Artist confirms they own rights to their music |
| `music_license_type` | Radio | non_exclusive / porterful_exclusive |

**Important:** These are artist-level declarations (at signup), NOT per-track declarations. An artist could upload a cover or sample later without per-track verification.

---

## 5. PUBLIC PUBLISHING LOGIC

**File:** `src/app/(app)/artist/[slug]/page.tsx`

### Current Behavior
- Tracks displayed if `is_active = true`
- No rights verification check before showing
- No "pending review" state for unverified uploads

### What's Needed for v0.1
- If `rights_declaration_verified = false` → show track with "Pending rights verification" badge
- If `original_work = false` AND (`contains_samples = true` OR `cover_song = true`) → show disclosure badge

---

## 6. CURRENT TERMS/RIGHTS CHECKBOXES

| Location | Checkbox | Status |
|----------|----------|--------|
| Artist application (`/apply/form`) | `agree_terms` | ✅ Exists |
| Artist application (`/apply/form`) | `agree_rights` | ✅ Exists |
| Track upload (`/dashboard/upload`) | None | ❌ Missing |
| Track edit (`/dashboard/artist/tracks/[id]/edit`) | None | ❌ Missing |

---

## 7. V0.1 IMPLEMENTATION SCOPE (RECOMMENDED)

### Goal
Add a lightweight rights declaration gate to uploads and track edits. Do NOT implement producer splits, sample clearance workflows, or payment distribution yet.

### DB Migration (v0.1)

```sql
-- Migration: 021_track_rights_declaration.sql

-- Add rights declaration fields to tracks table
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS rights_declaration_verified BOOLEAN DEFAULT false;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS original_work BOOLEAN DEFAULT true;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS contains_samples BOOLEAN DEFAULT false;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS cover_song BOOLEAN DEFAULT false;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS rights_notes TEXT;

-- Index for filtering unverified tracks
CREATE INDEX IF NOT EXISTS idx_tracks_rights_verified ON tracks(rights_declaration_verified);

-- RLS: artists can update their own tracks' rights fields
CREATE POLICY "Artists can update own track rights" ON tracks
  FOR UPDATE USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);
```

### Files to Touch (v0.1)

| # | File | Change |
|---|------|--------|
| 1 | `src/app/(app)/dashboard/dashboard/upload/page.tsx` | Add rights declaration checkbox section |
| 2 | `src/app/dashboard/artist/tracks/[id]/edit/page.tsx` | Add rights declaration edit section |
| 3 | `src/app/api/tracks/route.ts` | Accept rights fields on POST |
| 4 | `src/app/api/tracks/[id]/route.ts` | Accept rights fields on PATCH |
| 5 | `supabase/migrations/021_track_rights_declaration.sql` | DB migration |

### UI Copy (Upload Form)

```
--- Rights Declaration ---

[ ] I confirm that I own or control all rights necessary 
    to upload, distribute, and sell this track on Porterful.

[ ] This is an original work created by me.
    (If unchecked: [ ] This track contains samples  [ ] This is a cover song)

⚠️ If your track contains samples or is a cover song, 
    you are responsible for obtaining all necessary licenses 
    before making it available for sale.

[Save Track] (disabled until rights checkbox is checked)
```

### What Blocks Publishing (v0.1)
- `rights_declaration_verified = false` → track shows "Rights pending" badge
- Track is still visible/listenable but clearly marked
- Does NOT block upload — artist can save draft

### What Remains Private/Review-Only
- Producer splits → NOT in v0.1
- Sample clearance workflow → NOT in v0.1
- Payment distribution → NOT in v0.1
- Automated rights verification → NOT in v0.1
- Cover song licensing → NOT in v0.1

### What Must Wait for Legal/Payment Review
- Producer split percentages and payouts
- Sample clearance database integration
- Cover song mechanical licensing (Harry Fox, Easy Song Licensing)
- DMCA takedown workflow
- Rights dispute resolution

---

## 8. FILES NOT TO TOUCH

| System | Status |
|--------|--------|
| Player | ✅ Untouched |
| Catalog/audio ordering | ✅ Untouched |
| Album order | ✅ Untouched |
| Profile image | ✅ Untouched |
| Upload bucket/storage | ✅ Untouched |
| Merch | ✅ Untouched |
| Payments/Stripe | ✅ Untouched |
| Unlock system | ✅ Untouched |

---

## 9. SAFEST NEXT STEP

1. **Create migration** `021_track_rights_declaration.sql`
2. **Add rights section** to upload form (checkbox + original work toggle)
3. **Add rights section** to track edit page (same fields, editable)
4. **Update API routes** to accept/store rights fields
5. **Add visual indicator** on public track/artist page for unverified tracks
6. **Test** with existing tracks (default `rights_declaration_verified = false`)

---

## 10. RISK ASSESSMENT

| Risk | Level | Mitigation |
|------|-------|------------|
| Adding columns to `tracks` | LOW | Safe ALTER TABLE with IF NOT EXISTS |
| Changing upload form | LOW | Additive change, no breaking |
| Existing tracks unverified | LOW | Default `false`, visible badge only |
| Legal liability | MEDIUM | Clear "artist responsibility" copy |

---

**AUDIT COMPLETE. v0.1 scope defined. Ready for Od's go-ahead to implement.**
