'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── System Definitions ──────────────────────────────────────────
const SYSTEMS = [
  {
    id: 'music',
    label: 'MUSIC',
    subtitle: 'Stream. Own. Earn.',
    tagline: 'The Artist Economy.',
    description: 'Music + merch for independent artists. 80% revenue share. No labels. No middlemen.',
    route: '/music',
    glowColor: '#ff6b00',
    iconPath: 'M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z',
  },
  {
    id: 'land',
    label: 'LAND',
    subtitle: 'Acquire. Control. Build.',
    tagline: 'The Ownership Economy.',
    description: 'Land intelligence, tax deed discovery, and acquisition pathways for real wealth building.',
    route: '/land',
    glowColor: '#22c55e',
    iconPath: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  },
  {
    id: 'mind',
    label: 'MIND',
    subtitle: 'Learn. Grow. Scale.',
    tagline: 'The Knowledge Economy.',
    description: 'The ARCHTEXT method. Cognitive learning infrastructure for homeschool families.',
    route: '/education',
    glowColor: '#a855f7',
    iconPath: 'M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7zM9 21v-2a3 3 0 0 1 6 0v2',
  },
  {
    id: 'law',
    label: 'LAW',
    subtitle: 'Document. Protect. Resolve.',
    tagline: 'The Access Economy.',
    description: 'Legal document assistance for incarcerated individuals and their families.',
    route: '/law',
    glowColor: '#3b82f6',
    iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  },
  {
    id: 'commerce',
    label: 'COMMERCE',
    subtitle: 'Trade. Exchange. Connect.',
    tagline: 'The Barter Economy.',
    description: 'Structured barter exchange for communities. Trade value without cash friction.',
    route: '/commerce',
    glowColor: '#f97316',
    iconPath: 'M16 3h5v5M8 3H3v5M3 16v5h5M21 16v5h-5M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  },
  {
    id: 'credit',
    label: 'CREDIT',
    subtitle: 'Build. Restore. Rise.',
    tagline: 'The Credit Economy.',
    description: 'Dispute letter automation and credit pathway guidance for credit-invisible communities.',
    route: '/credit',
    glowColor: '#10b981',
    iconPath: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  },
];

const SYSTEM_COUNT = SYSTEMS.length;

export default function SystemSelector() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [entered, setEntered] = useState(false);
  const lastIndexRef = useRef(0);

  // ── Scroll Detection ─────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    if (newIndex !== lastIndexRef.current && newIndex >= 0 && newIndex < SYSTEM_COUNT) {
      lastIndexRef.current = newIndex;
      setActiveIndex(newIndex);
      triggerHaptic();
    }
  }, []);

  // ── Haptic Feedback ──────────────────────────────────────────
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(8);
    }
  };

  // ── Snap to nearest on scroll end ───────────────────────────
  const snapToIndex = (index: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth',
    });
  };

  // ── Keyboard Navigation ──────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        const newIndex = e.key === 'ArrowDown' || e.key === ' '
          ? Math.min(activeIndex + 1, SYSTEM_COUNT - 1)
          : Math.max(activeIndex - 1, 0);
        snapToIndex(newIndex);
      }
      if (e.key === 'Enter') {
        handleEnter(activeIndex);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex]);

  // ── Enter System ────────────────────────────────────────────
  const handleEnter = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    triggerHaptic();
    setTimeout(() => {
      router.push(SYSTEMS[index].route);
    }, 350);
  };

  // ── Touch/Wheel Momentum ─────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let isScrolling = false;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      isScrolling = true;
      setTimeout(() => { isScrolling = false; }, 800);

      const newIndex = e.deltaY > 0
        ? Math.min(activeIndex + 1, SYSTEM_COUNT - 1)
        : Math.max(activeIndex - 1, 0);
      snapToIndex(newIndex);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [activeIndex]);

  // ── Progress Indicator ───────────────────────────────────────
  const progress = ((activeIndex) / (SYSTEM_COUNT - 1)) * 100;

  return (
    <div className="relative w-full">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        {SYSTEMS.map((system, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const distance = Math.abs(index - activeIndex);
          const opacity = isActive ? 1 : Math.max(0, 1 - distance * 0.6);
          const scale = isActive ? 1 : Math.max(0.6, 1 - distance * 0.3);
          const isVisible = distance < 3;

          return (
            <div
              key={system.id}
              className="h-screen w-full flex items-center justify-center relative snap-center"
              style={{ display: isVisible ? 'flex' : 'none' }}
            >
              {/* Glow behind icon */}
              {isActive && (
                <div
                  className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl"
                  style={{
                    background: system.glowColor,
                    boxShadow: `0 0 120px 40px ${system.glowColor}40`,
                  }}
                />
              )}

              {/* System Content */}
              <div
                className="flex flex-col items-center text-center px-8 transition-all duration-500"
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {/* Icon */}
                <button
                  onClick={() => isActive && handleEnter(index)}
                  className={`relative mb-10 transition-all duration-300 ${isActive ? 'scale-110' : ''}`}
                  style={{ cursor: isActive ? 'pointer' : 'default' }}
                  aria-label={`Enter ${system.label}`}
                >
                  {/* Outer ring */}
                  <div
                    className="absolute inset-0 rounded-full opacity-20 transition-all duration-500"
                    style={{
                      border: `1px solid ${system.glowColor}`,
                      boxShadow: isActive ? `0 0 30px ${system.glowColor}60` : 'none',
                    }}
                  />
                  {/* Icon */}
                  <svg
                    width="72"
                    height="72"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isActive ? system.glowColor : '#555'}
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                    style={{
                      filter: isActive ? `drop-shadow(0 0 12px ${system.glowColor}80)` : 'none',
                    }}
                  >
                    <path d={system.iconPath} />
                  </svg>
                  {/* Pulse ring when active */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-10"
                      style={{ border: `1px solid ${system.glowColor}` }}
                    />
                  )}
                </button>

                {/* Label */}
                <h2
                  className="text-6xl md:text-7xl font-black tracking-widest mb-4 transition-all duration-500"
                  style={{
                    color: isActive ? '#fff' : '#444',
                    textShadow: isActive ? `0 0 40px ${system.glowColor}60` : 'none',
                    letterSpacing: isActive ? '0.3em' : '0.2em',
                  }}
                >
                  {system.label}
                </h2>

                {/* Subtitle */}
                <p
                  className="text-xl md:text-2xl font-medium mb-3 tracking-wide transition-all duration-500"
                  style={{
                    color: isActive ? system.glowColor : '#333',
                    opacity: isActive ? 1 : 0.3,
                  }}
                >
                  {system.subtitle}
                </p>

                {/* Tagline */}
                <p
                  className="text-xs uppercase tracking-widest mb-8 transition-all duration-500"
                  style={{ color: '#555', opacity: isActive ? 0.7 : 0.2 }}
                >
                  {system.tagline}
                </p>

                {/* CTA */}
                {isActive && (
                  <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                      onClick={() => handleEnter(index)}
                      className="px-10 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 active:scale-95"
                      style={{
                        background: system.glowColor,
                        color: '#000',
                        boxShadow: `0 0 30px ${system.glowColor}50`,
                      }}
                      onMouseEnter={e => {
                        (e.target as HTMLButtonElement).style.boxShadow = `0 0 50px ${system.glowColor}80`;
                      }}
                      onMouseLeave={e => {
                        (e.target as HTMLButtonElement).style.boxShadow = `0 0 30px ${system.glowColor}50`;
                      }}
                    >
                      Enter
                    </button>
                    <p className="text-xs text-gray-600 tracking-widest">
                      or press ENTER
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-50">
        {SYSTEMS.map((_, index) => (
          <button
            key={index}
            onClick={() => snapToIndex(index)}
            className="w-1 rounded-full transition-all duration-300"
            style={{
              height: index === activeIndex ? '48px' : '16px',
              background: index === activeIndex
                ? SYSTEMS[index].glowColor
                : index < activeIndex
                  ? '#555'
                  : '#333',
              opacity: index === activeIndex ? 1 : 0.5,
            }}
            aria-label={`Go to system ${index + 1}`}
          />
        ))}
      </div>

      {/* Dot count */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
        <span className="text-xs text-gray-600 tracking-widest font-medium">
          {String(activeIndex + 1).padStart(2, '0')} / {String(SYSTEM_COUNT).padStart(2, '0')}
        </span>
      </div>

      {/* Scroll hint on first load */}
      {activeIndex === 0 && (
        <div className="fixed bottom-8 right-8 flex flex-col items-center gap-2 z-50 animate-bounce">
          <span className="text-xs text-gray-600 tracking-widest">SCROLL</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping { animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
}
