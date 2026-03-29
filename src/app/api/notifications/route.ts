import { NextRequest, NextResponse } from 'next/server'

// Subscribe to artist notifications
export async function POST(request: NextRequest) {
  try {
    const { artistId, email, action } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    if (action === 'subscribe') {
      // Add subscriber to notifications table
      const res = await fetch(
        `${supabaseUrl}/rest/v1/notifications`,
        {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            artist_id: artistId,
            subscriber_email: email,
            created_at: new Date().toISOString()
          })
        }
      )

      if (!res.ok) {
        // Already subscribed - update existing
        await fetch(
          `${supabaseUrl}/rest/v1/notifications?artist_id=eq.${artistId}&subscriber_email=eq.${encodeURIComponent(email)}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ created_at: new Date().toISOString() })
          }
        )
      }

      return NextResponse.json({ success: true, message: 'Subscribed to notifications' })
    }

    if (action === 'unsubscribe') {
      await fetch(
        `${supabaseUrl}/rest/v1/notifications?artist_id=eq.${artistId}&subscriber_email=eq.${encodeURIComponent(email)}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      )

      return NextResponse.json({ success: true, message: 'Unsubscribed' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

// Get notification status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const artistId = searchParams.get('artistId')
  const email = searchParams.get('email')

  if (!artistId || !email) {
    return NextResponse.json({ subscribed: false })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ subscribed: false })
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/notifications?artist_id=eq.${artistId}&subscriber_email=eq.${encodeURIComponent(email)}&select=id`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }
  )

  const data = await res.json()
  return NextResponse.json({ subscribed: Array.isArray(data) && data.length > 0 })
}
