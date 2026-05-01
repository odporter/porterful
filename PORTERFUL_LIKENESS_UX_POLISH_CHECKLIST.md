# Porterful + Likeness — UX Polish Checklist

**Status:** Audit lens. Not a redesign. Use this to walk both products and flag what breaks the premium feel.
**Owner:** O D Porter
**Date:** 2026-05-01

---

## How to use this

Walk each surface (web + mobile) and mark every item:

- ✅ clean
- ⚠️ rough but shippable
- ❌ breaks the premium feel — fix before showing investors / artists / press

The bar is **"would I screenshot this for a pitch deck?"** If no, it's not done.

---

## 1. Confusing buttons

- [ ] Every primary button on a screen has **one clear job** — no two buttons competing for the same tap.
- [ ] Button labels are **verbs the user understands** (*Add song*, *Download*, *Share link*) — never *Submit*, *OK*, *Continue* with no context.
- [ ] Disabled buttons explain **why** they're disabled (tooltip or helper text).
- [ ] Destructive actions (delete, cancel, remove) are visually quieter than safe ones — never the same color as the primary CTA.
- [ ] No button says one thing and does another (e.g., "Save" that also publishes).
- [ ] Back / cancel paths exist on every screen. The user is never trapped.

---

## 2. Ugly / cheesy visuals

- [ ] No stock-photo people smiling at laptops.
- [ ] No drop shadows stacked on drop shadows.
- [ ] No gradients that look like 2014 SaaS.
- [ ] No emoji as primary UI (occasional accent is fine; never load-bearing).
- [ ] No clip-art, no Lottie mascots, no cartoon avatars in serious surfaces (auth, payments, claims).
- [ ] No glossy 3D renders standing in for real product photography.
- [ ] No neon glow, no chrome, no "Web3" energy.
- [ ] Typography uses two families max. No Comic Sans cousins. No mid-weights.
- [ ] Color palette holds: deep black, warm off-white, gold accent, oxblood. One accent per screen.

---

## 3. Duplicate logos

- [ ] **Header has one logo. The footer has one logo. Never both at once on the same fold.**
- [ ] Favicon, app icon, and header logo all match the current brand mark — no leftover early versions.
- [ ] Splash / loading screen logo doesn't double up with the header logo on first paint.
- [ ] Watermark in generated content (lyric videos, claim cards) appears **once**, quiet, bottom corner.
- [ ] Email templates don't stack a header logo over a banner logo over a signature logo.
- [ ] No mixed-era logos across the same product (old wordmark in one place, new mark in another).

---

## 4. Hidden important features

- [ ] The thing the user came to do is reachable in **one tap from the home/start screen.**
- [ ] Core actions are not buried in a "..." menu, a settings page, or a hover-only state.
- [ ] On mobile, the primary CTA is in the thumb zone — never above the fold-only or behind a hamburger.
- [ ] Onboarding doesn't gate the main feature behind 4+ screens of setup.
- [ ] Likeness: claim, verify, and tap-in flows are visible from the public landing — not behind a login wall.
- [ ] Porterful: upload, lyric video, and artist support are all reachable from the artist dashboard without scrolling past marketing copy.

---

## 5. Weak CTAs

- [ ] Every page has **one** primary CTA. Not three "equal" buttons.
- [ ] CTA copy is specific: *Start a new video* > *Get started*. *Claim your name* > *Learn more*.
- [ ] CTAs sit on a strong contrast — not floating in a sea of similar buttons.
- [ ] No "Click here." No "Submit." No "Learn more" as the only action on a page that's supposed to convert.
- [ ] CTA leads somewhere immediately useful — not a marketing page about the feature they just tried to use.
- [ ] Above the fold on every landing page: a CTA the user can actually act on right now.

---

## 6. Placeholder copy

- [ ] No *Lorem ipsum* anywhere. Search the codebase. Search the CMS. Search the email templates.
- [ ] No *"Welcome to [Product Name]"* with a literal bracket left in.
- [ ] No *"Your tagline here."*
- [ ] No empty `alt=""` on hero images. No `title="Untitled"`.
- [ ] No "TODO," "FIXME," or "coming soon" in user-facing copy unless intentional and styled as such.
- [ ] All toast messages are written, not defaults (*"Success!"* / *"Error"* count as placeholders — replace with specifics).
- [ ] 404 and 500 pages are written in brand voice, not framework defaults.
- [ ] Empty states are written — never a blank panel with no copy.

---

## 7. Mobile issues

- [ ] Tap targets ≥ 44pt. Nothing requires precision.
- [ ] No horizontal scroll on any screen (except intentional carousels).
- [ ] Text is readable without zoom — body copy ≥ 16px.
- [ ] Inputs don't get hidden by the keyboard. The active field auto-scrolls into view.
- [ ] Primary CTA stays above the iOS home indicator and Android nav bar.
- [ ] Modals are dismissible by tap-outside **and** a visible close button.
- [ ] Images load progressively — no blank screens for 3+ seconds on cellular.
- [ ] Forms remember what the user typed if they background the app.
- [ ] No hover-only interactions. Everything is reachable by tap.
- [ ] Likeness QR / tap-in surfaces work in portrait, in low light, with a fingerprint-smudged screen.

---

## 8. Likeness shirt visual direction

**Decision:** No cheesy 3D shirt as the main Likeness public product image. The current 3D mockup reads like a generic POD template and undercuts the premium positioning.

### Don't

- ❌ Spinning / rotating 3D shirt renders
- ❌ Plastic-looking 3D mockup generators (Placeit defaults, Printful preview renders, etc.) shown as the hero image
- ❌ Floating shirts with no body, no context, no styling
- ❌ Multi-color shirt arrays ("available in 12 colors!") on the public landing
- ❌ Shirt-on-mannequin renders with visible 3D seams or unrealistic fabric
- ❌ Stacked merch grids that make Likeness look like a Shopify store

### Do (in priority order)

1. **Regular shirt mockup** — a single, well-lit shirt mockup using a real photographic mockup template (not a 3D render). One color. One angle. One frame.
2. **Flat-lay** — shirt laid flat on a textured surface (concrete, oak, linen). Shot from directly above. Soft, directional light. Editorial, not e-commerce.
3. **Clean product photo** — actual shirt, photographed against a neutral backdrop. Slight shadow. No model. Lets the artwork breathe.
4. **Realistic wearable look** — shirt photographed on a real person, cropped to chest/shoulders. Face optional. The shirt is the subject, not the model.
5. **Premium minimal lifestyle image (later)** — shirt in context: on a hanger in a clean apartment, folded on a bed, draped over a chair. One shot. No lifestyle clichés (coffee cups, succulents, exposed brick).

### Hero image rules

- **One shirt. One frame. One light source.**
- Shot or composed at the resolution of a press image — Likeness should look photographed, not generated.
- The artwork on the shirt is legible at thumbnail size.
- No watermark, no price tag, no "Buy now" button burned into the image.
- The image works on black, on white, and at 9:16 crop without losing the subject.

### When 3D is acceptable

Internal design tooling, "preview your name" interactive moments **inside** an authenticated flow — never as the public hero, never as the press image, never as the OG share card.

---

## Cross-product premium gut-check

Walk both products and answer honestly:

- Does the home screen look like something **a label, a stylist, or a venue** would respect?
- If a journalist screenshotted this page right now, would the screenshot help or hurt?
- Does anything on this page feel like it was made by someone else's product? (Stripe defaults, Vercel defaults, Tailwind UI samples that haven't been re-styled.)
- Is there **one** clearest action on this screen?
- Would O D post this to his own feed?

If the answer to any of these is no — the surface isn't ready.
