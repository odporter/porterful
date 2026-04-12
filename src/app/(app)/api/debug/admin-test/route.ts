import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  
  // Clean ALL keys that might have embedded newlines
  const cleanKey = (key: string) => key.replace(/[\r\n]/g, '')
  
  const serviceKey = cleanKey(process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  const anonKey = cleanKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

  try {
    // Test with cleaned key
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
      textLength: text.length,
      cleanKeyLength: serviceKey.length,
      parseable: !!JSON.parse(text).users,
      users: JSON.parse(text).users?.length || 0,
      error: null,
    })
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
      rawServiceKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || 'MISSING').substring(0, 50),
      cleanedLength: serviceKey.length,
    }, { status: 500 })
  }
}