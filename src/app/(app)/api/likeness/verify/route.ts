import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Likeness Verification API
 * 
 * Checks if a user's Likeness is verified by querying the LikenessVerified
 * Supabase project (gbyjinfneagkevizldqy.supabase.co) registrations table.
 * 
 * If verified, updates the Porterful profile with likeness fields.
 * 
 * This is the bridge between LikenessVerified.com and Porterful.
 */

const LIKENESS_SUPABASE_URL = 'https://gbyjinfneagkevizldqy.supabase.co'
const LIKENESS_SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.LIKENESS_SERVICE_ROLE_KEY

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('user_id')

    if (!email && !userId) {
      return NextResponse.json({ error: 'email or user_id required' }, { status: 400 })
    }

    // Query LikenessVerified Supabase for a matching registration
    let likenessQuery = `${LIKENESS_SUPABASE_URL}/rest/v1/registrations?select=id,email,name,likeness_id,created_at&order=created_at.desc&limit=1`
    
    if (email) {
      likenessQuery += `&email=ilike.${encodeURIComponent(email)}`
    }
    
    if (!LIKENESS_SUPABASE_KEY) {
      console.warn('[LikenessVerify] No service role key set — skipping external lookup')
      return NextResponse.json({ verified: false, source: 'unconfigured' })
    }

    const res = await fetch(likenessQuery, {
      headers: {
        'apikey': LIKENESS_SUPABASE_KEY,
        'Authorization': `Bearer ${LIKENESS_SUPABASE_KEY}`,
      },
      next: { revalidate: 0 } // Always fresh
    })

    if (!res.ok) {
      console.error('[LikenessVerify] External lookup failed:', res.status, await res.text())
      return NextResponse.json({ verified: false, source: 'error' })
    }

    const registrations = await res.json()
    
    if (!Array.isArray(registrations) || registrations.length === 0) {
      return NextResponse.json({ verified: false, source: 'not_registered' })
    }

    const registration = registrations[0]

    // Name match check — compare registration name with profile name if available
    let nameMatch: boolean | null = null
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const supabase = createServerClient()!
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, stage_name')
        .eq('id', userId)
        .single()
      
      if (profile) {
        const profileName = (profile.full_name || profile.stage_name || '').toLowerCase().trim()
        const regName = (registration.name || '').toLowerCase().trim()
        nameMatch = profileName.length > 0 && regName.includes(profileName.split(' ')[0])
      }
    }

    const result = {
      verified: true,
      source: 'likeness_registry',
      likeness_id: registration.likeness_id,
      likeness_email: registration.email,
      likeness_name: registration.name,
      name_match: nameMatch,
      registered_at: registration.created_at,
    }

    // If we have a Porterful user_id, sync this to their profile
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const supabase = createServerClient()!
      await supabase
        .from('profiles')
        .update({
          likeness_verified: true,
          likeness_registry_id: registration.likeness_id,
          likeness_verified_at: new Date().toISOString(),
          likeness_name_match: nameMatch,
        })
        .eq('id', userId)
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[LikenessVerify] Error:', err)
    return NextResponse.json({ verified: false, source: 'error' })
  }
}
