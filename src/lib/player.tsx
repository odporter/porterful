'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  cover: string
  audioUrl?: string
}

interface PlayerContextType {
  isPlaying: boolean
  currentTrack: Track | null
  progress: number
  volume: number
  queue: Track[]
  play: (track?: Track) => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (seconds: number) => void
  setVolume: (v: number) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer must be used within PlayerProvider')
  return context
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [queue, setQueue] = useState<Track[]>([])

  const play = useCallback((track?: Track) => {
    if (track) setCurrentTrack(track)
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => setIsPlaying(false), [])
  const toggle = useCallback(() => setIsPlaying(p => !p), [])
  
  const next = useCallback(() => {
    if (queue.length > 0) {
      const [nextTrack, ...rest] = queue
      setCurrentTrack(nextTrack)
      setQueue([...rest, currentTrack!])
      setProgress(0)
    }
  }, [queue, currentTrack])

  const prev = useCallback(() => {
    if (progress > 3) {
      setProgress(0)
    } else {
      setCurrentTrack(null)
      setProgress(0)
      setIsPlaying(false)
    }
  }, [progress])

  const seek = useCallback((seconds: number) => setProgress(seconds), [])
  const addToQueue = useCallback((track: Track) => setQueue(q => [...q, track]), [])
  const removeFromQueue = useCallback((index: number) => {
    setQueue(q => q.filter((_, i) => i !== index))
  }, [])

  return (
    <PlayerContext.Provider value={{
      isPlaying,
      currentTrack,
      progress,
      volume,
      queue,
      play,
      pause,
      toggle,
      next,
      prev,
      seek,
      setVolume,
      addToQueue,
      removeFromQueue
    }}>
      {children}
    </PlayerContext.Provider>
  )
}