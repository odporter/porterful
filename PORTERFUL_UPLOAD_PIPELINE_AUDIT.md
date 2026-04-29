# Porterful Upload Pipeline Audit

**Date:** 2026-04-29  
**Auditor:** Sentinel MM  
**Status:** ❌ **CRITICAL BUG IDENTIFIED**

---

## 1. /dashboard/upload Page

| Component | Status | Details |
|-----------|--------|---------|
| **Page Route** | ✅ `/dashboard/dashboard/upload/page.tsx` | Active |
| **Access Control** | ✅ Artist-only | Checks `profiles.role = 'artist'` |
| **Redirect** | ✅ `/dashboard/artist` | After successful upload |

---

## 2. Upload Form Fields

| Field | Required | Type | Status |
|-------|----------|------|--------|
| **Audio File** | ✅ YES | MP3, M4A, WAV | Max 50MB |
| **Title** | ✅ YES | Text | Auto-populated from filename |
| **Cover Art** | ❌ Optional | Image | Max 5MB, JPEG/PNG/WebP/GIF |
| **Album** | ❌ Optional | Text | Free-form album name |
| **Price** | ❌ Optional | Number | USD, defaults to $1 |
| **Description** | ❌ Optional | Text | Max 300 chars |

**Missing Fields (Potential Gaps):**
- Track number (for album ordering)
- Genre
- Featured artist
- Explicit content flag

---

## 3. Upload API Route

**Route:** `/app/api/upload/route.ts`

| Component | Status | Issue |
|-----------|--------|-------|
| **Method** | ✅ POST | Correct |
| **Auth** | ⚠️ Service Role | Bypasses user auth (intentional for upload) |
| **File Validation** | ✅ Type + Size | MP3, M4A, WAV, 50MB max |
| **Storage Bucket** | ❌ **WRONG** | `'porterful-assets'` |
| **Expected Bucket** | ✅ Correct | `'music'` (per DB tracks schema) |

---

## 4. Storage Destination — **CRITICAL BUG**

### Current (BROKEN)
```typescript
// /api/upload/route.ts
await supabaseAdmin.storage
  .from('porterful-assets')  // ❌ WRONG BUCKET
  .upload(path, buffer)
```

### Expected (CORRECT)
```typescript
await supabaseAdmin.storage
  .from('music')  // ✅ CORRECT BUCKET
  .upload(path, buffer)
```

### Verified Buckets (via API)
```json
[
  "music",           // ✅ Audio tracks (correct)
  "artist-images",   // ✅ Artist photos
  "product-images"   // ✅ Product photos
]
```

**Bucket `'porterful-assets'` does NOT exist.**

---

## 5. DB Insert — /api/tracks/route.ts

| Field | Status | Note |
|-------|--------|------|
| `artist_id` | ✅ Linked to `profiles.id` | Correct ownership |
| `title` | ✅ From form | User-provided |
| `artist` | ⚠️ From email | `user.email.split('@')[0]` — fallback |
| `audio_url` | ❌ Broken | Points to wrong bucket |
| `cover_url` | ✅ Optional | From form or null |
| `album` | ✅ Optional | User-provided |
| `proud_to_pay_min` | ✅ Default $1 | User-provided price |
| `is_active` | ✅ Default true | Immediately live |

**Issue:** `audio_url` from upload API points to `porterful-assets`, but app expects `music` bucket.

---

## 6. Artist Ownership Linking

| Component | Status | Details |
|-----------|--------|---------|
| **Auth Check** | ✅ Session-based | HttpOnly cookie validation |
| **Role Check** | ✅ `profiles.role = 'artist'` | Prevents non-artist uploads |
| **artist_id** | ✅ `profiles.id` | Correct FK link |
| **Track Limit** | ✅ 3 active tracks | Hard limit enforced |

---

## 7. Cover Art Upload

| Component | Status | Path |
|-----------|--------|------|
| **Destination** | ⚠️ `artist-images` bucket | Not `music` |
| **Usage** | ✅ Cover URL stored | Nullable in DB |
| **Format** | ✅ JPEG/PNG/WebP/GIF | Validated |
| **Size** | ✅ Max 5MB | Validated |

---

## 8. Post-Upload Redirect

