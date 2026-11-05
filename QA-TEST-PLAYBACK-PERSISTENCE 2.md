# QA Test Plan — Stripe Redirect Checkout with Playback Persistence

## Files Changed

### 1. Playback Persistence (`src/lib/playback-persistence.ts`)
- New utility for saving/restoring player state to sessionStorage
- 30-minute expiry on snapshots
- Captures: track ID, queue, current time, volume, playing state, mode, originating route

### 2. Checkout Page (`src/app/(app)/checkout/checkout/page.tsx`)
- Added `useAudio()` hook integration
- Added `savePlaybackSnapshot()` call before Stripe redirect
- Snapshot includes full track metadata, queue, and playback position

### 3. Success Page (`src/app/(app)/checkout/checkout/success/page.tsx`)
- Completely redesigned: mobile-first, no horizontal overflow
- Truncated order ID display (first 8 + last 4 chars)
- Three primary actions: Play Purchased Track, Download MP3, Access by Email
- Automatic playback state restoration on mount
- "Resume Playback" button appears if music was playing
- Removed all "No download available" dead-end copy

### 4. API Routes
- **`src/app/api/music/download/route.ts`**: Generates signed Supabase storage URLs (5-min expiry)
- **`src/app/api/music/email-access/route.ts`**: Creates recovery tokens for email-based access

### 5. Webhook (`src/app/api/webhooks/stripe/route.ts`)
- Added music purchase recording after checkout completion
- Stores buyer email, track details, Stripe session ID, storage path

### 6. Session API (`src/app/(app)/api/session/[id]/route.ts`)
- Enriches response with storage paths from `music_purchases` table

### 7. Database (`supabase/migrations/014_music_purchases.sql`)
- New `music_purchases` table with recovery token system
- Fields: buyer_email, track_id, track_title, artist_name, stripe_session_id, storage_path, recovery_token

## Purchase Schema Fields

```sql
music_purchases:
  - id: UUID PRIMARY KEY
  - buyer_email: TEXT NOT NULL
  - buyer_user_id: UUID (nullable, links to profiles)
  - track_id: TEXT NOT NULL
  - track_title: TEXT NOT NULL
  - artist_name: TEXT NOT NULL
  - stripe_session_id: TEXT NOT NULL
  - amount_paid: INTEGER (cents)
  - storage_bucket: TEXT DEFAULT 'music'
  - storage_path: TEXT NOT NULL
  - download_count: INTEGER DEFAULT 0
  - last_downloaded_at: TIMESTAMPTZ
  - recovery_token: TEXT UNIQUE
  - recovery_token_expires_at: TIMESTAMPTZ
  - purchased_at: TIMESTAMPTZ
```

## Download URL Generation

1. **Server-side**: `/api/music/download?path={storagePath}`
2. **Supabase signed URL**: Valid for 5 minutes
3. **Clean filename**: Generated server-side from path
4. **Private bucket support**: Uses `createSignedUrl()` with service role key

## QA Test Checklist

### Desktop Chrome/Firefox/Safari
- [ ] Play track on music page
- [ ] Click purchase → checkout page loads
- [ ] Complete Stripe test payment
- [ ] Return to success page
- [ ] Verify: Queue restored, current track loaded
- [ ] Click "Resume Playback" → music plays from saved position
- [ ] Click "Download MP3" → file downloads
- [ ] Verify: Order ID truncated (e.g., "A1B2C3D4...E5F6")

### Mobile Safari (iOS)
- [ ] Play track on music page
- [ ] Start purchase flow
- [ ] Complete checkout
- [ ] Return to success page
- [ ] Verify: No horizontal overflow
- [ ] Verify: Resume Playback works
- [ ] Download MP3 → triggers file save

### Email Recovery
- [ ] Click "Access by Email" on success page
- [ ] Check email for recovery link (dev mode: check response)
- [ ] Visit `/music/recover?token={token}`
- [ ] Verify: Download links available

### Edge Cases
- [ ] Cancel checkout → return to site, no playback interruption
- [ ] Expired snapshot (>30 min) → no restoration attempted
- [ ] No audio playing before purchase → no resume button shown
- [ ] Multiple tracks in cart → all show download buttons

## Remaining Risks

1. **Email sending not implemented**: Recovery email infrastructure needs Resend/Nodemailer setup
2. **Recovery page not built**: `/music/recover` route needs implementation
3. **Storage bucket**: Requires `music` bucket to exist in Supabase with RLS policies
4. **Mobile Safari download**: May open audio in new tab instead of downloading; needs Content-Disposition header
5. **SessionStorage limits**: Large queues may exceed ~5MB limit

## How It Works

```
User plays music → Clicks Buy
        ↓
Checkout page: savePlaybackSnapshot() → sessionStorage
        ↓
Stripe redirect (user leaves site)
        ↓
Payment complete → Stripe returns to /checkout/checkout/success
        ↓
Success page: loadPlaybackSnapshot() → restore queue, track, position
        ↓
User clicks "Resume Playback" → music continues where they left off
```
