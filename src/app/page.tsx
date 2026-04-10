'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Music2, Pause, Play, ShoppingBag } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useAudio, type Track } from '@/lib/audio-context'
import { TRACKS } from '@/lib/data'
import { ARTISTS } from '@/lib/artists'
import { FEATURED_PRODUCTS } from '@/lib/products'

const featuredArtist = ARTISTS.find((artist) => artist.slug === 'od-porter') ?? ARTISTS[0]

const featuredTracks = TRACKS
  .filter((track) => track.artist === featuredArtist.name)
  .sort((a, b) => (b.plays || 0) - (a.plays || 0))
  .slice(0, 4) as Track[]

const featuredTrack = featuredTracks[0]

const supportProducts = FEATURED_PRODUCTS
  .filter((product) => product.artist !== 'Porterful' && product.artist !== 'Various Artists')
  .slice(0, 3)

const artistSpotlight = ARTISTS.slice(0, 4)

function formatPlays(plays: number) {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`
  if (plays >= 1000) return `${Math.round(plays / 1000)}K`
  return plays.toString()
}

export default function HomePage() {
  const { currentTrack, isPlaying, playTrack, togglePlay, setQueue } = useAudio()

  const isFeaturedTrackActive = currentTrack?.id === featuredTrack?.id

  const startFeaturedPlayback = (track: Track) => {
    setQueue(featuredTracks)

    if (currentTrack?.id === track.id) {
      togglePlay()
      return
    }

    playTrack(track)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--pf-bg)] pt-16 md:pt-20">
        <section className="border-b border-[var(--pf-border)] bg-gradient-to-b from-[var(--pf-orange)]/10 via-[var(--pf-bg)] to-[var(--pf-bg)]">
          <div className="pf-container py-10 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--pf-orange)]">
                  Support Artists Directly
                </p>
                <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                  Hear the music. Back the artist. Buy direct.
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-[var(--pf-text-secondary)]">
                  Porterful is built for one thing: helping fans support artists by listening, buying music,
                  and purchasing products directly from the source.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => featuredTrack && startFeaturedPlayback(featuredTrack)}
                    className="pf-btn pf-btn-primary inline-flex items-center justify-center gap-2"
                  >
                    {isFeaturedTrackActive && isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    Play Music
                  </button>
                  <Link href={`/artist/${featuredArtist.slug}`} className="pf-btn pf-btn-secondary inline-flex items-center justify-center gap-2">
                    <Music2 size={18} />
                    Support Artist
                  </Link>
                  <Link href="/store" className="pf-btn pf-btn-secondary inline-flex items-center justify-center gap-2">
                    <ShoppingBag size={18} />
                    Browse Store
                  </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4">
                    <p className="text-sm text-[var(--pf-text-muted)]">Featured artist</p>
                    <p className="mt-1 text-lg font-semibold">{featuredArtist.name}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4">
                    <p className="text-sm text-[var(--pf-text-muted)]">Top release</p>
                    <p className="mt-1 text-lg font-semibold">{featuredTrack?.title}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4">
                    <p className="text-sm text-[var(--pf-text-muted)]">Direct support</p>
                    <p className="mt-1 text-lg font-semibold">Music + merch</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-5 shadow-2xl shadow-black/30">
                <div className="relative mb-5 aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={featuredTrack?.image || featuredArtist.image}
                    alt={featuredTrack?.title || featuredArtist.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[var(--pf-orange)]">Now Featured</p>
                    <h2 className="mt-2 text-2xl font-bold">{featuredTrack?.title}</h2>
                    <p className="mt-1 text-[var(--pf-text-secondary)]">
                      {featuredArtist.name} • {featuredTrack?.album}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => featuredTrack && startFeaturedPlayback(featuredTrack)}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--pf-orange)] text-white transition hover:bg-[var(--pf-orange-dark)]"
                    aria-label={isFeaturedTrackActive && isPlaying ? 'Pause featured track' : 'Play featured track'}
                  >
                    {isFeaturedTrackActive && isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                  </button>
                </div>

                <div className="mt-5 rounded-2xl bg-[var(--pf-bg)] p-4">
                  <div className="flex items-center justify-between text-sm text-[var(--pf-text-secondary)]">
                    <span>{formatPlays(featuredTrack?.plays || 0)} plays</span>
                    <span>${featuredTrack?.price || 1} track</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href={`/artist/${featuredArtist.slug}`} className="text-sm font-medium text-[var(--pf-orange)] hover:underline">
                      Visit artist page
                    </Link>
                    <Link href="/music" className="text-sm font-medium text-[var(--pf-orange)] hover:underline">
                      Hear more tracks
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--pf-border)]">
          <div className="pf-container py-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--pf-orange)]">Start Listening</p>
                <h2 className="mt-2 text-3xl font-bold">Play something in the first minute</h2>
              </div>
              <Link href="/music" className="hidden text-sm font-medium text-[var(--pf-orange)] hover:underline md:block">
                Open full music page
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {featuredTracks.map((track) => {
                const isActive = currentTrack?.id === track.id
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => startFeaturedPlayback(track)}
                    className="flex items-center gap-4 rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4 text-left transition hover:border-[var(--pf-orange)]"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                      <Image
                        src={track.image || featuredArtist.image}
                        alt={track.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate font-semibold ${isActive ? 'text-[var(--pf-orange)]' : ''}`}>{track.title}</p>
                      <p className="truncate text-sm text-[var(--pf-text-secondary)]">{track.album}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${track.price || 1}</p>
                      <p className="text-xs text-[var(--pf-text-muted)]">{formatPlays(track.plays || 0)} plays</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--pf-border)]">
          <div className="pf-container py-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--pf-orange)]">Support Now</p>
                <h2 className="mt-2 text-3xl font-bold">Buy directly from artists</h2>
              </div>
              <Link href="/store" className="hidden text-sm font-medium text-[var(--pf-orange)] hover:underline md:block">
                View full store
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {supportProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4 transition hover:border-[var(--pf-orange)]"
                >
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--pf-text-muted)]">{product.artist}</p>
                  <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
                  <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--pf-orange)]">
                      Support now
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="pf-container py-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--pf-orange)]">Artists</p>
                <h2 className="mt-2 text-3xl font-bold">Explore who you can support</h2>
              </div>
              <Link href="/artists" className="hidden text-sm font-medium text-[var(--pf-orange)] hover:underline md:block">
                Browse artists
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {artistSpotlight.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artist/${artist.slug}`}
                  className="group rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] p-4 transition hover:border-[var(--pf-orange)]"
                >
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{artist.name}</h3>
                  <p className="mt-1 text-sm text-[var(--pf-text-secondary)]">{artist.genre}</p>
                  <p className="mt-3 text-sm text-[var(--pf-text-muted)]">{artist.shortBio}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
