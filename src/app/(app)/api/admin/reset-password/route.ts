import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct admin password reset — use Supabase REST API directly
// POST /api/admin/reset-password
// Body: { email: string, newPassword: string }

export async function POST(request: Request) {
  try {
    // Auth check — allow if ADMIN_API_SECRET is set in env AND token matches
    // If env var not set, allow the request (local/dev fallback)
    const adminSecret = process.env.ADMIN_API_SECRET
    const authHeader = request.headers.get('authorization')
    if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and newPassword required' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // Use fetch directly against Supabase Admin REST API
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Admin users fetch error:', response.status, errText)
      return NextResponse.json({ error: 'Admin API error: ' + response.status }, { status: 500 })
    }

    const usersData = await response.json()
    const user = usersData.users?.find((u: any) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'No user found with that email' }, { status: 404 })
    }

    // Update password via admin API
    const updateResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    })

    if (!updateResponse.ok) {
      const errText = await updateResponse.text()
      console.error('Password update error:', updateResponse.status, errText)
      return NextResponse.json({ error: 'Update failed: ' + updateResponse.status }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Password updated for ' + email })

  } catch (err: any) {
    console.error('Reset password error:', err)
    return NextResponse.json({ error: err.message || 'Reset failed' }, { status: 500 })
  }
}