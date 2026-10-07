# PORTERFUL PLATFORM — SPEC v2.0
## Porterful: A System People Explore, Not a Page They Visit

---

## 1. CONCEPT

Porterful is a **multi-system ecosystem platform** — a universe of connected tools and experiences that work together. The homepage is a scroll-based mission control. Each route is a distinct world.

**The feel:** A cross between a high-end artist platform (like a luxury version of Bandcamp), a Bloomberg terminal for land data, and a curated marketplace — all unified by O D Porter's voice, aesthetic, and mission.

**Core philosophy:** Every system feeds the next. Music builds fans. Fans buy chains. Chains fund land deals. Land deals fund more music. The loop is the product.

---

## 2. HOMEPAGE — `/`

**Role:** Mission control. Scroll to explore.

### Sections (scroll-based):

1. **HERO** — "There Is A Way Forward." — One bold headline, no clutter. CTA: "Enter the System" (scrolls to system selector).

2. **SYSTEM SELECTOR** — 6 systems in a scroll-triggered reveal:
   - MUSIC → `/music` (glow: orange, primary)
   - SHOP → `/shop` (glow: gold, chains-first)
   - LAND → NLDS external (glow: green)
   - MIND → `/learn` (glow: purple)
   - LAW → IHD external (glow: blue)
   - CREDIT → CreditKlimb external (glow: teal)

3. **WHY PORTERFUL** — 3 pillars in Od's voice:
   - "We built what should have existed."
   - "Artists keep what they earn."
   - "Community owns the means."

4. **ARTIST SPOTLIGHT** — Od's page preview, links to `/music`

5. **CHAIN TEASER** — "Your Name. In Metal." — teaser for the custom chains, links to `/shop`

6. **SYSTEMS PREVIEW** — 3 cards: NLDS, TeachYoung, HungerSwipes

7. **FOOTER** — Simple. Links. Social.

