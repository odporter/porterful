/**
 * Playback Resume Hook
 * Restores audio playback after returning from Stripe checkout
 */

'use client'

import { useEffect, useCallback } from 'react'
import { useAudio } from '@/lib/audio-context'
import { getCheckoutState, clearCheckoutState, shouldResumePlayback } from '@/lib/checkout-state'

export function usePlaybackResume() {
  const { playTrack, setVolume, currentTrack } = useAudio()

  const resumePlayback = useCallback(() => {
    const state = getCheckoutState()
    if (!state) return false

    // Only resume if we have a track ID and user was playing
    if (state.trackId && shouldResumePlayback()) {
      // Resume the track from saved position
      playTrack({
        id: state.trackId,
        title: state.trackTitle,
        artist: state.artistName,
      }, state.currentTime)
      
      // Restore volume
      if (state.volume >= 0 && state.volume <= 1) {
        setVolume(state.volume)
      }
      
      // Clear the saved state
      clearCheckoutState()
      return true
    }
    
    clearCheckoutState()
    return false
  }, [playTrack, setVolume])

  return { resumePlayback, shouldResume: shouldResumePlayback }
}
