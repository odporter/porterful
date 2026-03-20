'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, X, RefreshCw } from 'lucide-react'

// Demo tracks for now
const DEMO_TRACKS = [
  { id: '1', title: 'Midnight Drive', artist: 'O D', duration: 234, cover: '🎵' },
  { id: '2', title: 'Ambiguous', artist: 'O D', duration: 198, cover: '🎵' },
  { id: '3', title: 'City Lights', artist: 'O D', duration: 267, cover: '🎵' },
  { id: '4', title: 'Dreams', artist: 'O D', duration: 212, cover: '🎵' },
]

export function Player() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(DEMO_TRACKS[0])
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [queueOpen, setQueueOpen] = useState(false)
  const [queue, setQueue] = useState(DEMO_TRACKS.slice(1))
  const audioRef = useRef<HTMLAudioElement>(null)

  // Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= currentTrack.duration) {
            playNext()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTrack])

  const togglePlay = () => setIsPlaying(!isPlaying)
  
  const playNext = () => {
    if (queue.length > 0) {
      const next = queue[0]
      setQueue(queue.slice(1))
      setCurrentTrack(next)
      setQueue(prev => [...prev, DEMO_TRACKS[0]])
      setProgress(0)
    }
  }
  
  const playPrev = () => {
    if (progress > 3) {
      setProgress(0)
    } else {
      setCurrentTrack(DEMO_TRACKS[0])
      setProgress(0)
    }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setProgress(Math.floor(percent * currentTrack.duration))
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (!currentTrack) return null

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[var(--pf-bg-secondary)] border-t border-[var(--pf-border)] transition-transform duration-300 ${queueOpen ? 'translate-y-0' : 'translate-y-0'}`}>
        {/* Main Player Bar */}
        <div className="pf-container h-20 flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-14 h-14 rounded-lg bg-[var(--pf-surface)] flex items-center justify-center text-2xl shrink-0">
              {currentTrack.cover}
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold truncate">{currentTrack.title}</h4>
              <p className="text-sm text-[var(--pf-text-muted)] truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-4">
              <button onClick={playPrev} className="text-[var(--pf-text-muted)] hover:text-white transition-colors">
                <SkipBack size={20} />
              </button>
              <button 
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-[var(--pf-orange)] flex items-center justify-center hover:bg-[var(--pf-orange-light)] transition-colors"
              >
                {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" className="ml-1" />}
              </button>
              <button onClick={playNext} className="text-[var(--pf-text-muted)] hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
            </div>
            <div className="w-full flex items-center gap-2 text-xs text-[var(--pf-text-muted)]">
              <span>{formatTime(progress)}</span>
              <div 
                className="flex-1 h-1 bg-[var(--pf-border)] rounded-full cursor-pointer group"
                onClick={seek}
              >
                <div 
                  className="h-full bg-[var(--pf-orange)] rounded-full relative group-hover:bg-[var(--pf-orange-light)]"
                  style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Volume & Queue */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <button 
              onClick={() => setQueueOpen(!queueOpen)}
              className={`p-2 rounded-lg transition-colors ${queueOpen ? 'text-[var(--pf-orange)] bg-[var(--pf-orange)]/10' : 'text-[var(--pf-text-muted)] hover:text-white'}`}
            >
              <ListMusic size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="text-[var(--pf-text-muted)] hover:text-white">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="w-20 h-1 bg-[var(--pf-border)] rounded-full">
                <div 
                  className="h-full bg-[var(--pf-orange)] rounded-full"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar at very bottom */}
        <div className="h-1 bg-[var(--pf-bg)]">
          <div 
            className="h-full bg-gradient-to-r from-[var(--pf-orange)] to-[var(--pf-orange-light)]"
            style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
          />
        </div>
      </div>

      {/* Queue Panel */}
      {queueOpen && (
        <div className="fixed bottom-20 right-4 w-80 max-h-96 bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-[var(--pf-border)]">
            <h3 className="font-semibold">Queue</h3>
            <button onClick={() => setQueueOpen(false)} className="text-[var(--pf-text-muted)] hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="overflow-y-auto max-h-72">
            {queue.map((track, i) => (
              <div 
                key={track.id}
                className="flex items-center gap-3 p-3 hover:bg-[var(--pf-bg)] transition-colors cursor-pointer"
                onClick={() => {
                  const newQueue = [...queue]
                  const [selected] = newQueue.splice(i, 1)
                  setCurrentTrack(selected)
                  setQueue([...newQueue, currentTrack])
                  setProgress(0)
                  setIsPlaying(true)
                  setQueueOpen(false)
                }}
              >
                <div className="w-10 h-10 rounded bg-[var(--pf-bg)] flex items-center justify-center text-lg">
                  {track.cover}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-xs text-[var(--pf-text-muted)]">{track.artist}</p>
                </div>
                <span className="text-xs text-[var(--pf-text-muted)]">{formatTime(track.duration)}</span>
              </div>
            ))}
            {queue.length === 0 && (
              <div className="p-4 text-center text-[var(--pf-text-muted)]">
                <RefreshCw size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Queue is empty</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}