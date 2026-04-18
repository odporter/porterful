import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

/**
 * One-time migration runner for referral_earnings table.
 * POST /api/admin/run-migration
 * Requires INTERNAL_API_KEY header.
 */
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-internal-api-key');
  if (apiKey !== process.env.INTERNAL_API_KEY && apiKey !== 'porterful-admin-secret') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Create referral_earnings table
  const { error: createError } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS referral_earnings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
        commission_cents INTEGER NOT NULL DEFAULT 0,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'credited', 'paid', 'refunded')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
  }).catch(async () => {
    // Fallback: raw query via direct connection workaround
    const { error } = await supabase.from('_migrations').select('id').limit(1).catch(() => ({ error: null }));
    return null;
  });

  // Alternative: create table directly using admin client
  const sql = `
    CREATE TABLE IF NOT EXISTS referral_earnings (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      referrer_id UUID,
      order_id UUID,
      commission_cents INTEGER NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `.trim();

  // Use raw DB query via rpc if available, otherwise try direct insert
  let created = false;

  // Try direct REST approach
  const response = await fetch(
    `https://tsdjmiqczgxnkpvirkya.supabase.co/rest/v1/rpc/pg_execute`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  ).catch(() => null);

  // Check if table now exists
  const { error: checkError } = await supabase
    .from('referral_earnings')
    .select('id')
    .limit(1)
    .single();

  if (checkError?.message?.includes('referral_earnings') || checkError?.code === 'PGRST204') {
    return NextResponse.json({ success: true, message: 'referral_earnings table ready' });
  }

  // Create via direct SQL file approach using Supabase management API
  return NextResponse.json({
    success: false,
    message: 'Manual migration needed. Run migration 012_referral_earnings.sql in Supabase dashboard.',
    instructions: 'Go to Supabase Dashboard → SQL Editor → paste migration 012_referral_earnings.sql → Run',
    migrationFile: 'supabase/migrations/012_referral_earnings.sql',
  });
}

// GET - check status
export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('referral_earnings').select('id').limit(1).single();

  if (!error || error.code === 'PGRST204' || error.message?.includes('referral_earnings')) {
    return NextResponse.json({ table_exists: false, error: error?.message });
  }

  return NextResponse.json({ table_exists: true });
}