# PORTERFUL RIGHTS GATE — VERIFICATION REPORT

**Date:** 2026-05-01
**Scope:** Artist rights gate enforcement beyond the form UI
**Method:** Static code + schema audit — no changes made
**Repo root:** `/Users/sentinel/Documents/porterful`

---

## SUMMARY

| # | Check | Status |
|---|---|---|
| 1 | Form requires rights confirmation before submit | PASS |
| 2 | Backend API rejects submissions missing rights | **FAIL** |
| 3 | DB stores `agree_rights` and `license_type` correctly | PASS |
| 4 | Review page displays rights/license selections | **FAIL** |
| 5 | Upload access blocked before artist approval | PASS (transitive) |
| 6 | Safe fallback for existing artists with missing rights | **FAIL** |
| 7 | No public copy implies Porterful owns artist music | PASS |
| 8 | No exclusive-license language unless artist selects exclusive | PASS |

**Overall:** 3 FAILS — the gate is enforced at the form UI but not at the API, not surfaced to reviewers, and the legacy backfill silently presumes consent.

---

## 1. FORM REQUIRES RIGHTS CONFIRMATION — PASS

**File:** `src/app/(app)/apply/form/page.tsx`

- Two state fields seeded false / non_exclusive: `agree_rights: false`, `music_license_type: 'non_exclusive'` (lines 67–68)
- Step 5 renders the rights checkbox (lines 590–600) and the license radio group (lines 603–658)
- Submit button gated at line 729:
  ```
  disabled={!form.agree_terms || !form.agree_rights || !form.music_license_type || submitting}
  ```
- A user cannot submit through the UI without ticking both checkboxes and selecting a license type.

**Verdict:** UI gate works.

---

## 2. BACKEND API REJECTS MISSING RIGHTS — FAIL

**File:** `src/app/(app)/api/artist-application/route.ts`

- Required-field validation (lines 58–69) checks only: `user_id`, `stage_name`, `email`, `phone`.
- `agree_rights` and `music_license_type` are read from the body at line 113 and inserted at lines 137–138, but **never validated**:
  ```
  agree_rights: agree_rights === true,
  music_license_type: music_license_type === 'porterful_exclusive' ? 'porterful_exclusive' : 'non_exclusive',
  ```
- A non-browser client (curl, script, modified frontend) can POST without `agree_rights` and the row is inserted with `agree_rights = false`. The application proceeds to the auto-approve check, which does **not** consider `agree_rights`. If the artist meets the bio/genre/contact/music-link bar, they are auto-approved and their `profiles.role` is set to `artist` — without ever having confirmed rights server-side.
- `music_license_type` is silently coerced to `non_exclusive` if absent or invalid — no error returned.

**Bug:** The server-side rights gate is unenforced. The form-disabled button is a UX nicety, not a security control.

**Suggested fix (not applied):** Add validation before the insert — return 400 if `agree_rights !== true` or if `music_license_type` is not one of `non_exclusive` / `porterful_exclusive`.

---

## 3. DB STORES FIELDS CORRECTLY — PASS

**File:** `supabase/migrations/018_artist_application_license_type.sql`

- `agree_rights BOOLEAN DEFAULT FALSE` (line 9)
- `music_license_type TEXT DEFAULT 'non_exclusive'` (line 10) with CHECK constraint `valid_music_license_type` enforcing `('non_exclusive', 'porterful_exclusive')` (lines 13–15)
- Index `idx_artist_applications_license_type` for analytics (lines 25–26)
- Comments documenting both columns (lines 18–22)

Insert path at `route.ts:137-138` writes both values. Schema and write path are aligned.

**Verdict:** DB layer is correct.

---

## 4. REVIEW PAGE DISPLAYS RIGHTS/LICENSE — FAIL

**File:** `src/app/(app)/admin/page.tsx`

- The `Application` type (lines 7–27) does **not** declare `agree_rights` or `music_license_type`. Even if the API returned them, the typed UI ignores them.
- The application card (lines 131–183) and detail modal (lines 188–364) render: avatar, stage name, genre, city, bio, email, phone, social links, and submitted images. Neither field appears anywhere.
- `src/app/(app)/api/artist-application/update/route.ts` only updates `status` and creates the artist row; it does not read or surface rights data.

**Bug:** A human reviewer approving a `pending_review` application has no way to see whether the artist agreed to rights or which license type they chose. They are approving blind.

**Suggested fix (not applied):** Add `agree_rights` and `music_license_type` to the `Application` type, surface a clear badge in the list (e.g., "Rights: ✓ / Exclusive" vs "Rights: ✗ / Non-Exclusive"), and refuse approval if `agree_rights !== true`.

---

## 5. UPLOAD ACCESS BLOCKED PRE-APPROVAL — PASS (transitive)

**Files:**
- `src/app/(app)/dashboard/dashboard/upload/page.tsx:39-47` — client redirects to `/dashboard` if `profile.role !== 'artist'`.
- `src/app/api/tracks/route.ts:28-30` — POST returns 403 if `profile.role !== 'artist'`.

