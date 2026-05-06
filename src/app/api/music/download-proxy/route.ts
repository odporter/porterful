import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Download proxy — validates purchase token, downloads file directly from
 * Supabase Storage using service-role key, and streams it back with
 * Content-Disposition: attachment so browsers treat it as a download.
 *
 * Why not signed URL? createSignedUrl returns a relative path that
 * requires /storage/v1 prefix, and fetching it server-side gave 400s.
 * Using .download() with the service role key is more reliable.
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

    // Download file directly via Supabase client (service role)
    const relativePath = purchase.storage_path.replace(/^audio\//, '');
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('audio')
      .download(relativePath);

    if (downloadError || !fileData) {
      console.error('[download-proxy] Download error:', downloadError);
      return NextResponse.json({ error: 'Failed to download file.' }, { status: 500 });
    }

    const fileBuffer = await fileData.arrayBuffer();

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
