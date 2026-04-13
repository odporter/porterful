import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const DASHBOARD_PATHS = ['/dashboard']
const AUTH_PATHS = ['/login', '/signup', '/superfan']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()

  // ──────────────────────────────────────────────
  // 1. Protect dashboard routes — use SSR client only, no manual cookie check
  // ──────────────────────────────────────────────
  const isDashboardPath = DASHBOARD_PATHS.some(p => pathname.startsWith(p))

  if (isDashboardPath) {
    // Create SSR client — reads cookies via request adapter, not manual name
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // Middleware only reads — sets handled in route handlers
          },
        },
      }
    )

    // getUser() reads cookies through adapter, calls Supabase /auth/v1/reveal
    // This also handles token refresh automatically
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      // No valid server session — redirect to login
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Server auth confirmed — pass user ID to route
    response.headers.set('x-user-id', user.id)
  }

  // ──────────────────────────────────────────────
  // 2. Redirect authenticated users away from auth pages
  // ──────────────────────────────────────────────
  const isAuthPath = AUTH_PATHS.some(p => pathname.startsWith(p))
  if (isAuthPath && !pathname.includes('/api/')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Already has server-valid session — send to dashboard
      return NextResponse.redirect(new URL('/dashboard/dashboard', request.url))
    }
  }

  // ──────────────────────────────────────────────
  // 3. Referral param capture
  // ──────────────────────────────────────────────
  const refParam = request.nextUrl.searchParams.get('ref')
  if (refParam) {
    const refCode = refParam.trim().toUpperCase()
    response.cookies.set('porterful_referral', refCode, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' })
    response.cookies.set('porterful_referral_client', refCode, { httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' })
    const url = request.nextUrl.clone()
    url.searchParams.delete('ref')
    return NextResponse.redirect(url)
  }

  // ──────────────────────────────────────────────
  // 4. Redirect /marketplace to /store
  // ──────────────────────────────────────────────
  if (pathname === '/marketplace') {
    return NextResponse.redirect(new URL('/store', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|maintenance|.*\\..*).*)',
  ],
}