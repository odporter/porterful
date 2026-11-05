# Porterful Full Rebuild Context Brief
_Last updated: April 3, 2026_

## Status
Stabilization phase COMPLETE. All trust-breaking routes resolved:
- /music, /shop, /artists, /systems, /ecosystem, /superfan, /radio — all 200
- /marketplace → redirects to /store
- /api/artists — returns real Supabase data with static fallback

**Next phase: BUILD THE DEPTH**

---

## Vision
Porterful is a new support economy for artists — hybrid of music discovery, direct support, culture, and commerce.

Not a generic music site. Not a Shopify page. A new model.

Core feel: music should not be disposable, support should feel meaningful, everyday buying should fund artists.

---

## Five Core Rebuild Areas (Priority Order)

### 1. ARTIST PROFILE PAGES — HIGHEST PRIORITY

**Route:** `/artist/[slug]`

Each artist needs a real, deep-linkable profile page — not just a modal or listing.

**Required elements per artist page:**
- Artist hero/banner area
- Artist image or avatar
- Artist bio/identity section
- Featured song or featured release
- Instant play button
- Support button
- "Proud-to-Pay" module or support module
- Artist store area if products available
- Links to related products, merch, or essentials market
- Optional: referral/support impact area
- Optional: playlist or related tracks
- Optional: artist stats

**Purpose:** Where identity, music, and monetization meet. A standalone destination someone can discover, listen, support, browse, and share.

**Currently:** No `/artist/[slug]` route exists. Artist links from /music go nowhere.

---

### 2. /music — PRODUCT DEPTH PASS

**Current state:** Landing-page feel. Strong concept, shallow interaction.

**Needs to become:** A real music destination.

**Required additions:**
- Persistent mini-player (survives scroll)
- Artist browse section (not just Od)
- Track filtering / search
- "Join as Artist" path (clearer)
- "Become a Superfan" path (clearer)
- Featured releases beyond flagship artist
- Social proof ticker (plays, supporters)

---

### 3. Superfan Dashboard / Referral Tracking

**Current state:** Static `/superfan` page with tiers built.

**Needs:**
- Auth-protected dashboard at `/dashboard`
- Real referral link generation
- Referral tracking (clicks → purchases)
- Commission balance visible in wallet
- Payout flow when balance reaches $25

---

### 4. Shop — Identity Category

**Current state:** `/shop` exists with chains builder + products.

**Needs:**
- Proper category page for custom name pieces
- Category name: "Identity" or "Custom Pieces" — refined, not cheesy
- Chains integrated as one option among curated products
- Premium product feel — aspirational, not novelty

---

### 5. Artist Onboarding Pipeline

**Needs:**
- `/apply` → artist application form
- Application → Supabase profiles table
- Profile → auto-generate live `/artist/[slug]` page
- Artist dashboard: upload tracks, manage products, see earnings
- Onboarding completion → activate page publicly

---

## Brand Language Notes
- Music is not disposable — ownership model
- Support is meaningful — not charity, economy
- Everyday buying funds artists — commerce integration
- 80% always goes to artist
- Platform is the artist's retirement plan

---

## Tech Stack
- Next.js (App Router)
- Supabase (auth, profiles, orders, products)
- Stripe (live mode — sk_live active)
- Printful (merch fulfillment)
- Vercel (hosting)

## Key Files
- `src/app/(app)/music/page.tsx` — flagship music page
- `src/app/(app)/artist/[id]/page.tsx` — TO BUILD
- `src/app/(app)/shop/page.tsx` — product layer
- `src/app/(app)/superfan/page.tsx` — just built
- `src/components/Navbar.tsx` — clean, 4-link hierarchy
- `src/lib/artists.ts` — static artist data
- `src/lib/products.ts` — product data
