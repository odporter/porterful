/**
 * Checkout State Management
 * Saves and restores playback state during Stripe redirect checkout
 */

const CHECKOUT_STATE_KEY = 'porterful_checkout_state'
const STATE_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes

export interface CheckoutState {
  trackId: string | null
  trackTitle: string
  artistName: string
  currentTime: number
  duration: number
  isPlaying: boolean
  volume: number
  queue: string[] // track IDs in queue
  sourceRoute: string
  timestamp: number
}

export function saveCheckoutState(state: Omit<CheckoutState, 'timestamp'>): void {
  if (typeof window === 'undefined') return
  
  const fullState: CheckoutState = {
    ...state,
    timestamp: Date.now(),
  }
  
  try {
    sessionStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify(fullState))
  } catch (e) {
    console.error('Failed to save checkout state:', e)
  }
}

export function getCheckoutState(): CheckoutState | null {
  if (typeof window === 'undefined') return null
  
  try {
    const saved = sessionStorage.getItem(CHECKOUT_STATE_KEY)
    if (!saved) return null
    
    const state: CheckoutState = JSON.parse(saved)
    
    // Check expiry
    if (Date.now() - state.timestamp > STATE_EXPIRY_MS) {
      clearCheckoutState()
      return null
    }
    
    return state
  } catch (e) {
    console.error('Failed to parse checkout state:', e)
    return null
  }
}

export function clearCheckoutState(): void {
  if (typeof window === 'undefined') return
  
  try {
    sessionStorage.removeItem(CHECKOUT_STATE_KEY)
  } catch (e) {
    console.error('Failed to clear checkout state:', e)
  }
}

export function shouldResumePlayback(): boolean {
  const state = getCheckoutState()
  return state ? state.isPlaying : false
}
