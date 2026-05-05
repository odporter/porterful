# Porterful Launch-Clean Audit — 2026-05-05 (Pass 2)

**Auditor:** Claude (Opus 4.7) — second pass, post-cron
**Branch:** `main`
**Pre-pass HEAD:** `358da467` — "docs: clarify Bucket A commit scope"
**Pre-pass tree state:** Dirty — 28 modified files + 8 untracked items, despite prior pass at 4:07 PM CDT having stashed them. A cron-driven directive (`[cron:797c4bd1-522c-459f-9f60-e6e66e097207 Site improvements batch 1 - Rob Soule fix + social buttons]`) re-applied a subset of the stashed work, and additional bot/agent activity reintroduced the rest.

> **Supersedes** the prior 4:07 PM CDT 2026-05-05 audit on this same path. That pass restored HEAD and reported "clean," but the working tree was dirtied again before this pass began. One material claim from the prior pass is also corrected below: `src/lib/checkout-catalog.ts` exists in the repo but is **not imported by any active checkout route** — both committed checkout routes still use the client-supplied `item.price`.

---

## 1. Executive Summary

This pass is a stabilization, audit, and launch-readiness review. No features were added. No designs were changed. No pricing logic was altered. No Stripe/webhook code was touched. The dirty working tree was triaged into three buckets: launch-clean copy/UX work that is safe to commit, an unrelated in-progress presence-tracking system that was deliberately left dirty, and a small unrelated `featured`-flag plumbing change on the artist track edit page that was also left dirty.

**Outcome of this pass**

- Launch-clean copy softening across ~22 public pages staged for commit
- Homepage featured track confirmed: "Thought We Was Bruddaz" by ATM Trap, real data in `src/lib/data.ts:152`
- `/music` roster order intentionally set: ATM Trap → Gune → O D Porter
- Dead demo `src/components/Player.tsx` removed (zero imports, hardcoded fake "O D Porter" demo tracks)
- `next build` is green (warnings only — preexisting `<img>` and `react-hooks/exhaustive-deps` lint warnings, plus one pre-existing dynamic-server warning on `/api/likeness/verify`)

**Launch blockers identified, intentionally NOT fixed in this pass**

- Both committed public checkout routes use **client-supplied** `item.price`, not DB-authoritative pricing
- `/music` has play action only — no inline buy / add-to-library / entitlement-aware purchased state
- "Featured" flag plumbing on the artist track edit page is half-wired (writes to DB; homepage still reads a hardcoded list)
- Presence-tracking system is half-merged into the working tree but not wired end-to-end

---

## 2. Branch / Commit Status

| Item | Status |
|---|---|
| Branch | `main` |
| Tracking | `origin/main` |
| HEAD before this pass | `358da467` |
| Pre-pass uncommitted changes | 28 modified, 8 untracked items |
| Production gap | Production reflects `origin/main`. The dirty-tree work in this pass had not been pushed. Vercel auto-deploys from `main`. |
| Recent featured-track work | `622c0833 Feature ATM Trap on homepage` already in history |

---

## 3. Files Changed In This Pass

### Committed (launch-clean)

Copy softening / payout-claim cleanup:
- `TODO.md`
- `src/app/(app)/about/page.tsx`
- `src/app/(app)/apply/page.tsx`
- `src/app/(app)/artists/page.tsx` (track-count chip removed)
- `src/app/(app)/challenge/layout.tsx`
- `src/app/(app)/challenge/page.tsx`
- `src/app/(app)/dashboard/dashboard/collaborations/page.tsx`
- `src/app/(app)/dashboard/dashboard/payout/page.tsx`
- `src/app/(app)/demo/page.tsx`
- `src/app/(app)/faq/faq/page.tsx`
- `src/app/(app)/moral-policy/page.tsx`
- `src/app/(app)/onboard/page.tsx`
- `src/app/(app)/press-kit/page.tsx`
- `src/app/(app)/settings/settings/thresholds/page.tsx`
- `src/app/(app)/signup/page.tsx`
- `src/app/(app)/superfan/page.tsx`
- `src/app/(app)/terms/terms/page.tsx`
- `src/app/(app)/trending/page.tsx`
- `src/app/(app)/unlock/unlock/page.tsx`
- `src/components/ArtistModal.tsx`
- `src/components/ArtistSearch.tsx` (track-count chip removed)
- `src/lib/artists.ts` (artist bios — softens "80%" claims)

Featured track + roster ordering:
- `src/app/page.tsx` (`HOME_FEATURED_TRACKS` highlights ATM Trap "Thought We Was Bruddaz" first)
- `src/app/music/page.tsx` (`ROSTER_ORDER`: ATM Trap → Gune → O D Porter)

