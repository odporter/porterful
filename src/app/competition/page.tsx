'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, DollarSign, Users, TrendingUp, Gift, Star, Zap, Crown, Target, Award } from 'lucide-react';

// Mock data - in production this comes from Supabase
const PRIZES = [
  { milestone: '$100', bonus: '$100', achieved: false, winner: null },
  { milestone: '$500', bonus: '$250', achieved: false, winner: null },
  { milestone: '$1,000', bonus: '$500', achieved: false, winner: null },
  { milestone: '$5,000', bonus: '$2,000', achieved: false, winner: null },
  { milestone: '$10,000', bonus: '$5,000', achieved: false, winner: null },
];

const LEADERS = [
  { rank: 1, name: 'O D Porter', sales: 1847, avatar: '🎤', trend: '+23%', badge: '🔥 Hot' },
  { rank: 2, name: 'Rob Soul', sales: 892, avatar: '🎵', trend: '+45%', badge: '⭐ Rising' },
  { rank: 3, name: 'Gune', sales: 654, avatar: '🎬', trend: '+12%', badge: null },
  { rank: 4, name: 'ATM Trap', sales: 423, avatar: '💎', trend: '+67%', badge: '🚀 Launch' },
  { rank: 5, name: 'TTD Dex', sales: 298, avatar: '🎧', trend: '+8%', badge: null },
];

const FAQS = [
  {
    q: 'How do I enter?',
    a: 'Sign up as an artist on Porterful, list your first product (music or merch), and start selling. Every sale counts toward your milestone.',
  },
  {
    q: 'When do I get paid?',
    a: 'Once you hit a milestone, we verify your sales and send your bonus within 7 business days via PayPal or direct deposit.',
  },
  {
    q: 'Does my sales amount include fees?',
    a: 'Your total sales (before our 10% cut) is what counts. So if you sell $100 in products, you hit the $100 milestone.',
  },
  {
    q: 'Can I win multiple prizes?',
    a: 'Yes! Hit $100, then $500, then $1,000 — you win each bonus along the way.',
  },
  {
    q: 'What about Superfan prizes?',
    a: 'Top Superfan referrers win $500. The more your fans buy through your unique link, the higher you rank.',
  },
];

