// API route for generating signed download URLs for music purchases
// Returns a time-limited signed URL for Supabase storage

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    const supabase = createServerClient();
    
    // Generate signed URL valid for 5 minutes
    const { data, error } = await supabase
      .storage
      .from('audio')
      .createSignedUrl(path, 300); // 300 seconds = 5 minutes

    if (error) {
      console.error('[music-download] Signed URL error:', error);
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
    }

    // Generate clean filename from path
    const filename = path.split('/').pop() || 'track.mp3';
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    return NextResponse.json({
      url: data.signedUrl,
      filename: cleanFilename,
      expiresIn: 300,
    });
  } catch (error) {
    console.error('[music-download] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