Dead-file cleanup:
- `src/components/Player.tsx` — DELETED (unused, zero imports, hardcoded fake "O D Porter" demo tracks)

New report:
- `docs/PORTERFUL_LAUNCH_CLEAN_AUDIT_2026-05-05.md` (this file, replacing the 4:07 PM CDT version)

### Intentionally NOT committed

Presence-tracking system (separate in-progress feature, **out of scope** for stabilization):
- `src/app/(app)/dashboard/PorterfulDashboard.tsx` (admin presence panel + types)
- `src/app/providers.tsx` (`/api/presence/heartbeat` 15 s poll loop)
- `supabase/schema.sql` (adds `presence_sessions`, `presence_visitors` tables)
- `supabase/migrations/021_presence_sessions.sql` (untracked)
- `supabase/migrations/022_presence_visitors.sql` (untracked)
- `src/app/(app)/api/admin/presence/` (untracked)
- `src/app/(app)/api/presence/` (untracked)

Featured-flag plumbing on artist track edit page (half-wired, **out of scope**):
- `src/app/dashboard/artist/tracks/[id]/edit/page.tsx`
  - Adds a `featured` boolean to the form/save payload. Migration `016_track_featured_column.sql` exists, so the column should be present, but the homepage still uses a hardcoded `HOME_FEATURED_TRACKS` list, not the DB flag. Half-wired — leave dirty until O D approves either wiring it up or reverting.

Pre-existing untracked report drafts (left for original authors):
- `docs/ARCHTEXT_STRUCTURE_VERIFICATION_2026-05-01.md`
- `docs/CLAUDE_COPY_POLISH_REPORT_2026-05-01.md`
- `docs/CLAW_CLAUDE_COPY_POLISH_VERIFICATION_2026-05-01.md`
- `docs/CODEX_PORTERFUL_PAYOUT_COPY_PATCH_IMPLEMENTATION_2026-05-01.md`
- `docs/CODEX_PORTERFUL_PAYOUT_COPY_PATCH_PLAN_2026-05-01.md`
- `docs/CODEX_PORTERFUL_PAYOUT_REVIEW_2026-05-01.md`
- `docs/CODEX_POST_COMMIT_REVIEW_BUCKET_A_2026-05-03.md`
- `docs/PORTERFUL_RIGHTS_GATE_COMPLETION_REPORT_2026-05-01.md`
- `docs/PORTERFUL_RIGHTS_GATE_VERIFICATION_2026-05-01.md`
- `docs/POST_DEPLOY_PAYOUT_COPY_VERIFICATION_2026-05-01.md`

---

## 4. Issues Found

| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | `/api/checkout` and `(app)/api/checkout` use client-supplied `item.price`. `src/lib/checkout-catalog.ts` exists but is **never imported**. | Launch blocker | Documented, not fixed |
| 2 | `/music` commerce has only play action (no inline buy / add-to-library / purchased state) | Launch concern | Documented, not fixed |
| 3 | Presence-tracking work bleeding into launch-clean tree | Hygiene | Resolved by separating commit scope |
| 4 | Dead demo `src/components/Player.tsx` with fake "O D Porter" tracks | Hygiene | Removed |
| 5 | Hardcoded play counts on tracks in `src/lib/data.ts` (e.g. `999999`, `125000`) | Marketing-claim risk | Pre-existing, documented, not fixed |
| 6 | `/systems` route still builds and renders, but is no longer in nav or footer | Hygiene | Documented, not fixed (route file lives at `src/app/systems/`) |
| 7 | `/api/likeness/verify` warns on dynamic server usage during build | Pre-existing warning | Documented, not fixed |
| 8 | Cron is re-applying experimental changes after stash | Process | Documented; needs O D decision (see §14) |

---

## 5. Issues Fixed

- **Duplicate GlobalPlayer mount risk**: Verified single mount in `src/app/layout.tsx:49`. `(app)/layout.tsx` does not re-mount the player. No change needed.
- **Dead demo Player**: Deleted `src/components/Player.tsx`.
- **Public copy with exact "80%" / payout-timing claims**: Already softened in dirty tree across ~20 pages; staged for commit in this pass.
- **Homepage featured track**: Already set to ATM Trap "Thought We Was Bruddaz" in `src/app/page.tsx`. Track exists in `src/lib/data.ts:152` with `featured: true` and a real audio URL — no fake data introduced.
- **Footer/nav inconsistency**: Verified — no stale "Systems" link in either. Both `Navbar` and `Footer` comment out `/store` with the same reason ("no real products yet"). Nav and Footer are consistent.

---

## 6. Issues Intentionally NOT Fixed

