import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

// Force dynamic rendering — session-based content must not be cached
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getServerSession() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // Read-only in server component
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  return { user }
}

export default async function DashboardPage() {
  // Server-side auth — validates session using cookies from the incoming request
  // This runs on the server BEFORE any client code, so the page cannot render
  // signed-out state for an authenticated user
  const { user } = await getServerSession()

  if (!user) {
    redirect('/login')
  }

  // Pass server-resolved user ID to the client component
  return <DashboardClient serverUserId={user.id} />
}