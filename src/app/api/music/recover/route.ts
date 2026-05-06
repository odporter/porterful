import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'No recovery token provided.' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Look up the purchase by recovery token
    const { data: purchase, error } = await supabase
      .from('music_purchases')
      .select('id, track_title, artist_name, storage_path, recovery_token_expires_at')
      .eq('recovery_token', token)
      .maybeSingle()

    if (error) {
      console.error('[music-recover] Database error:', error)
      return NextResponse.json({ error: 'Database error.' }, { status: 500 })
    }

    if (!purchase) {
      return NextResponse.json({ error: 'Invalid or expired recovery token.' }, { status: 404 })
    }

    // Check if token has expired
    if (purchase.recovery_token_expires_at && new Date(purchase.recovery_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Recovery link has expired.' }, { status: 410 })
    }

    // Generate signed download URL
    // storage_path includes bucket prefix (e.g. audio/artists/...), but
    // createSignedUrl expects the path relative to the bucket root.
    const relativePath = purchase.storage_path.replace(/^audio\//, '')
    const { data: signedUrlData, error: signedError } = await supabase
      .storage
      .from('audio')
      .createSignedUrl(relativePath, 300) // 5 minutes

    if (signedError || !signedUrlData?.signedUrl) {
      console.error('[music-recover] Signed URL error:', signedError)
      return NextResponse.json({ error: 'Failed to generate download link.' }, { status: 500 })
    }

    return NextResponse.json({
      trackTitle: purchase.track_title,
      artist: purchase.artist_name,
      downloadUrl: signedUrlData.signedUrl,
      expiresIn: 300,
    })
  } catch (err) {
    console.error('[music-recover] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
