import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client for artist pages
function getServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function getServerTracksByArtist(artistId: string) {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('artist_id', artistId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getServerTracksByArtist] Error:', error)
    return []
  }
  
  return data || []
}

export async function getServerTracksByArtistName(artistName: string) {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('artist', artistName)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getServerTracksByArtistName] Error:', error)
    return []
  }
  
  return data || []
}