export default function CompetitionPage() {
  const [faqs, setFaqs] = useState(FAQS);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 0, mins: 0, secs: 0 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Countdown to competition end (30 days from now)
    const end = new Date();
    end.setDate(end.getDate() + 30);
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--pf-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-[var(--pf-bg)] via-[var(--pf-bg-secondary)] to-[var(--pf-bg)]">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--pf-orange)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pf-orange)]/20 border border-[var(--pf-orange)]/30 rounded-full text-[var(--pf-orange)] text-sm font-medium mb-8">
            <Trophy size={16} />
            <span>$10,000 Launch Prize Pool</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold mb-6">
            First Artists to Hit<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--pf-orange)] to-purple-500">
              Win Cash Bonuses
            </span>
          </h1>
          
          <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto mb-8">
            Sell your music and merch. Hit milestones. Win bonus cash. 
            The more you earn, the more we reward you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup?role=artist" className="px-8 py-4 bg-[var(--pf-orange)] text-white rounded-xl font-bold text-lg hover:bg-[var(--pf-orange)]/90 transition-colors inline-flex items-center justify-center gap-2">
              <Star size={20} />
              Start Selling Now
            </Link>
            <Link href="#leaderboard" className="px-8 py-4 bg-[var(--pf-surface)] border border-[var(--pf-border)] text-white rounded-xl font-bold text-lg hover:bg-[var(--pf-surface-hover)] transition-colors inline-flex items-center justify-center gap-2">
              <Target size={20} />
              View Leaderboard
            </Link>
          </div>

          {/* Countdown */}
          <div className="inline-flex items-center gap-4 bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl px-8 py-4">
            <span className="text-[var(--pf-text-secondary)]">Competition ends in:</span>
            <div className="flex gap-3">
              {[
                { val: timeLeft.days, label: 'Days' },
                { val: timeLeft.hours, label: 'Hours' },
                { val: timeLeft.mins, label: 'Mins' },
                { val: timeLeft.secs, label: 'Secs' },
              ].map((t, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-[var(--pf-orange)]">{String(t.val).padStart(2, '0')}</div>
                  <div className="text-xs text-[var(--pf-text-muted)]">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prize Tiers */}
      <section className="py-16 md:py-24 bg-[var(--pf-bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Milestone <span className="text-[var(--pf-orange)]">Prizes</span>
            </h2>
            <p className="text-[var(--pf-text-secondary)] max-w-xl mx-auto">
              Hit a milestone first? The cash bonus is yours. Stack them up.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-12">
            {PRIZES.map((prize, i) => (
              <div 
                key={i}
                className={`relative bg-[var(--pf-bg)] rounded-2xl p-6 border text-center transition-all ${
                  prize.achieved 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-[var(--pf-border)] hover:border-[var(--pf-orange)]'
                }`}
              >
                {i === 4 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--pf-orange)] to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    GRAND PRIZE
                  </div>
                )}
                <div className={`text-sm text-[var(--pf-text-muted)] mb-2 ${i === 4 ? 'mt-2' : ''}`}>
                  First to sell
                </div>
                <div className="text-3xl font-bold mb-2">{prize.milestone}</div>
                <div className="text-[var(--pf-orange)] font-bold text-xl mb-2">{prize.bonus}</div>
                <div className="text-xs text-[var(--pf-text-muted)]">bonus cash</div>
                {prize.achieved && prize.winner && (
                  <div className="mt-3 pt-3 border-t border-green-500/30 text-green-400 text-sm font-medium">
                    🎉 {prize.winner}
                  </div>
                )}
                {!prize.achieved && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--pf-bg)]/80 rounded-2xl">
                    <span className="text-[var(--pf-text-muted)] text-sm">Unclaimed</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bonus Prizes */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20">
              <Crown className="text-yellow-500 mb-4" size={32} />
              <div className="text-2xl font-bold mb-2">Top Artist</div>
              <div className="text-[var(--pf-orange)] font-bold text-xl mb-2">$1,000</div>
              <div className="text-sm text-[var(--pf-text-secondary)]">
                Most sales by end of launch month
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
              <Star className="text-purple-400 mb-4" size={32} />
              <div className="text-2xl font-bold mb-2">Top Superfan</div>
              <div className="text-[var(--pf-orange)] font-bold text-xl mb-2">$500</div>
              <div className="text-sm text-[var(--pf-text-secondary)]">
                Most successful referrals
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
              <Award className="text-blue-400 mb-4" size={32} />
              <div className="text-2xl font-bold mb-2">Most Supporters</div>
              <div className="text-[var(--pf-orange)] font-bold text-xl mb-2">$250</div>
              <div className="text-sm text-[var(--pf-text-secondary)]">
                Most unique buyers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-[var(--pf-bg)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How the <span className="text-[var(--pf-orange)]">Competition</span> Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, icon: Star, title: 'Sign Up', desc: 'Create your free artist account on Porterful' },
              { step: 2, icon: Upload, title: 'List Products', desc: 'Upload your music, merch, or both' },
              { step: 3, icon: DollarSign, title: 'Make Sales', desc: 'Fans buy directly from you through Porterful' },
              { step: 4, icon: Trophy, title: 'Hit Milestones', desc: 'Be first to reach a milestone and win bonus cash' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--pf-orange)]/10 flex items-center justify-center mx-auto mb-4 relative">
                  <item.icon className="text-[var(--pf-orange)]" size={28} />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--pf-orange)] text-white font-bold text-sm flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--pf-text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="py-16 md:py-24 bg-[var(--pf-bg-secondary)]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Live <span className="text-[var(--pf-orange)]">Leaderboard</span>
              </h2>
              <p className="text-[var(--pf-text-secondary)]">
                Top artists by total sales (updated hourly)
              </p>
            </div>
            <Link href="/signup?role=artist" className="px-4 py-2 bg-[var(--pf-orange)] text-white rounded-lg font-medium text-sm hover:bg-[var(--pf-orange)]/90 transition-colors">
              Join the Race
            </Link>
          </div>

          <div className="bg-[var(--pf-bg)] rounded-2xl border border-[var(--pf-border)] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[var(--pf-surface)] border-b border-[var(--pf-border)] text-sm font-medium text-[var(--pf-text-muted)]">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Artist</div>
              <div className="col-span-3 text-right">Sales</div>
              <div className="col-span-3 text-right">Trend</div>
            </div>
            
            {/* Rows */}
            {LEADERS.map((leader, i) => (
              <div 
                key={i}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-[var(--pf-border)] last:border-0 hover:bg-[var(--pf-surface)] transition-colors ${
                  i === 0 ? 'bg-[var(--pf-orange)]/5' : ''
                }`}
              >
                <div className="col-span-1 flex items-center">
                  {i === 0 && <Trophy className="text-yellow-500 mr-2" size={18} />}
                  <span className={`font-bold ${i === 0 ? 'text-yellow-500' : ''}`}>#{leader.rank}</span>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <span className="text-2xl">{leader.avatar}</span>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {leader.name}
                      {leader.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          leader.badge === '🔥 Hot' ? 'bg-red-500/20 text-red-400' :
                          leader.badge === '⭐ Rising' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {leader.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 text-right font-bold text-[var(--pf-orange)]">
                  ${leader.sales.toLocaleString()}
                </div>
                <div className="col-span-3 text-right">
                  <span className="text-green-400 text-sm font-medium">{leader.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/artists" className="text-[var(--pf-orange)] hover:underline text-sm">
              View all artists →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[var(--pf-bg)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-[var(--pf-orange)]">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-medium"
                >
                  {faq.q}
                  <span className={`transform transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-[var(--pf-text-secondary)]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[var(--pf-orange)] to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Winning?
          </h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            Join Porterful today. List your first product. Start climbing the leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?role=artist" className="px-8 py-4 bg-white text-[var(--pf-orange)] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2">
              <Zap size={20} />
              Start as Artist
            </Link>
            <Link href="/superfan" className="px-8 py-4 bg-white/10 text-white border border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2">
              <Users size={20} />
              Become a Superfan
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[var(--pf-bg)] border-t border-[var(--pf-border)]">
        <div className="max-w-6xl mx-auto px-6 text-center text-[var(--pf-text-muted)] text-sm">
          <p>© {new Date().getFullYear()} Porterful. The Artist Economy.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/terms" className="hover:text-[var(--pf-orange)]">Terms</Link>
            <Link href="/privacy" className="hover:text-[var(--pf-orange)]">Privacy</Link>
            <Link href="/faq" className="hover:text-[var(--pf-orange)]">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
