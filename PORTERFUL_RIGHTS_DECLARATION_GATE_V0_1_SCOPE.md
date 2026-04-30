# PORTERFUL RIGHTS DECLARATION GATE — v0.1 FINAL SCOPE

**Status:** SCOPE LOCKED — awaiting Od go-ahead  
**Commit target:** `feat(tracks): add rights declaration gate v0.1`  
**Report time:** 2026-04-29 20:50 CDT  

---

## 1. FINAL V0.1 SCOPE

Add a strict rights declaration gate to the upload and edit flow. Unverified tracks stay **private** until cleared. No workarounds.

| Feature | In v0.1? |
|---------|----------|
| Rights declaration section on upload | ✅ YES |
| Rights declaration section on edit | ✅ YES |
| DB fields for rights status | ✅ YES |
| Track-level public/private filtering | ✅ YES |
| Dashboard status badges | ✅ YES |
| Producer splits | ❌ DEFERRED |
| Payments/unlock | ❌ DEFERRED |
| Cover licensing workflow | ❌ DEFERRED |
| DMCA process | ❌ DEFERRED |
| Merch | ❌ DEFERRED |
| Album order | ❌ DEFERRED |

---

## 2. FINAL DB MIGRATION SQL

**File:** `supabase/migrations/021_track_rights_declaration.sql`

```sql
-- ============================================
-- MIGRATION 021: Track Rights Declaration Gate
-- ============================================

-- Rights status of the track
ALTER TABLE tracks
  ADD COLUMN IF NOT EXISTS rights_status TEXT DEFAULT 'original',
  ADD COLUMN IF NOT EXISTS rights_declaration_accepted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS rights_declaration_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rights_review_status TEXT DEFAULT 'not_required',
  ADD COLUMN IF NOT EXISTS rights_notes TEXT,
  ADD COLUMN IF NOT EXISTS monetization_allowed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS public_stream_allowed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS download_allowed BOOLEAN DEFAULT FALSE;

-- Constraint on rights_status
ALTER TABLE tracks DROP CONSTRAINT IF EXISTS valid_rights_status;
ALTER TABLE tracks ADD CONSTRAINT valid_rights_status
  CHECK (rights_status IN (
    'original',
    'licensed_beat',
    'cover_song',
    'sample_or_remix',
    'third_party_master',
    'private_review'
  ));

-- Constraint on rights_review_status
ALTER TABLE tracks DROP CONSTRAINT IF EXISTS valid_rights_review_status;
ALTER TABLE tracks ADD CONSTRAINT valid_rights_review_status
  CHECK (rights_review_status IN (
    'not_required',
    'pending_review',
    'approved',
    'rejected',
    'needs_more_info'
  ));

-- Index for public page filtering
CREATE INDEX IF NOT EXISTS idx_tracks_public_filter
  ON tracks(is_active, rights_declaration_accepted, public_stream_allowed)
  WHERE is_active = TRUE AND rights_declaration_accepted = TRUE AND public_stream_allowed = TRUE;

-- RLS policy: artists can update their own tracks' rights fields
CREATE POLICY IF NOT EXISTS "Artists can update own track rights" ON tracks
  FOR UPDATE USING (auth.uid() = artist_id)
  WITH CHECK (auth.uid() = artist_id);

-- Backfill: set all existing tracks to pending_review to force re-declaration
UPDATE tracks
  SET rights_review_status = 'pending_review',
      rights_status = 'original',
      rights_declaration_accepted = FALSE,
      public_stream_allowed = FALSE,
      monetization_allowed = FALSE,
      download_allowed = FALSE
  WHERE rights_declaration_accepted IS NULL
     OR rights_declaration_accepted = FALSE;
```

---

## 3. UPLOAD/EDIT UI COPY

### Track Rights Section (Upload + Edit)

**Heading:** Track Rights & Ownership

**Artist must choose one:**

1. **Original work**
   > I own or control the beat, lyrics, recording, artwork, and all rights needed to upload this track.

2. **Licensed beat/material**
   > I have permission/license for this material and can provide proof if requested.

3. **Cover song**
   > This is a cover song. I understand I may need additional mechanical licensing before it can be sold or downloaded.

4. **Sample / remix / freestyle over third-party beat**
   > This track contains samples, remixes, or a third-party instrumental. It requires review before monetization or public sale.