- **Stripe pricing authority** (`src/app/api/checkout/route.ts:24`, `src/app/(app)/api/checkout/route.ts:124,237`): Both checkout routes accept the price from the client. Fix requires server-side product/track lookup against Supabase plus a careful change to the metadata pipeline that the webhook depends on. Per directive: "Do not touch Stripe/webhook logic unless verification reveals a break." The break is documented; the fix is left for an explicit, scoped follow-up. `src/lib/checkout-catalog.ts` already drafts the resolver but is unwired.
- **Featured-flag plumbing on track edit page**: Out of scope. Leave dirty.
- **Presence-tracking system**: Out of scope. Leave dirty.
- **Hardcoded play counts** in `src/lib/data.ts`: Pre-existing data. Not in scope. Recommended follow-up: zero them out or migrate to real plays tied to `tracks.plays` in DB. Risk: marketing-claim credibility.
- **Pre-existing build warnings**: Not in scope.

---

## 7. Route Verification

Verified via `next build` output. All key routes compiled successfully.

| Route | Type | Compiled |
|---|---|---|
| `/` | dynamic | ✅ |
| `/music` | dynamic, 5.12 kB | ✅ |
| `/store` | dynamic, 4.42 kB | ✅ (route exists; intentionally hidden from nav/footer) |
| `/apparel` | — | ❌ Route does not exist (was listed as "if active") |
| `/login` | dynamic, 3.66 kB | ✅ |
| `/dashboard` | dynamic, 3.69 kB | ✅ |
| `/dashboard/artist` | dynamic, 3.01 kB | ✅ |
| `/dashboard/upload` | dynamic | ✅ |
| `/dashboard/dashboard/upload` | dynamic, 3.42 kB | ✅ (legacy nested path) |
| `/dashboard/dashboard/payout` | dynamic, 3.16 kB | ✅ |
| `/wallet` | dynamic, 3.1 kB | ✅ |

Live HTTP route checks (redirect-loop, 500s, redirect-on-unauthenticated) were **not** run in this pass — would require a running dev server with valid env. Recommended for the next pass.

---

## 8. Build / Lint / Typecheck Results

- `npm run build`: **PASS** (warnings only)
  - Build script: `node scripts/check-layout-guards.js && next build`
  - Layout-guard check passed
  - ESLint: pre-existing `<img>` (next/image preference) and `react-hooks/exhaustive-deps` warnings on a handful of files
  - Runtime warning: `/api/likeness/verify` cannot be statically rendered because it uses `request.url` (pre-existing, dynamic by design)
- `npm run lint`: not run separately (covered by `next build`)
- `npm run typecheck`: **NO SUCH SCRIPT**. `package.json` defines only `dev`, `build`, `start`, `lint`, `check-layouts`, `test-hydration`. Type errors would surface in `next build` (which passed). Recommend adding `"typecheck": "tsc --noEmit"`.

---

## 9. Commerce / Stripe Readiness Checklist

| Check | Status | Notes |
|---|---|---|
| Server-side checkout exists | ✅ | `src/app/api/checkout/route.ts`, `src/app/(app)/api/checkout/route.ts`, `src/app/api/offers/checkout/route.ts`, `src/app/(app)/api/kids-chains-checkout/route.ts` |
| **DB-authoritative pricing** | ❌ | Both committed checkout routes use client-supplied `item.price`. **LAUNCH BLOCKER.** |
| Webhook signature verified | ✅ | `src/app/api/webhooks/stripe/route.ts:18` uses `STRIPE_WEBHOOK_SECRET` |
| Webhook writes order rows | ✅ | Confirmed structure |
| Webhook writes entitlement rows | ⚠️ | Not verified end-to-end in this pass |
| Duplicate webhook idempotency | ⚠️ | Not verified end-to-end in this pass |
| 3-track upload cap server-enforced | ✅ | `src/app/api/tracks/route.ts:32-41` |

### Required production env vars (referenced in code, do not print values)

- `STRIPE_SECRET_KEY` — used
- `STRIPE_WEBHOOK_SECRET` — used
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — used
- `NEXT_PUBLIC_SUPABASE_URL` — used
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — used
- `SUPABASE_SERVICE_ROLE_KEY` — used
- `OFFER_SECRET` — referenced in offers code path; verify presence in prod
- `PORTERFUL_SESSION_SECRET` — referenced via `decodePorterfulSession`; verify presence in prod
- `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL` — `(app)/api/checkout/route.ts` hardcodes `https://porterful.com` for success/cancel URLs. Recommend wiring through env to make preview deploys safer.

