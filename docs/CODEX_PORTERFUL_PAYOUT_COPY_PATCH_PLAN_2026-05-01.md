# Porterful Payout Copy-Only Patch Plan - 2026-05-01

## Executive Summary

This is a copy-only patch plan. No backend, Stripe, checkout, ledger, or database changes are included here.

The smallest safe path is to remove or soften every public-facing payout claim that is stronger than the backend proof in [CODEX_PORTERFUL_PAYOUT_REVIEW_2026-05-01.md](/Users/sentinel/Documents/porterful/docs/CODEX_PORTERFUL_PAYOUT_REVIEW_2026-05-01.md).

The key rule for this pass:

- Do not promise a fixed payout percentage unless it is proven end-to-end.
- Do not imply Stripe Connect is live.
- Do not imply automatic payouts are live.
- Keep the language simple, commercial, and current-settings based.

## Priority Order

1. Terms and legal copy first.
2. Public marketing and brand pages second.
3. Dashboard and settings labels third.
4. Docs only if they are intended for external sharing. Internal evidence docs stay unchanged in this smallest safe pass.

## Files Requiring Copy Changes

### 1. Terms and Legal Copy

#### `src/app/(app)/terms/terms/page.tsx`

- Current risky language:
  - `Artist receives: 80%`
  - `Payments are processed through Stripe. Payouts require a minimum balance of $10.`
  - `Upon termination, any pending payouts will be processed within 30 days.`
- Proposed safer replacement:
  - `Artist earnings are calculated from Porterful's current revenue settings and may be affected by processor fees, refunds, chargebacks, taxes, and reconciliation.`
  - `Payout timing and methods depend on the active payout configuration.`
  - `Any pending balances are handled according to the active payout configuration.`
- Why safer:
  - Removes the fixed 80% promise.
  - Avoids implying live Stripe Connect or automatic payout execution.
  - Keeps the language commercial without over-lawyering it.

### 2. Public Marketing Pages

#### `src/app/(app)/about/page.tsx`

- Current risky language:
  - `On Porterful, a $1 track purchase = $0.80 to the artist.`
  - `artists keep the majority of every sale`
- Proposed safer replacement:
  - `Artist earnings are calculated from Porterful's current revenue settings.`
  - `Artists earn from sales under Porterful's current revenue settings.`
- Why safer:
  - Removes the dollar-equivalent 80% claim.
  - Keeps the page positive without making a guaranteed payout promise.

#### `src/app/(app)/unlock/unlock/page.tsx`

- Current risky language:
  - `Artist gets`
  - `80%`
- Proposed safer replacement:
  - `Artist earnings`
  - `Current payout settings`
- Why safer:
  - Removes the literal percentage from the comparison table.
  - Avoids implying a locked-in payout guarantee.

#### `src/app/(app)/apply/page.tsx`

- Current risky language:
  - `Every sale is split three ways: artist, platform, and the superfan who brought the buyer. Here is exactly how it breaks down.`
  - `Merchant fees (e.g., Stripe's 2.9% + $0.30) are deducted from artist earnings before split.`
  - `3-8%` superfan commission
- Proposed safer replacement:
  - `Every sale follows Porterful's current revenue settings for artists, the platform, and superfans.`
  - `Final earnings can change with processor fees, refunds, chargebacks, taxes, and reconciliation.`
  - `Superfan commission varies by active tier and program settings.`
- Why safer:
  - Keeps the page commercial.
  - Removes the strongest "exact breakdown" claim.
  - Avoids a fixed commission promise if the program is not fully proven.

#### `src/components/ArtistModal.tsx`

- Current risky language:
  - `80% of every sale - keep more money`
  - `Payouts may be made over time. We reserve the right to modify or cancel.`
- Proposed safer replacement:
  - `Artist-first earnings - see how revenue sharing works`
  - `Payout timing depends on active payout settings.`
