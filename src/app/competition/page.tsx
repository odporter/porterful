'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Users, TrendingUp, Gift, Star, Zap, Crown, Target, Award, Lock, Unlock, CheckCircle2 } from 'lucide-react';

// Configuration
const MIN_ARTISTS = 50;
const CURRENT_ARTISTS = 8; // Mock - real count comes from Supabase
const COMPETITION_LAUNCH_DATE = new Date('2026-04-15'); // 20 days from now

// Tier system
const TIERS = [
  {
    name: 'Bronze',
    range: '$0 - $500',
    color: 'from-amber-600 to-amber-800',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    milestones: [
      { target: 100, bonus: 150, label: 'First to $100' },
      { target: 500, bonus: 250, label: 'First to $500' },
    ],
  },
  {
    name: 'Silver',
    range: '$500 - $5,000',
    color: 'from-gray-300 to-gray-500',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/30',
    milestones: [
      { target: 2500, bonus: 500, label: 'First to $2,500' },
      { target: 5000, bonus: 1000, label: 'First to $5,000' },
    ],
  },
  {
    name: 'Gold',
    range: '$5,000 - $25,000',
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    milestones: [
      { target: 10000, bonus: 2500, label: 'First to $10,000' },
      { target: 25000, bonus: 5000, label: 'First to $25,000' },
    ],
  },
  {
    name: 'Platinum',
    range: '$25,000+',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    milestones: [
      { target: 50000, bonus: 10000, label: 'First to $50,000' },
      { target: 100000, bonus: 25000, label: 'First to $100,000' },
    ],
  },
];

const FAQS = [
  {
    q: 'When does the competition start?',
    a: 'The competition launches when we hit 50 artists on the platform. We\'re currently at ' + CURRENT_ARTISTS + ' — join now to be ready when it starts!',
  },
  {
    q: 'How do I qualify?',
    a: 'Sign up as an artist, list your first product (music or merch), and start selling. Every sale counts toward your milestone.',
  },
  {
    q: 'How do tier resets work?',
    a: 'Once you hit a tier\'s cap (e.g., $500 in Bronze), you move to the next tier. Your milestone progress resets to $0 but you keep everything you earned.',
  },
  {
    q: 'When do I get paid?',
    a: 'Once you hit a milestone first, we verify your sales and send your bonus within 7 business days.',
  },
  {
    q: 'Does the prize come from the Prize Pool?',
    a: 'Yes. The Prize Pool accumulates from a small % of all platform sales. It\'s not taken from our profit — it\'s built from the community.',
  },
];

