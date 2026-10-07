import crypto from 'crypto';
import { cookies } from 'next/headers';

/**
 * Porterful Session — signed server cookie
 * Format: base64url(json).hmac
 */

export interface PorterfulSession {
  email: string;
  profileId: string;
  lkId: string | null;
  iat: number;
}

const PORTERFUL_SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function getPorterfulSessionSecret() {
  const secret = process.env.PORTERFUL_SESSION_SECRET;
  if (!secret) {
    throw new Error('PORTERFUL_SESSION_SECRET is required');
  }
  return secret;
}

function signPayload(payload: string) {
  return crypto.createHmac('sha256', getPorterfulSessionSecret()).update(payload).digest('base64url');
}

export function encodePorterfulSession(session: PorterfulSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const sig = signPayload(payload);
  return `${payload}.${sig}`;
}

export function decodePorterfulSession(token: string): PorterfulSession | null {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;

    const expectedSig = signPayload(payload);
    if (sig.length !== expectedSig.length) return null;

    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
    if (diff !== 0) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as PorterfulSession;
    if (!decoded?.email || !decoded?.profileId || !decoded?.iat) return null;

    if (Date.now() - decoded.iat > PORTERFUL_SESSION_MAX_AGE_MS) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export async function getPorterfulSession(): Promise<PorterfulSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('porterful_session');
    if (!cookie?.value) return null;
    return decodePorterfulSession(cookie.value);
  } catch {
    return null;
  }
}

export async function requirePorterfulSession(): Promise<PorterfulSession> {
  const session = await getPorterfulSession();
  if (!session) {
    throw new Error('NOT_AUTHENTICATED');
  }
  return session;
}
