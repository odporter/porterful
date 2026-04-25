// Server-safe accent color utilities
// Keep this file free of 'use client' and browser-only APIs

export const ACCENT_STORAGE_KEY = 'pf-accent-hue'

/**
 * Get the bootstrap script for accent color.
 * This is injected into the HTML via dangerouslySetInnerHTML
 * and runs before React hydration to prevent flash of wrong accent.
 */
export function getAccentBootstrapScript(): string {
  return `(function(){
    try {
      var saved = localStorage.getItem('${ACCENT_STORAGE_KEY}');
      var hue = saved ? parseInt(saved, 10) : 24; // Default orange
      if (isNaN(hue)) hue = 24;
      document.documentElement.style.setProperty('--accent-h', Math.max(0, Math.min(360, hue)).toString());
    } catch (e) {}
  })();`
}
