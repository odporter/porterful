'use client'

import { createContext, useContext, ReactNode } from 'react'
import { CartProvider } from '@/lib/cart-context'
import { ToastProvider } from '@/components/Toast'
import { WalletProvider } from '@/lib/wallet-context'
import { AudioProvider } from '@/lib/audio-context'
import { PayoutProvider } from '@/lib/payout-context'

// --- Auth Session type (mirrors Supabase) ---
interface SessionUser {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

interface AuthSession {
  user: SessionUser
  expires_at: number
  expires_in: number
  access_token: string
  refresh_token: string
  token_type: string
}

interface AuthError {
  message: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMockData = any

// --- Mock supabase client ---
const mockSupabase = {
  auth: {
    getSession: async (): Promise<{ data: { session: AuthSession | null }; error: AuthError | null }> => ({
      data: { session: null },
      error: null,
    }),
    getUser: async (): Promise<{ data: { user: SessionUser | null }; error: AuthError | null }> => ({
      data: { user: null },
      error: null,
    }),
    signInWithPassword: async (_opts?: unknown) => ({
      data: { session: null as AuthSession | null, user: null as SessionUser | null },
      error: { message: 'Not configured' } as AuthError,
    }),
    signUp: async (_opts?: unknown) => ({
      data: { session: null as AuthSession | null, user: null as SessionUser | null },
      error: { message: 'Not configured' } as AuthError,
    }),
    signInWithOAuth: async (_opts?: unknown) => ({
      data: { url: '' },
      error: { message: 'Not configured' } as AuthError,
    }),
    resetPasswordForEmail: async (_email?: string, _opts?: unknown) => ({
      data: {},
      error: { message: 'Not configured' } as AuthError,
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (_table: string) => {
    // Build a query chain that returns `any` data so property access doesn't error
    const query = (): AnyMockData => ({
      data: null,
      error: null,
      eq: () => query(),
      single: async () => ({ data: null, error: null }),
      select: () => query(),
      insert: async () => ({ data: null, error: null }),
      update: () => query(),
      delete: async () => ({ data: null, error: null }),
      order: () => query(),
      limit: () => query(),
    })
    return {
      select: (_columns?: string, _options?: unknown) => query(),
      insert: async (_data?: unknown) => ({ data: null, error: null }),
      update: () => query(),
      delete: async (_data?: unknown) => ({ data: null, error: null }),
    }
  },
  storage: {
    from: (_bucket: string) => ({
      upload: async () => ({ data: null, error: { message: 'Storage not configured' } as AuthError }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      download: async () => ({ data: null, error: null }),
    }),
  },
}

// --- Context ---
interface SupabaseContext {
  user: SessionUser | null
  loading: boolean
  supabase: typeof mockSupabase
  signOut?: () => Promise<void>
}

const SupabaseCtx = createContext<SupabaseContext>({
  user: null,
  loading: false,
  supabase: mockSupabase,
})

export function useSupabase() {
  return useContext(SupabaseCtx)
}

export { useTheme } from '@/lib/theme-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SupabaseCtx.Provider value={{ user: null, loading: false, supabase: mockSupabase }}>
      <WalletProvider>
        <CartProvider>
          <ToastProvider>
            <AudioProvider>
              <PayoutProvider>
                {children}
              </PayoutProvider>
            </AudioProvider>
          </ToastProvider>
        </CartProvider>
      </WalletProvider>
    </SupabaseCtx.Provider>
  )
}
