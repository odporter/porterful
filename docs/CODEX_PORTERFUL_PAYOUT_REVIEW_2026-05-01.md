# Porterful Payout Model Review - 2026-05-01

## Executive Conclusion

Risk rating: FAIL.

The repo still contains multiple public and Terms-facing payout promises that are stronger than the behavior I could prove in backend code. The live order pipeline does calculate split buckets, but it does not prove a live universal 80/20 artist payout engine, and I found no active Stripe Connect transfer or payout execution path. The only 80% backend constant I found is a Printful merch margin setting for established artists, which is not the same thing as a settled payout system.

The smallest safe next step is copy alignment first: soften or qualify the remaining public and Terms language so it matches the actual payout state before any stronger payout promise is shown again.

## Files Searched

- `/Users/sentinel/Documents/porterful/docs/PORTERFUL_PAYOUT_MODEL_LOCK_REPORT_2026-05-01.md` was not present in this repo.
- `/Users/sentinel/Documents/porterful/docs/POST_DEPLOY_PAYOUT_COPY_VERIFICATION_2026-05-01.md`
- `/Users/sentinel/Documents/porterful/docs/PORTERFUL_RIGHTS_GATE_COMPLETION_REPORT_2026-05-01.md`
- `/Users/sentinel/Documents/porterful/src/app/(app)/terms/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/terms/terms/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/about/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/unlock/unlock/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/apply/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/superfan/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/faq/faq/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/press-kit/page.tsx`
- `/Users/sentinel/Documents/porterful/src/components/ArtistModal.tsx`
- `/Users/sentinel/Documents/porterful/src/lib/artists.ts`
- `/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/payout/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/collaborations/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/earnings/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/thresholds/page.tsx`
- `/Users/sentinel/Documents/porterful/src/app/(app)/api/checkout/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/api/checkout/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/api/webhooks/stripe/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/(app)/api/orders/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/api/dashboard/earnings/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/(app)/api/dashboard/earnings/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/api/earnings/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/api/offers/checkout/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/(app)/api/collaborations/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/(app)/api/dropship/printful/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/(app)/api/wallet/route.ts`
- `/Users/sentinel/Documents/porterful/src/app/(app)/api/onboard/route.ts`
- `/Users/sentinel/Documents/porterful/src/lib/payout-context.tsx`
- `/Users/sentinel/Documents/porterful/src/lib/payout-schema.sql`
- `/Users/sentinel/Documents/porterful/src/lib/monetization-gate.ts`
- `/Users/sentinel/Documents/porterful/src/lib/likeness-verification.ts`
- `/Users/sentinel/Documents/porterful/src/lib/likeness-gateway-design.md`

## Search Commands Used

```bash
rg -n -i "80%|artist receives|artist gets|artist payout|revenue share|split|commission|platform fee|net|gross|after fees|Stripe|webhook|Connect|transfer|payout" /Users/sentinel/Documents/porterful/src /Users/sentinel/Documents/porterful/docs
rg -n -i "stripe_connect|transfer_data|destination charge|application_fee|transfers.create|payouts.create|stripeAccount|connect account|manual payout" /Users/sentinel/Documents/porterful/src
nl -ba "/Users/sentinel/Documents/porterful/src/app/(app)/terms/terms/page.tsx" | sed -n '35,120p'
nl -ba "/Users/sentinel/Documents/porterful/src/app/(app)/about/page.tsx" | sed -n '180,210p'
```

## Remaining Payout References

### Public Marketing Copy

