import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { decodePorterfulSession } from '@/lib/porterful-session';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('porterful_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessionData = decodePorterfulSession(sessionToken);
  if (!sessionData) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  if (!sessionData.lkId) {
    return NextResponse.json({ error: 'No Likeness™ identity' }, { status: 403 });
  }

  const supabase = createServerClient();

  const { data: earnings } = await supabase
    .from('earnings')
    .select('total_earned_cents, pending_cents, last_activity_at')
    .eq('lk_id', sessionData.lkId)
    .limit(1)
    .maybeSingle();

  const { data: transactions } = await supabase
    .from('offer_transactions')
    .select('offer_id, product_id, amount_cents, commission_cents, created_at, status')
    .eq('lk_id', sessionData.lkId)
    .order('created_at', { ascending: false })
    .limit(20);

  const total = earnings?.total_earned_cents || 0;
  const pending = earnings?.pending_cents || 0;

  return NextResponse.json({
    total_earned_cents: total,
    pending_cents: pending,
    settled_cents: total - pending,
    transactions: transactions || [],
  });
}
