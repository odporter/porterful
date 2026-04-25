// Playback state persistence for checkout redirect flow
// Saves player state before Stripe redirect, restores after return

const STORAGE_KEY = 'porterful_playback_snapshot';
const EXPIRY_MS = 1000 * 60 * 30; // 30 minutes

export interface PlaybackSnapshot {
  currentTrackId: string | null;
  currentTrack: {
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    image?: string;
    album?: string | null;
  } | null;
  queue: Array<{
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    image?: string;
  }>;
  currentTime: number; // seconds
  progress: number; // percentage 0-100
  isPlaying: boolean;
  volume: number; // 0-100
  originatingRoute: string;
  checkoutTimestamp: number;
}

export function savePlaybackSnapshot(snapshot: Omit<PlaybackSnapshot, 'checkoutTimestamp'>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const fullSnapshot: PlaybackSnapshot = {
      ...snapshot,
      checkoutTimestamp: Date.now(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fullSnapshot));
  } catch (e) {
    console.error('[playback-persistence] Failed to save snapshot:', e);
  }
}

export function loadPlaybackSnapshot(): PlaybackSnapshot | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const snapshot: PlaybackSnapshot = JSON.parse(stored);
    
    // Check if expired
    const age = Date.now() - snapshot.checkoutTimestamp;
    if (age > EXPIRY_MS) {
      clearPlaybackSnapshot();
      return null;
    }
    
    return snapshot;
  } catch (e) {
    console.error('[playback-persistence] Failed to load snapshot:', e);
    return null;
  }
}

export function clearPlaybackSnapshot(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('[playback-persistence] Failed to clear snapshot:', e);
  }
}

export function isSnapshotValid(): boolean {
  const snapshot = loadPlaybackSnapshot();
  if (!snapshot) return false;
  
  const age = Date.now() - snapshot.checkoutTimestamp;
  return age <= EXPIRY_MS;
}
