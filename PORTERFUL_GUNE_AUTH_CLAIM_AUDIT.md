# Porterful Gune Auth Claim Audit

Docs-only audit. No code changes made.

Last verified: 2026-04-27

## Executive Summary

The live Supabase auth account for `jameschapplejr@gmail.com` exists, but there is no matching `profiles` row and no `artists` row for `gune` in the live database. That means Gune currently has a registered auth account, but no app profile and no ownership link to the existing public artist slug.

The current flow treats an already-registered email as a failed signup, then routes successful sign-ins into dashboard/onboarding paths that assume a profile already exists. There is no dedicated public claim path that says: "this account already exists, sign in, then attach it to the existing Gune artist page."

The result is a loop:

1. Signup says the email is already registered.
2. Sign-in succeeds, but the app routes into generic dashboard/onboarding logic.
3. Artist-specific screens require `profiles.role === 'artist'` and/or an `artists` row, which are missing.
4. The user is pushed back toward Join Porterful instead of a claim state for the existing page.

PWA/stale-shell issues can make this feel worse, but they are secondary. The core problem is a missing auth/profile/artist link plus redirect logic that does not understand "existing user claiming an existing artist page."

## Current Database Link Status

Live Supabase check results:

| Item | Status | Notes |
| --- | --- | --- |
| `auth.users` | Present | `jameschapplejr@gmail.com` exists with auth user id `8c2a1546-4c66-4d10-af90-fa23b2991fc4` |
| `profiles` | Missing | No row for that email / user id |
| `artists` | Missing | No row for slug `gune` |
| `claimed artist link` | Missing | Schema uses `artists.id = profiles.id`; there is no separate `owner_id` or `profile_id` field to inspect |
| `artist_applications` | Unclear / not in live schema cache | REST API returned `PGRST205` for `public.artist_applications`, so treat the application table as unverified until Supabase confirms it is present |

## How The App Models Identity

The app currently distinguishes these states only indirectly:

| State | Where it is stored | Current Gune status | Result |
| --- | --- | --- | --- |
| Registered user | `auth.users` | Yes | User can authenticate |
| Completed profile | `profiles` row | No | Dashboard and role checks have nothing to read |
| Role | `profiles.role` | No profile row, so no runtime role | Artist/admin/supporter detection fails or falls back |
| Claimed artist page | `artists.id = profiles.id` plus matching slug | No | Existing public page is not connected to the auth user |
| Pending claim state | None obvious | Not implemented | The app has no explicit "claim in progress" branch |

The important detail is that the canonical ownership model is `profiles.id` -> `artists.id`. There is no separate claim-owner column to patch around.

## Exact Root Cause

### 1. Existing emails are handled as hard errors on signup

`src/app/(app)/api/auth/signup/route.ts` creates users directly with `supabase.auth.admin.createUser(...)`. In the committed code, if Supabase returns the duplicate-email error, that error is sent straight back to the client.

There is already an uncommitted change in `src/app/(app)/signup/page.tsx` that catches duplicate-email responses and redirects the user to login. That is a good first step, but it only solves the signup dead-end. It does not yet connect the user to the existing Gune page or repair the missing profile/artists rows.

### 2. Sign-in does not establish artist ownership

`src/app/(app)/login/LoginClient.tsx` and `src/app/(app)/api/auth/login/route.ts` both route successful sign-ins toward `/dashboard` or a caller-provided next path. Neither path creates or repairs the missing profile/artist link.

`src/app/auth/callback/route.ts` also defaults to `/dashboard`. It has no artist-claim awareness.

### 3. Dashboard logic assumes a profile should already exist, then falls back to generic onboarding

`src/app/(app)/dashboard/page.tsx` will auto-create a generic `supporter` profile if one is missing. That prevents one redirect loop, but it also means an unclaimed user is treated as a generic supporter instead of an artist claimant.

Artist-only screens then enforce `profiles.role === 'artist'`, so a user without the correct profile row is pushed back toward general dashboard or onboarding paths.

