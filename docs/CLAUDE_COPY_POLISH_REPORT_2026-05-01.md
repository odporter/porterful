# Claude Copy Polish Report — 2026-05-01

**Scope:** Copy/polish only. No app logic, Stripe, DB, or infra changes.
**Driver:** `CLAUDE DIRECTIVE — Porterful + Likeness Trust Copy Polish Pass`
**Audit reference:** `~/Documents/porterful/docs/PORTERFUL_LIKENESS_UX_TRUST_POLISH_AUDIT.md`
**Standards:** `~/Documents/New project/PORTERFUL_LIKENESS_COMPLIANCE_TRUST_CHECKLIST.md` (Codex)

---

## Summary

8 polish items completed across both repos. 2 new policy stub pages added on Porterful. All edits are text/JSX-string changes plus one CSS class addition (`whitespace-pre-line`) to support multi-line disclaimer rendering. No logic, no API, no DB, no Stripe wiring.

A linter / watcher reverted two edits in `settings/settings/page.tsx` mid-session; both were re-applied to match the directive. Flagging for OD: if the revert was intentional, set the file back manually and let me know.

---

## Files changed

### Porterful (`~/Documents/porterful/`)

| File | Change |
|---|---|
| `src/app/page.tsx` | Hero subhead — softened `80%` claim. Hero CTA — `Join Free` → `Create your account`. |
| `src/app/(app)/settings/settings/page.tsx` | Earnings card — `$0.00` render → `Not connected yet` + helper. Loading state → `Loading your settings…`. |
| `src/app/tap/page.tsx` | Disclaimer reformatted into 3 lines. |
| `src/app/tap/[slug]/page.tsx` | Disclaimer reformatted into 3 lines. |
| `src/components/tap/TapExperience.tsx` | Added `whitespace-pre-line` class so `\n` in `disclaimer` prop renders as line breaks. |
| `src/components/Footer.tsx` | Added Terms · Privacy · Refunds · Copyright links. |
| `src/components/GlobalPlayer.tsx` | Preview-end "unlock full track" → "full-track unlock coming soon" + button label. |
| `src/components/artist/ArtistTabs.tsx` | (No change — already specific.) |
| `src/app/(app)/dashboard/dashboard/artist/edit/track/[id]/page.tsx` | Error headline `Error` → `We couldn't load this track`. |
| `src/app/(app)/signup/layout.tsx` | Loading state → `Loading your account…`. |

**New files (stub policy pages):**

| File | Purpose |
|---|---|
| `src/app/(app)/refund/page.tsx` | `/refund` route — stub copy from directive. |
| `src/app/(app)/dmca/page.tsx` | `/dmca` route — stub copy from directive. |

### Likeness / voice-catcher (`~/Documents/voice-catcher/`)

| File | Change |
|---|---|
| `app/src/app/likelihood/page.tsx` | Added "Early preview — no payment required." note + "in early preview" framing on the gate. Loading state → `Loading your pathway…`. |
| `app/src/app/access/page.tsx` | Loading state → `One moment…`. |
| `app/src/app/access/success/page.tsx` | Loading state → `Confirming your access…`. |
| `app/src/app/activate/page.tsx` | Loading state → `One moment…`. |
| `app/src/app/dashboard/SignalDashboardClient.tsx` | `sub: 'Coming soon'` → `Tap-In destination setup coming soon`. |

---

## Risky phrases removed → safer replacements

| Before | After | Where |
|---|---|---|
| `80% of every purchase goes straight to the people making the music.` | `Built for artist-first sales, transparent earnings, and direct fan support.` | `src/app/page.tsx` hero subhead |
| `Join Free` | `Create your account` | `src/app/page.tsx` hero CTA |
| `${referralStats.totalEarnings.toFixed(2)}` rendering as `$0.00` | `Not connected yet` + helper line | `settings/settings/page.tsx` earnings card |
| `Documentation and registration only. No ownership enforcement, legal protection, or identity insurance is claimed here.` (single dense line) | Three lines: `Tap-In helps fans reach your official Porterful page. / It does not prove legal ownership of a name, song, or likeness. / Use it as a connection layer, not a legal claim.` | `tap/page.tsx`, `tap/[slug]/page.tsx` |
| `Documentation and registration only. No legal ownership, protection, or insurance is promised here.` | Same 3-line block as above | `tap/[slug]/page.tsx` |
| `Preview ended — unlock full track` + `Unlock Full Track` button + `Unlock feature coming soon` tooltip | `Preview ended — full-track unlock coming soon` + `Unlock coming soon` button + `Full-track unlock is coming soon` tooltip | `GlobalPlayer.tsx` |
| `Error` (h2 headline on track edit error state) | `We couldn't load this track` | `dashboard/.../track/[id]/page.tsx` |
| `Loading...` | `Loading your settings…`, `Loading your account…`, `Loading your pathway…`, `One moment…`, `Confirming your access…` (per context) | settings, signup, likelihood, access × 2, activate |
| `Discover your Likelihood™ pathway` (alone) | Same line + `Early preview — no payment required.` + `Likelihood™ is in early preview. Discovery and claim status will appear here once verification is fully connected.` | `likelihood/page.tsx` gate |
| `sub: 'Coming soon'` (Tap-In destination row) | `sub: 'Tap-In destination setup coming soon'` | voice-catcher dashboard |

