'use client';

import { useState, useEffect } from 'react';
import { useAudio } from '@/lib/audio-context';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Sliders, X, Clock, Crown, ShoppingBag, CreditCard } from 'lucide-react';
import Link from 'next/link';

export function GlobalPlayer() {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrev, volume, setVolume, progress, duration, isPreview, previewTimeRemaining, isSupporter, seek, isCountingDown, countdownSeconds, nextTrack, skipCountdown } = useAudio();
  const [showEQ, setShowEQ] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [eqSettings, setEqSettings] = useState({
    bass: 50,
    mid: 50,
    treble: 50,
  });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show upgrade modal when preview ends
  useEffect(() => {
    if (isPreview && !isSupporter && previewTimeRemaining <= 0 && currentTrack) {
      setShowUpgrade(true);
    }
  }, [isPreview, isSupporter, previewTimeRemaining, currentTrack]);

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

  // Check if preview is running low
  const previewEnding = isPreview && !isSupporter && previewTimeRemaining <= 30 && previewTimeRemaining > 0;
  const previewEnded = isPreview && !isSupporter && previewTimeRemaining <= 0;

  // Show countdown message
  const showCountdownMessage = isCountingDown && !isSupporter;

  return (
    <>
      {/* Countdown Between Tracks - Radio Style */}
      {showCountdownMessage && nextTrack && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center animate-pulse">
              <Crown className="text-[var(--pf-orange)]" size={40} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Up Next</h2>
            <p className="text-lg text-[var(--pf-text-secondary)] mb-2">{nextTrack.title}</p>
            <p className="text-sm text-[var(--pf-text-muted)] mb-6">by {nextTrack.artist}</p>
            
            <div className="text-6xl font-bold text-[var(--pf-orange)] mb-6">
              {countdownSeconds}
            </div>
            
            <p className="text-sm text-[var(--pf-text-muted)] mb-6">
              Playing in {countdownSeconds} second{countdownSeconds !== 1 ? 's' : ''}...
            </p>

            <div className="space-y-3">
              <button
                onClick={skipCountdown}
                className="w-full py-3 rounded-xl bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors font-medium"
              >
                Play Now
              </button>
              <p className="text-xs text-[var(--pf-text-muted)]">
                Get <strong className="text-white">Full Access for $5.99</strong> — every song, no waiting
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--pf-bg)] border-t border-[var(--pf-border)] z-50 safe-area-bottom">
        {/* Mobile Progress Bar */}
        {isMobile && (
          <div 
            className="h-1 bg-[var(--pf-surface)] cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = (x / rect.width) * 100;
              seek(percentage);
            }}
          >
            <div className="h-full bg-[var(--pf-orange)] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 p-2 sm:p-3 sm:px-4">
          {/* Track Info */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 flex items-center justify-center">
              {currentTrack.cover_url ? (
                <img src={currentTrack.cover_url} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg sm:text-xl">🎵</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate text-sm sm:text-base">{currentTrack.title}</p>
              <p className="text-xs sm:text-sm text-[var(--pf-text-muted)] truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Mobile Preview Badge */}
          {isMobile && isPreview && !isSupporter && (
            <div className="flex items-center gap-1 text-xs text-yellow-400 shrink-0">
              <Clock size={12} />
              <span>{Math.floor(previewTimeRemaining / 60)}:{Math.floor(previewTimeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={playPrev} 
              className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--pf-surface)] transition-colors touch-manipulation" 
              aria-label="Previous"
            >
              <SkipBack size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button 
              onClick={togglePlay} 
              className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-[var(--pf-orange)] flex items-center justify-center hover:bg-[var(--pf-orange)]/80 transition-colors touch-manipulation" 
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white ml-0.5" />}
            </button>
            <button 
              onClick={playNext} 
              className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--pf-surface)] transition-colors touch-manipulation" 
              aria-label="Next"
            >
              <SkipForward size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>

          {/* Desktop Progress */}
          {!isMobile && (
            <div className="flex-1 flex flex-col gap-1 max-w-md">
              <div 
                className="h-1 bg-[var(--pf-surface)] rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = (x / rect.width) * 100;
                  seek(percentage);
                }}
              >
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
                  <button 
                    onClick={() => setShowUpgrade(true)}
                    className="flex items-center gap-1 text-[var(--pf-orange)] hover:underline"
                  >
                    <Crown size={12} />
                    Keep Playing
                  </button>
                </div>
              )}
            </div>
          )}

          {/* EQ Button */}
          {!isMobile && (
            <button 
              onClick={() => setShowEQ(!showEQ)} 
              className={`p-2 rounded-full transition-colors ${showEQ ? 'bg-[var(--pf-orange)] text-white' : 'hover:bg-[var(--pf-surface)]'}`} 
              aria-label="Equalizer"
            >
              <Sliders size={18} />
            </button>
          )}

          {/* Volume */}
          <div className="flex items-center">
            <button 
              onClick={() => setVolume(volume === 0 ? 80 : 0)} 
              className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--pf-surface)] transition-colors touch-manipulation" 
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? <VolumeX size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Volume2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
            {!isMobile && (
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e) => setVolume(parseInt(e.target.value))} 
                className="w-20 h-1 bg-[var(--pf-surface)] rounded-full appearance-none cursor-pointer" 
                aria-label="Volume" 
              />
            )}
          </div>
        </div>

        {/* Mobile Upgrade Link */}
        {isMobile && isPreview && !isSupporter && (
          <button 
            onClick={() => setShowUpgrade(true)}
            className="block w-full text-center py-2 text-xs text-[var(--pf-orange)] bg-[var(--pf-surface)] border-t border-[var(--pf-border)]"
          >
            <Crown size={12} className="inline mr-1" />
            Keep Playing — Support the Artist
          </button>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-[var(--pf-surface)] rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center">
                <Crown className="text-[var(--pf-orange)]" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Keep Listening</h2>
              <p className="text-[var(--pf-text-secondary)]">
                Your 1-minute preview ended. Choose how to continue:
              </p>
            </div>

            <div className="space-y-3">
              {/* $1 Song */}
              <button 
                onClick={() => {
                  // In production: Stripe checkout for $1
                  alert('In production: Stripe checkout for $1');
                }}
                className="w-full p-4 rounded-xl border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors text-left flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <CreditCard size={20} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">This Song</div>
                  <div className="text-sm text-[var(--pf-text-muted)]">Keep this track playing</div>
                </div>
                <div className="text-xl font-bold">$1</div>
              </button>

              {/* $5.99 Full Access */}
              <button 
                onClick={() => {
                  // In production: Stripe checkout for $5.99
                  window.location.href = '/support?tier=full';
                }}
                className="w-full p-4 rounded-xl border-2 border-[var(--pf-orange)] bg-[var(--pf-orange)]/10 hover:bg-[var(--pf-orange)]/20 transition-colors text-left flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--pf-orange)]/20 flex items-center justify-center shrink-0">
                  <Crown size={20} className="text-[var(--pf-orange)]" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold flex items-center gap-2">
                    Full Access
                    <span className="text-xs bg-[var(--pf-orange)] text-white px-2 py-0.5 rounded">BEST VALUE</span>
                  </div>
                  <div className="text-sm text-[var(--pf-text-muted)]">Every song, every album, forever</div>
                </div>
                <div className="text-xl font-bold">$5.99</div>
              </button>

              {/* Marketplace */}
              <Link
                href="/marketplace"
                className="w-full p-4 rounded-xl border border-[var(--pf-border)] hover:border-purple-500 transition-colors text-left flex items-center gap-4 block"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <ShoppingBag size={20} className="text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Shop Marketplace</div>
                  <div className="text-sm text-[var(--pf-text-muted)]">Spend $10+ = full access included</div>
                </div>
              </Link>
            </div>

            <button 
              onClick={() => setShowUpgrade(false)}
              className="w-full mt-4 py-3 text-[var(--pf-text-muted)] hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* EQ Panel - Desktop only */}
      {showEQ && !isMobile && (
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
            </div>

            {/* Presets */}
            <div className="pt-4 border-t border-[var(--pf-border)]">
              <p className="text-sm text-[var(--pf-text-muted)] mb-2">Presets</p>
              <div className="flex gap-2 flex-wrap">
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