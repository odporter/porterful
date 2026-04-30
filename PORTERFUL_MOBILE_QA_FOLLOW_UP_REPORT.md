# PORTERFUL MOBILE QA FOLLOW-UP REPORT

**Commit:** `edd7e567`  
**Branch:** main  
**Deployment URL:** https://porterful.com  
**Report Time:** 2026-04-29 20:45 CDT

---

## 1. Existing Artist Apply/Sign-In Loop

**Status:** FIXED ✅  
**Files changed:**
- `src/app/(app)/apply/form/page.tsx` — Added `useEffect` check for existing artist on mount

**Route tested:** `/apply/form`  
**Mobile viewport result:** ✅ Existing artists redirected to `/dashboard/artist`

**Notes:**
- Added `checkingArtist` state with loading spinner
- On mount, checks `artists` table + `profiles.role` for current user
- If artist exists, calls `router.replace('/dashboard/artist')` — prevents re-applying
- If not artist, shows apply form normally
- Handles both DB artist record and profile role check

**Before fix:**
- Logged-in artist could visit `/apply/form`
- Would see full 5-step application form
- Could re-submit application
- No redirect or warning

**After fix:**
- Existing artist → brief "Checking your account..." spinner → redirect to dashboard
- New user → sees apply form normally

---

## 2. Profile Image Canonical Field

**Status:** FIXED ✅  
**Canonical field:** `artists.avatar_url` (DB) / `artists.image` (static fallback)  
**Files changed:**
- `src/lib/artist-db.ts` — Updated `mergeArtistData` to prefer `avatar_url`

**Routes tested:**
- `/artist/od-porter` — public page
- `/dashboard/artist/edit` — profile edit
- `/settings/settings` — settings page

**Mobile viewport result:** ✅ Consistent image loading

**Notes:**
- DB column: `artists.avatar_url` (added via `artist-profile-columns.sql`)
- Static fallback: `artists.image` (from `src/lib/artists.ts`)
- Public page (`artist/[slug]/page.tsx`) reads `artist.image` (merged from DB `avatar_url`)
- Settings page writes to `profiles.avatar_url` AND `artists.avatar_url`
- Dashboard edit page writes to `artists.avatar_url` and `artists.cover_url`

**Canonical chain:**
```
DB: artists.avatar_url → mergeArtistData() → artist.image → public page
Static: artists.image → fallback when no DB record
```

**Before fix:**
- `mergeArtistData` used `dbArtist.image` (non-existent column)
- Now uses `dbArtist.avatar_url` (correct column)

---

## 3. Mobile Menu Close

**Status:** FIXED ✅  
**Files changed:**
- `src/components/Navbar.tsx` — Added `pt-safe` class to mobile menu container
- `src/app/globals.css` — Added `.pt-safe` and `.pb-safe` utility classes

**Route tested:** `/` (homepage) — open hamburger menu  
**Mobile viewport result:** ✅ Close button accessible on iPhone

**Notes:**
- Mobile menu container now uses `pt-safe` instead of fixed `pt-20`
- `pt-safe` = `padding-top: max(env(safe-area-inset-top, 0px), 1rem)`
- Ensures content starts below iOS status bar / dynamic island
- Close button (X) is now tappable, not hidden behind status bar
- Tap-outside-to-close already works (via `onClick` on menu container)
- Escape key closes menu (already implemented)

**Before fix:**
- `pt-20` (5rem / 80px) fixed padding
- On iPhone with dynamic island, close button could be obscured

**After fix:**
- `pt-safe` adapts to device safe area
- Close button always visible and tappable

---

## SUMMARY

| # | Issue | Status | Files |
|---|-------|--------|-------|
| 1 | Existing artist apply loop | ✅ FIXED | `apply/form/page.tsx` |
| 2 | Profile image canonical field | ✅ FIXED | `artist-db.ts` |
| 3 | Mobile menu close/safe area | ✅ FIXED | `Navbar.tsx`, `globals.css` |

---

**All Phase 2/3 items resolved. Build clean. Deployed to production.**
