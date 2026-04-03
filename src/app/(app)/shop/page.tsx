'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Truck, Shield, RefreshCw, Ruler, Sparkles, ArrowLeft } from 'lucide-react';

// Chain options
const METALS = [
  { id: 'silver', label: 'Sterling Silver', price: 45, hex: 'bg-gray-300' },
  { id: 'gold', label: '14K Gold Vermeil', price: 55, hex: 'bg-yellow-400' },
  { id: 'rosegold', label: 'Rose Gold', price: 50, hex: 'bg-pink-400' },
];

const LENGTHS = [
  { value: 16, label: '16"', desc: 'Choker' },
  { value: 18, label: '18"', desc: 'Standard' },
  { value: 20, label: '20"', desc: 'Loose' },
  { value: 22, label: '22"', desc: 'Extended' },
];

export default function ShopPage() {
  const [name, setName] = useState('');
  const [metal, setMetal] = useState(METALS[0]);
  const [length, setLength] = useState(18);
  const [loading, setLoading] = useState(false);
  const [showStory, setShowStory] = useState(false);

  const maxChars = 12;
  const displayName = name.trim() || 'YOUR NAME';
  const price = metal.price;

  const handleCheckout = useCallback(async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: `chain-${metal.id}-${length}`,
            name: `Custom Name Chain — ${displayName}`,
            price: price,
            type: 'physical',
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
            metal: metal.label,
            length: length,
          }],
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  }, [name, metal, length, displayName, price]);

  return (
    <div className="min-h-screen pb-24">

      {/* BACK NAV */}
      <div className="border-b border-[var(--pf-border)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors">
            <ArrowLeft size={16} />
            Back to Porterful
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--pf-bg)] to-[var(--pf-surface)]">
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <p className="text-sm uppercase tracking-widest text-yellow-400 mb-4">Porterful Shop</p>
              <h1 className="text-5xl lg:text-7xl font-bold leading-none mb-4">
                YOUR NAME.
                <br />
                <span className="text-yellow-400">IN METAL.</span>
              </h1>
              <p className="text-xl text-[var(--pf-text-secondary)] mb-8 max-w-md">
                Custom-made name chains. Sterling silver, gold vermeil, or rose gold. No compromises.
              </p>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-bold">${price}</span>
                <span className="text-[var(--pf-text-secondary)]">+ free shipping</span>
              </div>

              <a href="#builder" className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-full transition-colors">
                Design Your Chain
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Right: Hero image */}
            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=90"
                  alt="Custom name chain"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-sm text-[var(--pf-text-secondary)]">Ships in</p>
                <p className="text-xl font-bold">5–7 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-widest text-yellow-400 mb-8 text-center">How It Works</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Type Your Name', desc: 'Up to 12 characters. Any name, any word.' },
              { step: '02', title: 'Pick Your Metal', desc: 'Silver, Gold, or Rose Gold. Real metal, solid build.' },
              { step: '03', title: 'We Make It', desc: 'Handcrafted and shipped free. No returns — it\'s custom.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-border)] flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-400">{step}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-[var(--pf-text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAIN BUILDER */}
      <section id="builder" className="border-t border-[var(--pf-border)] bg-[var(--pf-surface)]/30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-yellow-400 mb-2">Custom Chain Builder</p>
            <h2 className="text-3xl lg:text-4xl font-bold">Design Yours</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Preview */}
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-5xl lg:text-7xl font-bold tracking-wider mb-8 transition-colors duration-300 ${
                    metal.id === 'gold' ? 'text-yellow-400' :
                    metal.id === 'rosegold' ? 'text-pink-400' :
                    'text-gray-300'
                  }`}>
                    {displayName.toUpperCase()}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className={`w-32 h-0.5 rounded-full ${metal.hex}`} />
                    <div className={`w-3 h-3 rounded-full ${metal.hex}`} />
                    <div className={`w-32 h-0.5 rounded-full ${metal.hex}`} />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    metal.id === 'gold' ? 'bg-yellow-400/20 text-yellow-400' :
                    metal.id === 'rosegold' ? 'bg-pink-400/20 text-pink-400' :
                    'bg-gray-400/20 text-gray-300'
                  }`}>
                    {metal.label}
                  </span>
                  <span className="text-white/50 text-sm">{length}&quot; chain</span>
                </div>
              </div>

              <p className="text-center mt-4 text-sm text-[var(--pf-text-secondary)]">
                {name.trim() ? `"${name.trim()}"` : 'Enter your name below'}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-8">
              {/* Name input */}
              <div>
                <label className="block text-sm font-medium mb-3">Your Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, maxChars))}
                    placeholder="Type any name..."
                    className="w-full px-6 py-4 bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-2xl text-xl font-medium focus:outline-none focus:border-yellow-400 transition-colors placeholder:text-[var(--pf-text-secondary)]"
                    maxLength={maxChars}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--pf-text-secondary)]">
                    {name.length}/{maxChars}
                  </span>
                </div>
              </div>

              {/* Metal selector */}
              <div>
                <label className="block text-sm font-medium mb-3">Metal</label>
                <div className="grid grid-cols-3 gap-3">
                  {METALS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMetal(m)}
                      className={`p-4 rounded-2xl border-2 transition-all text-center ${
                        metal.id === m.id
                          ? 'border-yellow-400 bg-yellow-400/5'
                          : 'border-[var(--pf-border)] hover:border-[var(--pf-text-secondary)]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full ${m.hex} mx-auto mb-2 shadow-lg`} />
                      <p className="text-sm font-medium">{m.label}</p>
                      <p className="text-sm text-[var(--pf-text-secondary)]">${m.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length selector */}
              <div>
                <label className="block text-sm font-medium mb-3">Chain Length</label>
                <div className="grid grid-cols-4 gap-3">
                  {LENGTHS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLength(l.value)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        length === l.value
                          ? 'border-yellow-400 bg-yellow-400/5'
                          : 'border-[var(--pf-border)] hover:border-[var(--pf-text-secondary)]'
                      }`}
                    >
                      <p className="font-medium">{l.label}</p>
                      <p className="text-xs text-[var(--pf-text-secondary)]">{l.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-6 rounded-2xl bg-[var(--pf-bg)] border border-[var(--pf-border)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[var(--pf-text-secondary)]">Custom Name Chain</span>
                  <span className="font-bold text-xl">${price}</span>
                </div>
                <div className="space-y-2 text-sm text-[var(--pf-text-secondary)] mb-4">
                  <div className="flex justify-between">
                    <span>Metal</span>
                    <span>{metal.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chain length</span>
                    <span>{length}&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom text</span>
                    <span>{name.trim() || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-yellow-400">FREE</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!name.trim() || loading}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    !name.trim() || loading
                      ? 'bg-[var(--pf-surface)] text-[var(--pf-text-secondary)] cursor-not-allowed'
                      : 'bg-yellow-500 hover:bg-yellow-400 text-black'
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Add to Cart — ${price}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-[var(--pf-text-secondary)] mt-3">
                  Custom orders are final. Ships in 5–7 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <button
            onClick={() => setShowStory(!showStory)}
            className="w-full flex items-center justify-between mb-8"
          >
            <div className="text-left">
              <p className="text-sm uppercase tracking-widest text-yellow-400 mb-1">Why We Built This</p>
              <h2 className="text-3xl font-bold">The Story</h2>
            </div>
            <ChevronDown size={24} className={`transition-transform ${showStory ? 'rotate-180' : ''}`} />
          </button>

          {showStory && (
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  number: '01',
                  title: 'The Name Means Something',
                  body: 'Your name is your identity. It\'s the first thing people learn about you. It\'s what people call when they need you. We turned it into something you wear.',
                },
                {
                  number: '02',
                  title: 'Made to Last',
                  body: 'Not plated. Not hollow. We use solid sterling silver, 14K gold vermeil, or rose gold over sterling. The kind of chain that outlasts trends.',
                },
                {
                  number: '03',
                  title: 'Built for the Culture',
                  body: 'Designed in St. Louis. For the culture that made us. No middlemen, no markups, no compromises. Just your name, in metal.',
                },
              ].map(({ number, title, body }) => (
                <div key={number} className="p-6 rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-border)]">
                  <span className="text-4xl font-bold text-yellow-400/30">{number}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3">{title}</h3>
                  <p className="text-[var(--pf-text-secondary)]">{body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SIZE GUIDE */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-widest text-yellow-400 mb-8 text-center">Size Guide</p>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-end justify-between mb-8 px-4">
              {[{len: '16"', desc: 'Choker'}, {len: '18"', desc: 'Standard'}, {len: '20"', desc: 'Loose'}].map(({ len, desc }) => (
                <div key={len} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <div className={`h-0.5 bg-gray-400 rounded-full ${len === '16"' ? 'w-20' : len === '18"' ? 'w-24' : 'w-28'}`} />
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                  </div>
                  <p className="font-bold">{len}</p>
                  <p className="text-sm text-[var(--pf-text-secondary)]">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[var(--pf-surface)] rounded-2xl p-6 border border-[var(--pf-border)]">
              <p className="text-sm text-[var(--pf-text-secondary)]">
                <strong className="text-[var(--pf-text)]">How to measure:</strong> Use a string or measuring tape. Wrap it around your neck where you'd want the chain to sit. For a choker fit, go 16&quot;. For a standard fit, 18&quot; is the sweet spot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEES */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On all orders' },
              { icon: Shield, title: 'Solid Metal', desc: 'Not plated, not hollow' },
              { icon: RefreshCw, title: 'No Returns', desc: 'Custom orders are final' },
              { icon: Sparkles, title: 'Handcrafted', desc: 'Made to order' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--pf-surface)] flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-[var(--pf-text-secondary)]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h3 className="text-xl font-bold mb-6">More from Porterful</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/music"
              className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-yellow-400/50 transition-colors group">
              <div className="w-16 h-16 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
                  <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">Listen to O D Porter</p>
                <p className="text-sm text-[var(--pf-text-secondary)]">Stream Ambiguous and more</p>
              </div>
              <ArrowRight size={20} className="ml-auto text-[var(--pf-text-secondary)] group-hover:text-yellow-400" />
            </Link>

            <Link href="/music"
              className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-border)] hover:border-yellow-400/50 transition-colors group">
              <div className="w-16 h-16 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">"There It Is, Here It Go"</p>
                <p className="text-sm text-[var(--pf-text-secondary)]">The book by O D Porter — $25</p>
              </div>
              <ArrowRight size={20} className="ml-auto text-[var(--pf-text-secondary)] group-hover:text-yellow-400" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
