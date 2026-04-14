import { redirect } from 'next/navigation'
import { getPorterfulSession } from '@/lib/porterful-session'
import { createServerClient } from '@/lib/supabase'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const session = await getPorterfulSession()

  if (!session) {
    redirect('/login/login')
  }

  const supabase = createServerClient()!
  if (!session.profileId) {
    redirect('/login/login')
  }

  // Fetch full profile using profileId from session
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.profileId)
    .limit(1)
    .single()

  if (!profile) {
    redirect('/login/login')
  }

  return <DashboardClient serverProfileId={session.profileId} lkId={session.lkId} />
}