| Component | Status | Details |
|-----------|--------|---------|
| **Success** | ✅ `/dashboard/artist` | Catalog view |
| **Delay** | ✅ 1500ms | Shows success message |
| **Error** | ❌ Stays on page | Shows error message |

---

## 9. Track Visibility — /dashboard/artist

| Component | Status | Details |
|-----------|--------|---------|
| **Route** | ✅ `/dashboard/dashboard/artist/page.tsx` | Active |
| **Track List** | ✅ DB query | `tracks` table, `artist_id` filtered |
| **Status** | ✅ Shows Live/Draft | `is_active` boolean |
| **Edit Link** | ✅ `/dashboard/artist/edit/track/[id]` | Available |

---

## 10. Public Visibility

| Component | Status | Rule |
|-----------|--------|------|
| **Public Display** | ✅ `is_active = true` only | Correct filtering |
| **Artist Page** | ✅ `/artist/[slug]` | Shows active tracks |
| **Music Page** | ✅ `/music` | Global track listing |
| **Playback** | ❌ **BROKEN** | Wrong bucket URL |

---

## 11. Track Playback — **BROKEN**

**Root Cause:** Audio URL points to non-existent `porterful-assets` bucket.

**Expected URL Format:**
```
https://{host}/storage/v1/object/public/music/{filename}
```

**Actual URL Format (BROKEN):**
```
https://{host}/storage/v1/object/public/porterful-assets/{filename}
```

**Result:** 404 errors when attempting to play uploaded tracks.

---

## 12. Post-Upload Editing

| Component | Status | Route |
|-----------|--------|-------|
| **Edit Page** | ✅ Exists | `/dashboard/artist/edit/track/[id]/page.tsx` |
| **Track Data** | ✅ Fetched from DB | `tracks` table |
| **Update API** | ⚠️ Not verified | Likely exists |
| **Delete** | ⚠️ Not verified | Soft delete via `is_active = false`? |

---

## UPLOAD SUPPORTED: ❌ **NO — CRITICAL BUG**

### Summary
| Feature | Status |
|---------|--------|
| Form renders | ✅ Yes |
| Auth works | ✅ Yes |
| File uploads | ✅ Yes (to wrong bucket) |
| DB insert | ✅ Yes (with broken URL) |
| Track plays | ❌ **NO** (404 error) |
| Public visibility | ❌ Broken (audio fails) |

---

## ROOT CAUSE

**File:** `/app/api/upload/route.ts`  
**Line:** `storage.from('porterful-assets')`  
**Fix:** Change to `storage.from('music')`

---

## SMALLEST SAFE FIX

### Option A: Fix Upload Bucket (1 line change)
```typescript
// /app/api/upload/route.ts
.from('music')  // Change from 'porterful-assets'
```

**Pros:** Uploads work immediately  
**Cons:** None (existing tracks in other buckets unaffected)

---

### Option B: Create Missing Bucket (infrastructure)
Create `'porterful-assets'` bucket in Supabase.

**Pros:** No code change  
**Cons:** Adds unnecessary bucket, schema inconsistency

---

### Recommendation: **Option A**
Single line change to align with existing `music` bucket schema.

---

## MISSING PIECES (Non-Critical)

| Feature | Priority | Note |
|---------|----------|------|
| Track number field | Low | For album ordering |
| Genre field | Low | For filtering |
| Draft/Live toggle | Medium | Currently always live |
| Bulk upload | Low | Future feature |
| Audio compression | Low | Validation only, no processing |

---

## VERIFICATION CHECKLIST

- [ ] Fix upload bucket to `'music'`
- [ ] Test upload end-to-end
- [ ] Verify audio plays correctly
- [ ] Verify public visibility
- [ ] Verify dashboard artist view

---

## API ROUTES USED

| Route | Purpose | Status |
|-------|---------|--------|
| `POST /api/upload` | File upload | ❌ Broken (wrong bucket) |
| `POST /api/tracks` | DB insert | ✅ Works (stores wrong URL) |
| `GET /api/tracks` | Track listing | ✅ Works (returns broken URLs for new tracks) |

---

## CONCLUSION

**Upload pipeline exists but is non-functional** due to bucket mismatch. 

**Fix required:** Change `porterful-assets` → `music` in `/app/api/upload/route.ts`

Estimated fix time: **5 minutes** (1 line change + deploy)
