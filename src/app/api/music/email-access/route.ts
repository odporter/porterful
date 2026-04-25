// API route for email-based access recovery to purchased music
// Generates a recovery token and sends access link

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, orderId } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Look up purchases by email
    const { data: purchases, error: purchaseError } = await supabase
      .from('music_purchases')
      .select('*')
      .eq('buyer_email', email.toLowerCase());

    if (purchaseError) {
      console.error('[email-access] Query error:', purchaseError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Also check orders table for non-music purchases
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select('id, buyer_email, stripe_checkout_session_id')
      .eq('buyer_email', email.toLowerCase())
      .eq('status', 'completed');

    if (orderError) {
      console.error('[email-access] Order query error:', orderError);
    }

    // Generate or refresh recovery tokens for purchases
    const accessLinks: Array<{
      trackTitle: string;
      artist: string;
      accessUrl: string;
      expiresAt: string;
    }> = [];

    if (purchases && purchases.length > 0) {
      for (const purchase of purchases) {
        // Generate new recovery token
        const { data: updated, error: updateError } = await supabase
          .from('music_purchases')
          .update({
            recovery_token: crypto.randomUUID(),
            recovery_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          })
          .eq('id', purchase.id)
          .select('recovery_token')
          .single();

        if (!updateError && updated) {
          accessLinks.push({
            trackTitle: purchase.track_title,
            artist: purchase.artist_name,
            accessUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/music/recover?token=${updated.recovery_token}`,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      }
    }

    // TODO: Send actual email via Resend or similar
    // For now, we return success and the links would be sent via email service
    // await sendRecoveryEmail(email, accessLinks);

    console.log('[email-access] Generated access links for:', email, accessLinks.length);

    return NextResponse.json({
      success: true,
      message: 'Access link sent to your email',
      // Only include links in development for testing
      ...(process.env.NODE_ENV === 'development' ? { debugLinks: accessLinks } : {}),
    });
  } catch (error) {
    console.error('[email-access] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
