'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowDown, Music, Map, Brain, Scale, CreditCard, ShoppingBag, ChevronRight, Star, Zap, Heart, Shield } from 'lucide-react';

// System definitions
const SYSTEMS = [
  {
    id: 'music',
    label: 'MUSIC',
    subtitle: 'Stream. Own. Earn.',
    tagline: 'The Artist Economy.',
    route: '/music',
    glowColor: '#ff6b00',
    iconBg: 'bg-orange-500/10',
    iconBorder: 'border-orange-500/30',
    iconColor: 'text-orange-400',
    description: 'O D Porter. Ambiguous. 21 tracks. A platform where artists keep 80%+ and superfans earn 3% on referrals.',
  },
  {
    id: 'shop',
    label: 'SHOP',
    subtitle: 'Your Name. In Metal.',
    tagline: 'The Custom Economy.',
    route: '/shop',
    glowColor: '#eab308',
    iconBg: 'bg-yellow-500/10',
    iconBorder: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    description: 'Custom name chains. Sterling silver, gold vermeil, rose gold. Ships in 5–7 days.',
  },
  {
    id: 'land',
    label: 'LAND',
    subtitle: 'Acquire. Control. Build.',
    tagline: 'The Ownership Economy.',
    route: '/systems',
    externalUrl: 'https://national-land-data-system.vercel.app',
    glowColor: '#22c55e',
    iconBg: 'bg-green-500/10',
    iconBorder: 'border-green-500/30',
    iconColor: 'text-green-400',
    description: 'National Land Data System™. 30+ proprietary deals. Land is the ultimate asset class.',
  },
  {
    id: 'mind',
    label: 'MIND',
    subtitle: 'Learn. Grow. Scale.',
    tagline: 'The Knowledge Economy.',
    route: '/learn',
    externalUrl: 'https://teachyoung.org',
    glowColor: '#a855f7',
    iconBg: 'bg-purple-500/10',
    iconBorder: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    description: 'TeachYoung. Homeschool curriculum for Honor and Noble. ARCHTEXT™ system.',
  },
  {
    id: 'law',
    label: 'LAW',
    subtitle: 'Document. Protect. Resolve.',
    tagline: 'The Access Economy.',
    route: '/systems',
    externalUrl: 'https://ihd-app.vercel.app',
    glowColor: '#3b82f6',
    iconBg: 'bg-blue-500/10',
    iconBorder: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    description: 'Inmate Help Desk™. Document assistance for incarcerated individuals and families.',
  },
  {
    id: 'credit',
    label: 'CREDIT',
    subtitle: 'Build. Restore. Rise.',
    tagline: 'The Credit Economy.',
    route: '/systems',
    externalUrl: 'https://creditklimb.com',
    glowColor: '#10b981',
    iconBg: 'bg-emerald-500/10',
    iconBorder: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    description: 'CreditKlimb. 24 pages of credit repair tools, dispute letters, and guidance.',
  },
];

const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  music: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shop: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
    </svg>
  ),
  land: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  mind: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21v-2a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  law: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  credit: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

