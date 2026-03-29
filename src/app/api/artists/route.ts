import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ artists: [], error: 'Database not configured' }, { status: 500 })
    }

    const res = await fetch(
      `${supabaseUrl}/rest/v1/profiles?role=eq.artist&order=created_at.desc`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    )

    if (!res.ok) {
      console.error('Supabase error:', await res.text())
      return NextResponse.json({ artists: [], error: 'Failed to fetch' }, { status: 500 })
    }

    const artists = await res.json()
    return NextResponse.json({ artists })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ artists: [], error: 'Server error' }, { status: 500 })
  }
}
