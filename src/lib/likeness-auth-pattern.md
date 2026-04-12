# Likeness™ Auth Pattern — Analysis & Porterful Adaptation Guide

> **Purpose:** Document how Likeness™ handles authentication (cookie, session model, DB schema, HMAC verification) so Porterful can replicate the same patterns for a unified artist identity system.

---

## 1. How Likeness Auth Works

### 1.1 Session Cookie

- **Cookie name:** `likeness_session`
- **HttpOnly:** Yes
- **Secure:** Yes
- **SameSite:** `lax`
- **Max-Age:** 30 days (`60 * 60 * 24 * 30`)
- **Path:** `/`

**Cookie value format (base64url encoded):**
```
base64url(encodeUTF8(`${email}|${HMAC-SHA256(email + MAGIC_LINK_SECRET)}`))
```

The value is NOT a random session ID. It's a deterministic signature — same email + secret always produces the same cookie. This means the cookie can be validated without a DB lookup for the basic integrity check (the DB lookup is for existence confirmation).

### 1.2 Signature Computation

```typescript
// Server-side (shared secret: MAGIC_LINK_SECRET env var)
const sig = createHash('sha256').update(email + secret).digest('base64url');
const sessionValue = Buffer.from(`${email}|${sig}`).toString('base64url');

// Middleware validation (reconstruct and compare with constant-time comparison)
const expectedSig = createHash('sha256').update(email + secret).digest('base64url');
// Constant-time comparison (diff accumulator to prevent timing attacks):
let diff = 0;
for (let i = 0; i < sig.length; i++) {
  diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
}
if (diff !== 0) return null;
```

### 1.3 Magic Link Token Format (send-link → verify)

**Token encoding:** The raw token is base64 with `-`→`+` and `_`→`/` for URL safety (URL-safe base64).

**Token structure:** `${expiresTimestamp}:${HMAC-SHA256(email:expiresTimestamp + MAGIC_LINK_SECRET)}` (hex)

- `expiresTimestamp` = Unix seconds when link expires (typically 15 min)
- Signature covers `${normalizedEmail}:${expiresTs}` — binds token to email and expiry

### 1.4 DB Model — `registrations` table (Likeness)

| Column | Type | Notes |
|---|---|---|
| `likeness_id` | TEXT UNIQUE | Primary identity key for SCS™ events |
| `email` | TEXT NOT NULL | Normalized to lowercase |
| `full_name` | TEXT NOT NULL | Legal name for verification |
| `pending_token` | TEXT | Set on send-link, cleared on verify (one-time use) |
| `pending_expires` | TIMESTAMPTZ | Token expiry timestamp |
| `likeness_verified` | BOOLEAN | Set to true after first magic link verify |
| `likeness_verified_at` | TIMESTAMPTZ | Timestamp of verification |
| `used_tokens` | TEXT[] | Array of already-used token signatures (HMAC hex) |

**Key behaviors:**
- Magic link is one-time use — `pending_token` is cleared after successful verification
- Token reuse emits `session_invalidated` SCS™ event
- All reads use `createServiceClient()` (service role key, bypasses RLS)
- RLS policies are defense-in-depth only

### 1.5 Middleware Validation Flow

```
Request → middleware
  ├─ /dashboard or /dashboard/*?
  │   └─ No likeness_session cookie? → redirect /register
  │   └─ Cookie present → decode → HMAC verify → DB lookup (likeness_id)
  │       └─ DB lookup fails? → redirect /register
  │       └─ Valid → NextResponse.next() (pass email + likeness_id via header)
  │
  ├─ /vault or /vault/*?
  │   └─ Same pattern → redirect /login if invalid
  │
  └─ All other paths → NextResponse.next()
```

### 1.6 Verify Route Flow