- [About page](/Users/sentinel/Documents/porterful/src/app/(app)/about/page.tsx#L205) still says a $1 track purchase maps to $0.80 for the artist.
- [About page](/Users/sentinel/Documents/porterful/src/app/(app)/about/page.tsx#L46) still frames Porterful as artist-majority revenue share language.
- [Unlock page](/Users/sentinel/Documents/porterful/src/app/(app)/unlock/unlock/page.tsx#L217) still shows an explicit 80% artist outcome in the comparison table.
- [Apply page](/Users/sentinel/Documents/porterful/src/app/(app)/apply/page.tsx#L165) says every sale is split three ways.
- [Apply page](/Users/sentinel/Documents/porterful/src/app/(app)/apply/page.tsx#L191) says merchant fees are deducted from artist earnings before split.
- [Superfan page](/Users/sentinel/Documents/porterful/src/app/(app)/superfan/page.tsx#L14) promises referral commissions by tier.
- [Superfan page](/Users/sentinel/Documents/porterful/src/app/(app)/superfan/page.tsx#L67) says commissions are paid out via Stripe once the balance reaches $25.
- [FAQ page](/Users/sentinel/Documents/porterful/src/app/(app)/faq/faq/page.tsx#L11) says artists can withdraw with a $10 minimum via Stripe.
- [FAQ page](/Users/sentinel/Documents/porterful/src/app/(app)/faq/faq/page.tsx#L21) says superfans earn 5% on merch and 3% on marketplace items.
- [FAQ page](/Users/sentinel/Documents/porterful/src/app/(app)/faq/faq/page.tsx#L32) states the business split as 67/20/3/10.
- [Press kit](/Users/sentinel/Documents/porterful/src/app/(app)/press-kit/page.tsx#L33) presents an artist-first revenue split.
- [Press kit](/Users/sentinel/Documents/porterful/src/app/(app)/press-kit/page.tsx#L100) says fans earn 5% on merch referrals and 3% on marketplace items.
- [Artist modal](/Users/sentinel/Documents/porterful/src/components/ArtistModal.tsx#L161) still says 80% of every sale goes to the artist.
- [Artist modal](/Users/sentinel/Documents/porterful/src/components/ArtistModal.tsx#L177) adds a soft disclaimer that payouts may be made over time.
- [Artist data](/Users/sentinel/Documents/porterful/src/lib/artists.ts#L88) embeds the same 80% claim in the artist bio content source.
- [Challenge metadata](/Users/sentinel/Documents/porterful/src/app/(app)/challenge/layout.tsx#L8) says the challenge uses artist-first payout and a 20% Porterful match.

### Terms / Legal Copy

- [Terms redirect](/Users/sentinel/Documents/porterful/src/app/(app)/terms/page.tsx#L1) redirects `/terms` to the nested canonical page.
- [Terms revenue section](/Users/sentinel/Documents/porterful/src/app/(app)/terms/terms/page.tsx#L50) still states the artist receives 80% on merch sales.
- [Terms revenue section](/Users/sentinel/Documents/porterful/src/app/(app)/terms/terms/page.tsx#L58) states the marketplace split as 67/20/3/10.
- [Terms payments section](/Users/sentinel/Documents/porterful/src/app/(app)/terms/terms/page.tsx#L89) says payments are processed through Stripe and payouts require a $10 minimum.
- [Terms termination section](/Users/sentinel/Documents/porterful/src/app/(app)/terms/terms/page.tsx#L110) says pending payouts will be processed within 30 days after termination.

### Dashboard / Admin Display

- [Payout dashboard](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/payout/page.tsx#L76) computes available balance as 67% after fees.
- [Payout dashboard](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/payout/page.tsx#L251) says payouts are processed via Stripe direct deposit and that Stripe account connection is required.
- [Payout dashboard](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/payout/page.tsx#L300) says there is a Stripe processing fee.
- [Collaborations dashboard](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/collaborations/page.tsx#L152) shows the 67/20/10/3 split summary.
- [Collaborations dashboard](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/collaborations/page.tsx#L169) says collaborators split from the 67% share.
- [Collaborations dashboard](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/collaborations/page.tsx#L372) shows the per-dollar split example.
- [Earnings dashboard](/Users/sentinel/Documents/porterful/src/app/(app)/dashboard/dashboard/earnings/page.tsx#L180) displays referral commissions.
- [Settings page](/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/page.tsx#L491) says Stripe payouts are not live yet.
- [Settings page](/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/page.tsx#L502) says Stripe Connect is not live in this build.
- [Settings thresholds](/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/thresholds/page.tsx#L56) says Stripe connected.
- [Settings thresholds](/Users/sentinel/Documents/porterful/src/app/(app)/settings/settings/thresholds/page.tsx#L236) says payouts are processed on the 1st and 15th.
- [Onboard page](/Users/sentinel/Documents/porterful/src/app/(app)/onboard/page.tsx#L179) says the page is ready and payouts unlock after profile completion.

### Backend Payout Logic

- [App checkout route](/Users/sentinel/Documents/porterful/src/app/(app)/api/checkout/route.ts#L132) computes artist fund, superfan share, platform fee, and seller earnings.
- [App checkout route](/Users/sentinel/Documents/porterful/src/app/(app)/api/checkout/route.ts#L271) puts split amounts into Stripe metadata, but does not create any transfer or Connect instruction.
- [App checkout route](/Users/sentinel/Documents/porterful/src/app/(app)/api/checkout/route.ts#L338) creates a regular Stripe checkout session only.
- [Generic checkout route](/Users/sentinel/Documents/porterful/src/app/api/checkout/route.ts#L43) creates a checkout session with product metadata only.
- [Stripe webhook](/Users/sentinel/Documents/porterful/src/app/api/webhooks/stripe/route.ts#L83) writes the persisted 67/20/3/10 split values to the order ledger.
- [Stripe webhook](/Users/sentinel/Documents/porterful/src/app/api/webhooks/stripe/route.ts#L195) credits referral earnings and superfan balances.
- [Stripe webhook](/Users/sentinel/Documents/porterful/src/app/api/webhooks/stripe/route.ts#L257) credits affiliate earnings as a 3% commission.
- [Orders route](/Users/sentinel/Documents/porterful/src/app/(app)/api/orders/route.ts#L134) calculates the same revenue split buckets.
- [Orders route](/Users/sentinel/Documents/porterful/src/app/(app)/api/orders/route.ts#L184) still has a TODO for creating a Stripe checkout session and returns a placeholder checkout URL.
- [Dashboard earnings route](/Users/sentinel/Documents/porterful/src/app/api/dashboard/earnings/route.ts#L29) reads seller earnings from the order ledger.
- [Dashboard earnings route](/Users/sentinel/Documents/porterful/src/app/api/dashboard/earnings/route.ts#L57) reads referral earnings from the referral ledger.
- [Alternate dashboard earnings route](/Users/sentinel/Documents/porterful/src/app/(app)/api/dashboard/earnings/route.ts#L29) does the same ledger read.
- [Offer checkout route](/Users/sentinel/Documents/porterful/src/app/api/offers/checkout/route.ts#L92) stores a 3% commission in Stripe metadata.
- [Offer earnings route](/Users/sentinel/Documents/porterful/src/app/api/earnings/route.ts#L22) reads offer earnings and transaction state.
- [Collaboration API](/Users/sentinel/Documents/porterful/src/app/(app)/api/collaborations/route.ts#L63) only validates that split totals do not exceed 100%.
- [Printful dropship route](/Users/sentinel/Documents/porterful/src/app/(app)/api/dropship/printful/route.ts#L9) defines merch artist margins of 60%, 70%, and 80% of profit.
- [Wallet API](/Users/sentinel/Documents/porterful/src/app/(app)/api/wallet/route.ts#L58) blocks payout actions until likeness verification passes, but does not create a payout transfer.
- [Wallet API](/Users/sentinel/Documents/porterful/src/app/(app)/api/wallet/route.ts#L81) only updates a local wallet balance for reset/set/get actions.
- [Onboard route](/Users/sentinel/Documents/porterful/src/app/(app)/api/onboard/route.ts#L119) says payouts unlock after profile completion, but again does not move money.

### Stripe / Checkout Metadata

- [App checkout route](/Users/sentinel/Documents/porterful/src/app/(app)/api/checkout/route.ts#L271) sends artist fund and referral split values as Stripe session metadata.
- [Generic checkout route](/Users/sentinel/Documents/porterful/src/app/api/checkout/route.ts#L28) only sends item metadata.
- [Offer checkout route](/Users/sentinel/Documents/porterful/src/app/api/offers/checkout/route.ts#L92) sends commission metadata to Stripe.
- I found no live backend usage of `transfer_data`, `destination_charge`, `application_fee_amount`, `transfers.create`, `payouts.create`, `stripeAccount`, or Connect onboarding primitives.

### Documentation Only

- [Payout copy verification report](/Users/sentinel/Documents/porterful/docs/POST_DEPLOY_PAYOUT_COPY_VERIFICATION_2026-05-01.md#L24) explicitly says equivalent payout claims still exist in public copy.
- [Payout copy verification report](/Users/sentinel/Documents/porterful/docs/POST_DEPLOY_PAYOUT_COPY_VERIFICATION_2026-05-01.md#L113) says the production sweep was not acceptable as-is.
- [Likeness gateway design](/Users/sentinel/Documents/porterful/src/lib/likeness-gateway-design.md#L105) is a proposal only and still lists payout blocking options as proposed, not implemented.
- [Payout schema](/Users/sentinel/Documents/porterful/src/lib/payout-schema.sql#L59) defines payout tables and transfer fields, but there is no runtime code proving they are active.
- [Payout context](/Users/sentinel/Documents/porterful/src/lib/payout-context.tsx#L133) explicitly says production would create a payout request via API, which means the current implementation is demo-only.

## Backend Payout Findings

- The only concrete ledger math I could verify in live routes is 67% seller, 20% artist fund, 3% superfan, and 10% platform for marketplace flows.
- There are two `/api/checkout` implementations in the tree. The top-level handler is a plain Stripe session builder, while the `(app)` handler computes split metadata. That duplication makes the checkout surface harder to treat as a single source of truth.
- The checkout preview route is not fully authoritative. It calculates seller earnings conditionally from the presence of a referral code, while the Stripe webhook and order ledger always write the 67/20/3/10 bucketed values.
- I found no active Stripe Connect transfer creation, no destination charge configuration, no application fee setup, and no payout creation call.
- The payout surface in settings explicitly says Stripe Connect is not live, which matches the lack of transfer primitives in code.
- The wallet route blocks withdrawal-like actions behind likeness verification, but it only mutates wallet balances and returns gating responses. It does not send money.
- The Printful merch integration is the only place that still contains a literal 80% backend constant, and it is scoped to established merch profit margin, not general artist payout settlement.

## Stripe / Webhook Findings

- The canonical Stripe webhook route records order totals and referral earnings from checkout metadata, but it does not move funds.
- The webhook uses metadata values to write to `orders`, `referral_earnings`, `affiliate_earnings`, `superfans`, and `music_purchases`.
- The webhook is ledger-oriented, not payout-orchestration-oriented.
- The checkout session builders store split values in metadata, but metadata is not the same thing as Stripe Connect transfer execution.
- The generic checkout route is even thinner: it only creates a checkout session and returns the session URL.

## Terms / Public Copy Mismatch

- The Terms page still promises a literal 80% artist share for merch sales.
- The same repo still has public-facing pages and data sources repeating the same 80% claim in different words.
- At the same time, the settings page says Stripe Connect is not live, and the payout dashboard says direct deposit withdrawals require Stripe connection.
- That means the public and legal surfaces are ahead of the actual payout transport state.
- The backend does support split accounting, but the split accounting is not the same thing as an enforced payout promise.

## Risk Rating

FAIL.

Why:

- Public copy still promises 80% and related payout certainty.
- Terms still contains an 80% merch promise.
- Backend ledger math is 67/20/3/10, not a proven universal 80/20 artist payout.
- No live Stripe Connect transfer or payout execution path was found.
- Some surfaces explicitly say payouts or Stripe Connect are not live, which conflicts with the stronger copy.

## Smallest Safe Patch Plan

1. Update `terms/terms/page.tsx` first so it no longer guarantees a percentage that the backend does not prove.
2. Soften or qualify the remaining public claims in `about`, `unlock`, `ArtistModal`, `lib/artists.ts`, `superfan`, `FAQ`, `press-kit`, and `challenge` so they cannot be read as a guaranteed payout promise.
3. Align dashboard copy in `dashboard/payout`, `settings`, and `thresholds` with the actual Stripe Connect state so the internal surfaces do not imply live withdrawal transport if it is not live.
4. Leave checkout, webhook, orders, and wallet code unchanged in this pass unless the team decides to implement a real payout transport path next.
5. If Porterful wants to keep the 80% claim, prove it end-to-end in backend settlement first, then restore the stronger copy only after that proof exists.

## No Changes Made

- No Terms edits were made.
- No payout code was changed.
- No Stripe or webhook logic was changed.
- No database changes were made.
- This pass was review-only, with the exception of creating this report file.
