'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Heart, Plus, ChevronRight } from 'lucide-react'

// Demo stations
const STATIONS = [
  { id: 'porterful', name: 'Porterful Radio', description: 'The home of independent artists', listeners: 2847, cover: '📻' },
  { id: 'od', name: 'O D Music', description: 'Ambiguous project and more', listeners: 1256, cover: '🎤' },
  { id: 'hiphop', name: 'Hip-Hop Central', description: 'Underground hip-hop and beats', listeners: 983, cover: '🎵' },
  { id: 'lofi', name: 'Lo-Fi Dreams', description: 'Chill beats for studying and work', listeners: 2104, cover: '🎧' },
  { id: 'rnb', name: 'R&B Vibes', description: 'Smooth soul and modern R&B', listeners: 756, cover: '🎹' },
  { id: 'indie', name: 'Indie Spotlight', description: 'Discover new independent artists', listeners: 1089, cover: '🎸' },
]

// Demo tracks for station
const DEMO_TRACKS = [
  { id: '1', title: 'Midnight Drive', artist: 'O D', album: 'Ambiguous', duration: '3:54' },
  { id: '2', title: 'Oddysee', artist: 'O D', album: 'Ambiguous', duration: '3:45' },
  { id: '3', title: 'Zarah', artist: 'O D', album: 'Ambiguous', duration: '3:22' },
  { id: '4', title: 'Dopamines', artist: 'O D', album: 'Ambiguous', duration: '3:18' },
  { id: '5', title: 'Make A Move', artist: 'O D', album: 'Ambiguous', duration: '3:12' },
]

export default function RadioPage() {
  const [selectedStation, setSelectedStation] = useState(STATIONS[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(DEMO_TRACKS[0])
  const [likedTracks, setLikedTracks] = useState<string[]>([])

  const toggleLike = (trackId: string) => {
    setLikedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="pf-container">
        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <div className="pf-card p-8 bg-gradient-to-br from-[var(--pf-orange)]/20 to-transparent relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,107,0,0.2)_0%,transparent_60%)]" />
              <div className="relative z-10">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[var(--pf-orange)] to-[var(--pf-orange-dark)] flex items-center justify-center text-6xl shadow-2xl shadow-[var(--pf-orange)]/30">
                    {selectedStation.cover}
                  </div>
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--pf-orange)]/20 text-[var(--pf-orange)] rounded-full text-sm font-medium mb-3">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      LIVE
                    </span>
                    <h1 className="text-3xl font-bold mb-2">{selectedStation.name}</h1>
                    <p className="text-[var(--pf-text-secondary)] mb-2">{selectedStation.description}</p>
                    <p className="text-sm text-[var(--pf-text-muted)]">
                      {selectedStation.listeners.toLocaleString()} listening now
                    </p>
                  </div>
                </div>

                {/* Now Playing */}
                <div className="bg-[var(--pf-bg)]/50 backdrop-blur-sm rounded-xl p-4 mb-4">
                  <p className="text-xs text-[var(--pf-text-muted)] uppercase tracking-wider mb-2">Now Playing</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
                      <p className="text-[var(--pf-text-secondary)]">{currentTrack.artist} • {currentTrack.album}</p>
                    </div>
                    <span className="text-[var(--pf-text-muted)]">{currentTrack.duration}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setCurrentTrack(DEMO_TRACKS[Math.max(0, DEMO_TRACKS.findIndex(t => t.id === currentTrack.id) - 1)])}
                    className="p-3 rounded-full bg-[var(--pf-surface)] hover:bg-[var(--pf-surface-hover)] transition-colors"
                  >
                    <SkipBack size={24} />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-[var(--pf-orange)] flex items-center justify-center hover:bg-[var(--pf-orange-light)] transition-colors shadow-lg shadow-[var(--pf-orange)]/30"
                  >
                    {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
                  </button>
                  <button 
                    onClick={() => setCurrentTrack(DEMO_TRACKS[(DEMO_TRACKS.findIndex(t => t.id === currentTrack.id) + 1) % DEMO_TRACKS.length])}
                    className="p-3 rounded-full bg-[var(--pf-surface)] hover:bg-[var(--pf-surface-hover)] transition-colors"
                  >
                    <SkipForward size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stations List */}
          <div className="pf-card p-6">
            <h2 className="font-semibold mb-4">Stations</h2>
            <div className="space-y-3">
              {STATIONS.map((station) => (
                <button
                  key={station.id}
                  onClick={() => setSelectedStation(station)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    selectedStation.id === station.id
                      ? 'bg-[var(--pf-orange)]/20 border border-[var(--pf-orange)]/30'
                      : 'hover:bg-[var(--pf-surface-hover)]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--pf-surface)] flex items-center justify-center text-xl">
                    {station.cover}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{station.name}</p>
                    <p className="text-xs text-[var(--pf-text-muted)]">{station.listeners.toLocaleString()} listening</p>
                  </div>
                  {selectedStation.id === station.id && (
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Track Queue */}
        <div className="pf-card">
          <div className="flex items-center justify-between p-4 border-b border-[var(--pf-border)]">
            <h2 className="font-semibold">Up Next</h2>
            <button className="text-sm text-[var(--pf-orange)] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[var(--pf-border)]">
            {DEMO_TRACKS.map((track, i) => (
              <div
                key={track.id}
                className={`flex items-center gap-4 p-4 hover:bg-[var(--pf-surface-hover)] transition-colors cursor-pointer ${
                  currentTrack.id === track.id ? 'bg-[var(--pf-orange)]/5' : ''
                }`}
                onClick={() => setCurrentTrack(track)}
              >
                <span className="w-6 text-center text-[var(--pf-text-muted)]">{i + 1}</span>
                <div className="w-12 h-12 rounded bg-[var(--pf-surface)] flex items-center justify-center">
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${currentTrack.id === track.id ? 'text-[var(--pf-orange)]' : ''}`}>
                    {track.title}
                  </p>
                  <p className="text-sm text-[var(--pf-text-muted)] truncate">{track.artist}</p>
                </div>
                <span className="text-sm text-[var(--pf-text-muted)]">{track.duration}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                  className={`p-2 rounded-lg transition-colors ${
                    likedTracks.includes(track.id) 
                      ? 'text-[var(--pf-orange)]' 
                      : 'text-[var(--pf-text-muted)] hover:text-white'
                  }`}
                >
                  <Heart size={18} fill={likedTracks.includes(track.id) ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-2 rounded-lg text-[var(--pf-text-muted)] hover:text-white transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Premium CTA */}
        <div className="mt-8 pf-card p-8 bg-gradient-to-r from-purple-500/20 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Go Premium</h3>
              <p className="text-[var(--pf-text-secondary)]">Ad-free listening, offline mode, exclusive tracks</p>
            </div>
            <button className="pf-btn pf-btn-primary whitespace-nowrap">
              Try Free for 30 Days <ChevronRight className="inline ml-1" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}