import { NextRequest, NextResponse } from 'next/server';
import { decodePorterfulSession } from '@/lib/porterful-session';

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get('porterful_session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const data = decodePorterfulSession(sessionToken);
    if (!data) {
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({
      authenticated: true,
      email: data.email || null,
      lkId: data.lkId || null,
      profileId: data.profileId || null,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
