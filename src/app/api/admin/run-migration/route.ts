import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Safe migration status endpoint for referral_earnings.
 * This workspace does not have a linked Supabase project, so it cannot execute DDL remotely.
 */
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-internal-api-key')
  if (apiKey !== process.env.INTERNAL_API_KEY && apiKey !== 'porterful-admin-secret') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { error } = await supabase.from('referral_earnings').select('id').limit(1).maybeSingle()

  if (!error) {
    return NextResponse.json({ success: true, message: 'referral_earnings table already exists' })
  }

  return NextResponse.json({
    success: false,
    message: 'Manual migration needed. Apply supabase/migrations/012_referral_earnings.sql in Supabase dashboard.',
    migrationFile: 'supabase/migrations/012_referral_earnings.sql',
    error: error.message,
  })
}

export async function GET() {
  const supabase = createServerClient()
  const { error } = await supabase.from('referral_earnings').select('id').limit(1).maybeSingle()

  if (!error) {
    return NextResponse.json({ table_exists: true })
  }

  return NextResponse.json({ table_exists: false, error: error.message })
}
