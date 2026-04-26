'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAudio } from '@/lib/audio-context'
import { X, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react'

type VisualizerType = 'waves' | 'bars' | 'circular'

// Read a Porterful token's hex value from the document.
// Canvas APIs need explicit color strings; this lets the visualizer follow tokens.
function readToken(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '').trim()
  if (h.length !== 6) return hex
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface VisualizerProps {
  type: VisualizerType
  analyser: AnalyserNode | null
  isPlaying: boolean
}

// Waveform visualizer
function WaveVisualizer({ analyser, isPlaying }: { analyser: AnalyserNode | null; isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!analyser || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const bg = readToken('--pf-bg', '#111111')
    const orange = readToken('--pf-orange', '#f97316')
    const fadeFill = withAlpha(bg, 0.1)

    const draw = () => {
      if (!isPlaying) {
        ctx.fillStyle = fadeFill
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        return
      }

      animationRef.current = requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArray)

      ctx.fillStyle = fadeFill
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.lineWidth = 2
      ctx.strokeStyle = orange
      ctx.beginPath()

      const sliceWidth = canvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [analyser, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

// Bar visualizer
function BarVisualizer({ analyser, isPlaying }: { analyser: AnalyserNode | null; isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!analyser || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const bg = readToken('--pf-bg', '#111111')
    const orange = readToken('--pf-orange', '#f97316')
    const bgFill = withAlpha(bg, 0.95)
    const orangeIdle = withAlpha(orange, 0.3)

    const draw = () => {
      if (!isPlaying) {
        ctx.fillStyle = bgFill
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw static bars when paused
        const barCount = 64
        const barWidth = canvas.width / barCount
        for (let i = 0; i < barCount; i++) {
          const barHeight = canvas.height * 0.1
          const x = i * barWidth
          ctx.fillStyle = orangeIdle
          ctx.fillRect(x + 1, canvas.height - barHeight, barWidth - 2, barHeight)
        }
        return
      }

      animationRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = bgFill
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barCount = 64
      const barWidth = canvas.width / barCount

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * (bufferLength / barCount))
        const intensity = dataArray[dataIndex] / 255
        const barHeight = intensity * canvas.height * 0.8

        const x = i * barWidth
        ctx.fillStyle = withAlpha(orange, Math.max(0.4, intensity))
        ctx.fillRect(x + 1, canvas.height - barHeight, barWidth - 2, barHeight)
      }
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [analyser, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

// Circular visualizer
function CircularVisualizer({ analyser, isPlaying }: { analyser: AnalyserNode | null; isPlaying: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!analyser || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const bg = readToken('--pf-bg', '#111111')
    const orange = readToken('--pf-orange', '#f97316')
    const bgFill = withAlpha(bg, 0.95)
    const orangeIdle = withAlpha(orange, 0.3)
    const orangeCenter = withAlpha(orange, 0.1)

    const draw = () => {
      if (!isPlaying) {
        ctx.fillStyle = bgFill
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw static circle when paused
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, 50, 0, Math.PI * 2)
        ctx.strokeStyle = orangeIdle
        ctx.lineWidth = 3
        ctx.stroke()
        return
      }

      animationRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = bgFill
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) / 3

      // Draw circular bars
      const barCount = 180
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * (bufferLength / barCount))
        const intensity = dataArray[dataIndex] / 255
        const barHeight = intensity * radius * 0.8

        const angle = (i / barCount) * Math.PI * 2
        const x1 = centerX + Math.cos(angle) * radius
        const y1 = centerY + Math.sin(angle) * radius
        const x2 = centerX + Math.cos(angle) * (radius + barHeight)
        const y2 = centerY + Math.sin(angle) * (radius + barHeight)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)

        ctx.strokeStyle = withAlpha(orange, Math.max(0.4, intensity))
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Draw center circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = orangeCenter
      ctx.fill()
      ctx.strokeStyle = orange
      ctx.lineWidth = 2
      ctx.stroke()
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [analyser, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

export function Visualizer() {
  const { currentTrack, isPlaying } = useAudio()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [visualizerType, setVisualizerType] = useState<VisualizerType>('bars')
  const [visualizerIndex, setVisualizerIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  
  const visualizers: VisualizerType[] = ['bars', 'circular', 'waves']

  // Setup audio analyser
  useEffect(() => {
    if (!currentTrack?.audio_url) return

    const setupAudio = async () => {
      try {
        // Create audio context
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }

        const audio = document.querySelector('audio')
        if (!audio) return

        // Create analyser
        if (!analyserRef.current) {
          analyserRef.current = audioContextRef.current.createAnalyser()
          analyserRef.current.fftSize = 256
        }

        // Connect audio element to analyser
        if (!sourceRef.current) {
          sourceRef.current = audioContextRef.current.createMediaElementSource(audio)
          sourceRef.current.connect(analyserRef.current)
          analyserRef.current.connect(audioContextRef.current.destination)
        }
      } catch (err) {
        console.log('Audio analyser setup:', err)
      }
    }

    setupAudio()
  }, [currentTrack?.audio_url])

  // Update Media Session API for iOS lock screen
  useEffect(() => {
    if (!currentTrack) return

    if ('mediaSession' in navigator) {
      const mediaSession = navigator.mediaSession
      
      mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title || 'Unknown Track',
        artist: currentTrack.artist || 'Unknown Artist',
        album: currentTrack.album || 'Unknown Album',
        artwork: currentTrack.image ? [
          { src: currentTrack.image, sizes: '512x512', type: 'image/jpeg' },
          { src: currentTrack.image, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.image, sizes: '128x128', type: 'image/jpeg' },
        ] : [],
      })

      mediaSession.setActionHandler('play', () => {
        // Toggle play - this would need access to audio element
        console.log('Play pressed')
      })

      mediaSession.setActionHandler('pause', () => {
        console.log('Pause pressed')
      })

      mediaSession.setActionHandler('previoustrack', () => {
        console.log('Previous track')
      })

      mediaSession.setActionHandler('nexttrack', () => {
        console.log('Next track')
      })
    }
  }, [currentTrack])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const cycleVisualizer = () => {
    const nextIndex = (visualizerIndex + 1) % visualizers.length
    setVisualizerIndex(nextIndex)
    setVisualizerType(visualizers[nextIndex])
  }

  if (!currentTrack) return null

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 bg-[var(--pf-bg)] z-50 ${isFullscreen ? '' : 'hidden'}`}
    >
      {/* Visualizer Canvas */}
      <div className="absolute inset-0">
        {visualizerType === 'waves' && <WaveVisualizer analyser={analyserRef.current} isPlaying={isPlaying} />}
        {visualizerType === 'bars' && <BarVisualizer analyser={analyserRef.current} isPlaying={isPlaying} />}
        {visualizerType === 'circular' && <CircularVisualizer analyser={analyserRef.current} isPlaying={isPlaying} />}
      </div>

      {/* Track Info Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-[var(--pf-bg)]/80 to-transparent">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-[var(--pf-text)] truncate">{currentTrack.title}</h2>
            <p className="text-lg text-[var(--pf-text-secondary)] truncate">{currentTrack.artist}</p>
            {currentTrack.album && (
              <p className="text-sm text-[var(--pf-text-muted)] truncate">{currentTrack.album}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={cycleVisualizer}
              className="p-3 rounded-full bg-[var(--pf-surface)] hover:bg-[var(--pf-border)] transition-colors"
              aria-label="Change visualizer"
            >
              <ChevronRight size={24} className="text-[var(--pf-text)]" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-full bg-[var(--pf-surface)] hover:bg-[var(--pf-border)] transition-colors"
              aria-label="Exit fullscreen"
            >
              <Minimize2 size={24} className="text-[var(--pf-text)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--pf-bg)]/80 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={cycleVisualizer}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--pf-surface)] hover:bg-[var(--pf-border)] transition-colors"
          >
            <span className="text-[var(--pf-text)] text-sm">Visualizer {visualizerIndex + 1}/3</span>
            <ChevronLeft size={16} className="text-[var(--pf-text)]" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-6 py-3 rounded-full bg-[var(--pf-surface)] border border-[var(--pf-border)] text-[var(--pf-text)] font-semibold hover:border-[var(--pf-text-secondary)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook to use visualizer
export function useVisualizer() {
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false)

  const openVisualizer = () => setIsVisualizerOpen(true)
  const closeVisualizer = () => setIsVisualizerOpen(false)
  const toggleVisualizer = () => setIsVisualizerOpen(prev => !prev)

  return { isVisualizerOpen, openVisualizer, closeVisualizer, toggleVisualizer }
}