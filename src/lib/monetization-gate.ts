/**
 * Monetization Gate — only enforce likeness for payout / withdrawal.
 * Creation flows stay open.
 */

import { createServerClient } from '@/lib/supabase'

export interface MonetizationStatus {
  allowed: boolean
  reason?: 'LIKENESS_REQUIRED' | 'NOT_AUTHENTICATED' | 'SERVER_ERROR' | 'OK'
  message?: string
  likeness_id?: string
}

/**
 * Check if user is allowed to perform payout actions.
 * When `requireLiveVerification` is false, authentication alone is enough.
 */
export async function checkMonetizationStatus(
  requireLiveVerification = false
): Promise<MonetizationStatus> {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return { allowed: false, reason: 'SERVER_ERROR', message: 'Server not configured' }
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return { allowed: false, reason: 'NOT_AUTHENTICATED', message: 'Sign in to continue' }
    }

    const userId = session.user.id
    const userEmail = session.user.email

    // Check Porterful profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('likeness_verified, likeness_registry_id, likeness_verified_at')
      .eq('id', userId)
      .single()

    if (!requireLiveVerification) {
      return {
        allowed: true,
        reason: 'OK',
        likeness_id: profile?.likeness_registry_id || null,
      }
    }

    if (profile?.likeness_registry_id) {
      const liveCheck = await verifyLikenessLive(profile.likeness_registry_id, userEmail!)
      if (!liveCheck.valid) {
        await supabase
          .from('profiles')
          .update({ likeness_verified: false })
          .eq('id', userId)
        return {
          allowed: false,
          reason: 'LIKENESS_REQUIRED',
          message: 'Verify your identity to withdraw funds. Your Likeness record could not be confirmed.',
        }
      }
    }

    if (!profile?.likeness_verified || !profile?.likeness_registry_id) {
      return {
        allowed: false,
        reason: 'LIKENESS_REQUIRED',
        message: 'Verify your identity to withdraw funds',
        likeness_id: profile?.likeness_registry_id || null,
      }
    }

    return {
      allowed: true,
      reason: 'OK',
      likeness_id: profile.likeness_registry_id,
    }

  } catch (err) {
    console.error('[checkMonetizationStatus] Error:', err)
    return { allowed: false, reason: 'SERVER_ERROR', message: 'Server error' }
  }
}

/**
 * Live verification against LikenessVerified.com registry
 */
async function verifyLikenessLive(likenessId: string, expectedEmail: string): Promise<{ valid: boolean }> {
  try {
    const LIKENESS_URL = 'https://gbyjinfneagkevizldqy.supabase.co'
    const LIKENESS_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.LIKENESS_SERVICE_ROLE_KEY

    if (!LIKENESS_KEY) {
      // Can't verify live — trust cached profile
      return { valid: true }
    }

    const res = await fetch(
      `${LIKENESS_URL}/rest/v1/registrations?select=id,likeness_id,email&likeness_id=eq.${encodeURIComponent(likenessId)}&limit=1`,
      {
        headers: {
          'apikey': LIKENESS_KEY,
          'Authorization': `Bearer ${LIKENESS_KEY}`,
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) return { valid: false }

    const registrations = await res.json()
    if (!Array.isArray(registrations) || registrations.length === 0) {
      return { valid: false }
    }

    const reg = registrations[0]
    if (reg.email?.toLowerCase() !== expectedEmail?.toLowerCase()) {
      return { valid: false }
    }

    return { valid: true }

  } catch {
    return { valid: false }
  }
}

/**
 * Gate response — returns the standard blocked response
 */
export function blockedResponse(message = 'Verify your identity to withdraw funds') {
  return new Response(JSON.stringify({
    status: 403,
    error: 'LIKENESS_REQUIRED',
    message,
    redirect_url: '/dashboard/likeness',
  }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  })
}