`.env.local.example` lists only Supabase URL/anon key, service-role key, Stripe secret + publishable. It does **not** include `STRIPE_WEBHOOK_SECRET`, `OFFER_SECRET`, `PORTERFUL_SESSION_SECRET`, or `RESEND_API_KEY`. Recommend expanding it.

### Paid-checkout proof plan (not yet executed)

1. Provision a low-value test track ($1) on staging with `is_active=true` and a real `audio_url`.
2. POST a checkout from the live UI; capture the resulting Stripe Checkout Session id.
3. Confirm `orders` row created with the expected `seller_total / artist_fund_total / superfan_total / platform_total` split.
4. Confirm `music_purchases` (or `entitlements`) row created tying buyer to track.
5. Re-replay the same webhook event manually to verify idempotency (no duplicate order, no duplicate entitlement, no double-credited referrer).
6. Log out, log back in as the buyer, confirm the buyer can play/download the track.

---

## 10. Music Commerce Status

`/music` page actions inventory:

| Action | Present? | Notes |
|---|---|---|
| Play | ✅ | `playTrack(track)` via `useAudio()` |
| Buy / Support | ❌ | No inline buy CTA on track row in `src/app/music/page.tsx` |
| Add to library | ❌ | No add-to-library control |
| Entitlement-aware "purchased" badge | ❌ | Webhook writes `music_purchases`, but no UI reads from it |
| Artist link / profile path | ✅ | Browse Artists rail links to `/artist/[slug]` |

**Severity:** Launch concern, not blocker — `/music` works as a discovery + play surface. Buying happens via cart → checkout. Confirm with O D whether a "buy / support" CTA on `/music` track rows is required for v1.

---

## 11. Featured Song Status

- Requirement: Homepage featured = "Thought We Was Bruddaz" by ATM Trap.
- Source of truth: `src/lib/data.ts:152` — track exists, `featured: true`, real `audio_url`.
- Implementation: `src/app/page.tsx` defines `HOME_FEATURED_TRACKS` with ATM Trap "Thought We Was Bruddaz" first; the homepage hero card highlights it as Featured.
- **Status: ✅ Real data, no fakes, requirement met.**

---

## 12. Codex / Test Album Status

- Repo-wide search for "Codex" / "codex" returns **only** unrelated planning/spec docs (e.g. `docs/CODEX_PORTERFUL_PAYOUT_*` review reports, where "Codex" refers to the Codex agent, not an artist or album).
- No "Codex" album in `src/lib/data.ts`, `src/lib/artists.ts`, `src/lib/artist-db.ts`, `supabase/schema.sql`, or any migration.
- **Status: ✅ Not present in repo.** If a Codex tester album exists, it lives only in production Supabase data, not addressable from the repo. Recommended follow-up: query `albums` and `tracks` for `LIKE 'Codex%'` and `LIKE '%test%'` before launch.

---

## 13. Remaining Launch Blockers

1. **Stripe pricing authority** — checkout routes accept client `item.price`. Must move to DB-authoritative pricing before paid public launch. `src/lib/checkout-catalog.ts` already drafts the resolver but is unwired.
2. **Webhook end-to-end proof** — entitlement creation + duplicate-event idempotency not verified in this pass. Run the §9 proof plan.
3. **Hardcoded play counts** in `src/lib/data.ts` (e.g. `999999`, `125000`) — credibility risk. Either zero them or back them with a real plays counter.
4. **Cron re-applying stashed work** — process risk. Whatever cron pulled the experimental changes back into the tree after the prior 4:07 PM stash needs to be paused, removed, or scoped, otherwise the next stabilization pass will face the same dirty-tree problem.

---

## 14. Recommended Next Directive

**Title: PORTERFUL STRIPE PRICING HARDENING + PAID CHECKOUT PROOF**

Scope:
1. Wire `src/lib/checkout-catalog.ts` (or its successor) into both public checkout routes. Server resolves unit prices from Supabase using only client-supplied IDs. Reject any cart item whose ID does not resolve. Keep activation/discount path intact. Update webhook metadata to use the resolved server-side amounts.
2. Run the §9 paid-checkout proof plan end-to-end on staging with a real $1 test track. Capture session id, order row, entitlement row, buyer access, and idempotency outcome in a verification report.
3. Decide on `src/app/dashboard/artist/tracks/[id]/edit/page.tsx` `featured` flag — either wire homepage to read DB `featured: true` and remove the hardcoded `HOME_FEATURED_TRACKS` list, or revert the edit-page change.
4. Decide on the presence-tracking system — wire it end-to-end on a separate branch or revert the working-tree changes.
5. Pause / scope the cron that is re-applying stashed experimental work.
6. Zero or replace the hardcoded play counts in `src/lib/data.ts`.

Out of scope for that next directive: redesign, new pages, brand changes.