### Visual Language:
- Dark base (#08080c), warm orange accent (#ff6b00)
- Scroll-triggered animations
- Bold typography, no fluff text
- Generous whitespace

---

## 3. MUSIC — `/music`

**Role:** Primary artist experience. Porterful Music is the anchor.

### Sections:

1. **HERO** — Full-width player:
   - Background: dark gradient with subtle grain
   - Track title, artist name, album art
   - Play/pause, progress bar, volume
   - Auto-advances through Od's best tracks
   - "Now Playing" state persists in context

2. **OD PORTER PROFILE CARD** — Sticky at top:
   - Artist photo, name, genre
   - Verified badge
   - Follower count
   - "Listen on repeat" toggle
   - Links to full artist page

3. **LATEST RELEASE** — Featured album: "Ambiguous"
   - Album art (large)
   - Tracklist with play buttons
   - Total runtime
   - "Buy Vinyl — $35" CTA
   - "Download" CTA if available

4. **FULL TRACKLIST** — All tracks, clean list:
   - Track number, title, duration
   - Play button per track
   - Active track highlighted in orange
   - Scrolling track list with sticky header

5. **ARTIST PAGES** — Other platform artists (3 max shown):
   - Gune, Nikee Turbo, Rob Soule
   - Small cards, link to individual artist pages

6. **MUSIC WIDGET FOOTER** — Persistent:
   - Always shows current track if playing
   - Mini player controls

### Audio Implementation:
- Use existing `useAudio` context
- Track list from `TRACKS` data (O D Porter tracks only on this page)
- Progress bar, play/pause, skip

---

## 4. SHOP — `/shop`

**Role:** Custom name chains only. No clutter. One product done right.

### Hero Section:
**"YOUR NAME. IN METAL."**
- Large product photo (chain necklace with name)
- Tagline: "Custom-made. No compromises."
- Price: from $45
- CTA: "Design Your Chain"

### How It Works (3 steps):
1. **Choose your name** — Type any name or word (max 12 chars)
2. **Pick your metal** — Gold ($55), Silver ($45), Rose Gold ($50)
3. **We make it** — Ships in 5-7 days. No returns — it's custom.

### Product Builder (interactive):
- Text input for name
- Metal selector (toggle: Gold / Silver / Rose Gold)
- Chain length selector (16" / 18" / 20")
- Preview: live-updates as you type
- Price updates based on selections
- "Add to Cart" → Stripe checkout

### Story Section:
**"Why We Built This"**
- Od's voice: the story behind the chains
- Why custom chains matter
- The art of wearing your name

### Size Guide:
- Simple diagram
- How to measure

### Reviews:
- Placeholder for social proof
- "Be the first to review"

### Related:
- "The Book" — There It Is, Here It Go ($25)
- "NFC Wristband" — Tap to visit artist ($15)

---

## 5. SYSTEMS — `/systems`

**Role:** Show NLDS and HungerSwipes as Porterful ecosystem systems.

### Hero:
- "THE ECOSYSTEM" — bold headline
- Subtext: "Systems that work together."

### System Cards:

**NLDS — National Land Data System™**
- Tagline: "Every parcel. Every opportunity."
- Status badge: LIVE
- Short description
- Screenshot preview
- CTA: "Explore NLDS →" (opens https://national-land-data-system.vercel.app)

**HungerSwipes™**
- Tagline: "Turn surplus into solutions."
- Status badge: BETA
- Short description
- CTA: "Join Waitlist" (form)

### How They Connect:
- "NLDS funds the ecosystem. HungerSwipes feeds the community."
- Shows the loop

---

## 6. LEARN — `/learn`

**Role:** Redirect to TeachYoung.

### Content:
- Simple page that says "Education is a right."
- "TeachYoung is Porterful's learning platform."
- CTA: "Go to TeachYoung →" (opens https://teachyoung.org)
- Or: full TeachYoung embedded/mirrored if possible

---

## 7. MUSIC ARTIST PAGE — `/music/[artist]`

**Role:** Individual artist pages (Od is primary, but template supports others)

### Od's Page (/music/od-porter):
- Large header with cover art
- Artist name + verified badge
- Bio (Od's full story)
- Stats: fans, plays, earnings
- Discography:
  - Ambiguous (album) — tracklist
  - Singles
  - Features
- Merch: chain links, book
- Superfan CTA: "Earn 3% on everything your referrals buy"
- Social links

### Template for other artists:
- Same layout, smaller scale
- Limited discography
- "Join the waitlist" for new artists

---

## 8. NAVIGATION

### Navbar (persistent):
- Logo: "PORTERFUL" (left)
- Links: Music | Shop | Systems | Learn (center)
- Right: Cart icon + count

### Footer:
- Logo
- Links: Privacy | Terms | Contact
- Social: Instagram, TikTok, Twitter
- "© 2026 Porterful. All Rights Reserved."

---

## 9. TECH STACK

- **Framework:** Next.js App Router
- **Styling:** Tailwind + CSS variables (existing `--pf-*` vars)
- **Payments:** Stripe (existing)
- **Database:** Supabase (existing, needs schema run)
- **Audio:** React Context (`useAudio`)
- **Animations:** Tailwind + Intersection Observer for scroll triggers
- **Deployment:** Vercel

---

## 10. FILE CHANGES

### New Routes:
- `/shop` — needs directory + page.tsx (currently doesn't exist as real route)
- `/learn` — needs directory + page.tsx

### Updated Routes:
- `/music` — completely redesign (currently 402 lines of music page)
- `/systems` — update to focus on NLDS + HungerSwipes
- `/` — keep SystemSelector, refine sections

### Components to Create:
- `ChainBuilder` — interactive product builder
- `MusicPlayer` — refined hero player
- `SystemCard` — reusable card for ecosystem systems
- `LearnRedirect` — TeachYoung redirect/mirror

### Components to Refine:
- Navbar (add Shop + Learn links)
- Footer (simplify)
- `SystemSelector` (already exists, refine scroll behavior)

---

## 11. NOT IN SCOPE (keep as-is)

- Cart (already works)
- Checkout (already works)
- Stripe integration (already works)
- Existing product catalog (hide/remove weak products)
- Other artist pages (keep minimal until needed)

---

## 12. SUCCESS METRICS

- Music page: feels like a premium streaming experience
- Shop page: chains are the only focus, no distractions
- Homepage: scroll-based exploration feels intentional, not gimmicky
- Systems: clear that Porterful is a platform, not a startup
