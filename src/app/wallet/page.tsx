'use client'

import { useState } from 'react'
import { useWallet, FUND_PACKAGES, centsToDollars } from '@/lib/wallet-context'
import { Wallet, ArrowLeft, CreditCard, Send, History, DollarSign, Gift } from 'lucide-react'
import Link from 'next/link'

export default function WalletPage() {
  const { balance, addFunds, formatBalance, isLoading } = useWallet()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async (pkg: typeof FUND_PACKAGES[0]) => {
    setIsProcessing(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            productId: `wallet-${pkg.id}`,
            name: `Wallet Credit: ${pkg.label}`,
            artist: 'Porterful',
            price: pkg.price,
            quantity: 1,
            type: 'wallet',
            image: '/logo.svg'
          }],
          successUrl: `/checkout/success?type=wallet&amount=${encodeURIComponent(pkg.label)}&session_id={CHECKOUT_SESSION_ID}`
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // No Stripe configured - show error
        alert('Payment system not configured. Please add Stripe keys to enable wallet funding.');
        setIsProcessing(false);
        setSelectedPackage(null);
      }
    } catch (err) {
      console.error('Purchase failed:', err);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--pf-bg)] text-[var(--pf-text)]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[var(--pf-orange)]/20 to-transparent pt-32 pb-8">
        <div className="pf-container">
          <Link href="/" className="flex items-center gap-2 text-[var(--pf-text-secondary)] hover:text-white mb-4">
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wallet className="text-[var(--pf-orange)]" />
            Wallet
          </h1>
          <p className="text-[var(--pf-text-secondary)] mt-1">
            Add funds to buy music and support artists
          </p>
        </div>
      </div>

      <div className="pf-container py-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[var(--pf-orange)] to-purple-600 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Available Balance</p>
              <p className="text-5xl font-bold">{isLoading ? '...' : formatBalance()}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <DollarSign size={32} className="text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-white/80 text-sm">
              Use your balance to purchase music, tip artists, and send to friends
            </p>
          </div>
        </div>

        {/* Add Funds */}
        <h2 className="text-xl font-bold mb-4">Add Funds</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {FUND_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                selectedPackage === pkg.id
                  ? 'border-[var(--pf-orange)] bg-[var(--pf-orange)]/10'
                  : 'border-[var(--pf-border)] bg-[var(--pf-surface)] hover:border-[var(--pf-orange)]/50'
              } ${pkg.id === 'popular' ? 'ring-2 ring-[var(--pf-orange)]' : ''}`}
            >
              {pkg.id === 'popular' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--pf-orange)] px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}
              {pkg.id === 'best' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 px-3 py-1 rounded-full text-xs font-semibold">
                  Best Value
                </div>
              )}
              <div className="text-3xl font-bold mb-1">${pkg.price.toFixed(2)}</div>
              {pkg.bonus > 0 && (
                <p className="text-green-400 text-sm mb-2">+ ${((pkg.bonus) / 100).toFixed(2)} bonus</p>
              )}
              <p className="text-[var(--pf-text-secondary)] text-sm">{pkg.description}</p>
            </button>
          ))}
        </div>

        {selectedPackage && (
          <div className="bg-[var(--pf-surface)] rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Complete Purchase</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[var(--pf-text-secondary)]">
                {FUND_PACKAGES.find(p => p.id === selectedPackage)?.label}
              </span>
              <span className="font-bold">
                ${FUND_PACKAGES.find(p => p.id === selectedPackage)?.price.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => handlePurchase(FUND_PACKAGES.find(p => p.id === selectedPackage)!)}
              disabled={isProcessing}
              className="w-full pf-btn pf-btn-primary flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                'Redirecting to payment...'
              ) : (
                <>
                  <CreditCard size={18} />
                  Pay ${FUND_PACKAGES.find(p => p.id === selectedPackage)?.price.toFixed(2)}
                </>
              )}
            </button>
          </div>
        )}

        {/* Send Money */}
        <h2 className="text-xl font-bold mb-4">Send Money</h2>
        <div className="bg-[var(--pf-surface)] rounded-xl p-6 mb-8">
          <p className="text-[var(--pf-text-secondary)] mb-4">
            Send money to other Porterful users instantly
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Recipient's email"
              className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--pf-orange)]"
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)]">$</span>
              <input
                type="number"
                placeholder="0.00"
                min="1"
                max={balance / 100}
                step="0.01"
                className="w-full bg-[var(--pf-bg)] border border-[var(--pf-border)] rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-[var(--pf-orange)]"
              />
            </div>
          </div>
          <button className="pf-btn pf-btn-primary mt-4 flex items-center gap-2">
            <Send size={18} />
            Send Money
          </button>
          <p className="text-sm text-[var(--pf-text-muted)] mt-2">
            Demo mode • Feature coming soon
          </p>
        </div>

        {/* How It Works */}
        <h2 className="text-xl font-bold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[var(--pf-surface)] rounded-xl p-6">
            <div className="w-12 h-12 bg-[var(--pf-orange)]/20 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="text-[var(--pf-orange)]" size={24} />
            </div>
            <h3 className="font-bold mb-2">1. Add Funds</h3>
            <p className="text-[var(--pf-text-secondary)] text-sm">
              Add money to your wallet with a credit card. No subscriptions.
            </p>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-6">
            <div className="w-12 h-12 bg-[var(--pf-orange)]/20 rounded-xl flex items-center justify-center mb-4">
              <Wallet className="text-[var(--pf-orange)]" size={24} />
            </div>
            <h3 className="font-bold mb-2">2. Use Your Balance</h3>
            <p className="text-[var(--pf-text-secondary)] text-sm">
              Spend on music, tip artists, or support creators you love.
            </p>
          </div>
          <div className="bg-[var(--pf-surface)] rounded-xl p-6">
            <div className="w-12 h-12 bg-[var(--pf-orange)]/20 rounded-xl flex items-center justify-center mb-4">
              <Gift className="text-[var(--pf-orange)]" size={24} />
            </div>
            <h3 className="font-bold mb-2">3. Send to Friends</h3>
            <p className="text-[var(--pf-text-secondary)] text-sm">
              Transfer funds to friends instantly. Share music together.
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <h2 className="text-xl font-bold mt-8 mb-4">Recent Activity</h2>
        <div className="bg-[var(--pf-surface)] rounded-xl p-4">
          <div className="text-center py-8 text-[var(--pf-text-muted)]">
            <History className="mx-auto mb-2" size={32} />
            <p>No transactions yet</p>
            <p className="text-sm mt-1">Add funds to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}