1. Decode base64url token from `?code=` param
2. Parse `${expires}:${sig}` — split on `:`
3. Check expiry timestamp > now
4. Compute expected HMAC and compare with constant-time comparison
5. DB lookup: find registration by email, get `pending_token`
6. Check `pending_token === presentedSig` (one-time use enforcement)
7. Check `pending_expires > now`
8. **All pass:** clear `pending_token`, `pending_expires`; emit `email_verified` SCS™ event; set `likeness_session` cookie
9. **Any fail:** redirect to `/login?error=<reason>`

---

## 2. Patterns Porterful Should Replicate Exactly

### 2.1 Session Cookie

**Replicate exactly:**
- Cookie name: `porterful_session` (namespaced, not `likeness_session`)
- Flags: `httpOnly: true`, `secure: true`, `sameSite: 'lax'`, `maxAge: 60*60*24*30`, `path: '/'`
- Value format: `base64url("${email}|${HMAC-SHA256(email + SECRET)}")`

### 2.2 HMAC Verification Function

**Replicate exactly:**
```typescript
// Constant-time comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
```

### 2.3 Middleware Auth Pattern

**Replicate exactly — protect these path patterns:**
- `/dashboard` and all `/dashboard/*` subpaths → redirect to `/register` if no valid session
- `/vault` and all `/vault/*` subpaths → redirect to `/login?redirect=<path>` if no valid session

**Validation sequence:**
1. Read `porterful_session` cookie
2. Decode base64url → split on `|` → `[email, sig]`
3. Recompute HMAC with `MAGIC_LINK_SECRET`
4. Constant-time compare signatures
5. DB lookup against `profiles` table for email
6. If valid, attach `{email, userId}` to request headers for downstream use

### 2.4 API Auth Guard Pattern

Create `src/lib/porterful-auth.ts` that exports:
- `validateSessionCookie(request, cookieName)` → `{email, userId, likenessId} | null`
- `withPorterfulAuth(handler)` wrapper matching the Likeness pattern

### 2.5 Service Client Pattern

Always use `createServiceClient()` (service role key) for auth operations — never anon key.

```typescript
// src/lib/supabase/service.ts
import { createClient } from '@supabase/supabase-js';

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

---

## 3. Supabase Schema for Porterful `profiles` Table

Add these columns via migration (all are non-breaking additions):

```sql
-- ============================================
-- LIKENESS AUTH COLUMNS (add to existing profiles table)
-- Run in Supabase SQL Editor after existing schema
-- ============================================

-- Magic link one-time token
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pending_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pending_expires TIMESTAMPTZ;

-- Likeness verification status (mirrors Likeness registrations table)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likeness_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likeness_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likeness_verified_at TIMESTAMPTZ;

-- Track used tokens for one-time enforcement (HMAC signatures in hex)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS used_tokens TEXT[] DEFAULT '{}';

-- Index for fast likeness_id lookup
CREATE INDEX IF NOT EXISTS idx_profiles_likeness_id ON profiles(likeness_id) 
  WHERE likeness_id IS NOT NULL;

-- ============================================
-- RLS POLICIES (add to existing RLS)
-- ============================================

-- All auth reads use service role (bypasses RLS)
-- RLS policies are defense-in-depth only:

-- Allow service role full access (defense-in-depth — service role bypasses RLS anyway)
CREATE POLICY "Allow service role full profiles" ON profiles
  FOR ALL USING (true);

-- Public read of profiles is fine (email/name are already public in current schema)
-- But likeness fields should only be readable by service role
-- The existing "Public profiles are viewable" policy remains, but likeness columns
-- are only exposed via service client in API routes (never returned in public responses)

