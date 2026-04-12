import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * POST /api/likeness/link
 * 
 * Links a Likeness ID (from likenessverified.com) to the current user's
 * Porterful profile. Does a live lookup at LikenessVerified.com to verify
 * the ID exists and belongs to this user.
 */

export async function POST(req: Request) {
  try {
    const { likeness_id } = await req.json()

    if (!likeness_id || typeof likeness_id !== 'string') {
      return NextResponse.json({ verified: false, message: 'Likeness ID is required' }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ verified: false, message: 'Server not configured' }, { status: 500 })
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ verified: false, message: 'Not authenticated' }, { status: 401 })
    }

    const userId = session.user.id
    const userEmail = session.user.email

    // Look up the Likeness ID at LikenessVerified.com
    const LIKENESS_SUPABASE_URL = 'https://gbyjinfneagkevizldqy.supabase.co'
    const LIKENESS_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.LIKENESS_SERVICE_ROLE_KEY

    if (!LIKENESS_KEY) {
      return NextResponse.json({ verified: false, message: 'Likeness service not configured' }, { status: 500 })
    }

    // Check that the Likeness ID exists in the registry
    const res = await fetch(
      `${LIKENESS_SUPABASE_URL}/rest/v1/registrations?select=id,likeness_id,email,name,created_at&likeness_id=eq.${encodeURIComponent(likeness_id)}&limit=1`,
      {
        headers: {
          'apikey': LIKENESS_KEY,
          'Authorization': `Bearer ${LIKENESS_KEY}`,
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ verified: false, message: 'Could not verify Likeness ID' }, { status: 500 })
    }

    const registrations = await res.json()
    if (!Array.isArray(registrations) || registrations.length === 0) {
      return NextResponse.json({ verified: false, message: 'That Likeness ID was not found. Please register at likenessverified.com first.' }, { status: 400 })
    }

    const registration = registrations[0]

    // SECURITY: Verify the Likeness ID belongs to THIS user.
    // The registration email must match the authenticated user's email.
    // This prevents User A from claiming User B's Likeness ID.
    if (!registration.email) {
      return NextResponse.json({ verified: false, message: 'Likeness record is incomplete. Please re-register at likenessverified.com.' }, { status: 400 })
    }

    if (registration.email.toLowerCase() !== userEmail?.toLowerCase()) {
      return NextResponse.json(
        { verified: false, message: 'That Likeness ID belongs to a different email address. Link your own Likeness ID that matches your Porterful account email.' },
        { status: 403 }
      )
    }

    // Update Porterful profile with the Likeness linkage
    const { error } = await supabase
      .from('profiles')
      .update({
        likeness_verified: true,
        likeness_registry_id: registration.likeness_id,
        likeness_verified_at: registration.created_at || new Date().toISOString(),
        likeness_name_match: null,
      })
      .eq('id', userId)

    if (error) {
      console.error('[LikenessLink] DB update error:', error)
      return NextResponse.json({ verified: false, message: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({
      verified: true,
      likeness_id: registration.likeness_id,
      registered_at: registration.created_at,
    })
  } catch (err) {
    console.error('[LikenessLink] Error:', err)
    return NextResponse.json({ verified: false, message: 'Internal error' }, { status: 500 })
  }
}
