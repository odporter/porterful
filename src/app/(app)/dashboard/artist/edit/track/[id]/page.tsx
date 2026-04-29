import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditTrackRedirectPage({ params }: PageProps) {
  const { id } = await params
  redirect(`/dashboard/artist/tracks/${id}/edit`)
}
