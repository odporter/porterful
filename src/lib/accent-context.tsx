'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

// ============================================
// ACCENT COLOR SYSTEM
// Only ONE user-controlled variable: --accent-h (hue)
// Saturation and lightness are LOCKED for design integrity
// ============================================

// Hue values for presets (0-360)
export const ACCENT_PRESETS = {
  orange: { h: 24, name: 'Default Orange', icon: '🟠' },
  gold: { h: 43, name: 'Aurum', icon: '🟡' },
  blue: { h: 217, name: 'Ocean', icon: '🔵' },
  forest: { h: 145, name: 'Forest', icon: '🟢' },
  ember: { h: 350, name: 'Ember', icon: '🔴' },
  void: { h: 260, name: 'Void', icon: '🟣' },
} as const

export type AccentPreset = keyof typeof ACCENT_PRESETS

// Constraints for accessibility
const MIN_HUE = 0
const MAX_HUE = 360
const LOCKED_SATURATION = 95
const LOCKED_LIGHTNESS = 53

const ACCENT_STORAGE_KEY = 'pf-accent-hue'

interface AccentContextType {
  hue: number
  setHue: (hue: number) => void
  setPreset: (preset: AccentPreset) => void
  currentPreset: AccentPreset | 'custom'
  hueToPreset: (hue: number) => AccentPreset | 'custom'
}

const AccentCtx = createContext<AccentContextType | null>(null)

export function useAccent() {
  const ctx = useContext(AccentCtx)
  if (!ctx) throw new Error('useAccent must be used within AccentProvider')
  return ctx
}

// Clamp hue to valid range
function clampHue(hue: number): number {
  return Math.max(MIN_HUE, Math.min(MAX_HUE, Math.round(hue)))
}

// Find closest preset for a given hue
function hueToPreset(hue: number): AccentPreset | 'custom' {
  const clamped = clampHue(hue)
  let closest: AccentPreset | 'custom' = 'custom'
  let minDiff = Infinity

  for (const [key, value] of Object.entries(ACCENT_PRESETS)) {
    const diff = Math.abs(value.h - clamped)
    if (diff < minDiff && diff <= 5) { // 5 degree tolerance
      minDiff = diff
      closest = key as AccentPreset
    }
  }

  return closest
}

// Apply accent CSS variables to document
function applyAccentToDocument(hue: number) {
  if (typeof document === 'undefined') return
  
  const clamped = clampHue(hue)
  const root = document.documentElement
  
  root.style.setProperty('--accent-h', clamped.toString())
  // Note: --accent-s and --accent-l remain at their locked CSS values
}

// Bootstrap script for instant application before React hydration
export function getAccentBootstrapScript(): string {
  return `(function(){
    try {
      var saved = localStorage.getItem('${ACCENT_STORAGE_KEY}');
      var hue = saved ? parseInt(saved, 10) : ${ACCENT_PRESETS.orange.h};
      if (isNaN(hue)) hue = ${ACCENT_PRESETS.orange.h};
      document.documentElement.style.setProperty('--accent-h', Math.max(${MIN_HUE}, Math.min(${MAX_HUE}, hue)).toString());
    } catch (e) {}
  })();`
}

interface AccentProviderProps {
  children: ReactNode
  initialHue?: number | null
}

export function AccentProvider({ children, initialHue }: AccentProviderProps) {
  const [hue, setHueState] = useState(() => {
    if (typeof window === 'undefined') {
      return initialHue ?? ACCENT_PRESETS.orange.h
    }
    
    // If we have a server-provided initial value, use it
    if (initialHue !== undefined && initialHue !== null) {
      return clampHue(initialHue)
    }
    
    // Otherwise check localStorage
    try {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY)
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed)) return clampHue(parsed)
      }
    } catch (e) {
      // localStorage unavailable
    }
    
    return ACCENT_PRESETS.orange.h
  })

  const [currentPreset, setCurrentPreset] = useState<AccentPreset | 'custom'>(() => 
    hueToPreset(hue)
  )

  // Apply CSS variables whenever hue changes
  useEffect(() => {
    applyAccentToDocument(hue)
    setCurrentPreset(hueToPreset(hue))
  }, [hue])

  const setHue = useCallback((newHue: number) => {
    const clamped = clampHue(newHue)
    setHueState(clamped)
    
    // Persist to localStorage
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, clamped.toString())
    } catch (e) {
      // localStorage unavailable
    }
  }, [])

  const setPreset = useCallback((preset: AccentPreset) => {
    const presetHue = ACCENT_PRESETS[preset].h
    setHue(presetHue)
  }, [setHue])

  return (
    <AccentCtx.Provider value={{ 
      hue, 
      setHue, 
      setPreset,
      currentPreset,
      hueToPreset
    }}>
      {children}
    </AccentCtx.Provider>
  )
}
