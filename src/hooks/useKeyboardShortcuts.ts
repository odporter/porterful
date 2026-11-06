'use client';

import { useEffect, useRef } from 'react';
import { useAudio } from '@/lib/audio-context';

/**
 * Global keyboard shortcuts for the music player.
 * Attach this hook inside any client component wrapped by both
 * AudioProvider and ToastProvider.
 *
 * Shortcuts:
 *   Space       → toggle play/pause
 *   →           → next track
 *   ←           → previous track
 *   ↑           → volume up (+10)
 *   ↓           → volume down (-10)
 *
 * Shortcuts are suppressed when focus is inside an input, textarea, or select.
 */
export function useKeyboardShortcuts(onNotify?: (msg: string) => void) {
  const { togglePlay, playNext, playPrev, volume, setVolume } = useAudio();
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    const notify = (msg: string) => onNotify?.(msg);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't steal from real inputs
      const tag = (e.target as HTMLElement).tagName;
      const isEditable = (e.target as HTMLElement).isContentEditable;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || isEditable) return;

      // Don't fire when modifier keys are held
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          notify('Music playback toggled');
          break;

        case 'ArrowRight':
          e.preventDefault();
          playNext();
          notify('Next track →');
          break;

        case 'ArrowLeft':
          e.preventDefault();
          playPrev();
          notify('← Previous track');
          break;

        case 'ArrowUp':
          e.preventDefault();
          const newVol = Math.min(100, volumeRef.current + 10);
          setVolume(newVol);
          notify(`🔊 Volume: ${newVol}%`);
          break;

        case 'ArrowDown':
          e.preventDefault();
          const newVol2 = Math.max(0, volumeRef.current - 10);
          setVolume(newVol2);
          notify(`🔉 Volume: ${newVol2}%`);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, playNext, playPrev, setVolume, onNotify]);
}
