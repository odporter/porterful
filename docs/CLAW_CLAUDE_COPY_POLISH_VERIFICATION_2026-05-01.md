# CLAW — Claude Copy Polish Verification Report
> **Date:** 2026-05-01
> **Commit inspected:** `fdbe3b9f` ("fix(launch): remove trust-killer placeholder claims")> **Author:** O D Porter (committed after Claude's pass)
> **Scope:** Copy/JSX text changes only. No logic, no DB, no Stripe, no infra.

---

## 1. FILES CHANGED (by Claude)

| # | File | Lines Changed | Change Type |
|---|------|---------------|-------------|
| 1 | `src/app/page.tsx` | 3 | Copy — hero subhead, CTA button, Support card |
| 2 | `src/app/(app)/settings/settings/page.tsx` | 6 | Copy — loading state, earnings card |
| 3 | `src/app/tap/page.tsx` | 1 | Copy — disclaimer reformatted to 3 lines |
| 4 | `src/app/tap/[slug]/page.tsx` | 1 | Copy — disclaimer reformatted to 3 lines |
| 5 | `src/components/tap/TapExperience.tsx` | 1 | CSS — added `whitespace-pre-line` class |
| 6 | `src/components/Footer.tsx` | 4 | Copy — added Terms, Privacy, Refunds, Copyright links |
| 7 | `src/components/GlobalPlayer.tsx` | 4 | Copy — preview-end message softened |
| 8 | `src/app/(app)/signup/layout.tsx` | 1 | Copy — loading state |
| 9 | `src/app/(app)/dashboard/dashboard/artist/edit/track/[id]/page.tsx` | 1 | Copy — error headline |
| 10 | `src/app/(app)/refund/page.tsx` | 39 | New page — stub refund policy |
| 11 | `src/app/(app)/dmca/page.tsx` | 44 | New page — stub DMCA policy |

**Total:** 11 files, 102 insertions(+), 15 deletions(-)

---

## 2. VERIFICATION BY FILE

### 2A. `src/app/page.tsx` — Homepage
| Before | After | Verdict |
|--------|-------|---------|
| `"80% of every purchase goes straight to the people making the music."` | `"Built for artist-first sales, transparent earnings, and direct fan support."` | ✅ Trust-safe. No unprovable percentage. |
| `"Join Free"` | `"Create your account"` | ✅ Honest. No "free" promise. |
| `"80% of every purchase goes directly to artists."` (Support card) | `"Artist-first earnings. Direct support, no middlemen."` | ✅ Trust-safe. No percentage claim. |
| **App logic touched?** | None. | ✅ |

### 2B. `src/app/(app)/settings/settings/page.tsx` — Settings Page
| Check | Status |
|-------|--------|
| JSX valid | ✅ No fragments, no broken lines |
| Loading copy | ✅ `"Loading your settings…"` (was `"Loading..."`) |
| Earnings card render | ✅ `"Not connected yet"` + helper text |
| Fake `$0.00` removed | ✅ No `.toFixed(2)` render |
| Data layer touched | ❌ No — `totalEarnings: 0` TODO still present at line 78 |
| App logic touched | ❌ No — only JSX text strings changed |
| Claude's reported revert issue | ✅ Both lines (196 loading, 452 earnings) confirmed in final commit |

### 2C. `src/app/tap/page.tsx` + `src/app/tap/[slug]/page.tsx` — Tap Pages
| Before | After | Verdict |
|--------|-------|---------|
| `"Documentation and registration only. No ownership enforcement, legal protection, or identity insurance is claimed here."` | `"Tap-In helps fans reach your official Porterful page.\nIt does not prove legal ownership of a name, song, or likeness.\nUse it as a connection layer, not a legal claim."` | ✅ Honest, readable, no legal overclaim. |
| `TakExperience.tsx` | Added `whitespace-pre-line` class to footer | ✅ Renders `\n` as actual line breaks. |

### 2D. `src/components/GlobalPlayer.tsx` — Preview End State
| Before | After | Verdict |
|--------|-------|---------|
| `"Preview ended — unlock full track"` | `"Preview ended — full-track unlock coming soon"` | ✅ Honest. Feature not wired. |
| `"Unlock Full Track"` button | `"Unlock coming soon"` button | ✅ Honest. |
| `title="Unlock feature coming soon"` | `title="Full-track unlock is coming soon"` | ✅ Consistent. |

### 2E. `src/components/Footer.tsx` — Footer Links
| Added | Verdict |
|-------|---------|
| `/terms` | ✅ Existing route |
| `/privacy` | ✅ Existing route |
| `/refund` | ✅ New stub page — conservative |
| `/dmca` | ✅ New stub page — conservative |
| `/store` | ⚠️ Still commented out (was already hidden) |

### 2F. `src/app/(app)/refund/page.tsx` — New Refund Policy Page
| Check | Status |
|-------|--------|
| Route compiles | ✅ (seen in build output) |
| Legal-service claim | ❌ None |
| Instant refund promise | ❌ None — says "not a guarantee" |
| Contact route | ✅ Links to `/contact` |
| Conservative language | ✅ "reviewed according to... may follow different timelines" |

### 2G. `src/app/(app)/dmca/page.tsx` — New DMCA Policy Page
| Check | Status |
|-------|--------|
| Route compiles | ✅ (seen in build output) |
| Legal-service claim | ❌ None |
| Instant takedown promise | ❌ None — says "does not guarantee any specific outcome" |
| Required elements | ✅ All 6 standard DMCA fields listed |
| Contact route | ✅ Links to `/contact` |

### 2H. Other Files
| File | Change | Verdict |
|------|--------|---------|
| `signup/layout.tsx` | `"Loading..."` → `"Loading your account…"` | ✅ |
| `track/[id]/page.tsx` | `"Error"` → `"We couldn't load this track"` | ✅ |

---

## 3. BUILD / TYPECHECK RESULT

| Check | Command | Result |
|-------|---------|--------|
| Production build | `npm run build` | ✅ **PASS** — exited code 0 |
| All routes compiled | Build output | ✅ 60+ routes including `/refund`, `/dmca` |
| Type errors | Build output | ✅ None (TypeScript compiled clean) |
| Static prerender | Build output | ✅ `/refund` and `/dmca` prerendered as static |

---

## 4. TRUST / COMPLIANCE BLOCKERS

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Settings page `totalEarnings: 0` TODO still in data layer | Low | Acknowledged. Render shows "Not connected" so no user-facing fake number. Fix when wiring real earnings join. |
| 2 | `/refund` and `/dmca` are stubs — need real contact email eventually | Low | Acceptable for MVP. Route exists, language is conservative. |
| 3 | Footer `/store` link still commented out | Info | Already hidden before this pass. Separate decision when store is wired. |
| 4 | Nested `terms/terms` and `privacy/privacy` paths still exist | Info | Pre-existing. Not introduced by this pass. |

**No new trust-killers introduced.**
**No fake claims remain visible.**
**No legal overclaims added.**

---

## 5. RECOMMENDATION

## ✅ SAFE TO MERGE

All changes are copy/JSX text only. No app logic modified. No unsafe claims added. Build passes clean. Trust-killer phrases removed.

---

## 6. WHAT WAS NOT TOUCHED

| What | Why |
|------|-----|
| No Stripe wiring | Out of scope |
| No DB migrations | Out of scope |
| No payout system implementation | Out of scope |
| No store wiring | Out of scope |
| No auth logic changes | Out of scope |
| No API route changes | Out of scope |
| No env changes | Out of scope |

---

## 7. REMAINING CLAUDE-FLAGGED ITEMS (for future Claw passes)

From Claude's report — these need logic, not copy:

1. **Wire `referral_earnings` join** — `settings/settings/page.tsx:82` TODO
2. **Wire Stripe payment verification** for `/likelihood`
3. **Verify 80% payout claim** end-to-end through Stripe config
4. **Wire `/store`** before re-enabling footer link
5. **Cull half-shipped routes** behind `/labs/` namespace
6. **Clean nested `privacy/privacy` paths**
7. **Likeness `/legal` audit** — confirm full coverage

These are correctly **not addressed** in this copy-only pass.
