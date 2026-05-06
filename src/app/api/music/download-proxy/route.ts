import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 });

    const supabase = createServerClient();
    const { data: purchase } = await supabase
      .from('music_purchases')
      .select('track_title, artist_name, storage_path, recovery_token_expires_at')
      .eq('recovery_token', token)
      .maybeSingle();

    if (!purchase) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (purchase.recovery_token_expires_at && new Date(purchase.recovery_token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Expired' }, { status: 410 });
    }

    // Use the SAME signed URL generation that /api/music/recover uses
    const relativePath = purchase.storage_path.replace(/^audio\//, '');
    const { data: signedData, error: signedError } = await supabase.storage.from('audio').createSignedUrl(relativePath, 60);
    
    if (signedError || !signedData?.signedUrl) {
      console.error('[download-proxy] Signed URL error:', signedError);
      return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 });
    }

    // Build full URL -- Supabase returns /object/sign/audio/... (relative to /storage/v1)
    const signedUrl = signedData.signedUrl.startsWith('http') 
      ? signedData.signedUrl 
      : `https://tsdjmiqczgxnkpvirkya.supabase.co/storage/v1${signedData.signedUrl}`;

    // Fetch file
    const fileRes = await fetch(signedUrl);
    if (!fileRes.ok) {
      console.error('[download-proxy] Fetch failed:', fileRes.status, fileRes.statusText, 'URL:', signedUrl.substring(0, 100));
      return NextResponse.json({ error: `Fetch failed: ${fileRes.status}` }, { status: 500 });
    }

    const fileBuffer = await fileRes.arrayBuffer();
    const filename = `${purchase.artist_name || 'artist'} - ${purchase.track_title || 'track'}.mp3`;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(fileBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error('[download-proxy] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
