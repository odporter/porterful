'use client';

import { useAudio } from '@/lib/audio-context';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

export function GlobalPlayer() {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrev, volume, setVolume, progress, duration } = useAudio();

  if (!currentTrack) return null;

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format current time
  const formatCurrentTime = () => {
    if (!duration || isNaN(duration)) return '0:00';
    const currentSeconds = (progress / 100) * duration;
    const mins = Math.floor(currentSeconds / 60);
    const secs = Math.floor(currentSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
          <button
            onClick={playPrev}
            className="p-2 rounded-full hover:bg-[var(--pf-surface)] transition-colors"
            aria-label="Previous"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[var(--pf-orange)] flex items-center justify-center hover:bg-[var(--pf-orange)]/80 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5" />}
          </button>
          <button
            onClick={playNext}
            className="p-2 rounded-full hover:bg-[var(--pf-surface)] transition-colors"
            aria-label="Next"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex-1 hidden md:flex flex-col gap-1">
          <div className="h-1 bg-[var(--pf-surface)] rounded-full overflow-hidden cursor-pointer">
            <div 
              className="h-full bg-[var(--pf-orange)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--pf-text-muted)]">
            <span>{formatCurrentTime()}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVolume(volume === 0 ? 80 : 0)}
            className="p-2 rounded-full hover:bg-[var(--pf-surface)] transition-colors"
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
          >
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-20 h-1 bg-[var(--pf-surface)] rounded-full appearance-none cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}