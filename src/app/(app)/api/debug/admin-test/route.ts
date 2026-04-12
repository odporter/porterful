import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  try {
    // Try with apikey ONLY (service role key in header)
    // Supabase GoTrue service role auth uses apikey header
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
      },
    })

    const status = response.status
    const text = await response.text()
    
    return NextResponse.json({
      status,
      text: text.substring(0, 300),
    })
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
    }, { status: 500 })
  }
}