'use client';

import { useState, useEffect } from 'react';
import { useAudio } from '@/lib/audio-context';
import { useWallet } from '@/lib/wallet-context';
import { Search, Play, Pause, SkipForward, SkipBack, Radio, Music, Plus } from 'lucide-react';
import Link from 'next/link';
import { TRACKS } from '@/lib/data';

const GENRES = ['All', 'Hip-Hop', 'R&B', 'Soul', 'Pop', 'Electronic', 'Jazz', 'Lo-Fi'];

export default function RadioPage() {
  const audioContext = useAudio();
  const { balance, formatBalance } = useWallet();
  const { currentTrack, isPlaying, togglePlay, playNext, playPrev, isPreview, previewTimeRemaining, setQueue, playTrack } = audioContext;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [filteredTracks, setFilteredTracks] = useState(TRACKS);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(16).fill(0));

  // Visualizer animation
  useEffect(() => {
    if (!isPlaying) {
      setVisualizerBars(Array(16).fill(0));
      return;
    }
    
    const interval = setInterval(() => {
      const newBars = Array(16).fill(0).map(() => Math.random() * 100);
      setVisualizerBars(newBars);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Filter tracks
  useEffect(() => {
    let filtered = TRACKS;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = TRACKS.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.artist.toLowerCase().includes(query) ||
        (t.album && t.album.toLowerCase().includes(query))
      );
    }
    
    setFilteredTracks(filtered);
  }, [searchQuery]);

  const handlePlayTrack = (track: typeof TRACKS[0]) => {
    // Convert string duration to seconds if needed
    const trackWithDuration = {
      ...track,
      duration: typeof track.duration === 'string' 
        ? track.duration.split(':').reduce((acc: number, time: string) => (60 * acc) + parseInt(time, 10), 0)
        : track.duration || 180,
    };
    setQueue(TRACKS.map(t => ({
      ...t,
      duration: typeof t.duration === 'string'
        ? t.duration.split(':').reduce((acc: number, time: string) => (60 * acc) + parseInt(time, 10), 0)
        : t.duration || 180
    })));
    playTrack(trackWithDuration as any);
  };

  return (
    <div className="min-h-screen bg-[var(--pf-bg)] text-[var(--pf-text)]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[var(--pf-orange)]/20 to-transparent pt-32 pb-16">
        <div className="pf-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Radio className="text-[var(--pf-orange)]" />
                Radio
              </h1>
              <p className="text-[var(--pf-text-secondary)] mt-1">
                Discover new music. Previews are free.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)]" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists, albums..."
              className="w-full bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--pf-orange)]"
            />
          </div>

          {/* Genre Filters */}
          <div className="flex gap-2 overflow-x-auto py-4">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedGenre === genre
                    ? 'bg-[var(--pf-orange)] text-white'
                    : 'bg-[var(--pf-surface)] hover:bg-[var(--pf-orange)]/20'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <div className="sticky top-16 md:top-20 bg-[var(--pf-surface)] border-b border-[var(--pf-border)] z-30">
          <div className="pf-container py-4">
            <div className="flex items-center gap-4">
              {/* Visualizer */}
              <div className="hidden md:flex items-end gap-0.5 h-8">
                {visualizerBars.map((bar, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[var(--pf-orange)] rounded-full transition-all"
                    style={{ height: `${bar}%` }}
                  />
                ))}
              </div>

              {/* Track Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  {currentTrack.image ? (
                    <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 flex items-center justify-center">
                      <Music size={20} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{currentTrack.title}</p>
                  <Link href="/artist/od-porter" className="text-sm text-[var(--pf-text-muted)] hover:text-[var(--pf-orange)] truncate block">
                    {currentTrack.artist}
                  </Link>
                </div>
              </div>

              {/* Preview Badge */}
              {isPreview && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--pf-orange)]/10 text-[var(--pf-orange)] text-sm">
                  <span>Preview</span>
                  <span className="text-[var(--pf-text-muted)]">•</span>
                  <span>{Math.floor(previewTimeRemaining / 60)}:{Math.floor(previewTimeRemaining % 60).toString().padStart(2, '0')}</span>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button onClick={playPrev} className="p-2 hover:bg-[var(--pf-bg)] rounded-full">
                  <SkipBack size={20} />
                </button>
                <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-[var(--pf-orange)] flex items-center justify-center">
                  {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
                </button>
                <button onClick={playNext} className="p-2 hover:bg-[var(--pf-bg)] rounded-full">
                  <SkipForward size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="pf-container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{searchQuery ? `Results for "${searchQuery}"` : 'All Tracks'}</h2>
          <span className="text-sm text-[var(--pf-text-muted)]">{filteredTracks.length} songs</span>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="text-center py-12">
            <Music className="mx-auto mb-4 text-[var(--pf-text-muted)]" size={48} />
            <p className="text-[var(--pf-text-muted)]">No tracks found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => handlePlayTrack(track)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--pf-surface)] transition-colors text-left ${
                  currentTrack?.id === track.id ? 'bg-[var(--pf-surface)]' : ''
                }`}
              >
                <span className="w-6 text-center text-sm text-[var(--pf-text-muted)]">{index + 1}</span>
                <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                  {track.image ? (
                    <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 flex items-center justify-center">
                      <Music size={16} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <Link href="/artist/od-porter" className="text-sm text-[var(--pf-text-muted)] hover:text-[var(--pf-orange)] truncate block">
                    {track.artist}
                  </Link>
                </div>
                <span className="text-sm text-[var(--pf-text-muted)]">{track.duration}</span>
                {currentTrack?.id === track.id && isPlaying && (
                  <div className="flex items-end gap-0.5 h-4">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1 bg-[var(--pf-orange)] rounded-full animate-pulse" style={{ height: '100%', animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Add Funds CTA - Subtle */}
        <div className="mt-12 p-6 rounded-xl bg-[var(--pf-surface)] border border-[var(--pf-border)]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[var(--pf-text-secondary)] mb-1">
                Want full tracks? Add funds to your wallet.
              </p>
              <p className="text-sm text-[var(--pf-text-muted)]">
                Your balance: <span className="font-medium text-[var(--pf-orange)]">{formatBalance()}</span>
              </p>
            </div>
            <Link href="/wallet" className="pf-btn bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-[var(--pf-orange)] flex items-center gap-2">
              <Plus size={18} />
              Add Funds
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}