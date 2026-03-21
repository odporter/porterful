'use client';

import { useState } from 'react';
import { useAudio } from '@/lib/audio-context';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Sliders, X, Clock, Crown } from 'lucide-react';
import Link from 'next/link';

export function GlobalPlayer() {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrev, volume, setVolume, progress, duration, isPreview, previewTimeRemaining, isSupporter } = useAudio();
  const [showEQ, setShowEQ] = useState(false);
  const [eqSettings, setEqSettings] = useState({
    bass: 50,
    mid: 50,
    treble: 50,
  });

  if (!currentTrack) return null;

  const formatDuration = (seconds?: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrentTime = () => {
    if (!duration || isNaN(duration)) return '0:00';
    const currentSeconds = (progress / 100) * duration;
    const mins = Math.floor(currentSeconds / 60);
    const secs = Math.floor(currentSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--pf-bg)] border-t border-[var(--pf-border)] py-3 px-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 flex items-center justify-center">
              {currentTrack.cover_url ? (
                <img src={currentTrack.cover_url} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🎵</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{currentTrack.title}</p>
              <p className="text-sm text-[var(--pf-text-muted)] truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button onClick={playPrev} className="p-2 rounded-full hover:bg-[var(--pf-surface)] transition-colors" aria-label="Previous">
              <SkipBack size={18} />
            </button>
            <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-[var(--pf-orange)] flex items-center justify-center hover:bg-[var(--pf-orange)]/80 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5" />}
            </button>
            <button onClick={playNext} className="p-2 rounded-full hover:bg-[var(--pf-surface)] transition-colors" aria-label="Next">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Progress */}
          <div className="flex-1 hidden md:flex flex-col gap-1">
            <div className="h-1 bg-[var(--pf-surface)] rounded-full overflow-hidden cursor-pointer">
              <div className="h-full bg-[var(--pf-orange)] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-[var(--pf-text-muted)]">
              <span>{formatCurrentTime()}</span>
              <span>{formatDuration(duration)}</span>
            </div>
            {/* Preview Mode Indicator */}
            {isPreview && !isSupporter && (
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Clock size={12} />
                  Preview: {Math.floor(previewTimeRemaining / 60)}:{Math.floor(previewTimeRemaining % 60).toString().padStart(2, '0')}
                </span>
                <Link href="/support" className="flex items-center gap-1 text-[var(--pf-orange)] hover:underline">
                  <Crown size={12} />
                  Unlock Full Track
                </Link>
              </div>
            )}
          </div>

          {/* EQ Button */}
          <button onClick={() => setShowEQ(!showEQ)} className={`p-2 rounded-full transition-colors ${showEQ ? 'bg-[var(--pf-orange)] text-white' : 'hover:bg-[var(--pf-surface)]'}`} aria-label="Equalizer">
            <Sliders size={18} />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={() => setVolume(volume === 0 ? 80 : 0)} className="p-2 rounded-full hover:bg-[var(--pf-surface)] transition-colors" aria-label={volume === 0 ? 'Unmute' : 'Mute'}>
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="w-20 h-1 bg-[var(--pf-surface)] rounded-full appearance-none cursor-pointer" aria-label="Volume" />
          </div>
        </div>
      </div>

      {/* EQ Panel */}
      {showEQ && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl p-6 z-50 w-80 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Equalizer</h3>
            <button onClick={() => setShowEQ(false)} className="p-1 rounded hover:bg-[var(--pf-bg)]">
              <X size={18} />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Bass */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Bass</span>
                <span className="text-[var(--pf-orange)]">{eqSettings.bass}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={eqSettings.bass}
                onChange={(e) => setEqSettings({ ...eqSettings, bass: parseInt(e.target.value) })}
                className="w-full h-2 bg-[var(--pf-bg)] rounded-full appearance-none cursor-pointer"
                style={{ accentColor: 'var(--pf-orange)' }}
              />
              <div className="flex justify-between text-xs text-[var(--pf-text-muted)]">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Mid */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Mid</span>
                <span className="text-[var(--pf-orange)]">{eqSettings.mid}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={eqSettings.mid}
                onChange={(e) => setEqSettings({ ...eqSettings, mid: parseInt(e.target.value) })}
                className="w-full h-2 bg-[var(--pf-bg)] rounded-full appearance-none cursor-pointer"
                style={{ accentColor: 'var(--pf-orange)' }}
              />
              <div className="flex justify-between text-xs text-[var(--pf-text-muted)]">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Treble */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Treble</span>
                <span className="text-[var(--pf-orange)]">{eqSettings.treble}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={eqSettings.treble}
                onChange={(e) => setEqSettings({ ...eqSettings, treble: parseInt(e.target.value) })}
                className="w-full h-2 bg-[var(--pf-bg)] rounded-full appearance-none cursor-pointer"
                style={{ accentColor: 'var(--pf-orange)' }}
              />
              <div className="flex justify-between text-xs text-[var(--pf-text-muted)]">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Presets */}
            <div className="pt-4 border-t border-[var(--pf-border)]">
              <p className="text-sm text-[var(--pf-text-muted)] mb-2">Presets</p>
              <div className="flex gap-2">
                <button onClick={() => setEqSettings({ bass: 70, mid: 50, treble: 30 })} className="px-3 py-1.5 text-sm rounded-lg bg-[var(--pf-bg)] hover:bg-[var(--pf-orange)]/20 transition-colors">Bass Boost</button>
                <button onClick={() => setEqSettings({ bass: 30, mid: 50, treble: 70 })} className="px-3 py-1.5 text-sm rounded-lg bg-[var(--pf-bg)] hover:bg-[var(--pf-orange)]/20 transition-colors">Vocals</button>
                <button onClick={() => setEqSettings({ bass: 50, mid: 50, treble: 50 })} className="px-3 py-1.5 text-sm rounded-lg bg-[var(--pf-bg)] hover:bg-[var(--pf-orange)]/20 transition-colors">Flat</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}