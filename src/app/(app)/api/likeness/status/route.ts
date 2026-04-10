import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/likeness/status
 * 
 * Returns the Likeness verification status of the current user.
 * Also triggers a sync from LikenessVerified.com if not yet verified.
 * 
 * This is called on dashboard load to determine if the monetization gate is shown.
 */

export async function GET() {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ verified: false, reason: 'server_not_configured' })
    }
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ verified: false, reason: 'not_authenticated' })
    }

    const userId = session.user.id
    const userEmail = session.user.email

    // Check Porterful profile first
    const { data: profile } = await supabase
      .from('profiles')
      .select('likeness_verified, likeness_registry_id, likeness_verified_at, likeness_name_match')
      .eq('id', userId)
      .single()

    // Already verified on Porterful
    if (profile?.likeness_verified) {
      return NextResponse.json({
        verified: true,
        source: 'porterful_profile',
        likeness_id: profile.likeness_registry_id,
        verified_at: profile.likeness_verified_at,
        name_match: profile.likeness_name_match,
      })
    }

    // Try to sync from LikenessVerified.com
    const LIKENESS_SUPABASE_URL = 'https://gbyjinfneagkevizldqy.supabase.co'
    const LIKENESS_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.LIKENESS_SERVICE_ROLE_KEY

    if (LIKENESS_KEY && userEmail) {
      try {
        const res = await fetch(
          `${LIKENESS_SUPABASE_URL}/rest/v1/registrations?select=id,likeness_id,name,created_at&email=ilike.${encodeURIComponent(userEmail)}&order=created_at.desc&limit=1`,
          {
            headers: {
              'apikey': LIKENESS_KEY,
              'Authorization': `Bearer ${LIKENESS_KEY}`,
            },
            cache: 'no-store',
          }
        )

        if (res.ok) {
          const registrations = await res.json()
          if (Array.isArray(registrations) && registrations.length > 0) {
            const reg = registrations[0]
            
            // Sync to Porterful profile
            await supabase
              .from('profiles')
              .update({
                likeness_verified: true,
                likeness_registry_id: reg.likeness_id,
                likeness_verified_at: reg.created_at,
              })
              .eq('id', userId)

            return NextResponse.json({
              verified: true,
              source: 'likeness_registry_sync',
              likeness_id: reg.likeness_id,
              verified_at: reg.created_at,
            })
          }
        }
      } catch (syncError) {
        console.warn('[LikenessStatus] Sync attempt failed:', syncError)
      }
    }

    return NextResponse.json({
      verified: false,
      reason: profile?.likeness_verified === false ? 'not_registered' : 'profile_not_found',
      register_url: 'https://likenessverified.com/register',
    })
  } catch (err) {
    console.error('[LikenessStatus] Error:', err)
    return NextResponse.json({ verified: false, reason: 'error' })
  }
}
