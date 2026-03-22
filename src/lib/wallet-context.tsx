'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  balance: number // in cents (100 = $1.00)
  addFunds: (amount: number) => void
  spendFunds: (amount: number) => boolean
  formatBalance: () => string
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0) // stored in cents
  const [isLoading, setIsLoading] = useState(true)

  // Load balance from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('porterful_balance')
    if (savedBalance) {
      setBalance(parseInt(savedBalance, 10))
    } else {
      // Give new users $1.00 to start
      setBalance(100) // 100 cents = $1.00
      localStorage.setItem('porterful_balance', '100')
    }
    setIsLoading(false)
  }, [])

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('porterful_balance', balance.toString())
    }
  }, [balance, isLoading])

  const addFunds = (amount: number) => {
    setBalance(prev => prev + amount)
  }

  const spendFunds = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount)
      return true
    }
    return false
  }

  const formatBalance = () => {
    const dollars = Math.floor(balance / 100)
    const cents = balance % 100
    return `$${dollars}.${cents.toString().padStart(2, '0')}`
  }

  return (
    <WalletContext.Provider value={{ balance, addFunds, spendFunds, formatBalance, isLoading }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Fund packages for purchase
export const FUND_PACKAGES = [
  { id: 'starter', amount: 500, price: 5.00, bonus: 0, label: '$5.00', description: 'Get started' },
  { id: 'basic', amount: 1000, price: 10.00, bonus: 100, label: '$10.50 value', description: '$10 + $0.50 bonus' },
  { id: 'popular', amount: 2500, price: 25.00, bonus: 500, label: '$30.00 value', description: '$25 + $5 bonus — Most Popular' },
  { id: 'best', amount: 5000, price: 50.00, bonus: 1500, label: '$65.00 value', description: '$50 + $15 bonus — Best Value' },
]

// Price conversion helpers
export function centsToDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}