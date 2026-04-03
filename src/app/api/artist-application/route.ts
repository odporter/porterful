import { createServerClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      user_id,
      stage_name,
      genre,
      city,
      bio,
      email,
      phone,
      instagram,
      twitter,
      youtube,
      tiktok,
      spotify,
      apple_music,
      soundcloud,
      avatar_url,
      cover_image_url,
    } = body

    if (!user_id || !stage_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!email || !phone) {
      return NextResponse.json({ error: 'Email and phone are required' }, { status: 400 })
    }

    // Lazy init — only create client when actually needed (not at module load)
    const { createServerClient } = await import('@/lib/supabase')
    const supabase = createServerClient()
    if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

    // Check if already has pending application
    const { data: existing } = await supabase
      .from('artist_applications')
      .select('id, status')
      .eq('user_id', user_id)
      .single()

    if (existing) {
      return NextResponse.json({
        error: 'You already have an application. Status: ' + existing.status,
        application_id: existing.id,
      }, { status: 400 })
    }

    // Insert application
    const { data, error } = await supabase
      .from('artist_applications')
      .insert({
        user_id,
        stage_name,
        genre,
        city,
        bio,
        email,
        phone,
        instagram: instagram || null,
        twitter: twitter || null,
        youtube: youtube || null,
        tiktok: tiktok || null,
        spotify: spotify || null,
        apple_music: apple_music || null,
        soundcloud: soundcloud || null,
        avatar_url: avatar_url || null,
        cover_image_url: cover_image_url || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Application insert error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, application: data })
  } catch (err) {
    console.error('Application route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  // Admin only — check for admin auth header or role
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET || 'admin-secret'}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { createServerClient } = await import('@/lib/supabase')
  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

  const { data, error } = await supabase
    .from('artist_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ applications: data })
}