export default function CompetitionPage() {
  const [faqs, setFaqs] = useState(FAQS);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [artistCount, setArtistCount] = useState(CURRENT_ARTISTS);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const artistsNeeded = Math.max(0, MIN_ARTISTS - artistCount);
  const progressPercent = Math.min(100, (artistCount / MIN_ARTISTS) * 100);
  const competitionReady = artistCount >= MIN_ARTISTS;

  useEffect(() => {
    // Countdown to competition launch
    const interval = setInterval(() => {
      const now = new Date();
      const diff = competitionReady 
        ? 0 
        : COMPETITION_LAUNCH_DATE.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [competitionReady]);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNotifySubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--pf-bg)]">
      {/* Hero - Pre-Competition */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-[var(--pf-bg)] via-[var(--pf-bg-secondary)] to-[var(--pf-bg)]">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--pf-orange)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Competition Status Banner */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-8 ${competitionReady ? 'bg-green-500/20 border border-green-500/30 text-green-400' : 'bg-[var(--pf-orange)]/20 border border-[var(--pf-orange)]/30 text-[var(--pf-orange)]'}`}>
            {competitionReady ? (
              <>
                <Unlock size={18} />
                <span>Competition is LIVE!</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Competition launching soon</span>
              </>
            )}
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--pf-orange)] to-purple-500">
              $10,000
            </span>
            <br />
            Artist Competition
          </h1>
          
          <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto mb-8">
            {!competitionReady 
              ? `The competition launches when we hit ${MIN_ARTISTS} artists. Be one of the first to start selling when it begins.`
              : 'Be the first to hit a milestone and win bonus cash. The more you earn, the more you win.'
            }
          </p>

          {/* Artist Progress */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[var(--pf-text-secondary)]">Artists joined</span>
              <span className="font-bold">{artistCount} / {MIN_ARTISTS}</span>
            </div>
            <div className="h-4 bg-[var(--pf-surface)] rounded-full overflow-hidden border border-[var(--pf-border)]">
              <div 
                className="h-full bg-gradient-to-r from-[var(--pf-orange)] to-purple-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-[var(--pf-text-muted)] mt-2">
              {artistsNeeded > 0 ? `${artistsNeeded} more artists needed to unlock competition` : 'Competition unlocked!'}
            </p>
          </div>

          {/* Countdown */}
          {!competitionReady && (
            <div className="inline-flex items-center gap-4 bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl px-8 py-4 mb-8">
              <span className="text-[var(--pf-text-secondary)]">Estimated launch:</span>
              <div className="flex gap-3">
                {[
                  { val: timeLeft.days, label: 'Days' },
                  { val: timeLeft.hours, label: 'Hours' },
                  { val: timeLeft.mins, label: 'Mins' },
                  { val: timeLeft.secs, label: 'Secs' },
                ].map((t, i) => (
                  <div key={i} className="text-center min-w-[3rem]">
                    <div className="text-2xl font-bold text-[var(--pf-orange)]">{String(t.val).padStart(2, '0')}</div>
                    <div className="text-xs text-[var(--pf-text-muted)]">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup?role=artist" className="px-8 py-4 bg-[var(--pf-orange)] text-white rounded-xl font-bold text-lg hover:bg-[var(--pf-orange)]/90 transition-colors inline-flex items-center justify-center gap-2">
              <Star size={20} />
              {competitionReady ? 'Start Selling Now' : 'Get Early Access'}
            </Link>
            <Link href="#tiers" className="px-8 py-4 bg-[var(--pf-surface)] border border-[var(--pf-border)] text-white rounded-xl font-bold text-lg hover:bg-[var(--pf-surface-hover)] transition-colors inline-flex items-center justify-center gap-2">
              <Target size={20} />
              View Prize Tiers
            </Link>
          </div>

          {/* How it works quick */}
          {!competitionReady && (
            <div className="bg-[var(--pf-surface)]/50 rounded-xl p-6 max-w-xl mx-auto">
              <h3 className="font-bold mb-4">Here's how it works:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-green-400 mt-0.5 flex-shrink-0" size={18} />
                  <span>Join as an artist for free</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-green-400 mt-0.5 flex-shrink-0" size={18} />
                  <span>List your music or merch</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-green-400 mt-0.5 flex-shrink-0" size={18} />
                  <span>Start selling immediately</span>
                </div>
              </div>
              <p className="text-xs text-[var(--pf-text-muted)] mt-4">
                You'll be ready to compete the moment {MIN_ARTISTS} artists join. Early artists have the advantage.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Tiers Section */}
      <section id="tiers" className="py-16 md:py-24 bg-[var(--pf-bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prize <span className="text-[var(--pf-orange)]">Tiers</span>
            </h2>
            <p className="text-[var(--pf-text-secondary)] max-w-xl mx-auto">
              Compete within your tier based on your total earnings. Climb the ranks as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              <div 
                key={tier.name}
                className={`${tier.bgColor} rounded-2xl p-6 border ${tier.borderColor}`}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${tier.color} text-white mb-4`}>
                  {tier.name}
                </div>
                
                <div className="text-sm text-[var(--pf-text-muted)] mb-4">
                  Earnings: {tier.range}
                </div>

                <div className="space-y-4">
                  {tier.milestones.map((m, i) => (
                    <div key={i} className="bg-[var(--pf-bg)]/50 rounded-xl p-4">
                      <div className="text-sm text-[var(--pf-text-secondary)] mb-1">
                        {m.label}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--pf-text-muted)]">
                          ${m.target.toLocaleString()} earned
                        </span>
                        <span className={`font-bold ${tier.name === 'Bronze' ? 'text-green-400' : 'text-[var(--pf-orange)]'}`}>
                          +${m.bonus.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {tier.name !== 'Platinum' && (
                  <div className="mt-4 pt-4 border-t border-[var(--pf-border)]">
                    <p className="text-xs text-[var(--pf-text-muted)] flex items-center gap-1">
                      <TrendingUp size={12} />
                      Resets & moves to next tier after ${tier.milestones[tier.milestones.length - 1].target.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pool explanation */}
          <div className="mt-12 bg-gradient-to-r from-[var(--pf-orange)]/10 to-purple-500/10 rounded-2xl p-8 border border-[var(--pf-border)] max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center flex-shrink-0">
                <Gift className="text-[var(--pf-orange)]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Where does the prize money come from?</h3>
                <p className="text-[var(--pf-text-secondary)] text-sm">
                  <strong className="text-[var(--pf-orange)]">The Prize Pool.</strong> Every sale on Porterful contributes a small % to the pool. 
                  When you hit a milestone first, your bonus comes from that pool — not from our profits. 
                  The more everyone sells, the bigger the prizes grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Scenarios */}
      <section className="py-16 md:py-24 bg-[var(--pf-bg)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Example <span className="text-[var(--pf-orange)]">Winners</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-2xl">
                  🎤
                </div>
                <div>
                  <div className="font-bold">New Artist</div>
                  <div className="text-xs text-[var(--pf-text-muted)]">Bronze Tier</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--pf-text-muted)]">Sales earned:</span>
                  <span className="font-bold">$100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--pf-text-muted)]">Milestone hit:</span>
                  <span className="text-green-400">$100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--pf-text-muted)]">Bonus won:</span>
                  <span className="text-[var(--pf-orange)] font-bold">$150</span>
                </div>
                <div className="border-t border-[var(--pf-border)] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Total earned:</span>
                    <span className="font-bold text-green-400">$250</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-400/20 flex items-center justify-center text-2xl">
                  🎵
                </div>
                <div>
                  <div className="font-bold">Growing Artist</div>
                  <div className="text-xs text-[var(--pf-text-muted)]">Silver Tier</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--pf-text-muted)]">Sales earned:</span>
                  <span className="font-bold">$5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--pf-text-muted)]">Milestone hit:</span>
                  <span className="text-green-400">$5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--pf-text-muted)]">Bonus won:</span>
                  <span className="text-[var(--pf-orange)] font-bold">$1,000</span>
                </div>
                <div className="border-t border-[var(--pf-border)] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Total earned:</span>
                    <span className="font-bold text-green-400">$6,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
                  👑
                </div>
                <div>
                  <div className="font-bold">Top Artist</div>
                  <div className="text-xs text-[var(--pf-text-muted)]">Gold Tier</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--pf-text-muted)]">Sales earned:</span>
                  <span className="font-bold">$25,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--pf-text-muted)]">Milestone hit:</span>
                  <span className="text-green-400">$25,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--pf-text-muted)]">Bonus won:</span>
                  <span className="text-[var(--pf-orange)] font-bold">$5,000</span>
                </div>
                <div className="border-t border-[var(--pf-border)] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Total earned:</span>
                    <span className="font-bold text-green-400">$30,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[var(--pf-bg-secondary)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-[var(--pf-orange)]">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i}
                className="bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-xl overflow-hidden"
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

      {/* Notify Me CTA */}
      {!competitionReady && (
        <section className="py-16 md:py-24 bg-[var(--pf-bg)]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="bg-gradient-to-br from-[var(--pf-orange)]/20 to-purple-500/20 rounded-3xl p-8 md:p-12 border border-[var(--pf-border)]">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Be the First to Know When It Starts
              </h2>
              <p className="text-[var(--pf-text-secondary)] mb-8">
                Drop your email and we'll notify you the moment {MIN_ARTISTS} artists join. 
                Early birds get featured on our launch announcement.
              </p>
              
              {!notifySubmitted ? (
                <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-xl focus:outline-none focus:border-[var(--pf-orange)]"
                    required
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[var(--pf-orange)] text-white rounded-xl font-bold hover:bg-[var(--pf-orange)]/90 transition-colors"
                  >
                    Notify Me
                  </button>
                </form>
              ) : (
                <div className="bg-green-500/20 text-green-400 px-6 py-4 rounded-xl inline-flex items-center gap-2">
                  <CheckCircle2 size={20} />
                  <span>You're on the list! We'll email you when it launches.</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Live Competition CTA */}
      {competitionReady && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-[var(--pf-orange)] to-purple-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Competition is LIVE!
            </h2>
            <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
              Be the first to hit a milestone and claim your bonus. Every sale counts.
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
      )}

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
