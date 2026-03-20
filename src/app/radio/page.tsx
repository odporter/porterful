'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from 'lucide-react';
import { TRACKS, ARTISTS } from '@/lib/data';

export default function RadioPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [volume, setVolume] = useState(80);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const artist = ARTISTS[0];

  const togglePlay = (trackId: string) => {
    setPlaying(playing === trackId ? null : trackId);
  };

  const toggleLike = (trackId: string) => {
    setLiked(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="pf-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Radio</h1>
            <p className="text-[var(--pf-text-secondary)]">
              Stream music from independent artists
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`p-2 rounded-lg transition-colors ${
                shuffle ? 'bg-[var(--pf-orange)] text-white' : 'text-[var(--pf-text-muted)] hover:text-white'
              }`}
            >
              <Shuffle size={20} />
            </button>
            <button
              onClick={() => setRepeat(!repeat)}
              className={`p-2 rounded-lg transition-colors ${
                repeat ? 'bg-[var(--pf-orange)] text-white' : 'text-[var(--pf-text-muted)] hover:text-white'
              }`}
            >
              <Repeat size={20} />
            </button>
          </div>
        </div>

        {/* Now Playing */}
        {playing && (
          <div className="pf-card p-6 mb-8 bg-gradient-to-r from-[var(--pf-orange)]/10 to-purple-500/10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img 
                  src={TRACKS.find(t => t.id === playing)?.image}
                  alt="Now playing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--pf-text-muted)] mb-1">NOW PLAYING</p>
                <p className="text-xl font-bold truncate">
                  {TRACKS.find(t => t.id === playing)?.title}
                </p>
                <p className="text-[var(--pf-text-secondary)]">
                  {TRACKS.find(t => t.id === playing)?.artist}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-[var(--pf-surface)]">
                  <SkipBack size={24} />
                </button>
                <button 
                  onClick={() => setPlaying(null)}
                  className="w-14 h-14 rounded-full bg-[var(--pf-orange)] flex items-center justify-center"
                >
                  <Pause size={24} className="text-white" />
                </button>
                <button className="p-2 rounded-full hover:bg-[var(--pf-surface)]">
                  <SkipForward size={24} />
                </button>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-4 mt-4">
              <Volume2 size={18} className="text-[var(--pf-text-muted)]" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="flex-1 h-1 bg-[var(--pf-surface)] rounded-full appearance-none"
              />
              <span className="text-sm text-[var(--pf-text-muted)]">{volume}%</span>
            </div>
          </div>
        )}

        {/* Featured Station */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Featured Station</h2>
          <div className="pf-card p-8 bg-gradient-to-r from-[var(--pf-orange)]/20 to-purple-600/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300"
                  alt="Ambiguous Radio"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Ambiguous Radio</h3>
                <p className="text-[var(--pf-text-secondary)] mb-4">
                  The complete collection from O D Porter. All 5 tracks from the Ambiguous EP.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <button 
                    onClick={() => setPlaying(TRACKS[0].id)}
                    className="pf-btn pf-btn-primary"
                  >
                    <Play className="inline mr-2" size={18} />
                    Play All
                  </button>
                  <Link href="/digital" className="pf-btn pf-btn-secondary">
                    View Album
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Tracks */}
        <section>
          <h2 className="text-xl font-bold mb-4">All Tracks</h2>
          <div className="pf-card overflow-hidden">
            <div className="divide-y divide-[var(--pf-border)]">
              {TRACKS.map((track, i) => (
                <div 
                  key={track.id}
                  className={`flex items-center gap-4 p-4 hover:bg-[var(--pf-surface-hover)] transition-colors group ${
                    playing === track.id ? 'bg-[var(--pf-orange)]/5' : ''
                  }`}
                >
                  <span className="w-8 text-center text-[var(--pf-text-muted)] font-bold">{i + 1}</span>
                  
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={track.image}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <button 
                    onClick={() => togglePlay(track.id)}
                    className="w-10 h-10 rounded-full bg-[var(--pf-surface)] flex items-center justify-center group-hover:bg-[var(--pf-orange)] transition-colors shrink-0"
                  >
                    {playing === track.id ? (
                      <Pause size={16} className="text-white" />
                    ) : (
                      <Play size={16} className="text-white ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${playing === track.id ? 'text-[var(--pf-orange)]' : ''}`}>
                      {track.title}
                    </p>
                    <p className="text-sm text-[var(--pf-text-muted)]">{track.artist} • {track.album}</p>
                  </div>

                  <span className="text-sm text-[var(--pf-text-muted)] hidden sm:block">
                    {(track.plays / 1000).toFixed(0)}K plays
                  </span>
                  
                  <span className="text-sm text-[var(--pf-text-muted)]">{track.duration}</span>
                  
                  <span className="font-bold">${track.price}+</span>

                  <button 
                    onClick={() => toggleLike(track.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      liked.includes(track.id) 
                        ? 'text-red-500' 
                        : 'text-[var(--pf-text-muted)] hover:text-white'
                    }`}
                  >
                    <Heart size={18} fill={liked.includes(track.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support CTA */}
        <section className="mt-12">
          <div className="pf-card p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Want Your Music Here?</h3>
            <p className="text-[var(--pf-text-secondary)] mb-4">
              Upload your tracks and reach fans directly. Keep 80% of every sale.
            </p>
            <Link href="/signup?role=artist" className="pf-btn pf-btn-primary">
              Upload Your Music
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}