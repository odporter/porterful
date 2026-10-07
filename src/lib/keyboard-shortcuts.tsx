'use client'

import { useEffect } from 'react'
import { useAudio } from '@/lib/audio-context'

export function KeyboardShortcuts() {
  const { togglePlay, playNext, playPrev, setVolume, volume, currentTrack } = useAudio()

  useEffect(() => {
    if (!currentTrack) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          playPrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          playNext()
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(Math.min(100, volume + 10))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(Math.max(0, volume - 10))
          break
        case 'KeyM':
          e.preventDefault()
          setVolume(volume > 0 ? 0 : 80)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, playNext, playPrev, setVolume, volume, currentTrack])

  return null
}
