import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token = requestUrl.searchParams.get('token')
  const type = requestUrl.searchParams.get('type')
  const email = requestUrl.searchParams.get('email')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard/dashboard'

  if (!code && !token) {
    return NextResponse.redirect(new URL('/login?error=no_token', requestUrl.origin))
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            try {
              cookieStore.set(name, value, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
                maxAge: options?.maxAge,
              })
            } catch (err) {
              console.error('[Auth Callback] Cookie set failed:', name, err)
            }
          }
        },
      },
    }
  )

  if (code) {
    const { data: { user, session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !session) {
      console.error('[Auth Callback] Exchange failed:', error?.message)
      return NextResponse.redirect(new URL('/login?error=exchange_failed', requestUrl.origin))
    }

    // Success — redirect to dashboard
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  if (type === 'recovery' && token && email) {
    const { data: { session }, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    })

    if (error || !session) {
      return NextResponse.redirect(new URL('/login?error=recovery_failed', requestUrl.origin))
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  return NextResponse.redirect(new URL('/login?error=invalid_params', requestUrl.origin))
}