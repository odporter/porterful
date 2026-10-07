'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Search, Disc, Users, Filter } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAudio } from '@/lib/audio-context';
import { useToast } from '@/components/Toast';
import { TRACKS } from '@/lib/data';

export default function MusicClient() {
  const { addItem } = useCart();
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('all');

  // Get unique albums
  const albums = Array.from(new Set(TRACKS.map(t => t.album)));

  // Filter tracks
  const filteredTracks = TRACKS.filter(track => {
    const matchesSearch = searchQuery === '' || 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAlbum = selectedAlbum === 'all' || track.album === selectedAlbum;
    return matchesSearch && matchesAlbum;
  });

  // Featured track (most plays)
  const featuredTrack = TRACKS.reduce((prev, curr) => 
    (curr.plays || 0) > (prev.plays || 0) ? curr : prev
  , TRACKS[0]);

  const handlePlay = (track: typeof TRACKS[0]) => {
    playTrack(track);
  };

  const handleAddToCart = (track: typeof TRACKS[0]) => {
    addItem({
      productId: track.id,
      name: track.title,
      price: track.price,
      image: track.image || '',
      artist: track.artist,
      artistCut: track.price * 0.8,
    });
    showToast(`${track.title} added to cart`, 'success');
  };

  const formatPlays = (plays: number) => {
    if (!plays) return '0';
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
    if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`;
    return plays.toString();
  };

  return (
    <div className="min-h-screen bg-[var(--pf-bg)]">
      {/* Featured Track Hero */}
      <section className="bg-[var(--pf-bg)] border-b border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-6 sm:pt-10 pb-5 sm:pb-8">
          <p className="text-[11px] uppercase tracking-widest text-[var(--pf-text-secondary)] mb-3">
            Featured
          </p>
          <div className="flex items-center gap-4 sm:gap-5">
            <Link 
              href={`/album/${featuredTrack?.album.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--pf-surface)]"
              aria-label="Open artist page"
            >
              {featuredTrack?.image ? (
                <Image
                  src={featuredTrack.image}
                  alt={featuredTrack.album || featuredTrack.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[var(--pf-surface)]" />
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold truncate">
                {featuredTrack ? featuredTrack.title : 'Featured Track'}
              </h1>
              {featuredTrack ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-[var(--pf-text-secondary)]">
                  {featuredTrack.artist}
                </span>
                {featuredTrack.album && (
                  <>
                    <span className="text-[var(--pf-text-muted)]">•</span>
                    <Link 
                      href={`/album/${featuredTrack.album.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-[var(--pf-orange)] hover:underline"
                    >
                      {featuredTrack.album}
                    </Link>
                  </>
                )}
              </div>
              ) : (
                <p className="text-sm text-[var(--pf-text-secondary)]">Stream music from independent artists.</p>
              )}
            </div>
            <button
              onClick={() => featuredTrack && handlePlay(featuredTrack)}
              disabled={!featuredTrack}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-colors shadow-lg bg-[var(--pf-orange)] hover:bg-[var(--pf-orange-dark)] text-white disabled:opacity-50"
              aria-label="Play featured track"
            >
              <Play size={24} className="ml-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Browse Artists */}
      <section className="border-b border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-[var(--pf-text-secondary)]" />
            <h2 className="text-base font-semibold">Browse Artists</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6 scrollbar-hide pb-1">
            <Link href="/artist/od-porter" className="flex-shrink-0 w-36 sm:w-40 group">
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-[24px] bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 mb-2 flex items-center justify-center text-4xl transition-transform group-hover:scale-105">
                🎤
              </div>
              <div className="h-4 w-24 rounded-full bg-[var(--pf-surface)] mb-1" />
              <div className="h-3 w-16 rounded-full bg-[var(--pf-surface)]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Albums */}
      <section className="border-b border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Disc size={16} className="text-[var(--pf-text-secondary)]" />
              <h2 className="text-base font-semibold">Albums</h2>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6 scrollbar-hide pb-1">
            {albums.slice(0, 8).map(album => {
              const track = TRACKS.find(t => t.album === album);
              return (
                <Link 
                  key={album}
                  href={`/album/${album.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex-shrink-0 w-36 sm:w-40 group"
                >
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-[24px] overflow-hidden mb-2 bg-[var(--pf-surface)]">
                    {track?.image ? (
                      <Image
                        src={track.image}
                        alt={album}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--pf-surface)]" />
                    )}
                  </div>
                  <p className="font-medium text-sm truncate group-hover:text-[var(--pf-orange)] transition-colors">
                    {album}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Tracks */}
      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music2 lucide-music-2 text-[var(--pf-text-secondary)]" aria-hidden="true"><circle cx="8" cy="18" r="4"></circle><path d="M12 18V2l7 4"></path></svg>
              <h2 className="text-base font-semibold">All Tracks</h2>
            </div>
            <p className="text-xs text-[var(--pf-text-muted)]">
              {filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)]" />
              <input
                type="text"
                placeholder="Search tracks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 py-2 w-full bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pf-orange)]/50 focus:ring-1 focus:ring-[var(--pf-orange)]/20 transition-all placeholder:text-[var(--pf-text-muted)]"
              />
            </div>
            {/* Album Filter */}
            <div className="relative w-full sm:w-44">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)] pointer-events-none" />
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="pl-8 pr-3 py-2 w-full bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--pf-orange)]/50 appearance-none cursor-pointer"
              >
                <option value="all">All albums</option>
                {albums.map(album => (
                  <option key={album} value={album}>{album}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="space-y-1">
          {filteredTracks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--pf-text-muted)]">No tracks found matching your search.</p>
            </div>
          ) : (
            filteredTracks.map(track => {
              const isCurrentTrack = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  className="relative flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg hover:bg-[var(--pf-surface)] transition-colors group sm:pr-3"
                >
                  {/* Mobile: full-row tap target for play; desktop: icon button */}
                  <button
                    onClick={() => handlePlay(track)}
                    className="sm:relative absolute inset-0 sm:static flex items-center justify-center sm:justify-start sm:w-5 sm:h-5 sm:shrink-0 z-10"
                    aria-label={isCurrentTrack && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  >
                    {/* Visible play/pause indicator — desktop only */}
                    <span className="hidden sm:flex w-5 h-5 items-center justify-center text-[var(--pf-text-muted)] group-hover:text-[var(--pf-orange)] transition-colors">
                      {isCurrentTrack && isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                      ) : (
                        <Play size={14} className="ml-0.5" />
                      )}
                    </span>
                    {/* Mobile: colored dot for playing state, neutral for paused */}
                    {isCurrentTrack && isPlaying ? (
                      <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-[var(--pf-orange)] absolute left-1.5 top-1/2 -translate-y-1/2" />
                    ) : (
                      <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-[var(--pf-text-muted)] absolute left-1.5 top-1/2 -translate-y-1/2" />
                    )}
                  </button>
                  
                  {/* Album Art */}
                  <Link 
                    href={`/album/${track.album.toLowerCase().replace(/\s+/g, '-')}`}
                    className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg sm:rounded bg-[var(--pf-surface)] overflow-hidden shrink-0 z-10"
                  >
                    {track.image && (
                      <Image
                        src={track.image}
                        alt={track.album || track.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </Link>
                  
                  {/* Track Info */}
                  <div className="flex-1 min-w-0 pl-4 sm:pl-0 pr-16 sm:pr-0">
                    <p 
                      className={`font-medium text-sm sm:text-base truncate ${isCurrentTrack ? 'text-[var(--pf-orange)]' : 'group-hover:text-[var(--pf-orange)]'} transition-colors`}
                    >
                      {track.title}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--pf-text-muted)] truncate">{track.artist}</p>
                  </div>
                  
                  {/* Album (hidden on mobile) */}
                  <Link 
                    href={`/album/${track.album.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hidden sm:block text-sm text-[var(--pf-text-secondary)] truncate max-w-[150px] hover:text-[var(--pf-orange)] shrink-0"
                  >
                    {track.album}
                  </Link>
                  
                  {/* Plays */}
                  <span className="hidden md:block text-xs text-[var(--pf-text-muted)] w-14 text-right shrink-0">
                    {formatPlays(track.plays || 0)}
                  </span>
                  
                  {/* Duration */}
                  <span className="hidden sm:block text-xs text-[var(--pf-text-muted)] w-10 text-right shrink-0">
                    {track.duration}
                  </span>
                  
                  {/* Price & Add to Cart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(track);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 sm:relative sm:right-auto sm:top-auto sm:translate-y-0 text-xs font-medium px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-lg bg-[var(--pf-orange)]/10 text-[var(--pf-orange)] hover:bg-[var(--pf-orange)] hover:text-white transition-colors shrink-0 z-10"
                  >
                    ${track.price.toFixed(2)}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