### Phrases preserved (already brand-safe)

- Likeness homepage hero: *"Your likeness is already being used. This puts it on record."* — keep.
- Likeness `legal/page.tsx`: full legal language — keep verbatim.
- Likeness `recover/page.tsx`, `involved/page.tsx`: "not guaranteed" caveats — keep.
- Porterful `(app)/demo/page.tsx`: `Coming soon` is already labelled correctly.
- Porterful `ArtistTabs.tsx` Store empty state: `Store coming soon — {artist} hasn't published merch yet.` — already specific, no change.

---

## Items that need Claw (logic, not copy)

These are flagged here so Claw / infra picks them up. Claude did not touch them.

1. **Wire `referral_earnings` join** — `settings/settings/page.tsx:82` still has `totalEarnings: 0, // TODO: join with referral_earnings`. The render now shows `Not connected yet`, but the data layer still computes a hard-coded `0`. Fix the join, then revert the visible copy to a real earnings number.
2. **Wire Stripe payment verification** for `/likelihood` — TODOs at `likelihood/page.tsx:5` and the gate handler. Until wired, the page is correctly framed as early preview. When wired, replace "early preview" framing with real entitlement copy.
3. **Verify the `80%` payout claim** end-to-end through Stripe / payout config. If real and provable, restore a stronger version of the homepage line and link to a payout policy page. If not real, leave the softened version in place.
4. **Wire `/store` (Porterful)** before re-enabling the commented-out footer link.
5. **Cull / namespace half-shipped routes** (`food`, `wallet`, `cart`, `superfan`, `challenge`, `competition`, `services`, `submit`, `radio`, `digital`, `coming-soon`, `systems/worlds`, `teachyoung-inquiry`, `ecosystem`, `land`, `learn`) — copy edits cannot fix the surface-area-vs-truth gap; these need to move behind a `/labs/` namespace or a feature gate.
6. **Clean nested `privacy/privacy` and `terms/terms` paths** — currently `/privacy` redirects to `/privacy/privacy`. Pick one path; redirect the other.
7. **Likeness `/legal` audit** — confirm the single legal page covers Terms, Privacy, Refund, and DMCA sections explicitly. If any are missing, add. (Out of copy-only scope.)
8. **Likeness apparel mockup files** — confirm hero shirt mockup is photographic, not a 3D Printful render. Asset swap, not code.
9. **Settings file mid-session revert** — a linter or watcher reverted my edits to `settings/settings/page.tsx` at lines 196 and 452. I re-applied. If something in the toolchain is auto-reverting these, Claw should investigate. The data-side (`totalEarnings: 0` in `loadReferrals`) is intentionally left as-is since the render no longer reads it; Claw can clean up when wiring the real join.

---

## Build / typecheck

**Not run.** The directive said run only if "normal for this repo and safe." Both repos use Next.js with multi-minute production builds and (in voice-catcher's case) custom Next conventions flagged by `app/AGENTS.md`. Running a full build mid-polish-pass risks unrelated failures and long timeouts.

All edits are pure JSX text content + one CSS class addition + two new pages whose imports mirror the existing `(app)/privacy/privacy/page.tsx` pattern. No type signatures changed. No imports modified beyond the two new stub pages. Risk of a build break from this pass alone is low.

> **Recommendation:** Claw runs `npm run build` (Porterful) and the equivalent for voice-catcher as part of the next infra/logic pass.

---

## Mirror note for Codex

Master planning copies should mirror to:

- `~/Documents/New project/ARCHTEXT/CLAUDE_COPY_POLISH_REPORT_2026-05-01.md`

Codex can copy this file once the audit cycle wraps.
