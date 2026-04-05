import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // URL: /media/artist-images/od-porter/avatar.jpg
  // Maps to: public/artist-images/od-porter/avatar.jpg
  const filePath = path.join(process.cwd(), 'public', 'artist-images', ...params.path);

  try {
    const file = await readFile(filePath);
    const ext = (filePath.split('.').pop() || '').toLowerCase();

    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      flac: 'audio/flac',
    };

    return new NextResponse(file, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        // Vary: Origin so CDN doesn't cache based on Accept-Encoding
        'Vary': 'Origin',
        // Short cache — just CDN edge cache, not browser
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
