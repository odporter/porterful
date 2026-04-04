'use client'

import Link from 'next/link'
import { ArrowRight, Check, Music, DollarSign, Users, Zap, Headphones, Globe, Shield } from 'lucide-react'

const BENEFITS = [
  {
    icon: DollarSign,
    title: '80% on every sale',
    desc: 'More than any other platform. Your music, your price, your cut.',
  },
  {
    icon: Users,
    title: 'Direct fan relationships',
    desc: 'No algorithm. Fans find you through identity, not recommendation engines.',
  },
  {
    icon: Zap,
    title: 'Superfan referrals',
    desc: 'Your fans earn 3–8% bringing buyers to you. They become your promoters.',
  },
  {
    icon: Music,
    title: 'Merch + music together',
    desc: 'Sell tracks, albums, books, and custom products from one artist page.',
  },
]

const REVENUE_MODEL = [
  { label: 'Track sale', artistGets: '80%', porterful: '10%', superfan: '10%' },
  { label: 'Album sale', artistGets: '80%', porterful: '10%', superfan: '10%' },
  { label: 'Merch sale', artistGets: '67%', porterful: '10%', superfan: '10%' },
  { label: 'Book sale', artistGets: '80%', porterful: '10%', superfan: '10%' },
]

const PLATFORM_STATS = [
  { value: '80%', label: 'Artist revenue share' },
  { value: '100+', label: 'Tracks available' },
  { value: '3–8%', label: 'Superfan commission' },
  { value: '$0', label: 'To join' },
]

export default function ApplyPage() {
  return (
    <div className="min-h-screen pb-24">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--pf-orange)]/5 via-[var(--pf-bg)] to-[var(--pf-bg)]">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-3" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, var(--pf-orange) 0%, transparent 50%), radial-gradient(circle at 70% 50%, var(--pf-purple) 0%, transparent 50%)',
        }} />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/20 text-[var(--pf-orange)] text-sm font-medium mb-8">
            <Music size={14} />
            Porterful Music — Artist Applications
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your music.<br />
            <span className="text-[var(--pf-orange)]">Your terms.</span>
          </h1>

          <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto mb-10">
            Porterful is not a platform that takes from artists. It is a platform that artists own. Keep 80% on every sale. Build with your fans. No label. No middleman.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/apply/form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--pf-orange)] text-white font-bold rounded-full hover:bg-[var(--pf-orange-dark)] transition-colors text-lg"
            >
              Apply to Join <ArrowRight size={18} />
            </Link>
            <Link
              href="/music"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--pf-surface)] border border-[var(--pf-border)] text-[var(--pf-text-secondary)] font-medium rounded-full hover:border-[var(--pf-orange)]/40 hover:text-[var(--pf-text)] transition-colors"
            >
              See the Platform <Headphones size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* PLATFORM STATS */}
      <section className="border-y border-[var(--pf-border)]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-6 text-center">
            {PLATFORM_STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-[var(--pf-orange)] mb-1">{value}</p>
                <p className="text-sm text-[var(--pf-text-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)] mb-2">What artists get</p>
          <h2 className="text-3xl font-bold">Built for artists who build</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-6 rounded-2xl bg-[var(--pf-surface)] border border-[var(--pf-border)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--pf-orange)]/10 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-[var(--pf-orange)]" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-[var(--pf-text-secondary)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVENUE MODEL */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-[var(--pf-orange)] mb-2">How revenue works</p>
            <h2 className="text-3xl font-bold mb-3">The math is simple</h2>
            <p className="text-[var(--pf-text-secondary)] max-w-lg mx-auto">
              Every sale is split three ways: artist, platform, and the superfan who brought the buyer. Here is exactly how it breaks down.
            </p>
          </div>

          {/* Revenue table */}
          <div className="bg-[var(--pf-surface)] rounded-2xl border border-[var(--pf-border)] overflow-hidden mb-8">
            <div className="grid grid-cols-4 gap-4 p-4 bg-[var(--pf-bg)] border-b border-[var(--pf-border)]">
              <div className="text-sm font-medium text-[var(--pf-text-muted)]">Product</div>
              <div className="text-sm font-medium text-[var(--pf-orange)]">Artist</div>
              <div className="text-sm font-medium text-[var(--pf-text-muted)]">Porterful</div>
              <div className="text-sm font-medium text-[var(--pf-text-muted)]">Superfan</div>
            </div>
            {REVENUE_MODEL.map(({ label, artistGets, porterful, superfan }) => (
              <div key={label} className="grid grid-cols-4 gap-4 p-4 border-b border-[var(--pf-border)] last:border-0">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-sm font-bold text-[var(--pf-orange)]">{artistGets}</div>
                <div className="text-sm text-[var(--pf-text-secondary)]">{porterful}</div>
                <div className="text-sm text-[var(--pf-text-secondary)]">{superfan}</div>
              </div>
            ))}
          </div>

          <p className="text-sm text-[var(--pf-text-muted)] text-center">
            Superfan cut applies only when a purchase comes through a referral link. If there is no superfan referral, the artist keeps 90% and Porterful takes 10%.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What happens after you apply</h2>
            <p className="text-[var(--pf-text-secondary)]">We review every application personally. Here's the process.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Apply', desc: 'Fill out the application. Takes about 5 minutes.' },
              { step: '02', title: 'Review', desc: 'Our team reviews within 24–48 hours.' },
              { step: '03', title: 'Onboard', desc: 'We set up your artist page and configure your account.' },
              { step: '04', title: 'Launch', desc: 'Your page goes live. You start earning.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative text-center p-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-[var(--pf-text-secondary)]">{desc}</p>
                {step !== '04' && (
                  <div className="hidden md:block absolute top-[calc(50%-12px)] right-0 translate-x-1/2 w-8 border-t border-dashed border-[var(--pf-border)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--pf-border)]">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/20 text-[var(--pf-orange)] text-sm font-medium mb-6">
            <Shield size={14} />
            Selective but open
          </div>

          <h2 className="text-4xl font-bold mb-4">Ready to own your revenue?</h2>
          <p className="text-xl text-[var(--pf-text-secondary)] max-w-xl mx-auto mb-10">
            Join artists who are building on Porterful. No upfront cost. No label. Just your music and your terms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply/form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--pf-orange)] text-white font-bold rounded-full hover:bg-[var(--pf-orange-dark)] transition-colors text-lg"
            >
              Start Application <ArrowRight size={18} />
            </Link>
            <Link
              href="/music"
              className="inline-flex items-center gap-2 px-6 py-3 text-[var(--pf-text-secondary)] hover:text-[var(--pf-text)] transition-colors"
            >
              Listen to O D Porter first <Globe size={16} />
            </Link>
          </div>

          <p className="text-sm text-[var(--pf-text-muted)] mt-8">
            Questions?{" "}
            <Link href="/contact" className="text-[var(--pf-orange)] hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </section>

    </div>
  )
}