### 4. The existing claim path is manual/admin-only, not public self-service

`src/app/api/artist-invite/route.ts` is the closest thing to a claim flow. It is manual/admin-only and sends existing users to password reset and new users to signup.

`src/app/(app)/api/admin/invite-artist/route.ts` even hardcodes Gune (`jameschapplejr@gmail.com`, slug `gune`) as a seeded invite target. That is a strong signal that the intended recovery path is admin-mediated, not public self-serve.

### 5. The public Gune page itself is not the problem

`src/lib/artists.ts`, `src/lib/artist-db.ts`, and `src/app/(app)/artist/[slug]/page.tsx` can render `/artist/gune` from static catalog data even when the DB rows are missing.

So the public page can exist while ownership is still disconnected. That is exactly what is happening here.

## Exact Files Involved

| File | Why It Matters |
| --- | --- |
| `src/app/(app)/signup/page.tsx` | Dirty working tree change already redirects duplicate-email signups to login; still needs claim-aware follow-through |
| `src/app/(app)/api/auth/signup/route.ts` | Creates auth users and profiles; duplicate email is returned as a raw error instead of a sign-in prompt |
| `src/app/(app)/login/page.tsx` | Redirects already-authenticated users away from the login form |
| `src/app/(app)/login/LoginClient.tsx` | Immediately routes successful sign-in to `/dashboard` or the requested next path |
| `src/app/(app)/api/auth/login/route.ts` | Signs in with password and returns a redirect response to `/dashboard` |
| `src/app/auth/callback/route.ts` | OAuth / magic link callback also defaults to `/dashboard` |
| `src/middleware.ts` | Protected routes bounce unauthenticated users back to login with a return URL |
| `src/app/(app)/dashboard/page.tsx` | Auto-creates a generic supporter profile if one is missing |
| `src/app/(app)/dashboard/dashboard/artist/page.tsx` | Requires `profiles.role === 'artist'`; otherwise it redirects away |
| `src/app/(app)/apply/form/page.tsx` | Signed-out users are sent to `/signup?role=artist`, which creates a new account instead of claiming an existing one |
| `src/app/(app)/api/artist-application/route.ts` | Auto-approves by creating a new artist page; not a claim flow for an existing slug |
| `src/app/(app)/api/artist-application/update/route.ts` | Admin approval also creates a new artist record and sets the role to artist |
| `src/app/api/artist-invite/route.ts` | Manual claim/invite flow; existing users are sent to password reset, new users to signup |
| `src/app/(app)/api/admin/invite-artist/route.ts` | Hardcoded admin invite list includes Gune |
| `src/lib/supabase-auth.ts` | Central auth helpers and redirect URL logic |
| `src/lib/auth-utils.ts` | Role checks read from `profiles.role` |
| `src/app/(app)/api/auth/route.ts` | Returns `user` plus `profile`, so profile presence is assumed across the app |
| `src/app/(app)/settings/settings/page.tsx` | Updates artist data only if `profiles.role === 'artist'` |
| `src/app/(app)/dashboard/dashboard/artist/edit/page.tsx` | Artist edit screen also keys off `profiles.role` and `user.id` |
| `src/lib/artists.ts` | Static Gune catalog entry exists even when DB ownership rows do not |
| `src/lib/artist-db.ts` | Merges static artist data with DB data when a slug exists |
| `src/app/(app)/artist/[slug]/page.tsx` | Public artist page still renders from static fallback and DB merge |

## Why Existing Users Were Blocked On Signup

In the committed code, the signup API uses `supabase.auth.admin.createUser(...)` and stops on the duplicate-email error. The current dirty working tree has already started fixing the UI by redirecting duplicate emails to login from `src/app/(app)/signup/page.tsx`.

That improvement is useful, but it still leaves the bigger claim problem intact: once the user signs in, there is no reliable profile/artists link for Gune and no claim-aware pending state.