-- ============================================
-- UNIQUE CONSTRAINT (if not exists)
-- ============================================
-- likeness_id must be unique (each artist has one)
DO $$ BEGIN
  ALTER TABLE profiles ADD CONSTRAINT profiles_likeness_id_unique 
    UNIQUE (likeness_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
```

**Summary of new columns:**

| Column | Type | Notes |
|---|---|---|
| `pending_token` | TEXT | One-time magic link token (HMAC hex) |
| `pending_expires` | TIMESTAMPTZ | When the pending token expires |
| `likeness_id` | TEXT UNIQUE | Artist's Likeness™ identity — links to Likeness registry |
| `likeness_verified` | BOOLEAN | True when artist completed likeness verification |
| `likeness_verified_at` | TIMESTAMPTZ | When verification occurred |
| `used_tokens` | TEXT[] | Array of spent token signatures (prevents replay) |

---

## 4. Specific File Paths to Create/Update

### New Files to Create

| Path | Purpose |
|---|---|
| `src/lib/supabase/service.ts` | `createServiceClient()` using service role key |
| `src/lib/porterful-session.ts` | Session cookie encode/decode, HMAC verify, `validateSessionCookie()` |
| `src/app/api/auth/send-link/route.ts` | Send magic link email (pattern from Likeness `send-link`) |
| `src/app/api/auth/verify/route.ts` | Verify magic link, set `porterful_session` cookie |
| `src/app/api/auth/logout/route.ts` | Clear `porterful_session` cookie |
| `src/app/api/auth/me-lk/route.ts` | Return current user's email + likeness_id (like Likeness `me` route) |

### Files to Update

| Path | Change |
|---|---|
| `src/middleware.ts` | Replace Supabase auth cookie check with `porterful_session` + HMAC + DB lookup; protect `/dashboard/*` → `/register`, `/vault/*` → `/login` |
| `src/lib/api-auth-guard.ts` | Add `withPorterfulAuth()` as alternative to `withAuth()`; use service client instead of anon key |
| `src/lib/auth-utils.ts` | Add `requireLikenessAuth()` using custom session pattern; keep existing for backwards compatibility |
| `supabase/schema.sql` or new migration | Add `pending_token`, `pending_expires`, `likeness_id`, `likeness_verified`, `likeness_verified_at`, `used_tokens` columns to `profiles` |

### Environment Variables Required

```env
MAGIC_LINK_SECRET=<same secret used by Likeness for cross-service token verification>
# Porterful should use the SAME secret as Likeness so tokens are mutually verifiable
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_BASE_URL=<your-app-url>
```

### Migration File to Create

`supabase/migrations/024_add_likeness_auth_columns.sql` — adds the five new columns to `profiles` and indexes.

---

## 5. Key Differences from Current Porterful Auth

| Aspect | Current Porterful | Target (Likeness pattern) |
|---|---|---|
| Cookie | `sb-access-token` (Supabase JWT) | `porterful_session` (custom HMAC) |
| Session model | Supabase Auth-managed (refresh tokens) | Self-contained signed token |
| DB lookup | Supabase Auth `auth.users` + `profiles` join | `profiles` table only (email → likeness_id) |
| Token type | OAuth/JWT refresh flow | One-time magic link with HMAC |
| Service client | Not consistently used | Always `createServiceClient()` for auth |
| SCS™ events | None | `email_verified` on successful login |

---

## 6. Implementation Notes

1. **Do not use Supabase Auth cookies** for the likeness-verified flow. The `sb-access-token` / `sb-refresh-token` flow is separate and continues to work for the general Porterful commerce flow.

2. **Two auth systems coexist:** Porterful's existing Supabase Auth (products, orders, checkout) + new Likeness session auth (artist identity, dashboard access for verified artists).

3. **Shared secret:** If Porterful and Likeness share the same `MAGIC_LINK_SECRET`, magic links sent from one platform can potentially be verified on the other. This is a design choice — it's useful if you want cross-platform verification.

4. **Likeness ID generation:** When an artist first verifies, generate a `likeness_id` if one doesn't exist. Format suggestion: `lk_<base62(random(16))>` — same pattern Likeness uses.

5. ** SCS™ events:** If Porterful adopts SCS™ integration, the `email_verified` event should be emitted on successful magic link verification, using the same `emitSCSEvent()` pattern from `@/lib/scs/emit`.