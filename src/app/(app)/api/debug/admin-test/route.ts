import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  try {
    // Test listing users via REST API
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
    })

    const text = await response.text()
    let result: any = { status: response.status }

    try {
      const json = JSON.parse(text)
      if (json.users) {
        result.users = json.users.length
        result.sampleEmail = json.users[0]?.email
      } else {
        result.data = text.substring(0, 200)
      }
    } catch {
      result.raw = text.substring(0, 200)
    }

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}