## Why Sign-In Cycles Back To Join Porterful

The sign-in path always assumes the next step is dashboard access, but the dashboard logic is missing the artist ownership data it needs:

1. Login succeeds.
2. The app routes to `/dashboard` or `/dashboard/artist`.
3. If the profile is missing, the dashboard creates a generic `supporter` profile.
4. If the user lands on an artist-only route, the route requires `profiles.role === 'artist'` and redirects away if that is not true.
5. The user is left in generic onboarding or Join Porterful instead of a claim/pending state.

This is why a refresh or another navigation can appear to "help" in some cases: the shell is not carrying a stable claim state through the redirect chain.

## Recommended Smallest Safe Fix For Claw

Keep the change as small as possible:

1. Detect duplicate email on signup and convert it into a clear "sign in instead" or "reset password" flow.
2. On successful sign-in or callback, upsert the missing `profiles` row before routing onward.
3. If the request includes an artist claim slug, upsert the matching `artists` row using the same UUID as the profile id.
4. If the user is authenticated but not yet linked to the artist page, show a claim/pending state instead of redirecting back to Join Porterful.
5. Do not create a duplicate artist page for Gune. Keep the existing `gune` slug and connect the existing auth user to it.

Smallest code surface to review first:

- `src/app/(app)/api/auth/signup/route.ts`
- `src/app/(app)/signup/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/app/(app)/dashboard/page.tsx`
- `src/app/api/artist-invite/route.ts`
- `src/app/(app)/apply/form/page.tsx`

## Manual Supabase Recovery Steps If Needed

If the app fix cannot ship immediately, the lowest-risk recovery is to connect the existing auth user to the missing profile and artist rows using the same UUID:

```sql
-- 1) Create or repair the profile row for the existing auth user
insert into public.profiles (id, email, name, role)
select id, email, 'Gune', 'artist'
from auth.users
where email = 'jameschapplejr@gmail.com'
on conflict (id) do update
set email = excluded.email,
    name = excluded.name,
    role = excluded.role;

-- 2) Create or repair the artist row using the same id
insert into public.artists (id, slug, name, bio, verified, created_at)
select id, 'gune', 'Gune', 'Raw St. Louis hip-hop. Gune should map to the existing public artist page.', true, now()
from public.profiles
where email = 'jameschapplejr@gmail.com'
on conflict (id) do update
set slug = excluded.slug,
    name = excluded.name,
    bio = excluded.bio,
    verified = excluded.verified;
```

Important: do not create a second slug or a second public artist page. The goal is to attach the existing auth identity to the existing Gune page, not to duplicate the page.

## Smoke Tests

Use these after the fix or manual recovery:

1. Sign up with `jameschapplejr@gmail.com` again.
   - Expected: the UI tells the user to sign in or reset their password, not to create a new account.
2. Sign in with the existing account.
   - Expected: lands on `/dashboard` or `/dashboard/artist` without bouncing back to Join Porterful.
3. Visit the artist edit/dashboard screens.
   - Expected: `profiles.role` resolves to `artist` once the link is repaired.
4. Open `/artist/gune`.
   - Expected: the public page still loads and does not duplicate the artist record.
5. Try the flow in PWA/home-screen app mode.
   - Expected: no redirect loop, no stale claim state, no client-side exception overlay.
6. Try an OAuth or magic-link sign-in.
   - Expected: callback lands on the correct artist-aware destination instead of generic onboarding.
7. Try the admin invite path.
   - Expected: existing users go to password reset, new users go to signup, and both paths preserve the `gune` slug.

## Notes For Handoff

- The app does distinguish role types, but almost all runtime checks read from `profiles.role`.
- There is no explicit `claimed_artist` or `artist_owner_id` field in the current schema.
- The current implementation already has a manual invite path for Gune, which strongly suggests the missing piece is not "create a new page" but "repair the owner/profile link."
- No ARCHTEXT mirror was created because there is no ARCHTEXT target or directory in this repo.