- Why safer:
  - Removes the unsupported 80% promise from a high-visibility modal.
  - Keeps the commercial tone while dropping the payout guarantee.

#### `src/lib/artists.ts`

- Current risky language:
  - `Porterful is a platform where artists keep 80%+, where superfans earn 3% on everything their referrals buy`
  - `80% of every sale goes straight to the artist`
- Proposed safer replacement:
  - `Porterful is a platform with artist-first earnings under the current revenue settings.`
  - `Artist earnings are based on the current program settings.`
- Why safer:
  - This content source feeds public artist pages.
  - Removing the fixed percentage here prevents the claim from coming back through profile content.

#### `src/app/(app)/superfan/page.tsx`

- Current risky language:
  - `3% on all referrals`
  - `5% on all referrals`
  - `8% on all referrals`
  - `Commissions are calculated monthly and paid out when your balance reaches $25 via Stripe.`
  - `Hit 5 referrals to unlock Advocate tier (5% commission)`
- Proposed safer replacement:
  - `Higher tiers unlock stronger referral earnings.`
  - `Referral earnings are handled under the active superfan program settings.`
  - `Payout timing depends on the active payout configuration.`
- Why safer:
  - Removes exact commission promises.
  - Avoids saying Stripe-based payouts are live.
  - Keeps the page simple and commercial.

#### `src/app/(app)/faq/faq/page.tsx`

- Current risky language:
  - `You keep the majority of every sale.`
  - `Payments are processed via Stripe. You can withdraw anytime with a $10 minimum.`
  - `5% on artist merch, 3% on marketplace items.`
  - `Connect your Stripe account and withdraw anytime. Minimum withdrawal is $10.`
  - `67% to you, 20% to artists..., 3% to superfans, 10% to Porterful.`
- Proposed safer replacement:
  - `Artist earnings are calculated from Porterful's current revenue settings.`
  - `Payout timing and methods depend on the active payout configuration.`
  - `Referral earnings depend on the active program settings.`
  - `Current revenue settings allocate sales across business, artist, superfan, and platform buckets.`
- Why safer:
  - Removes the impression of live withdrawal support.
  - Softens the exact split language.
  - Avoids a percentage promise on a FAQ surface that users will treat as factual.

#### `src/app/(app)/press-kit/page.tsx`

- Current risky language:
  - `Revenue Split` / `Artist-first`
  - `Fans earn 5% on merch referrals, 3% on marketplace items.`
- Proposed safer replacement:
  - `Artist-first earnings model`
  - `Fans can earn referral income under the current program settings.`
- Why safer:
  - A press kit is highly shareable and likely to be quoted.
  - This avoids hard percentage claims in a media-facing asset.

#### `src/app/(app)/trending/page.tsx`

- Current risky language:
  - `The majority of every sale goes directly to creators.`
- Proposed safer replacement:
  - `Creators earn from sales under Porterful's current revenue settings.`
- Why safer:
  - Removes the implied guarantee.
  - Keeps the line short and brand-friendly.

#### `src/app/(app)/moral-policy/page.tsx`

- Current risky language:
  - `the majority of every sale goes to the artist.`
- Proposed safer replacement:
  - `artists earn from sales under Porterful's current revenue settings.`
- Why safer:
  - Keeps the policy page aligned with the Terms and public marketing tone.

#### `src/app/(app)/signup/page.tsx`

- Current risky language:
  - `Upload tracks, set prices, keep the majority`
- Proposed safer replacement:
  - `Upload tracks, set prices, and sell directly to fans`
- Why safer:
  - Removes the payout implication from the signup tagline.
  - Keeps the message short and commercial.

#### `src/app/(app)/demo/page.tsx`

- Current risky language:
  - `Keep the majority of every sale`
- Proposed safer replacement:
  - `Preview artist-first sales`
- Why safer:
  - Demo pages should preview the experience, not promise a fixed payout.

#### `src/app/(app)/challenge/page.tsx`

