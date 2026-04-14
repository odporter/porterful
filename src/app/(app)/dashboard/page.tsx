import { redirect } from 'next/navigation'

// Canonical dashboard — all /dashboard/* routes redirect here
// Middleware protects /dashboard/* via SSR client (no client-side redirect)
export default function DashboardRoot() {
  redirect('/dashboard/dashboard')
}