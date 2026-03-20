import Link from 'next/link'
import { 
  Play, Headphones, Users, TrendingUp, ArrowRight, Zap, Music, 
  ShoppingBag, Store, Building2, Heart, Sparkles, ChevronRight,
  Star, Share2, Wallet, Target, Gift
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,0,0.2)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="relative z-10 pf-container text-center pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pf-orange)]/10 border border-[var(--pf-orange)]/30 rounded-full text-[var(--pf-orange)] text-sm font-medium mb-8 animate-fade-in">
            <Sparkles size={16} />
            <span>The Artist Economy</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
            Where Artists
            <br />
            <span className="text-[var(--pf-orange)]">Own Everything.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[var(--pf-text-secondary)] max-w-3xl mx-auto mb-10 leading-relaxed">
            Music. Merch. Marketplace. Every purchase — even toothpaste — 
            sends <span className="text-[var(--pf-orange)] font-semibold">real money</span> to artists.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/shop" className="pf-btn pf-btn-primary text-lg px-10 py-5 group">
              Explore Marketplace
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="/artists" className="pf-btn pf-btn-secondary text-lg px-10 py-5">
              <Music className="inline mr-2" size={20} />
              Browse Artists
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--pf-text-muted)] mb-16">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              847 Artists
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              12,400 Products
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              $2.4M to Artists
            </span>
          </div>
          
          {/* Revenue Flow Preview */}
          <div className="bg-[var(--pf-surface)]/50 backdrop-blur-sm border border-[var(--pf-border)] rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-sm text-[var(--pf-text-muted)] mb-3">How revenue flows:</p>
            <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
              <span className="px-3 py-1 bg-[var(--pf-orange)]/20 text-[var(--pf-orange)] rounded-full">You buy $10</span>
              <ChevronRight className="text-[var(--pf-text-muted)]" size={16} />
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">$7 → Seller</span>
              <ChevronRight className="text-[var(--pf-text-muted)]" size={16} />
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">$2 → Artist Fund</span>
              <ChevronRight className="text-[var(--pf-text-muted)]" size={16} />
              <span className="px-3 py-1 bg-[var(--pf-surface)] border border-[var(--pf-border)] rounded-full">$1 → Platform</span>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[var(--pf-text-muted)] rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-[var(--pf-text-muted)] rounded-full" />
          </div>
        </div>
      </section>

      {/* Three-Sided Marketplace */}
      <section className="py-24 bg-[var(--pf-bg-secondary)]">
        <div className="pf-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Three Worlds. One Economy.</h2>
            <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto">
              Artists, businesses, and brands — all connected. Every transaction benefits creators.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Artists */}
            <div className="pf-card p-8 text-center group hover:border-[var(--pf-orange)]/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--pf-orange)] to-[var(--pf-orange-dark)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Artists</h3>
              <p className="text-[var(--pf-text-secondary)] mb-6">
                Upload music, sell merch, create radio stations. Set monthly goals. 
                Fans see progress. You get paid from <span className="text-[var(--pf-orange)]">every marketplace sale</span>.
              </p>
              <ul className="text-left text-sm space-y-2 text-[var(--pf-text-muted)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--pf-orange)]" />
                  Custom artist page + store
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--pf-orange)]" />
                  Proud to Pay pricing tiers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--pf-orange)]" />
                  Radio station + queue
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--pf-orange)]" />
                  85% of your merch sales
                </li>
              </ul>
              <Link href="/signup?role=artist" className="mt-6 inline-flex items-center gap-2 text-[var(--pf-orange)] hover:underline">
                Apply as Artist <ArrowRight size={16} />
              </Link>
            </div>
            
            {/* Small Businesses */}
            <div className="pf-card p-8 text-center group hover:border-blue-500/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Store size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Small Businesses</h3>
              <p className="text-[var(--pf-text-secondary)] mb-6">
                List products, reach music fans authentically. Partner with artists for co-branded drops. 
                Every sale shares revenue with the artist community.
              </p>
              <ul className="text-left text-sm space-y-2 text-[var(--pf-text-muted)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Product marketplace access
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Artist collaboration requests
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Built-in music fan audience
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  65-70% of your sales
                </li>
              </ul>
              <Link href="/signup?role=business" className="mt-6 inline-flex items-center gap-2 text-blue-400 hover:underline">
                List Your Products <ArrowRight size={16} />
              </Link>
            </div>
            
            {/* Brands */}
            <div className="pf-card p-8 text-center group hover:border-purple-500/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Brands</h3>
              <p className="text-[var(--pf-text-secondary)] mb-6">
                Sponsor artists. Create co-branded drops. Reach engaged audiences authentically. 
                Analytics on music + commerce crossover.
              </p>
              <ul className="text-left text-sm space-y-2 text-[var(--pf-text-muted)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Artist sponsorship marketplace
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Co-branded product drops
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Targeted campaigns
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Cross-purchase analytics
                </li>
              </ul>
              <Link href="/signup?role=brand" className="mt-6 inline-flex items-center gap-2 text-purple-400 hover:underline">
                Partner With Us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Proud to Pay */}
      <section className="py-24">
        <div className="pf-container">
          <div className="text-center mb-12">
            <span className="pf-badge pf-badge-orange mb-4">💜 PROUD TO PAY</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Pay What You Want. Support Who You Want.</h2>
            <p className="text-[var(--pf-text-secondary)] max-w-2xl mx-auto text-lg">
              Music isn't free. It costs time, energy, and love. Choose how much you value it.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="pf-card p-8 text-center hover:border-[var(--pf-orange)]/50 hover:-translate-y-1 transition-all">
              <p className="text-sm text-[var(--pf-text-muted)] uppercase tracking-wider mb-3">Listener</p>
              <p className="text-4xl font-bold text-[var(--pf-orange)] mb-2">$1</p>
              <p className="text-[var(--pf-text-secondary)] text-sm mb-4">Stream minimum</p>
              <p className="text-xs text-[var(--pf-text-muted)]">Full access to music</p>
            </div>
            <div className="pf-card p-8 text-center hover:border-[var(--pf-orange)]/50 hover:-translate-y-1 transition-all">
              <p className="text-sm text-[var(--pf-text-muted)] uppercase tracking-wider mb-3">Supporter</p>
              <p className="text-4xl font-bold text-[var(--pf-orange)] mb-2">$5</p>
              <p className="text-[var(--pf-text-secondary)] text-sm mb-4">Support tier</p>
              <p className="text-xs text-[var(--pf-text-muted)]">+1 bonus track</p>
            </div>
            <div className="pf-card p-8 text-center hover:border-[var(--pf-orange)]/50 hover:-translate-y-1 transition-all border-[var(--pf-orange)]/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--pf-orange)] text-white text-xs font-bold rounded-full">
                POPULAR
              </div>
              <p className="text-sm text-[var(--pf-text-muted)] uppercase tracking-wider mb-3">Champion</p>
              <p className="text-4xl font-bold text-[var(--pf-orange)] mb-2">$10</p>
              <p className="text-[var(--pf-text-secondary)] text-sm mb-4">Invest tier</p>
              <p className="text-xs text-[var(--pf-text-muted)]">Name in credits</p>
            </div>
            <div className="pf-card p-8 text-center hover:border-[var(--pf-orange)]/50 hover:-translate-y-1 transition-all">
              <p className="text-sm text-[var(--pf-text-muted)] uppercase tracking-wider mb-3">Patron</p>
              <p className="text-4xl font-bold text-[var(--pf-orange)] mb-2">$20+</p>
              <p className="text-[var(--pf-text-secondary)] text-sm mb-4">Superfan tier</p>
              <p className="text-xs text-[var(--pf-text-muted)]">Early access + merch</p>
            </div>
          </div>
          
          <p className="text-center text-[var(--pf-text-muted)] italic mt-8">
            "The best platforms aren't free. They're funded by people who believe." — Porterful
          </p>
          
          <div className="text-center mt-8">
            <Link href="/support" className="pf-btn pf-btn-primary">
              <Star className="inline mr-2" size={18} />
              Find Artists to Support
            </Link>
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section className="py-24 bg-[var(--pf-bg-secondary)]">
        <div className="pf-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Marketplace</h2>
              <p className="text-[var(--pf-text-secondary)]">Every purchase supports an artist</p>
            </div>
            <Link href="/shop" className="pf-btn pf-btn-secondary hidden md:flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Featured Products */}
            {[
              { name: 'Ambiguous Tour Tee', price: 25, category: 'artist', emoji: '👕', artist: 'O D' },
              { name: 'Premium Toothpaste', price: 8.99, category: 'essentials', emoji: '🪥', artist: 'O D' },
              { name: 'Wireless Earbuds', price: 49.99, category: 'trending', emoji: '🎧', artist: 'O D' },
              { name: 'Ambiguous EP Digital', price: 5, category: 'artist', emoji: '💿', artist: 'O D' },
              { name: 'Bottled Water (24pk)', price: 8.99, category: 'essentials', emoji: '💧', artist: 'O D' },
              { name: 'Phone Charger Cable', price: 15.99, category: 'trending', emoji: '🔌', artist: 'O D' },
              { name: 'Signed Vinyl', price: 50, category: 'artist', emoji: '📀', artist: 'O D' },
              { name: 'Hand Soap Refill', price: 9.99, category: 'essentials', emoji: '🧼', artist: 'O D' },
            ].map((product, i) => (
              <div key={i} className="pf-card group overflow-hidden">
                <div className="aspect-square bg-[var(--pf-bg-tertiary)] flex items-center justify-center text-5xl relative">
                  {product.emoji}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--pf-bg)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-[var(--pf-orange)] uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-[var(--pf-text-muted)] mb-2">
                    Supports: <span className="text-[var(--pf-orange)]">{product.artist}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price}</span>
                    <button className="p-2 rounded-lg bg-[var(--pf-orange)] hover:bg-[var(--pf-orange-light)] transition-colors">
                      <ShoppingBag size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop" className="pf-btn pf-btn-secondary">
              View All Products <ArrowRight className="inline ml-2" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="pf-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-[var(--pf-text-secondary)]">
              Simple for artists. Powerful for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-[var(--pf-orange)]">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Artists Sign Up</h3>
              <p className="text-[var(--pf-text-secondary)]">
                Create your profile, upload music, set goals. Your store is ready in minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-[var(--pf-orange)]">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Fans Choose Artists</h3>
              <p className="text-[var(--pf-text-secondary)]">
                Every purchase shows which artist benefits. Fans feel good about buying anything.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-[var(--pf-orange)]">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Artists Get Paid</h3>
              <p className="text-[var(--pf-text-secondary)]">
                Monthly direct deposit. Transparent analytics. No streaming pennies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Goal Preview */}
      <section className="py-24 bg-[var(--pf-bg-secondary)]">
        <div className="pf-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="pf-badge pf-badge-orange mb-4">🎯 ARTIST GOALS</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Fans See Your Progress</h2>
              <p className="text-[var(--pf-text-secondary)] mb-6 text-lg">
                Set a monthly earnings goal. Your supporters see how close you are. 
                It's not begging — it's transparent community building.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Zap size={20} className="text-[var(--pf-orange)]" />
                  <span>Set custom monthly target</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users size={20} className="text-[var(--pf-orange)]" />
                  <span>Supporters see real-time progress</span>
                </li>
                <li className="flex items-center gap-3">
                  <Heart size={20} className="text-[var(--pf-orange)]" />
                  <span>Build loyal fanbase with transparency</span>
                </li>
              </ul>
              <Link href="/signup?role=artist" className="pf-btn pf-btn-primary">
                Set Your Goal <ArrowRight className="inline ml-2" size={16} />
              </Link>
            </div>
            
            <div className="pf-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-[var(--pf-orange)] flex items-center justify-center text-3xl">
                  🎤
                </div>
                <div>
                  <h4 className="text-xl font-bold">O D Music</h4>
                  <p className="text-[var(--pf-text-muted)]">Hip-Hop / R&B</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--pf-text-secondary)]">March Goal</span>
                  <span className="font-bold">$1,847 / $2,500</span>
                </div>
                <div className="h-3 bg-[var(--pf-border)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[var(--pf-orange)] to-[var(--pf-orange-light)] rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
              <div className="flex justify-between text-sm text-[var(--pf-text-muted)]">
                <span>312 supporters this month</span>
                <span className="text-[var(--pf-orange)]">74% funded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Superfan Program */}
      <section className="py-24">
        <div className="pf-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="pf-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-3xl">
                      <Star className="text-white" size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Superfan Dashboard</h4>
                      <p className="text-[var(--pf-text-muted)]">Your earnings at a glance</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[var(--pf-bg)] rounded-lg p-4">
                      <p className="text-xs text-[var(--pf-text-muted)] uppercase mb-1">This Month</p>
                      <p className="text-2xl font-bold text-purple-400">$847</p>
                    </div>
                    <div className="bg-[var(--pf-bg)] rounded-lg p-4">
                      <p className="text-xs text-[var(--pf-text-muted)] uppercase mb-1">Referrals</p>
                      <p className="text-2xl font-bold text-purple-400">142</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[var(--pf-bg)] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--pf-orange)] flex items-center justify-center">🎤</div>
                        <div>
                          <p className="font-medium">O D Music t-shirt</p>
                          <p className="text-xs text-[var(--pf-text-muted)]">via your link</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-semibold">+$1.25</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[var(--pf-bg)] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">🪥</div>
                        <div>
                          <p className="font-medium">Toothpaste (marketplace)</p>
                          <p className="text-xs text-[var(--pf-text-muted)]">via your link</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-semibold">+$0.30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium mb-6">
                <Star size={16} />
                SUPERFAN PROGRAM
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Fans Earn Too
              </h2>
              <p className="text-[var(--pf-text-secondary)] mb-6 text-lg">
                Become a Superfan. Share artist links. Earn from every sale. 
                Build wealth while supporting the music you love.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Share2 className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Share Your Link</p>
                    <p className="text-sm text-[var(--pf-text-muted)]">Get a unique referral code. Post it anywhere.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Wallet className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Earn on Every Sale</p>
                    <p className="text-sm text-[var(--pf-text-muted)]">Artist merch: 5%. Marketplace: 3%. Premium: 10%.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Target className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Climb the Tiers</p>
                    <p className="text-sm text-[var(--pf-text-muted)]">More referrals = higher rate = more earnings.</p>
                  </div>
                </div>
              </div>
              <Link href="/signup?role=superfan" className="pf-btn pf-btn-primary bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400">
                Become a Superfan <ArrowRight className="inline ml-2" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Retirement */}
      <section className="py-24 bg-gradient-to-b from-[var(--pf-bg-secondary)] to-[var(--pf-bg)]">
        <div className="pf-container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
              <Gift size={16} />
              THE RETIREMENT PLAN
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              There's No 401(k) for Artists
            </h2>
            <p className="text-xl text-[var(--pf-text-secondary)] max-w-3xl mx-auto">
              No pension. No benefits. Just streaming pennies that don't add up.
              <span className="text-[var(--pf-orange)]"> Until now.</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="pf-card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-3xl">💸</span>
              </div>
              <h3 className="text-xl font-bold mb-2">The Problem</h3>
              <p className="text-[var(--pf-text-secondary)]">
                Spotify pays $0.003/stream. Local artists don't get royalties. 
                No retirement plan exists for creators.
              </p>
            </div>
            <div className="pf-card p-8 text-center border-[var(--pf-orange)]/30">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center">
                <span className="text-3xl">🏗️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">The Solution</h3>
              <p className="text-[var(--pf-text-secondary)]">
                Build superfans who promote for you. Every referral earns you both. 
                Your network becomes your retirement.
              </p>
            </div>
            <div className="pf-card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-bold mb-2">The Result</h3>
              <p className="text-[var(--pf-text-secondary)]">
                100 superfans × $100/month = $20,400/year. 
                Compounds over time. This IS retirement.
              </p>
            </div>
          </div>
          
          <div className="pf-card p-8 bg-[var(--pf-orange)]/5 border-[var(--pf-orange)]/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">The Math</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-medium">You recruit superfans</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">They sign up with your referral link</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-medium">They promote your music</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">Share links, drive sales, spread the word</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-medium">You both earn</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">Every sale: artist gets % + superfan gets %</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[var(--pf-orange)]/20 flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <p className="font-medium">It compounds</p>
                      <p className="text-sm text-[var(--pf-text-muted)]">Superfans recruit more superfans = passive income</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-[var(--pf-text-muted)] uppercase tracking-wider mb-2">Potential Monthly Income</p>
                <p className="text-5xl font-bold text-[var(--pf-orange)] mb-4">$20K+</p>
                <p className="text-[var(--pf-text-secondary)]">with 100 active superfans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="pf-container">
          <div className="pf-card p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.15)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">The Artist Economy Starts Here</h2>
              <p className="text-xl text-[var(--pf-text-secondary)] max-w-2xl mx-auto mb-10">
                Artists earn from everything. Fans earn from sharing. Businesses reach music lovers. 
                This is how it should work.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup?role=artist" className="pf-btn pf-btn-primary text-lg px-10 py-5">
                  Join as Artist
                  <ArrowRight className="inline ml-2" size={20} />
                </Link>
                <Link href="/signup?role=superfan" className="pf-btn pf-btn-secondary text-lg px-10 py-5">
                  Become a Superfan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--pf-border)]">
        <div className="pf-container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--pf-orange)] to-[var(--pf-orange-dark)] flex items-center justify-center">
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <rect x="55" y="45" width="15" height="110" rx="4" fill="white" />
                    <rect x="78" y="60" width="55" height="12" rx="3" fill="white" />
                    <rect x="78" y="82" width="40" height="12" rx="3" fill="white" />
                    <rect x="78" y="104" width="55" height="12" rx="3" fill="white" />
                    <rect x="78" y="126" width="28" height="12" rx="3" fill="white" />
                  </svg>
                </div>
                <span className="font-bold text-xl">PORTERFUL</span>
              </div>
              <p className="text-[var(--pf-text-muted)] text-sm">
                The artist economy. Every purchase supports creators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-[var(--pf-text-secondary)]">
                <li><Link href="/artists" className="hover:text-[var(--pf-orange)]">Artists</Link></li>
                <li><Link href="/shop" className="hover:text-[var(--pf-orange)]">Marketplace</Link></li>
                <li><Link href="/radio" className="hover:text-[var(--pf-orange)]">Radio</Link></li>
                <li><Link href="/trending" className="hover:text-[var(--pf-orange)]">Trending</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">For Creators</h4>
              <ul className="space-y-2 text-sm text-[var(--pf-text-secondary)]">
                <li><Link href="/signup?role=artist" className="hover:text-[var(--pf-orange)]">Artist Sign Up</Link></li>
                <li><Link href="/signup?role=business" className="hover:text-[var(--pf-orange)]">Business Sign Up</Link></li>
                <li><Link href="/goals" className="hover:text-[var(--pf-orange)]">Goals Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-[var(--pf-text-secondary)]">
                <li><Link href="/about" className="hover:text-[var(--pf-orange)]">About</Link></li>
                <li><Link href="/blog" className="hover:text-[var(--pf-orange)]">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-[var(--pf-orange)]">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--pf-orange)]">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--pf-border)]">
            <p className="text-[var(--pf-text-muted)] text-sm">
              © 2026 Porterful. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--pf-text-muted)]">
              <Link href="/privacy" className="hover:text-[var(--pf-orange)]">Privacy</Link>
              <Link href="/terms" className="hover:text-[var(--pf-orange)]">Terms</Link>
              <Link href="/shipping" className="hover:text-[var(--pf-orange)]">Shipping</Link>
              <Link href="/refunds" className="hover:text-[var(--pf-orange)]">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}