'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAudio } from '@/lib/audio-context';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/components/Toast';
import type { Track } from '@/lib/audio-context';

interface AlbumClientProps {
  albumName: string;
  albumImage: string;
  albumTracks: Track[];
  totalDuration: string;
}

export default function AlbumClient({ albumName, albumImage, albumTracks, totalDuration }: AlbumClientProps) {
  const { playTrack, currentTrack, isPlaying, setQueue } = useAudio();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [buyingAlbum, setBuyingAlbum] = useState(false);

  const handlePlayAll = () => {
    setQueue(albumTracks);
    playTrack(albumTracks[0], undefined, undefined, albumTracks, 0);
    showToast(`Playing ${albumName}`, 'success');
  };

  const handlePlayTrack = (track: Track) => {
    const index = albumTracks.findIndex(t => t.id === track.id);
    setQueue(albumTracks);
    playTrack(track, undefined, undefined, albumTracks, index);
  };

  const handleBuyAlbum = () => {
    setBuyingAlbum(true);
    albumTracks.forEach(track => {
      addItem({
        productId: track.id,
        name: track.title,
        price: track.price || 0.5,
        image: track.image || albumImage,
        artist: track.artist,
        artistCut: (track.price || 0.5) * 0.8,
      });
    });
    showToast(`${albumTracks.length} tracks added to cart`, 'success');
    setTimeout(() => setBuyingAlbum(false), 1000);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[var(--pf-orange)]/20 via-[var(--pf-bg)] to-purple-500/10">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pf-bg)] to-transparent" />
        
        <div className="relative z-10 pf-container max-w-4xl pt-8 pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Album Art */}
            <div className="w-full md:w-64 shrink-0">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative">
                <Image 
                  src={albumImage} 
                  alt={albumName}
                  fill
                  sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Album Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--pf-orange)] uppercase tracking-wider mb-2">Album</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{albumName}</h1>
              <Link 
                href="/artist/od-porter"
                className="inline-flex items-center gap-2 text-[var(--pf-text-secondary)] hover:text-[var(--pf-orange)] transition-colors mb-4"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  O
                </div>
                <span className="font-medium">O D Porter</span>
              </Link>
              
              <div className="flex flex-wrap gap-4 text-sm text-[var(--pf-text-secondary)] mb-6">
                <span>{albumTracks.length} tracks</span>
                <span>•</span>
                <span>{totalDuration}</span>
              </div>
              
              {/* Play Button */}
              <div className="flex gap-3">
                <button 
                  onClick={handlePlayAll}
                  className="pf-btn pf-btn-primary flex items-center gap-2 text-lg px-6 py-3"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                  Play All
                </button>
                <button 
                  onClick={handleBuyAlbum}
                  disabled={buyingAlbum}
                  className="pf-btn pf-btn-secondary flex items-center gap-2 disabled:opacity-50"
                >
                  {buyingAlbum ? 'Adding...' : 'Buy Album'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Track List */}
      <div className="pf-container max-w-4xl py-8">
        <h2 className="text-xl font-bold mb-4">Tracks</h2>
        <div className="space-y-2">
          {albumTracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            return (
              <div 
                key={track.id}
                className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-[var(--pf-orange)] transition-colors cursor-pointer"
                onClick={() => handlePlayTrack(track)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePlayTrack(track);
                  }
                }}
                aria-label={`${isCurrentTrack && isPlaying ? 'Pause' : 'Play'} ${track.title}`}
              >
                {/* Track Number / Play indicator */}
                <span className="w-8 text-center text-[var(--pf-text-muted)] group-hover:hidden flex items-center justify-center">
                  {isCurrentTrack && isPlaying ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--pf-orange)]">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="w-8 text-center hidden group-hover:flex items-center justify-center text-[var(--pf-orange)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                </span>
                
                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isCurrentTrack ? 'text-[var(--pf-orange)]' : 'group-hover:text-[var(--pf-orange)]'} transition-colors`}>
                    {track.title}
                  </p>
                </div>
                
                {/* Duration */}
                <span className="text-sm text-[var(--pf-text-muted)]">
                  {track.duration}
                </span>
                
                {/* Price */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem({
                      productId: track.id,
                      name: track.title,
                      price: track.price || 0.5,
                      image: track.image || albumImage,
                      artist: track.artist,
                      artistCut: (track.price || 0.5) * 0.8,
                    });
                    showToast(`${track.title} added to cart`, 'success');
                  }}
                  className="text-sm font-medium text-[var(--pf-orange)] hover:bg-[var(--pf-orange)] hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
                  aria-label={`Buy ${track.title} for $${track.price || 0.5}`}
                >
                  ${(track.price || 0.5).toFixed(2)}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Back to Music */}
        <div className="mt-8 pt-8 border-t border-[var(--pf-border)]">
          <Link 
            href="/music"
            className="text-[var(--pf-orange)] hover:underline font-medium"
          >
            ← Back to all music
          </Link>
        </div>
      </div>
    </>
  );
}
