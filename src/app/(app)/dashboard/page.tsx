import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentSupabaseClient } from '@/lib/supabase-auth'
import { createServerClient } from '@/lib/supabase'
import PorterfulDashboard from './PorterfulDashboard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardRoot() {
  const cookieStore = await cookies()
  const supabase = createServerComponentSupabaseClient(cookieStore)

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const inferredRole = user.user_metadata?.role === 'artist' ? 'artist' : 'supporter'

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .limit(1)
    .maybeSingle()

  let profile = existingProfile

  if (!profile) {
    // Profile missing — auto-create to prevent /login ↔ /dashboard redirect loop.
    // This handles race conditions from the Likeness bridge and first-time OAuth users.
    const adminSb = createServerClient()
    const { data: createdProfile } = await adminSb
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email: user.email?.toLowerCase() ?? '',
          name: user.email?.split('@')[0] ?? '',
          role: inferredRole,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single()

    if (!createdProfile) {
      // Creation failed — send to signup, not /login (avoids the redirect loop)
      redirect('/signup?setup=1')
    }

    profile = createdProfile
  } else if (inferredRole === 'artist' && profile.role !== 'artist') {
    const adminSb = createServerClient()
    const { data: normalizedProfile } = await adminSb
      .from('profiles')
      .update({ role: 'artist' })
      .eq('id', user.id)
      .select('*')
      .single()

    if (normalizedProfile) {
      profile = normalizedProfile
    }
  }

  // Role-aware redirect: artists to their specific dashboard
  if (profile?.role === 'artist') {
    redirect('/dashboard/artist')
  }

  return (
    <PorterfulDashboard
      serverProfileId={user.id}
      initialProfile={profile}
    />
  )
}