`profiles.role = 'artist'` is set only by:
- `src/app/(app)/api/artist-application/route.ts:184` (auto-approve path)
- `src/app/(app)/api/artist-application/update/route.ts:67-70` (admin approval)

So upload is gated on artist approval. The gate is enforced both in the dashboard page and at the tracks API.

**Note:** Neither the upload page nor the tracks API independently re-checks `agree_rights`. Enforcement is transitive: an approved artist is presumed to have agreed at application time. That presumption is **only as strong as Check 2** — which currently fails. Once Check 2 is fixed, this becomes a clean PASS.

---

## 6. EXISTING ARTIST FALLBACK — FAIL

**File:** `supabase/migrations/018_artist_application_license_type.sql:29-32`

```sql
UPDATE artist_applications
SET music_license_type = 'non_exclusive',
    agree_rights = COALESCE(agree_rights, TRUE)  -- Assume true for existing approved applications
WHERE music_license_type IS NULL;
```

The backfill flips legacy `agree_rights` from `NULL` to `TRUE`. This silently presumes consent that pre-migration artists never gave through this UI. The inline comment acknowledges the assumption.

This is the opposite of a "safe fallback." A safe fallback would either:
- (a) leave the legacy value `FALSE` and prompt re-acceptance before any sensitive action (publish, payout, exclusive change), or
- (b) flag the row with a `rights_acceptance_source = 'backfill'` field so reviewers can distinguish presumed consent from explicit consent.

**Bug:** Legacy artists' rights status is indistinguishable from explicitly-confirmed rights.

**Suggested fix (not applied):** Either revert the COALESCE to leave NULL, or add a provenance column. Block sensitive transitions on legacy rows until they re-confirm.

---

## 7. NO PUBLIC COPY IMPLIES PORTERFUL OWNS ARTIST MUSIC — PASS

**Files reviewed:**
- `src/app/(app)/terms/terms/page.tsx` — section 6 (lines 80–83):
  > "You retain ownership of content you upload. By uploading, you grant Porterful a license to display, distribute, and promote your content on the Platform. You represent that you have the right to upload all content."
- `src/app/(app)/terms/page.tsx` — redirects to `/terms/terms`.
- `src/app/(app)/privacy/privacy/page.tsx` — no music-ownership claims.

The string "ASSIGNMENT OF RIGHTS" appears in `src/app/(app)/law/legal-docs/page.tsx:344`, but that page is a **generic legal-document template generator** (NDAs, non-competes, partnership agreements, invention assignment, founder agreements) — a tool users fill in for their own purposes. It is not applied to artist music.

No public copy was found that asserts Porterful owns artist music.

**Verdict:** Copy is consistent with artist ownership.

---

## 8. NO FORCED EXCLUSIVE LANGUAGE — PASS

**File:** `src/app/(app)/apply/form/page.tsx:603-657`

- Default state: `music_license_type: 'non_exclusive'` (line 68).
- Non-exclusive option (lines 608–631) is labeled "Recommended" (green badge) and reads:
  > "I may also distribute, sell, stream, or promote this music on other platforms (Spotify, Apple Music, Bandcamp, etc.)"
- Exclusive language is scoped to the `porterful_exclusive` radio option block (lines 633–656):
  > "I agree this music will be available exclusively through Porterful…"
  > "⚠️ Exclusive content cannot be distributed elsewhere"
- The exclusive copy is **only rendered inside the option** — it is not a global agreement the artist passes through unselected.

**Verdict:** Exclusive license terms only appear when the artist actively selects exclusive.

---

## CRITICAL FILES

| File | Role |
|---|---|
| `src/app/(app)/apply/form/page.tsx` | Application form UI — gate works |
| `src/app/(app)/api/artist-application/route.ts` | Application POST — **rights validation missing** |
| `src/app/(app)/api/artist-application/update/route.ts` | Admin status update — does not surface rights |
| `src/app/(app)/admin/page.tsx` | Admin review UI — **does not display rights** |
| `supabase/migrations/018_artist_application_license_type.sql` | Schema — correct; **backfill presumes consent** |
| `src/app/(app)/dashboard/dashboard/upload/page.tsx` | Upload UI — role-gated |
| `src/app/api/tracks/route.ts` | Track POST — role-gated |
| `src/app/(app)/terms/terms/page.tsx` | Public terms — artist retains ownership |

---

## RECOMMENDED FIXES (not applied per directive)

Priority order, all small:

1. **API rights validation** — `api/artist-application/route.ts` should reject `agree_rights !== true` and unknown `music_license_type` with 400. Closes Checks 2 and (transitively) 5.
2. **Admin review surface** — `admin/page.tsx` should fetch and display `agree_rights` + `music_license_type` per application; refuse approval when `agree_rights !== true`. Closes Check 4.
3. **Backfill provenance** — add a `rights_acceptance_source` column or revert the `COALESCE(... TRUE)` so legacy and explicit consent are distinguishable. Closes Check 6.

None of these change the form, schema shape, or public copy. They harden gates that already exist but only run client-side.

---

**End of report.**
