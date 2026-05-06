import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Download proxy — validates purchase token, fetches file from Supabase Storage,
 * and streams it back with Content-Disposition: attachment so browsers
 * treat it as a download (not inline playback).
 *
 * Why a proxy? Supabase Storage signed URLs are cross-origin. Browsers ignore
 * the `download` attribute on <a> tags for cross-origin URLs. By proxying through
 * our own domain, the file comes from same-origin and download works reliably.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'No recovery token provided.' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Validate the recovery token
    const { data: purchase, error: purchaseError } = await supabase
      .from('music_purchases')
      .select('track_title, artist_name, storage_path, recovery_token_expires_at')
      .eq('recovery_token', token)
      .maybeSingle();

    if (purchaseError) {
      console.error('[download-proxy] Database error:', purchaseError);
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }

    if (!purchase) {
      return NextResponse.json({ error: 'Invalid or expired recovery token.' }, { status: 404 });
    }

    // Check if token has expired
    if (purchase.recovery_token_expires_at && new Date(purchase.recovery_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Recovery link has expired.' }, { status: 410 });
    }

    // Generate a fresh signed URL (short-lived)
    const relativePath = purchase.storage_path.replace(/^audio\//, '');
    const { data: signedData, error: signedError } = await supabase
      .storage
      .from('audio')
      .createSignedUrl(relativePath, 60); // 1 minute — enough for the fetch

    if (signedError || !signedData?.signedUrl) {
      console.error('[download-proxy] Signed URL error:', signedError);
      return NextResponse.json({ error: 'Failed to generate download link.' }, { status: 500 });
    }

    // Fetch the actual file bytes from Supabase Storage
    const fileRes = await fetch(signedData.signedUrl);
    if (!fileRes.ok) {
      console.error('[download-proxy] File fetch failed:', fileRes.status, fileRes.statusText);
      return NextResponse.json({ error: 'Failed to fetch file from storage.' }, { status: 500 });
    }

    const fileBuffer = await fileRes.arrayBuffer();

    // Build a clean filename
    const cleanTitle = (purchase.track_title || 'track').replace(/[^a-zA-Z0-9\s_-]/g, '').trim();
    const cleanArtist = (purchase.artist_name || 'artist').replace(/[^a-zA-Z0-9\s_-]/g, '').trim();
    const filename = `${cleanArtist} - ${cleanTitle}.mp3`;

    // Stream back with forced download headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Content-Length': String(fileBuffer.byteLength),
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch (err) {
    console.error('[download-proxy] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