- Current risky language:
  - `Within 30 days of hitting $10K. Wire, ACH, or platform credit - your choice.`
- Proposed safer replacement:
  - `Prize timing and delivery depend on the current challenge rules and payout configuration.`
- Why safer:
  - Avoids promising a live payout delivery method.
  - Keeps the challenge copy understandable without overcommitting.

#### `src/app/(app)/challenge/layout.tsx`

- Current risky language:
  - `artist-first payout, 20% matched by Porterful.`
- Proposed safer replacement:
  - `Challenge bonus details depend on the current challenge rules.`
- Why safer:
  - Keeps the metadata from oversharing payout specifics in social previews.

#### `src/app/(app)/onboard/page.tsx`

- Current risky language:
  - `Your artist page is ready. Complete your profile to unlock payouts and start selling from the catalog.`
  - `Complete your profile to unlock payouts`
  - `Complete Profile -> Unlock Payouts`
- Proposed safer replacement:
  - `Your artist page is ready. Complete your profile to unlock earnings settings and start selling from the catalog.`
  - `Complete your profile to unlock earnings settings`
  - `Complete Profile -> Unlock Earnings Settings`
- Why safer:
  - Avoids implying payout transport is already live.
  - Keeps onboarding momentum without making a settlement promise.

### 3. Dashboard and Settings Labels

#### `src/app/(app)/dashboard/dashboard/payout/page.tsx`

- Current risky language:
  - `67% artist cut after fees`
  - `Payouts are processed via Stripe direct deposit. Connect your Stripe account in settings to enable withdrawals.`
  - `$0.25 Stripe processing fee`
- Proposed safer replacement:
  - `Estimated available balance based on current revenue settings`
  - `Payout timing and methods depend on the active payout configuration. Stripe Connect payout features are not live yet.`
  - `Processing fees may apply`
- Why safer:
  - Removes the direct-deposit promise.
  - Aligns the page with the current Connect-not-live status.
  - Keeps the dashboard useful without overstating live payout behavior.

#### `src/app/(app)/dashboard/dashboard/collaborations/page.tsx`

- Current risky language:
  - `67%` / `20%` / `10%` / `3%`
  - `Collaborators split from your 67% share.`
  - `If this track sells for $1.00, here's how the revenue splits:`
- Proposed safer replacement:
  - `Example Revenue Model`
  - `Collaborators split from the creator share when split rules are active.`
  - `Example only: if this track sells for $1.00, here's one possible split under the current model.`
- Why safer:
  - Makes the page clearly illustrative instead of implying a guaranteed live split.
  - Keeps the collaboration tool commercial and easy to read.

#### `src/app/(app)/settings/settings/thresholds/page.tsx`

- Current risky language:
  - `Stripe connected`
  - `Payouts on the 1st & 15th`
  - `When your earnings in each category reach the threshold, they'll automatically be included in the next payout.`
  - `Ready for payout`
- Proposed safer replacement:
  - `Stripe Connect not live yet`
  - `Payout timing depends on the active payout configuration`
  - `When earnings reach the threshold, they become eligible for the next payout once payouts are enabled.`
  - `Threshold met`
- Why safer:
  - Avoids presenting automatic payout timing as live.
  - Matches the current settings-page status copy.
  - Keeps thresholds useful without promising an active payout rail.

## Docs

No copy changes are recommended for internal evidence and review docs in the smallest safe pass.

Reason:

- The docs hits in this repo are mostly verification and audit artifacts, not user-facing product copy.
- Keeping them unchanged preserves the historical record that the next session will need.
- If any of those docs are ever published externally, they should be rewritten with the same neutral wording pattern used above.

## Explicit No-Code / No-Backend Statement

- No code changes.
- No backend payout changes.
- No Stripe changes.
- No checkout changes.
- No database changes.
- No ledger changes.
- No UI redesign work beyond copy replacement.

