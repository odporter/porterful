# Porterful Likeness Gateway — Design Document
**Status: DESIGN PROPOSED — NOT APPROVED FOR PRODUCTION**
**Last updated: 2026-04-12**

---

## 1. What Is Being Verified

**Narrow claim:** A Likeness Gateway verifies that an artist has a **registry linkage** at LikenessVerified.com — specifically, that the email address used to register at LikenessVerified.com matches the email address on their Porterful account.

**What it does NOT claim:**
- Does NOT verify legal identity
- Does NOT verify real-world personhood
- Does NOT verify ownership of anything beyond the registry record
- Does NOT confer any legal rights, protection, or authority

**Registry linkage =** A record in the LikenessVerified.com system where:
- `registrations.likeness_id` is a unique identifier
- `registrations.email` is the account holder's email
- `registrations.full_name` is the registered name

The gateway checks: does this artist's Porterful email match the email on file at LikenessVerified.com for this Likeness ID?

---

## 2. Profile Fields Stored in Porterful

| Field | Type | Written by | Purpose |
|---|---|---|---|
| `likeness_registry_id` | TEXT | `/api/likeness/link`, `/api/likeness/status` | Links artist to Likeness registry record |
| `likeness_verified` | BOOLEAN | Same | Cached "linked and email-matched" flag |
| `likeness_verified_at` | TIMESTAMPTZ | Same | When linkage was first confirmed |
| `likeness_name_match` | BOOLEAN | `/api/likeness/verify` | Whether first name in registry matches Porterful profile |

**No other data pulled from Likeness.** Email, full name, voice/photo URLs are NOT stored in Porterful.

---

## 3. What Minimum Data Is Pulled from Likeness

On link (manual):
```
GET registrations?likeness_id=<id>
→ likeness_id, email, created_at
```

On status sync (automatic on login):
```
GET registrations?email=<user_email>&order=created_at.desc&limit=1
→ likeness_id, email, name, created_at
```

Nothing else. Voice recordings, photo URLs, certificate data are never pulled into Porterful.

---

## 4. Linkage Recheck Policy

**On manual link:** Full email match required against Likeness registry. If registry email ≠ Porterful email → 403 reject.

**On status sync (login):** Queries Likeness registry by authenticated user's email. If a matching record exists, syncs to Porterful. This is passive revalidation — happens every time the artist visits `/dashboard/likeness` or `/api/likeness/status`.

**Staleness mechanism:** If a Likeness record is deleted or invalidated at the source, Porterful's `likeness_verified=true` becomes stale. The next status sync (on next login) would not find a matching record and would NOT update the flag — but it also would NOT clear the flag.

**Proposed fix for staleness:** On each status sync, if the Likeness registry record is not found for the user's email, set `likeness_verified=false` in Porterful. This has not been implemented.

---

## 5. How Unlink / Invalid / Missing Records Behave

| Scenario | Current behavior | Proposed behavior |
|---|---|---|
| Artist wants to unlink | No mechanism exists | Admin-only unlink (manual DB operation) |
| Likeness record deleted from registry | `likeness_verified` stays `true` in Porterful | On next sync: check if record exists; set `likeness_verified=false` |
| Likeness record's email changed | Link stays valid | Link stays valid (Porterful only checks on link/sync) |
| `likeness_registry_id` manually cleared | Artist unlinked | Artist unlinked |
| Artist changes Porterful email | No revalidation triggered | Re-validation needed (not implemented) |

**Open decision:** Should a Porterful email change trigger a mandatory Likeness re-verification?

---

## 6. How Raw Identifiers Are Protected

**Public exposure:**
- Artist cards/pages: `likeness_registry_id` is NOT selected in any public query
- `likeness_verified` is NOT exposed in public artist profiles
- No Likeness IDs appear in URLs, API responses to unauthenticated users, or client-side bundles

**Authenticated exposure (artist sees their own):**
- `/dashboard/likeness` page: shows the artist's own `likeness_registry_id` to that artist
- `/api/likeness/status`: returns `likeness_id` to authenticated artist only
- No other artist can see another artist's Likeness ID

**Stored in database:**
- `likeness_registry_id` in `profiles` table — same table as other artist data
- Accessible via service role key (same as all other profile data)

---

## 7. Gateway Enforcement Scope

**PROPOSED — not implemented:**

Option A: Block payouts only
- Artist can list products, receive orders
- Artist cannot withdraw earnings or receive payouts
- Payout API route checks `likeness_verified` before processing

Option B: Block selling + payouts
- Artist cannot list new products
- Existing orders fulfill normally
- Artist cannot withdraw earnings
- Product listing API checks `likeness_verified`
- Payout API checks `likeness_verified`

Option C: Block listing only (lightest touch)
- Artist cannot list new products until verified
- Existing products stay live
- Payouts continue normally
- Graceful: gives artists incentive without blocking revenue

**Decision required:** Which option? This affects UX for existing artists significantly.

---

## 8. How This Affects Already-Onboarded Artists

**Existing artists without Likeness linkage:**
- `likeness_verified = false` (default)
- Dashboard shows verification banner
- Can continue operating normally until enforcement is active
- No retroactive removal of listings

**Proposed grandfather clause:**
- Artists who applied before gateway launch: 30-day grace period
- Banner shown, but enforcement not active during grace
- After grace: must verify to list new products or withdraw

**Artists with pre-existing linkage (manual):**
- Already verified via email-match flow ✅
- No action needed

---

## 9. Likeness Link vs. Likeness Verify — Two Separate Flows

**`/api/likeness/link`** (manual, artist-initiated):
- Artist enters their Likeness ID from likenessverified.com
- API fetches registry record, checks `registration.email === userEmail`
- On match: writes linkage to Porterful profile
- Spoofing-resistant ✅ (email match enforced)

**`/api/likeness/status`** (automatic, on login/visit):
- System queries Likeness registry by authenticated user's email
- If record found: syncs linkage to Porterful
- Artist does nothing — purely passive sync
- No spoofing risk because it queries by authenticated email, not user-supplied ID

**`/api/likeness/verify`** (manual, admin/internal):
- Accepts email or user_id as query param
- Looks up by email in registry
- Used for one-time onboarding sync
- Not exposed as a user-facing route

**Security note:** The link route is the only user-facing write path. The email match check is now enforced.

---

## 10. Trust Layer Claims — What Is Strictly True

- ✅ "This artist has linked their Likeness ID from LikenessVerified.com"
- ✅ "The email on the Likeness registry matches their Porterful email"
- ✅ "The Likeness ID was verified against the Likeness registry at time of linking"

**What cannot be claimed:**
- ❌ "This artist is who they say they are"
- ❌ "This artist owns their likeness"
- ❌ "This artist has legal protection"
- ❌ "This artist is verified by Likeness™ as a real person"

---

## 11. Open Decisions (Require Od Approval)

1. **Enforcement scope:** Option A (payouts only), B (selling + payouts), or C (listing only)?
2. **Staleness fix:** Should `likeness_verified` be set to `false` if status sync doesn't find a registry record?
3. **Email change re-validation:** Should changing Porterful email require re-verifying Likeness?
4. **Grace period:** 30 days for existing artists? Shorter? Longer?
5. **Unlink mechanism:** Should artists be able to manually unlink, or only admin?

---

*This document is design-only. No enforcement code is active in production.*
