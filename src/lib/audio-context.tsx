'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  duration?: number;
  audio_url?: string;
  cover_url?: string;
}

interface AudioContext {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isPreview: boolean;
  previewTimeRemaining: number;
  isSupporter: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  pause: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (v: number) => void;
  seek: (p: number) => void;
  queue: Track[];
  setQueue: (tracks: Track[]) => void;
  currentIndex: number;
  upgradeToFull: () => void;
}

// Preview duration in seconds (1 minute)
const PREVIEW_DURATION = 60;

const AudioCtx = createContext<AudioContext | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPreview, setIsPreview] = useState(true);
  const [previewTimeRemaining, setPreviewTimeRemaining] = useState(PREVIEW_DURATION);
  const [isSupporter, setIsSupporter] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Create audio element on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume / 100;

      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(isNaN(pct) ? 0 : pct);

          // Track preview time remaining
          if (isPreview && !isSupporter) {
            const timeRemaining = PREVIEW_DURATION - audioRef.current.currentTime;
            setPreviewTimeRemaining(Math.max(0, timeRemaining));
            
            // Stop playback after preview duration
            if (audioRef.current.currentTime >= PREVIEW_DURATION) {
              audioRef.current.pause();
              setIsPlaying(false);
              setIsPreview(false);
            }
          }
        }
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
          setPreviewTimeRemaining(Math.min(PREVIEW_DURATION, audioRef.current.duration));
        }
      });

      audioRef.current.addEventListener('ended', () => {
        playNext();
      });

      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });

      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (previewTimerRef.current) {
        clearInterval(previewTimerRef.current);
      }
    };
  }, []);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    const idx = queue.findIndex(t => t.id === track.id);
    if (idx >= 0) setCurrentIndex(idx);
    setProgress(0);
    setIsPreview(!isSupporter);
    setPreviewTimeRemaining(PREVIEW_DURATION);

    if (audioRef.current && track.audio_url) {
      audioRef.current.src = track.audio_url;
      audioRef.current.play().catch(e => {
        console.log('Playback failed:', e);
      });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!audioRef.current.src && currentTrack.audio_url) {
        audioRef.current.src = currentTrack.audio_url;
      }
      audioRef.current.play().catch(e => {
        console.log('Playback failed:', e);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const nextIdx = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIdx);
    const nextTrack = queue[nextIdx];
    setCurrentTrack(nextTrack);
    setProgress(0);
    setIsPreview(!isSupporter);
    setPreviewTimeRemaining(PREVIEW_DURATION);
    
    if (audioRef.current && nextTrack.audio_url) {
      audioRef.current.src = nextTrack.audio_url;
      audioRef.current.play().catch(e => {
        console.log('Playback failed:', e);
      });
    }
  };

  const playPrev = () => {
    if (queue.length === 0) return;
    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIdx);
    const prevTrack = queue[prevIdx];
    setCurrentTrack(prevTrack);
    setProgress(0);
    setIsPreview(!isSupporter);
    setPreviewTimeRemaining(PREVIEW_DURATION);
    
    if (audioRef.current && prevTrack.audio_url) {
      audioRef.current.src = prevTrack.audio_url;
      audioRef.current.play().catch(e => {
        console.log('Playback failed:', e);
      });
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v / 100;
    }
  };

  const seek = (p: number) => {
    // Non-supporters can only seek within preview range
    if (isPreview && !isSupporter) {
      const previewProgress = (PREVIEW_DURATION / (duration || PREVIEW_DURATION)) * 100;
      const maxSeek = Math.min(p, previewProgress);
      if (audioRef.current && duration) {
        audioRef.current.currentTime = (maxSeek / 100) * duration;
        setProgress(maxSeek);
        setPreviewTimeRemaining(PREVIEW_DURATION - audioRef.current.currentTime);
      }
    } else {
      if (audioRef.current && duration) {
        audioRef.current.currentTime = (p / 100) * duration;
        setProgress(p);
      }
    }
  };

  const upgradeToFull = () => {
    setIsSupporter(true);
    setIsPreview(false);
  };

  // Initialize queue
  useEffect(() => {
    if (queue.length > 0 && currentIndex === -1) {
      setCurrentIndex(0);
      if (!currentTrack) setCurrentTrack(queue[0]);
    }
  }, [queue, currentIndex, currentTrack]);

  return (
    <AudioCtx.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      progress,
      duration,
      isPreview,
      previewTimeRemaining,
      isSupporter,
      playTrack,
      togglePlay,
      pause,
      playNext,
      playPrev,
      setVolume,
      seek,
      queue,
      setQueue,
      currentIndex,
      upgradeToFull,
    }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return ctx;
}