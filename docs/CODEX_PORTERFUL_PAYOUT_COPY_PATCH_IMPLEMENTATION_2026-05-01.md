# Porterful Payout Copy Patch Implementation - 2026-05-01

## Executive Conclusion

The copy-only payout patch is in place. The strongest unsupported public claims were softened or removed from Terms, marketing pages, onboarding, dashboards, and settings so the live UI now reads as current settings / not-live status instead of a guaranteed payout promise.

The remaining `payout`, `commission`, and `split` references are either:
- explicitly marked not live,
- safe contextual reward/split language,
- or historical/internal documentation and backend copy that were intentionally left untouched in this pass.

## Files Changed

- [src/app/(app)/terms/terms/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/terms/terms/page.tsx)
- [src/app/(app)/about/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/about/page.tsx)
- [src/app/(app)/unlock/unlock/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/unlock/unlock/page.tsx)
- [src/app/(app)/apply/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/apply/page.tsx)
- [src/components/ArtistModal.tsx](/Users/sentinel/Documents/porterful/src/components/ArtistModal.tsx)
- [src/lib/artists.ts](/Users/sentinel/Documents/porterful/src/lib/artists.ts)
- [src/app/(app)/superfan/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/superfan/page.tsx)
- [src/app/(app)/faq/faq/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/faq/faq/page.tsx)
- [src/app/(app)/press-kit/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/press-kit/page.tsx)
- [src/app/(app)/trending/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/trending/page.tsx)
- [src/app/(app)/moral-policy/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/moral-policy/page.tsx)
- [src/app/(app)/signup/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/signup/page.tsx)
- [src/app/(app)/demo/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/demo/page.tsx)
- [src/app/(app)/challenge/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/challenge/page.tsx)
- [src/app/(app)/challenge/layout.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/challenge/layout.tsx)
- [src/app/(app)/onboard/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/onboard/page.tsx)
- [src/app/(app)/dashboard/dashboard/payout/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/payout/page.tsx)
- [src/app/(app)/dashboard/dashboard/collaborations/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/collaborations/page.tsx)
- [src/app/(app)/settings/settings/thresholds/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/thresholds/page.tsx)

## Exact Categories Changed

- Terms/legal copy
- Public marketing pages
- Dashboard labels and helper text
- Settings / threshold copy
- Artist bio source data
- Public program copy for Superfan / Challenge / Apply / Demo / Press Kit

## Search Results After Patch

### Targeted search commands used

```bash
rg -n -i "80%|artist receives|direct payout|automatic payout|Stripe Connect|revenue share|payout" src/app src/components src/lib docs
rg -n -i "commission|split|revenue share|payout" src/app/(app)/apply/page.tsx src/app/(app)/superfan/page.tsx src/app/(app)/dashboard/dashboard/collaborations/page.tsx src/app/(app)/faq/faq/page.tsx src/app/(app)/press-kit/page.tsx src/app/(app)/superfan/superfan/page.tsx src/app/(app)/signup/superfan/page.tsx
```

### What changed in the user-facing surfaces

- `80%` no longer appears in the targeted public page files that were in scope for this patch.
- `artist receives` no longer appears in user-facing copy.
- `direct payout` and `automatic payout` no longer appear in the public pages that were patched.
- `Stripe Connect` now appears only in explicit not-live wording, such as:
  - [src/app/(app)/faq/faq/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/faq/faq/page.tsx)
  - [src/app/(app)/superfan/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/superfan/page.tsx)
  - [src/app/(app)/settings/settings/thresholds/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/thresholds/page.tsx)
  - [src/app/(app)/dashboard/dashboard/payout/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/payout/page.tsx)
- `revenue share`, `commission`, `split`, and `payout` still appear, but in contextual or explicitly qualified copy:
  - [src/app/(app)/superfan/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/superfan/page.tsx) uses reward tiers and notes that payout timing depends on the active payout configuration.
  - [src/app/(app)/superfan/superfan/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/superfan/superfan/page.tsx) uses referral/revenue-share marketing language without live payout transport claims.
  - [src/app/(app)/dashboard/dashboard/collaborations/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/collaborations/page.tsx) is a split calculator, not a payout promise.
  - [src/app/(app)/settings/settings/thresholds/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/thresholds/page.tsx) now says Stripe Connect is not live yet and payout timing depends on the active payout configuration.
  - [src/app/(app)/settings/settings/page.tsx](/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/page.tsx) already says Stripe payouts are not live yet.

### Remaining references that are intentionally left

- Historical / internal docs still contain `80%` and payout language:
  - [docs/CODEX_PORTERFUL_PAYOUT_REVIEW_2026-05-01.md](/Users/sentinel/Documents/porterful/docs/CODEX_PORTERFUL_PAYOUT_REVIEW_2026-05-01.md)
  - [docs/POST_DEPLOY_PAYOUT_COPY_VERIFICATION_2026-05-01.md](/Users/sentinel/Documents/porterful/docs/POST_DEPLOY_PAYOUT_COPY_VERIFICATION_2026-05-01.md)
  - [docs/CLAUDE_COPY_POLISH_REPORT_2026-05-01.md](/Users/sentinel/Documents/porterful/docs/CLAUDE_COPY_POLISH_REPORT_2026-05-01.md)
  - [docs/PORTERFUL_LIKENESS_UX_TRUST_POLISH_AUDIT.md](/Users/sentinel/Documents/porterful/docs/PORTERFUL_LIKENESS_UX_TRUST_POLISH_AUDIT.md)
- Backend / internal implementation files still contain payout-related references, but they were intentionally not changed in this copy-only pass:
  - [src/app/(app)/api/onboard/route.ts](/Users/sentinel/Documents/porterful/src/app/(app)/api/onboard/route.ts)
  - [src/app/(app)/api/dropship/printful/route.ts](/Users/sentinel/Documents/porterful/src/app/(app)/api/dropship/printful/route.ts)
  - [src/lib/payout-context.tsx](/Users/sentinel/Documents/porterful/src/lib/payout-context.tsx)
  - [src/lib/payout-schema.sql](/Users/sentinel/Documents/porterful/src/lib/payout-schema.sql)
  - [src/lib/likeness-gateway-design.md](/Users/sentinel/Documents/porterful/src/lib/likeness-gateway-design.md)

## Build / Lint / Typecheck

- `npm run build`
  - Passed successfully.
  - Output included pre-existing warnings unrelated to this patch:
    - `@next/next/no-img-element`
    - `react-hooks/exhaustive-deps`
    - one dynamic-server warning for `/api/likeness/verify`
- `npm run lint`
  - Passed successfully.
  - Reported the same pre-existing warnings as build; no new errors.
- Typecheck
  - No separate typecheck script exists in `package.json`.
  - `next build` performed type validation as part of the build.

## No Backend Changes

No backend, Stripe, checkout, database, ledger, routing, entitlement, upload, or payout logic changed in this pass.
