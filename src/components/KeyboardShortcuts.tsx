'use client';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/components/Toast';

/**
 * Attaches global music-player keyboard shortcuts.
 * Mount this once inside the AudioProvider + ToastProvider tree
 * (e.g. in the root layout or the AudioPlayerBar component).
 */
export function KeyboardShortcuts() {
  const { showToast } = useToast();
  useKeyboardShortcuts((msg) => showToast(msg, 'info'));
  return null;
}
