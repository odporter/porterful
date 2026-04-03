import { NextResponse } from 'next/server'
import { ARTISTS } from '@/lib/artists'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/profiles?role=eq.artist&order=created_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
          next: { revalidate: 60 }
        }
      )

      if (res.ok) {
        const artists = await res.json()
        return NextResponse.json({ artists })
      }
    }

    // Fallback to static artists data when DB is not configured
    return NextResponse.json({ artists: ARTISTS })
  } catch (error) {
    console.error('API error:', error)
    // Fallback to static data on any error
    return NextResponse.json({ artists: ARTISTS })
  }
}
