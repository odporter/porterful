import { Track } from '@/lib/audio-context'

// Canonical dedupe key: normalized artist + album + title
export function getTrackDedupeKey(track: { artist: string; album?: string | null; title: string }): string {
  const normalize = (s: string) => s.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
  const artist = normalize(track.artist)
  const album = normalize(track.album || '')
  const title = normalize(track.title)
  return `${artist}|${album}|${title}`
}

// Merge DB tracks with static, applying canonical rules:
// 1. DB track wins over static track (same dedupe key)
// 2. Inactive DB track blocks matching static from public display
// 3. Static only shown if no matching DB track exists
export function mergeCanonicalTracks(
  dbTracks: (Track & { is_active?: boolean })[],
  staticTracks: Track[],
  options: { includeInactive?: boolean } = {}
): Track[] {
  const { includeInactive = false } = options
  const merged = new Map<string, Track>()
  const blockedKeys = new Set<string>()

  // First pass: process DB tracks
  dbTracks.forEach((dbTrack) => {
    const key = getTrackDedupeKey(dbTrack)

    // If DB track is inactive, mark key as blocked for public display
    if (!dbTrack.is_active && !includeInactive) {
      blockedKeys.add(key)
      return // Don't add inactive tracks to public view
    }

    // Add DB track (wins over any static)
    merged.set(key, {
      id: dbTrack.id,
      title: dbTrack.title,
      artist: dbTrack.artist,
      album: dbTrack.album,
      duration: dbTrack.duration,
      audio_url: dbTrack.audio_url,
      cover_url: dbTrack.cover_url,
      image: dbTrack.cover_url || dbTrack.image,
      plays: (dbTrack as any).plays || (dbTrack as any).play_count || 0,
      price: (dbTrack as any).price || (dbTrack as any).proud_to_pay_min || 1,
    })
  })

  // Second pass: add static tracks only if not blocked and not already in DB
  staticTracks.forEach((staticTrack) => {
    const key = getTrackDedupeKey(staticTrack)

    // Skip if blocked by inactive DB track or already have DB version
    if (blockedKeys.has(key) || merged.has(key)) {
      return
    }

    merged.set(key, staticTrack)
  })

  return Array.from(merged.values())
}

// Deduplicate queue tracks to prevent repeats
export function dedupeQueueTracks(tracks: Track[]): Track[] {
  const seen = new Set<string>()
  return tracks.filter((track) => {
    const key = getTrackDedupeKey(track)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}
