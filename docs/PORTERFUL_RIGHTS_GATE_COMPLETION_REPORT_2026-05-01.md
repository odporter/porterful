# PORTERFUL RIGHTS GATE — COMPLETION REPORT

**Date:** 2026-05-01
**Scope:** Closing two of three gaps identified in the rights-gate verification pass
**Companion doc:** `docs/PORTERFUL_RIGHTS_GATE_VERIFICATION_2026-05-01.md`

---

## 1. ORIGINAL ISSUES FOUND

The verification pass surfaced three real gaps. Two are now closed; one remains open by design (legacy backfill).

| # | Gap | Status |
|---|---|---|
| 1 | API did not validate `agree_rights` server-side — form-disabled button was the only gate | **FIXED** |
| 2 | Admin review page hid `agree_rights` and `music_license_type` from reviewers — manual approvals were blind | **FIXED** |
| 3 | Migration 018 backfill (`COALESCE(agree_rights, TRUE)`) silently presumes consent for legacy artists | **OPEN** — see §6 |

The form UI gate, DB schema, upload role-gating, public copy, and exclusive-language scoping all passed verification and were not touched.

---

## 2. BACKEND VALIDATION FIX

**File:** `src/app/(app)/api/artist-application/route.ts`

- Hoisted `agree_rights` into the top body destructure so it's available alongside the existing required-field checks.
- Added a strict guard before any DB call:
  ```ts
  if (agree_rights !== true) {
    return NextResponse.json(
      { error: 'You must confirm you own or control the rights needed to submit this music.' },
      { status: 400 }
    )
  }
  ```
- `=== true` rejects `false`, `null`, `undefined`, `"true"` (string), `1`, and any other truthy-but-not-true value. A scripted client cannot bypass the gate by omitting the field.
- Removed the redundant second destructure further down the route; `music_license_type` is still read where it was, behavior unchanged.
- Insert path (`agree_rights: agree_rights === true`) left as-is — conservative, no semantic change.

The validation runs before existence check, auto-approve evaluation, insert, artist-row creation, and role promotion. A request without rights confirmation does not reach the DB.

---

## 3. ADMIN VISIBILITY FIX

**File:** `src/app/(app)/admin/page.tsx`

- Extended the `Application` type with `agree_rights: boolean | null` and `music_license_type: 'non_exclusive' | 'porterful_exclusive' | null`. The existing `select('*')` in the GET handler already returns these columns, so no API change was needed.
- Added a "Rights & License" section to the detail modal, placed directly after Bio. Two row-pills:

  | Field | Value | Label | Color |
  |---|---|---|---|
  | Rights ownership | `agree_rights === true` | "Rights confirmed" | green |
  | Rights ownership | `false` / `null` / `undefined` | "Rights not confirmed / legacy or incomplete" | yellow |
  | License type | `'porterful_exclusive'` | "Porterful Exclusive" | yellow |
  | License type | `'non_exclusive'` | "Non-Exclusive" | green |
  | License type | anything else | "License type missing" | yellow |

- Display labels only. No auto-approve/reject gating was added — reviewers still decide manually. The list-card was intentionally left unchanged per direction.

---

## 4. FILES CHANGED

| File | Change |
|---|---|
| `src/app/(app)/api/artist-application/route.ts` | Server-side `agree_rights !== true` rejection (400) |
| `src/app/(app)/admin/page.tsx` | `Application` type extended; "Rights & License" section added to detail modal |

No other files modified. Form UI, migrations, payout logic, terms copy, and the legacy backfill were not touched.

---

## 5. TYPECHECK / LINT RESULTS

Run from repo root after each change.

| Step | Command | Result |
|---|---|---|
| After backend fix | `npx tsc --noEmit` | exit 0, no output |
| After backend fix | `npx next lint --file 'src/app/(app)/api/artist-application/route.ts'` | "No ESLint warnings or errors" |
| After admin fix | `npx tsc --noEmit` | exit 0, no output |
| After admin fix | `npx next lint --file 'src/app/(app)/admin/page.tsx'` | "No ESLint warnings or errors" |

Both fixes pass cleanly.

---

## 6. REMAINING UNRESOLVED ITEM — LEGACY BACKFILL

**Source:** `supabase/migrations/018_artist_application_license_type.sql:29-32`

```sql
UPDATE artist_applications
SET music_license_type = 'non_exclusive',
    agree_rights = COALESCE(agree_rights, TRUE)  -- Assume true for existing approved applications
WHERE music_license_type IS NULL;
```

**The problem:** Any application submitted before migration 018 had its `agree_rights` flipped from `NULL` to `TRUE` without the artist ever confirming through the new UI. There is currently no provenance column to distinguish "explicitly confirmed via the form" from "presumed true by backfill."

**Why it stays open:** Resolving it touches data and migration history, which is out of scope for this pass. Three viable paths when ready:

1. **Add provenance** — add `rights_acceptance_source TEXT` (`'form' | 'backfill'`) and re-run a corrective migration that sets `'backfill'` for affected rows. Lowest blast radius. Surfaces honestly in the admin modal.
2. **Reset and re-prompt** — flip backfilled rows to `agree_rights = FALSE` and force re-acceptance on next login or before any sensitive transition (publish, payout, exclusive change). Stricter; more user friction.
3. **Soft-flag in the UI now, fix data later** — the admin modal already labels missing/unknown values as "Rights not confirmed / legacy or incomplete." Reviewers see the warning, but the underlying row still reads `TRUE` from the backfill, so this only helps if a reviewer happens to click in.

**Risk while open:** Legacy artists' rows are indistinguishable from explicitly-confirmed rows when queried programmatically. Any future automation that branches on `agree_rights = TRUE` (payout gates, exclusive enforcement, takedown automation) will treat them as fully confirmed.

**Recommendation:** Pick path 1 before any rights-gated automation ships. Path 2 if legal requires affirmative consent on record.

---

**End of report.**
