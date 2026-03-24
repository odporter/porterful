'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface WalletContextType {
  balance: number
  addFunds(amount: number): void
  spendFunds(amount: number): boolean
  formatBalance(): string
  isLoading: boolean
  resetWallet(userId: string): Promise<void>
  getWallet(userId: string): Promise<number>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [userId] = useState('default-user')

  async function getWallet(uid: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', uid)
        .single()
      
      if (error && error.code === 'PGRST116') {
        const { data: newWallet } = await supabase
          .from('wallets')
          .insert({ user_id: uid, balance: 0 })
          .select('balance')
          .single()
        return newWallet?.balance || 0
      }
      
      if (error) {
        console.error('Wallet fetch error:', error)
        return 0
      }
      
      return data?.balance || 0
    } catch (err) {
      console.error('Wallet fetch error:', err)
      return 0
    }
  }

  async function resetWallet(uid: string) {
    try {
      await supabase
        .from('wallets')
        .update({ balance: 0, updated_at: new Date().toISOString() })
        .eq('user_id', uid)
      
      if (uid === userId) {
        setBalance(0)
      }
    } catch (err) {
      console.error('Reset wallet error:', err)
    }
  }

  useEffect(() => {
    async function loadBalance() {
      setIsLoading(true)
      const savedBalance = await getWallet(userId)
      setBalance(savedBalance)
      setIsLoading(false)
    }
    loadBalance()
  }, [userId])

  async function addFunds(amount: number) {
    const newBalance = balance + amount
    setBalance(newBalance)
    
    await supabase
      .from('wallets')
      .upsert({ 
        user_id: userId, 
        balance: newBalance,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
  }

  async function spendFunds(amount: number): Promise<boolean> {
    if (balance < amount) {
      return false
    }
    
    const newBalance = balance - amount
    setBalance(newBalance)
    
    await supabase
      .from('wallets')
      .upsert({ 
        user_id: userId, 
        balance: newBalance,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
    
    return true
  }

  function formatBalance() {
    const dollars = Math.floor(balance / 100)
    const cents = balance % 100
    return `$${dollars}.${cents.toString().padStart(2, '0')}`
  }

  return (
    <WalletContext.Provider value={{ balance, addFunds, spendFunds, formatBalance, isLoading, resetWallet, getWallet }}>
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

export const FUND_PACKAGES = [
  { id: 'starter', amount: 500, price: 5.00, bonus: 0, label: '$5.00', description: 'Get started' },
  { id: 'basic', amount: 1000, price: 10.00, bonus: 100, label: '$10.50 value', description: '$10 + $0.50 bonus' },
  { id: 'popular', amount: 2500, price: 25.00, bonus: 500, label: '$30.00 value', description: '$25 + $5 bonus — Most Popular' },
  { id: 'best', amount: 5000, price: 50.00, bonus: 1500, label: '$65.00 value', description: '$50 + $15 bonus — Best Value' },
]

export function centsToDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}