5. **Private review only**
   > Keep this track private. I will handle rights clearance before publishing.

**Required checkbox:**

> [ ] I confirm that the information above is accurate and that I have the rights or permissions needed for the selected use.

**Save Track button:**
- Disabled until rights option selected AND declaration checkbox checked

---

## 4. PUBLIC FILTERING RULE

Public artist page (`/artist/[slug]`) only shows tracks where:

```sql
SELECT * FROM tracks
WHERE artist_id = :artist_id
  AND is_active = TRUE
  AND audio_url IS NOT NULL
  AND public_stream_allowed = TRUE
  AND rights_declaration_accepted = TRUE;
```

**If a track fails any of these:** it is hidden from public view but still visible in the artist dashboard.

---

## 5. DASHBOARD STATUS BADGES

| Status | Badge | Color | Meaning |
|--------|-------|-------|---------|
| Rights Verified | "Rights Verified" | Green | Original + declaration accepted |
| Review Required | "Review Required" | Yellow | Cover/sample/third-party declared |
| Private Review | "Private Review" | Gray | Artist chose private mode |
| Missing Declaration | "Missing Declaration" | Red | Pre-migration or unchecked |

---

## 6. PUBLISHING LOGIC

### Original work + declaration accepted
- `public_stream_allowed` = TRUE
- `monetization_allowed` = TRUE
- `download_allowed` = TRUE
- `rights_review_status` = 'not_required'

### Licensed beat/material + declaration accepted
- `public_stream_allowed` = TRUE
- `monetization_allowed` = FALSE (until manual review)
- `download_allowed` = FALSE
- `rights_review_status` = 'pending_review'

### Cover song + declaration accepted
- `public_stream_allowed` = FALSE
- `monetization_allowed` = FALSE
- `download_allowed` = FALSE
- `rights_review_status` = 'pending_review'

### Sample/remix/third-party + declaration accepted
- `public_stream_allowed` = FALSE
- `monetization_allowed` = FALSE
- `download_allowed` = FALSE
- `rights_review_status` = 'pending_review'

### Private review
- `public_stream_allowed` = FALSE
- `monetization_allowed` = FALSE
- `download_allowed` = FALSE
- `rights_review_status` = 'pending_review' (or 'not_required')

---

## 7. FILES TO TOUCH

| # | File | Change |
|---|------|--------|
| 1 | `src/app/(app)/dashboard/dashboard/upload/page.tsx` | Add Track Rights section |
| 2 | `src/app/dashboard/artist/tracks/[id]/edit/page.tsx` | Add Track Rights edit section |
| 3 | `src/app/api/tracks/route.ts` | Accept + store rights fields on POST |
| 4 | `src/app/api/tracks/[id]/route.ts` | Accept + store rights fields on PATCH |
| 5 | `src/app/(app)/artist/[slug]/page.tsx` | Filter public tracks with rights check |
| 6 | `src/app/(app)/dashboard/artist/page.tsx` | Add dashboard status badges |
| 7 | `supabase/migrations/021_track_rights_declaration.sql` | DB migration |

---

## 8. SMOKE TESTS

| Test | Expected |
|------|----------|
| Upload track without rights declaration | Error: "Rights declaration required" |
| Upload track as "Original" + checkbox | Success, track shows "Rights Verified" |
| Upload track as "Cover" + checkbox | Success, track shows "Review Required", hidden from public |
| Edit track to change rights status | Status updates, public visibility recalculates |
| Public page loads | Only "Rights Verified" tracks visible |
| Dashboard loads | All tracks visible with correct badge |
| Existing track (pre-migration) | Shows "Missing Declaration", hidden from public |

---

## 9. WHAT REMAINS DEFERRED

| Feature | Deferred to |
|---------|-------------|
| Producer splits | v0.3+ |
| Payment distribution | v0.3+ |
| Cover song licensing integration | v0.4+ |
| DMCA takedown workflow | v0.4+ |
| Automatic legal review | v0.5+ |
| Rights document upload | v0.3+ |
| Sample clearance database | v0.5+ |
| Merch integration | v0.6+ |
| Catalog ordering | Already working, no change |
| Player preview behavior | Already working, no change |

---

**SCOPE LOCKED. Awaiting Od's go-ahead to implement.**
