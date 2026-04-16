import { redirect } from 'next/navigation'
import { createServerComponentSupabaseClient } from '@/lib/supabase-auth'
import { cookies } from 'next/headers'

export default async function LoginPage() {
  // Server-side auth guard: redirect authenticated users to dashboard immediately
  // This prevents any flash of login form for logged-in users
  const cookieStore = await cookies()
  const supabase = createServerComponentSupabaseClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  // Not authenticated — render the login form at /login/login
  redirect('/login/login')
}
