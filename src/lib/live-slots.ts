/**
 * Live Slots System — Porterful Artist Upload Limits
 * 
 * Rules:
 * - Max 3 live (active) tracks per artist
 * - Max 1 featured track among live tracks
 * - Max 3 live products per artist
 * - Tracks can be archived (removed from public view) to free up slots
 */

export const LIVE_SLOT_LIMITS = {
  tracks: {
    live: 3,
    featured: 1,
  },
  products: {
    live: 3,
  },
} as const

export interface SlotStatus {
  live_count: number
  max_live: number
  featured_count: number
  max_featured: number
  can_add_live: boolean
  oldest_unfeatured_live_track_id: string | null
}

/**
 * Check how many live/featured slots an artist has used for tracks.
 * Returns slot status and the ID of the oldest non-featured live track
 * (which would be the candidate for auto-archive if limit is hit).
 */
export async function getTrackSlotStatus(
  artistId: string,
  supabase: any
): Promise<SlotStatus> {
  const { data: liveTracks } = await supabase
    .from('tracks')
    .select('id, is_featured, created_at')
    .eq('artist_id', artistId)
    .is('archived_at', null)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const liveCount = liveTracks?.length || 0
  const featuredCount = liveTracks?.filter((t: any) => t.is_featured).length || 0
  const oldestUnfeatured = liveTracks?.find((t: any) => !t.is_featured)

  return {
    live_count: liveCount,
    max_live: LIVE_SLOT_LIMITS.tracks.live,
    featured_count: featuredCount,
    max_featured: LIVE_SLOT_LIMITS.tracks.featured,
    can_add_live: liveCount < LIVE_SLOT_LIMITS.tracks.live,
    oldest_unfeatured_live_track_id: oldestUnfeatured?.id || null,
  }
}

/**
 * Check product slot status for an artist.
 */
export async function getProductSlotStatus(
  artistId: string,
  supabase: any
): Promise<{ live_count: number; max_live: number; can_add_live: boolean }> {
  const { data: liveProducts } = await supabase
    .from('products')
    .select('id')
    .eq('artist_id', artistId)
    .eq('is_active', true)
    .is('archived_at', null)

  const liveCount = liveProducts?.length || 0

  return {
    live_count: liveCount,
    max_live: LIVE_SLOT_LIMITS.products.live,
    can_add_live: liveCount < LIVE_SLOT_LIMITS.products.live,
  }
}
