import { redirect } from 'next/navigation'

export default function ArtistEditAliasPage() {
  redirect('/dashboard/dashboard/artist/edit')
}

// Note: The actual edit page is at /dashboard/dashboard/artist/edit/page.tsx
// This redirect preserves legacy links while the canonical route is cleaned up
