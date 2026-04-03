'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, Users, TrendingUp, Gift, ArrowRight, Check, ChevronRight, Crown } from 'lucide-react'

const SUPERFAN_TIERS = [
  {
    name: 'Listener',
    emoji: '🎧',
    requirement: 'Sign up & share',
    reward: '3% on all referrals',
    color: 'from-gray-400 to-gray-500',
    border: 'border-gray-500/30',
    textColor: 'text-gray-300',
    perks: [
      'Unique referral link',
      '3% commission on referrals',
      'Supporter badge on artist pages',
      'Early access to new releases',
    ],
  },
  {
    name: 'Advocate',
    emoji: '🔥',
    requirement: '5 successful referrals',
    reward: '5% on all referrals',
    color: 'from-[var(--pf-orange)] to-orange-600',
    border: 'border-[var(--pf-orange)]/30',
    textColor: 'text-[var(--pf-orange)]',
    perks: [
      'Everything in Listener',
      '5% commission on referrals',
      'Featured on artist pages',
      'Exclusive Discord role',
      'Behind-the-scenes content',
    ],
  },
  {
    name: 'Legend',
    emoji: '👑',
    requirement: '20+ successful referrals',
    reward: '8% on all referrals',
    color: 'from-yellow-400 to-amber-500',
    border: 'border-yellow-400/30',
    textColor: 'text-yellow-400',
    perks: [
      'Everything in Advocate',
      '8% commission on referrals',
      'Monthly payout',
      'Direct artist connection',
      'Exclusive Legend events',
      'Custom badge + portfolio',
    ],
  },
]

const FAQS = [
  {
    q: 'How do I become a Superfan?',
    a: 'Sign up through any artist\'s page, or join directly from the Superfan section. No purchase required — just share your link and start earning.',
  },
  {
    q: 'When do I get paid?',
    a: 'Commissions are calculated monthly and paid out when your balance reaches $25. Payouts go directly to your wallet or Stripe.',
  },
  {
    q: 'What counts as a successful referral?',
    a: 'Anyone who clicks your link and makes a purchase within 30 days. They don\'t need to create an account — just buy.',
  },
  {
    q: 'Does it cost anything to join?',
    a: 'Nothing. Superfan is free to join. We make money when your referrals buy, so we want you to succeed.',
  },
  {
    q: 'Can I be a Superfan for multiple artists?',
    a: 'Yes. Your referral link is tied to your account — when someone buys from any artist through your link, you earn.',
  },
]

export default function SuperfanPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="pf-container max-w-5xl">

        {/* Hero */}
        <section className="text-center py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/20 text-[var(--pf-orange)] text-sm font-medium mb-6">
            <Crown size={14} />
            Earn while you support
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Become a <span className="text-[var(--pf-orange)]">Superfan</span>
          </h1>
          <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto mb-8">
            Not just a fan. A partner. Share music you love, earn commissions on every purchase your referrals make — 80% always goes to the artist.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/apply" className="pf-btn pf-btn-primary inline-flex items-center gap-2">
              Start Earning <ArrowRight size={18} />
            </Link>
            <Link href="/music" className="pf-btn pf-btn-secondary inline-flex items-center gap-2">
              Listen First <ChevronRight size={18} />
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-4 mb-16">
          {[
            { label: 'Active Superfans', value: '340+', icon: Users },
            { label: 'Paid to Superfans', value: '$12,400', icon: Gift },
            { label: 'Avg. Commission', value: '4.2%', icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[var(--pf-surface)] rounded-2xl p-6 border border-[var(--pf-border)] text-center">
              <Icon size={24} className="text-[var(--pf-orange)] mx-auto mb-3" />
              <p className="text-3xl font-bold mb-1">{value}</p>
              <p className="text-sm text-[var(--pf-text-secondary)]">{label}</p>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Get Your Link',
                desc: 'Sign up and get a unique referral link tied to your account. Share it with anyone who loves music.',
                color: 'from-orange-500 to-red-600',
              },
              {
                step: '02',
                title: 'They Buy Through You',
                desc: 'When someone clicks your link and purchases music, merch, or any product — it\'s tracked to you.',
                color: 'from-purple-500 to-pink-600',
              },
              {
                step: '03',
                title: 'You Earn Automatically',
                desc: 'Commissions are calculated in real time. Cash out monthly when you hit $25. Artist always gets 80%.',
                color: 'from-green-500 to-emerald-600',
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="relative bg-[var(--pf-surface)] rounded-2xl p-6 border border-[var(--pf-border)]">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} text-white font-bold text-sm mb-4`}>
                  {step}
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-[var(--pf-text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tiers */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-2">Superfan Tiers</h2>
          <p className="text-[var(--pf-text-secondary)] text-center mb-8">Climb the ranks. Earn more. The more you refer, the higher your tier.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {SUPERFAN_TIERS.map((tier) => (
              <div key={tier.name} className={`rounded-2xl border ${tier.border} bg-[var(--pf-surface)] overflow-hidden`}>
                <div className={`bg-gradient-to-br ${tier.color} p-6 text-white`}>
                  <div className="text-3xl mb-2">{tier.emoji}</div>
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="text-sm opacity-80 mt-1">{tier.requirement}</p>
                </div>
                <div className="p-6">
                  <p className={`text-2xl font-bold ${tier.textColor} mb-4`}>{tier.reward}</p>
                  <ul className="space-y-3">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-[var(--pf-orange)] shrink-0 mt-0.5" />
                        <span className="text-[var(--pf-text-secondary)]">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/apply"
                    className={`mt-6 w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-br ${tier.color} text-white hover:opacity-90 transition-opacity`}
                  >
                    Join {tier.name} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Questions</h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[var(--pf-surface)] rounded-xl border border-[var(--pf-border)] overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronRight size={18} className={`text-[var(--pf-text-muted)] shrink-0 transition-transform ${activeFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 text-sm text-[var(--pf-text-secondary)] border-t border-[var(--pf-border)] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-br from-[var(--pf-orange)]/10 to-purple-600/10 rounded-2xl p-12 border border-[var(--pf-orange)]/20">
          <Star size={48} className="text-[var(--pf-orange)] mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Ready to become a Superfan?</h2>
          <p className="text-[var(--pf-text-secondary)] mb-8 max-w-lg mx-auto">
            Free to join. No purchase required. Start sharing music you love and earning automatically.
          </p>
          <Link href="/apply" className="pf-btn pf-btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
            Get Your Referral Link <ArrowRight size={20} />
          </Link>
        </section>

      </div>
    </div>
  )
}
