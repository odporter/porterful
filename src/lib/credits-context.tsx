'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CreditsContextType {
  credits: number
  addCredits: (amount: number) => void
  spendCredits: (amount: number) => boolean
  isLoading: boolean
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load credits from localStorage on mount
  useEffect(() => {
    const savedCredits = localStorage.getItem('porterful_credits')
    if (savedCredits) {
      setCredits(parseInt(savedCredits, 10))
    } else {
      // Give new users 100 credits (worth $1)
      setCredits(100)
      localStorage.setItem('porterful_credits', '100')
    }
    setIsLoading(false)
  }, [])

  // Save credits to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('porterful_credits', credits.toString())
    }
  }, [credits, isLoading])

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount)
  }

  const spendCredits = (amount: number): boolean => {
    if (credits >= amount) {
      setCredits(prev => prev - amount)
      return true
    }
    return false
  }

  return (
    <CreditsContext.Provider value={{ credits, addCredits, spendCredits, isLoading }}>
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditsContext)
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider')
  }
  return context
}

// Credit packages for purchase
export const CREDIT_PACKAGES = [
  { id: 'starter', credits: 100, price: 1.00, bonus: 0, label: '100 Credits', description: '$1 worth' },
  { id: 'basic', credits: 500, price: 4.99, bonus: 50, label: '550 Credits', description: '$5.50 value' },
  { id: 'popular', credits: 1000, price: 9.99, bonus: 200, label: '1,200 Credits', description: '$12 value - Most Popular' },
  { id: 'best', credits: 2500, price: 19.99, bonus: 750, label: '3,250 Credits', description: '$32.50 value - Best Value' },
]

// Conversion: 100 credits = $1
export const CREDITS_PER_DOLLAR = 100

export function formatCredits(credits: number): string {
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(1)}K`
  }
  return credits.toString()
}

export function creditsToDollars(credits: number): string {
  return `$${(credits / CREDITS_PER_DOLLAR).toFixed(2)}`
}