function SystemCard({ system, index }: { system: typeof SYSTEMS[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const href = system.externalUrl || system.route || '#';

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <a
        href={href}
        {...(system.externalUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group block p-6 rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-[var(--pf-border)] transition-all duration-300 hover:shadow-lg relative overflow-hidden"
        style={{
          ['--tw-shadow-color' as string]: system.glowColor + '20',
        }}
      >
        {/* Glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${system.glowColor}08 0%, transparent 60%)`,
          }}
        />

        <div className="relative">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl ${system.iconBg} border ${system.iconBorder} flex items-center justify-center mb-4 ${system.iconColor}`}>
            {SYSTEM_ICONS[system.id]}
          </div>

          {/* Label */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-[var(--pf-text-secondary)]">{system.id}</span>
            {system.externalUrl && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[var(--pf-text-secondary)]">
                <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          <h3 className="text-xl font-bold mb-1">{system.label}</h3>
          <p className={`text-sm font-medium mb-2 ${system.iconColor}`}>{system.tagline}</p>
          <p className="text-sm text-[var(--pf-text-secondary)] mb-4">{system.description}</p>

          <div className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: system.glowColor }}>
            {system.externalUrl ? 'Visit' : 'Explore'}
            <ChevronRight size={14} />
          </div>
        </div>
      </a>
    </div>
  );
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[var(--pf-bg)]">
          {/* Gradient orbs */}
          <div
            className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #ff6b00 0%, transparent 70%)',
              top: '20%',
              left: '30%',
              transform: `translate(${scrollY * 0.02}px, ${scrollY * 0.01}px)`,
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full opacity-8 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)',
              bottom: '20%',
              right: '25%',
              transform: `translate(${-scrollY * 0.01}px, ${-scrollY * 0.02}px)`,
            }}
          />
        </div>

        <div className="relative text-center px-6 max-w-5xl mx-auto">
          {/* Tagline */}
          <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)] mb-6">
            Porterful Ecosystem
          </p>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6">
            THERE IS
            <br />
            <span className="text-[var(--pf-orange)]">A WAY</span>
            <br />
            FORWARD.
          </h1>

          <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto mb-12">
            A platform built for artists, by an artist. Music, land, mind, law, commerce, credit — all connected.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#systems"
              className="px-8 py-4 bg-[var(--pf-orange)] hover:bg-[var(--pf-orange)]/90 text-black font-bold rounded-full transition-all inline-flex items-center gap-2"
            >
              Enter the System
              <ArrowDown size={18} />
            </a>
            <a
              href="/music"
              className="px-8 py-4 bg-[var(--pf-surface)] hover:bg-[var(--pf-border)] text-[var(--pf-text)] font-medium rounded-full transition-all border border-[var(--pf-border)] inline-flex items-center gap-2"
            >
              <Play size={18} />
              Listen Now
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--pf-text-secondary)]">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--pf-text-secondary)] to-transparent animate-pulse" />
        </div>
      </section>

      {/* WHY PORTERFUL */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)] mb-8 text-center">Why Porterful</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'We built what should have existed.',
                body: 'A platform where artists keep 80%+ of what they earn. Where superfans earn 3% on everything their referrals buy. Where the community owns the means.',
              },
              {
                number: '02',
                title: 'Artists are the economy.',
                body: 'Not Spotify. Not Apple. Not a label. Artists. The platform is the retirement plan. The music is the foundation. The community is the asset.',
              },
              {
                number: '03',
                title: 'The loop is the product.',
                body: 'Music builds fans. Fans buy chains. Chains fund land deals. Land deals fund more music. Every system feeds the next.',
              },
            ].map(({ number, title, body }) => (
              <div key={number} className="text-center">
                <span className="text-5xl font-bold text-[var(--pf-orange)]/20">{number}</span>
                <h3 className="text-xl font-bold mt-2 mb-3">{title}</h3>
                <p className="text-[var(--pf-text-secondary)]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEM SELECTOR */}
      <section id="systems" className="border-t border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)] mb-4">The Ecosystem</p>
            <h2 className="text-4xl lg:text-5xl font-bold">Choose Your Entry Point</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SYSTEMS.map((system, i) => (
              <SystemCard key={system.id} system={system} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ARTIST SPOTLIGHT */}
      <section className="border-t border-[var(--pf-border)] bg-gradient-to-b from-[var(--pf-orange)]/5 to-transparent">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)] mb-4">Artist Spotlight</p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">O D Porter</h2>
              <p className="text-lg text-[var(--pf-text-secondary)] mb-6">
                St. Louis-born. Born in Miami, raised between NOLA and the Lou. Stubborn when he sets his mind to something.
              </p>
              <p className="text-[var(--pf-text-secondary)] mb-8">
                After years grinding in the underground, he built Porterful out of frustration — with platforms that take 80% of what artists earn, with labels that own your work before you see a dollar.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/music"
                  className="px-6 py-3 bg-[var(--pf-orange)] hover:bg-[var(--pf-orange)]/90 text-black font-bold rounded-full transition-all inline-flex items-center gap-2"
                >
                  <Play size={18} />
                  Listen to Ambiguous
                </a>
                <a
                  href="/shop"
                  className="px-6 py-3 bg-[var(--pf-surface)] hover:bg-[var(--pf-border)] text-[var(--pf-text)] font-medium rounded-full transition-all border border-[var(--pf-border)] inline-flex items-center gap-2"
                >
                  Shop Custom Chains
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 rounded-3xl overflow-hidden border-2 border-[var(--pf-orange)]/30">
                  <Image
                    src="/artist-art/od-porter.jpg"
                    alt="O D Porter"
                    width={288}
                    height={288}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800';
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full bg-[var(--pf-orange)] text-black text-sm font-bold">
                  21 Tracks
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAIN TEASER */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative w-72 h-72 rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
                  alt="Custom name chain"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-3xl font-bold">YOUR NAME.</p>
                  <p className="text-lg text-white/70">IN METAL.</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-sm uppercase tracking-widest text-yellow-400 mb-4">Porterful Shop</p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Custom Name Chains
              </h2>
              <p className="text-lg text-[var(--pf-text-secondary)] mb-6">
                Sterling silver, gold vermeil, or rose gold. Handcrafted to order. Ships in 5–7 days.
              </p>

              <ul className="space-y-2 mb-8">
                {[
                  'Up to 12 characters',
                  'Real metal — not plated',
                  'Free shipping',
                  'Final sale (custom order)',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[var(--pf-text-secondary)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="/shop"
                className="px-8 py-4 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold rounded-full transition-all border border-yellow-500/30 inline-flex items-center gap-2"
              >
                Design Your Chain
                <ChevronRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-1">PORTERFUL</h3>
              <p className="text-sm text-[var(--pf-text-secondary)]">The ecosystem. Built for artists.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="/music" className="text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors">Music</a>
              <a href="/shop" className="text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors">Shop</a>
              <a href="/systems" className="text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors">Systems</a>
              <a href="/learn" className="text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors">Learn</a>
              <a href="/privacy" className="text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors">Privacy</a>
              <a href="/terms" className="text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors">Terms</a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--pf-border)] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--pf-text-secondary)]">
            <p>© 2026 Porterful. All Rights Reserved.</p>
            <p>Inquiring Minds LLC · St. Louis, MO</p>
          </div>
        </div>
      </section>

    </div>
  );
}
