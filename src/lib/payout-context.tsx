'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Tier definitions
export const PAYOUT_TIERS = {
  new: {
    name: 'New Artist',
    threshold: 0,
    payoutFrequency: 'Monthly',
    minimumPayout: 10,
    probationDays: 90,
    description: 'Monthly payouts after 30-day holding period. Minimum $10 to withdraw.',
  },
  growing: {
    name: 'Growing Artist',
    threshold: 100,
    payoutFrequency: 'Bi-weekly',
    minimumPayout: 0,
    probationDays: 0,
    description: 'Bi-weekly payouts with 14-day holding. No minimum withdrawal.',
  },
  established: {
    name: 'Established Artist',
    threshold: 500,
    payoutFrequency: 'Weekly',
    minimumPayout: 0,
    probationDays: 0,
    description: 'Weekly payouts with 7-day holding. Instant transfer available.',
  },
} as const

export type TierName = keyof typeof PAYOUT_TIERS

interface ArtistEarnings {
  artistId: string
  artistName: string
  totalSales: number
  totalPaidOut: number
  currentBalance: number
  tier: TierName
  payoutMethod: 'monthly' | 'biweekly' | 'weekly' | 'on_demand'
  minimumPayout: number
  probationEndsAt: Date | null
  nextPayoutDate: Date | null
  salesCount: number
  recentSales: Sale[]
  payoutHistory: Payout[]
}

interface Sale {
  id: string
  productId: string
  productName: string
  amount: number
  artistCut: number
  platformFee: number
  artistFundFee: number
  superfanFee: number
  status: 'pending' | 'completed' | 'refunded'
  payoutStatus: 'pending' | 'paid'
  saleDate: Date
}

interface Payout {
  id: string
  amount: number
  method: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  requestedAt: Date
  processedAt: Date | null
}

interface PayoutContextType {
  earnings: ArtistEarnings | null
  isLoading: boolean
  requestPayout: (amount: number) => Promise<void>
  refreshEarnings: () => Promise<void>
}

const PayoutContext = createContext<PayoutContextType | undefined>(undefined)

export function PayoutProvider({ children }: { children: ReactNode }) {
  const [earnings, setEarnings] = useState<ArtistEarnings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load earnings on mount (demo mode)
  useEffect(() => {
    // In production, this would fetch from Supabase
    // For demo, use localStorage
    const savedEarnings = localStorage.getItem('porterful_artist_earnings')
    if (savedEarnings) {
      setEarnings(JSON.parse(savedEarnings))
    } else {
      // Default demo data
      setEarnings({
        artistId: 'demo-artist',
        artistName: 'O D Porter',
        totalSales: 0,
        totalPaidOut: 0,
        currentBalance: 0,
        tier: 'new',
        payoutMethod: 'monthly',
        minimumPayout: 10,
        probationEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        nextPayoutDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        salesCount: 0,
        recentSales: [],
        payoutHistory: [],
      })
    }
    setIsLoading(false)
  }, [])

  // Save to localStorage when earnings change
  useEffect(() => {
    if (earnings) {
      localStorage.setItem('porterful_artist_earnings', JSON.stringify(earnings))
    }
  }, [earnings])

  const requestPayout = async (amount: number) => {
    if (!earnings) return
    
    if (amount < earnings.minimumPayout) {
      throw new Error(`Minimum payout is $${earnings.minimumPayout}`)
    }
    
    if (amount > earnings.currentBalance) {
      throw new Error('Insufficient balance')
    }
    
    // In production, this would create a payout request via API
    // For demo, just simulate it
    const newPayout: Payout = {
      id: `payout_${Date.now()}`,
      amount,
      method: 'bank_transfer',
      status: 'pending',
      requestedAt: new Date(),
      processedAt: null,
    }
    
    setEarnings(prev => prev ? {
      ...prev,
      currentBalance: prev.currentBalance - amount,
      totalPaidOut: prev.totalPaidOut + amount,
      payoutHistory: [newPayout, ...prev.payoutHistory],
    } : null)
  }

  const refreshEarnings = async () => {
    setIsLoading(true)
    // In production, fetch from Supabase
    // For demo, just reload from localStorage
    const savedEarnings = localStorage.getItem('porterful_artist_earnings')
    if (savedEarnings) {
      setEarnings(JSON.parse(savedEarnings))
    }
    setIsLoading(false)
  }

  return (
    <PayoutContext.Provider value={{ earnings, isLoading, requestPayout, refreshEarnings }}>
      {children}
    </PayoutContext.Provider>
  )
}

export function usePayout() {
  const context = useContext(PayoutContext)
  if (context === undefined) {
    throw new Error('usePayout must be used within a PayoutProvider')
  }
  return context
}

// Helper functions
export function getTierInfo(tier: TierName) {
  return PAYOUT_TIERS[tier]
}

export function calculateNextTier(currentTier: TierName, totalSales: number): TierName {
  if (totalSales >= 500) return 'established'
  if (totalSales >= 100) return 'growing'
  return 'new'
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}