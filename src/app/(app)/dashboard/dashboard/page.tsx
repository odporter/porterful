import { redirect } from 'next/navigation'
import { createServerComponentSupabaseClient } from '@/lib/supabase-auth'
import { cookies } from 'next/headers'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Dashboard — single auth truth: Supabase SSR session cookies.
 * middleware handles redirect if unauthenticated; this is the final guard.
 * getUser() (not getSession) — avoids extra network round-trip.
 */
export default async function DashboardPage() {
  // Single auth source: Supabase SSR cookies set by login/callback routes
  const cookieStore = await cookies()
  const supabase = createServerComponentSupabaseClient(cookieStore)

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch profile for the authenticated user
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .limit(1)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return <DashboardClient serverProfileId={user.id} lkId={profile.lk_id} />
}