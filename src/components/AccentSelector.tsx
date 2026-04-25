'use client'

import { useState, useCallback } from 'react'

// ============================================
// ACCENT COLOR SELECTOR
// Controlled accent personalization with design system integrity
// Only hue is user-controlled; saturation + lightness locked
// ============================================

// Hue values for presets (0-360)
const ACCENT_PRESETS = {
  orange: { h: 24, name: 'Default Orange', icon: '🟠' },
  gold: { h: 43, name: 'Aurum', icon: '🟡' },
  blue: { h: 217, name: 'Ocean', icon: '🔵' },
  forest: { h: 145, name: 'Forest', icon: '🟢' },
  ember: { h: 350, name: 'Ember', icon: '🔴' },
  void: { h: 260, name: 'Void', icon: '🟣' },
} as const

type AccentPreset = keyof typeof ACCENT_PRESETS

const ACCENT_STORAGE_KEY = 'pf-accent-hue'
const LOCKED_SATURATION = 95
const LOCKED_LIGHTNESS = 53

// Clamp hue to valid range
function clampHue(hue: number): number {
  return Math.max(0, Math.min(360, Math.round(hue)))
}

// Find closest preset for a given hue
function hueToPreset(hue: number): AccentPreset | 'custom' {
  const clamped = clampHue(hue)
  let closest: AccentPreset | 'custom' = 'custom'
  let minDiff = Infinity

  for (const [key, value] of Object.entries(ACCENT_PRESETS)) {
    const diff = Math.abs(value.h - clamped)
    if (diff < minDiff && diff <= 5) {
      minDiff = diff
      closest = key as AccentPreset
    }
  }

  return closest
}

// Apply accent CSS variables to document
function applyAccentToDocument(hue: number) {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty('--accent-h', clampHue(hue).toString())
}

interface AccentSelectorProps {
  className?: string
  showTitle?: boolean
  compact?: boolean
}

