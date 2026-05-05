# Post-Deploy Verification — Porterful Payout-Copy Sweep

**Date:** 2026-05-01
**Verifier:** Claude (taking over from Claw mid-cycle — Claw hit session usage limit)
**Production URL:** https://porterful.com
**Deployed HEAD:** `e7a0345a` — *fix(copy): soften exact payout percentage claims across public pages*

**Commits in scope:**

- `954bdeaa` fix(launch): hide /store from homepage featured cards
- `fdbe3b9f` fix(launch): remove trust-killer placeholder claims
- `e7a0345a` fix(copy): soften exact payout percentage claims across public pages

Local `git rev-parse HEAD` matches `e7a0345a`, so the deployed tip and the local working tree are aligned.

---

## Method

Each route was fetched against the live production domain (`https://porterful.com`) and screened for:

- Page reachability (200 / expected redirect / 404).
- Forbidden marketing strings: `80%`, `fake`, `TODO`, `placeholder`, `not implemented`.
- Equivalent-meaning payout claims phrased differently (e.g., `$0.80 of every $1`, `80 cents`).
- Obvious crashes, blank screens, or stack traces.
- For `/refund` and `/dmca`: presence of overpromise language.
- For `/terms`: that the deferred `Artist receives: 80%` line is still present (intentional).

Source files were grepped after the fetch sweep to ground every flag in real code.

---

## Route results

| Route | Live status | Result |
|---|---|---|
| `/` | Loads | Clean. No flagged strings. |
| `/about` | Loads | **FAIL** — payout-equivalent claim still on page. See finding 1. |
| `/apply` | Loads | Clean for payout sweep. *Adjacent flag* — uses `Likeness™ protection` wording (Codex's avoid list). See note. |
| `/demo` | Loads | Clean. |
| `/faq` | Loads | Clean. |
| `/moral-policy` | Loads | Clean. Mentions `Labels take 80-90%` as a competitor comparison — not a Porterful payout claim. OK. |
| `/press-kit` | Loads | Clean. |
| `/proud-to-pay` | Loads | Clean. |
| `/signup` | Loads | Clean. (Vercel rewrite to `/signup/signup` resolves correctly.) |
| `/superfan` | Loads | Renders SSR `Loading…` shell — that's the page's normal first-paint state. No crash. |
| `/trending` | Loads | Clean. |
| `/unlock` | Loads | **FAIL** — literal `80%` still rendered. See finding 2. |
| `/refund` | Loads | ✓ Conservative copy. Explicit *"a request is not a guarantee of a refund."* No instant-refund promise. |
| `/dmca` | Loads | ✓ Conservative copy. Explicit *"Submitting a notice does not guarantee any specific outcome or timeline."* No instant-takedown promise. |
| `/terms` | Loads | ✓ Still contains `Artist receives: 80%` in the Revenue Sharing section under Artist Merch Sales — preserved as intended. |

No 5xx responses observed on any route. No stack traces or hydration errors visible in the rendered HTML.

---

## Findings

### Finding 1 — `/about` still advertises 80% as a dollar example

**File:** `src/app/(app)/about/page.tsx:205`

```text
On Porterful, a $1 track purchase = $0.80 to the artist. That's 267x more than 267 Spotify streams.
```

This is mathematically the same claim as `80%`, just expressed as a dollar example. The sweep softened the literal `80%` string, but this restatement remained. If the payout pipeline is not proven end-to-end, this line carries the same trust risk as the original homepage claim that was just softened.

### Finding 2 — `/unlock/unlock` still renders literal `80%`

**File:** `src/app/(app)/unlock/unlock/page.tsx:218`

```text
<strong className="text-green-400">80%</strong>
```

This sits in a comparison table on the deployed `/unlock` route. The sweep did not catch it. Bold green styling makes it the visual focal point of that table cell.

### Finding 3 (adjacent, not payout sweep) — `Likeness™ protection` on `/apply`

**Files:** `src/app/(app)/apply/page.tsx:259`, `src/app/(app)/apply/form/page.tsx:136, 698`

```text
Likeness™ protection included free — voice + face registration
Likeness™ protection added
Add Likeness™ protection
```

`protection` is on Codex's trust-killer language list (`PORTERFUL_LIKENESS_COMPLIANCE_TRUST_CHECKLIST.md`). The Likeness checklist asks for `record`, `documentation`, or `verification foundation` instead. Out of the payout-copy sweep's scope — but flagging it here so it doesn't slip past the next polish pass.

---

## Verifications confirmed

- `/terms` still contains **`Artist receives: 80%`** — confirmed deferred per directive.
- `/refund` exists, returns 200, conservative wording.
- `/dmca` exists, returns 200, conservative wording.
- No public route returns `fake`, `TODO`, `placeholder`, or `not implemented` in the visible HTML.
- No public route shows a runtime crash or stack trace.

---

## Build / typecheck

**Not run by this verifier.** Per directive scope (post-deploy verification) and the earlier flag that `package.json` exposes `lint` and `build` but no standalone `typecheck` script, a fresh build was not started. The deployed commit `e7a0345a` is itself proof of a successful Vercel build pipeline — production is up and serving HTML on every checked route.

If a local typecheck is wanted for completeness, `npx tsc --noEmit` against the porterful repo is the right command and is not destructive.

---

## Recommendation

**`needs follow-up fix`** — production is **not acceptable** as-is for the payout-copy sweep success criterion.

- Production is **stable** (no crashes, no broken routes, all pages return 200).
- No **rollback** is needed — the deploy did not regress functionality.
- The sweep is **incomplete**: two surfaces (`/about`, `/unlock`) still carry payout-equivalent claims that the deploy was meant to remove.

### Concrete next step (copy-only, can be one PR)

1. `src/app/(app)/about/page.tsx:205` — replace the `$0.80` example with language consistent with the homepage softening (e.g., *"On Porterful, the artist keeps the majority of every purchase — see how revenue sharing works in our Terms."*). Link to `/terms` so the deferred 80% disclosure is reachable but no specific percentage appears on marketing pages.
2. `src/app/(app)/unlock/unlock/page.tsx:218` — replace the bold `80%` in the comparison table with `Artist-first` or `Direct to artist` until the payout pipeline is verified end-to-end. Same softening logic as the homepage.
3. (Adjacent — not a payout-sweep blocker) Sweep `Likeness™ protection` on `/apply` and replace with `Likeness™ record`, `Likeness™ verification`, or `Likeness™ documentation` in a follow-up polish pass.

### Hard-rule compliance

The directive's hard rule was: *"Do not say 'production acceptable' unless the deployed site is actually verified, not just local build."* Production was actually verified by fetching every listed route on the live domain. Two routes failed the payout-copy criterion, so the verdict is **needs follow-up fix**, not "production acceptable."