export function AccentSelector({ className = '', showTitle = true, compact = false }: AccentSelectorProps) {
  const [hue, setHueState] = useState(() => {
    if (typeof window === 'undefined') return ACCENT_PRESETS.orange.h
    try {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY)
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed)) return clampHue(parsed)
      }
    } catch (e) {}
    return ACCENT_PRESETS.orange.h
  })

  const currentPreset = hueToPreset(hue)
  const [isDragging, setIsDragging] = useState(false)

  // Handle slider change
  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value, 10)
    setHueState(newHue)
    applyAccentToDocument(newHue)
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, newHue.toString())
    } catch (e) {}
  }, [])

  // Handle preset click
  const handlePresetClick = useCallback((preset: AccentPreset) => {
    const presetHue = ACCENT_PRESETS[preset].h
    setHueState(presetHue)
    applyAccentToDocument(presetHue)
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, presetHue.toString())
    } catch (e) {}
  }, [])

  // Generate gradient for slider (full hue spectrum)
  const hueGradient = 'linear-gradient(to right, '
    + 'hsl(0,95%,53%), '
    + 'hsl(60,95%,53%), '
    + 'hsl(120,95%,53%), '
    + 'hsl(180,95%,53%), '
    + 'hsl(240,95%,53%), '
    + 'hsl(300,95%,53%), '
    + 'hsl(360,95%,53%))'

  if (compact) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Preset buttons only */}
        <div className="flex flex-wrap gap-2">
          {(Object.entries(ACCENT_PRESETS) as [AccentPreset, typeof ACCENT_PRESETS[AccentPreset]][]).map(([key, value]) => {
            const isActive = currentPreset === key
            return (
              <button
                key={key}
                onClick={() => handlePresetClick(key)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-150 ease-out
                  ${isActive 
                    ? 'ring-2 ring-offset-1 ring-offset-[var(--pf-bg)]' 
                    : 'hover:bg-[var(--pf-surface-hover)]'
                  }
                `}
                style={{
                  backgroundColor: isActive ? `hsl(${value.h},95%,53%)` : 'var(--pf-surface)',
                  color: isActive ? '#111111' : 'var(--pf-text)',
                  '--tw-ring-color': `hsl(${value.h},95%,53%)`,
                } as React.CSSProperties}
                title={value.name}
              >
                <span>{value.icon}</span>
                <span className={isActive ? 'text-[#111111]' : ''}>{value.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-5 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[var(--pf-text)]">Accent Color</h3>
            <p className="text-xs text-[var(--pf-text-muted)]">
              Personalize your experience
            </p>
          </div>
          <div 
            className="w-10 h-10 rounded-full border-2 border-[var(--pf-border)] shadow-sm"
            style={{ 
              backgroundColor: `hsl(${hue},95%,53%)`,
              boxShadow: `0 0 20px hsla(${hue},95%,53%,0.3)`
            }}
          />
        </div>
      )}

      {/* Hue Slider */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--pf-text-secondary)] uppercase tracking-wider">
          Hue Spectrum
        </label>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={handleSliderChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="w-full h-3 rounded-full cursor-pointer appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pf-bg)]"
            style={{
              background: hueGradient,
              WebkitAppearance: 'none',
            }}
            aria-label="Accent color hue"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={hue}
          />
          
          {/* Custom thumb styling via CSS */}
          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: white;
              border: 3px solid hsl(${hue}, 95%, 53%);
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              transition: transform 0.15s ease, box-shadow 0.15s ease;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              transform: scale(1.15);
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: white;
              border: 3px solid hsl(${hue}, 95%, 53%);
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              transition: transform 0.15s ease, box-shadow 0.15s ease;
            }
          `}</style>
        </div>
        
        <div className="flex justify-between text-[10px] text-[var(--pf-text-muted)] uppercase">
          <span>Red</span>
          <span>Yellow</span>
          <span>Green</span>
          <span>Cyan</span>
          <span>Blue</span>
          <span>Purple</span>
          <span>Red</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--pf-text-secondary)] uppercase tracking-wider">
          Presets
        </label>
        
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(ACCENT_PRESETS) as [AccentPreset, typeof ACCENT_PRESETS[AccentPreset]][]).map(([key, value]) => {
            const isActive = currentPreset === key
            return (
              <button
                key={key}
                onClick={() => handlePresetClick(key)}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-150 ease-out
                  ${isActive 
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]' 
                    : 'border-[var(--pf-border)] bg-[var(--pf-surface)] hover:border-[var(--pf-border-hover)]'
                  }
                `}
              >
                <div 
                  className="w-8 h-8 rounded-full"
                  style={{ 
                    backgroundColor: `hsl(${value.h},95%,53%)`,
                    boxShadow: isActive ? `0 0 12px hsla(${value.h},95%,53%,0.5)` : 'none'
                  }}
                />
                <span className={`text-xs font-medium ${isActive ? 'text-[var(--accent)]' : 'text-[var(--pf-text-secondary)]'}`}>
                  {value.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Current Value Display */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--pf-surface)] border border-[var(--pf-border)]">
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: `hsl(${hue},95%,53%)` }}
          />
          <div>
            <p className="text-xs text-[var(--pf-text-secondary)]">Current</p>
            <p className="text-sm font-mono text-[var(--pf-text)]">
              hsl({hue}, {hue < 0 ? '--' : '95'}%, {hue < 0 ? '--' : '53'}%)
            </p>
          </div>
        </div>
        
        <button
          onClick={() => handlePresetClick('orange')}
          className="text-xs text-[var(--pf-text-muted)] hover:text-[var(--pf-text)] transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// Preview component showing accent in action
export function AccentPreview({ hue }: { hue: number }) {
  return (
    <div className="space-y-4 p-4 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-bg-secondary)]">
      <div className="space-y-2">
        <p className="text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider">
          Preview
        </p>
        
        {/* Primary Button */}
        <button className="w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
          style={{
            backgroundColor: `hsl(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%)`,
            color: '#111111',
          }}
          onClick={(e) => {
            e.preventDefault()
            e.currentTarget.style.transform = 'scale(0.98)'
            setTimeout(() => {
              e.currentTarget.style.transform = 'scale(1)'
            }, 100)
          }}
        >
          Primary Action
        </button>
        
        {/* Secondary Button */}
        <button className="w-full px-4 py-2.5 rounded-lg font-medium text-sm border transition-all duration-200"
          style={{
            borderColor: `hsla(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%,0.5)`,
            color: `hsl(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%)`,
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `hsla(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%,0.12)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Secondary Action
        </button>
        
        {/* Link example */}
        <p className="text-sm">
          <a href="#" className="transition-colors duration-200 hover:underline"
            style={{ color: `hsl(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%)` }}
            onClick={(e) => e.preventDefault()}
          >
            Text link example
          </a>
        </p>
        
        {/* Badge example */}
        <div className="flex gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `hsla(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%,0.12)`,
              color: `hsl(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%)`
            }}
          >
            Active
          </span>
          
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
            style={{ 
              borderColor: `hsla(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%,0.5)`,
              color: `hsl(${hue},${LOCKED_SATURATION}%,${LOCKED_LIGHTNESS}%)`
            }}
          >
            Pending
          </span>
        </div>
      </div>
    </div>
  )
}
