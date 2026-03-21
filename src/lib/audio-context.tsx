'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';

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
  
  // Use refs for values that need to be current in event handlers
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSupporterRef = useRef(false);
  const isPreviewRef = useRef(true);

  // Keep refs in sync with state
  useEffect(() => {
    isSupporterRef.current = isSupporter;
    isPreviewRef.current = isPreview;
  }, [isSupporter, isPreview]);

  // Create audio element on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audioRef.current = audio;
      audio.volume = volume / 100;

      const handleTimeUpdate = () => {
        if (audioRef.current && audioRef.current.duration) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(isNaN(pct) ? 0 : pct);

          // Track preview time remaining - use refs for current values
          if (isPreviewRef.current && !isSupporterRef.current) {
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
      };

      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
          setPreviewTimeRemaining(Math.min(PREVIEW_DURATION, audioRef.current.duration));
        }
      };

      const handleEnded = () => {
        // Use the queue state directly
        setQueue(currentQueue => {
          if (currentQueue.length === 0) return currentQueue;
          setCurrentIndex(currentIdx => {
            const nextIdx = (currentIdx + 1) % currentQueue.length;
            const nextTrack = currentQueue[nextIdx];
            if (nextTrack && audioRef.current && nextTrack.audio_url) {
              setCurrentTrack(nextTrack);
              setProgress(0);
              setIsPreview(!isSupporterRef.current);
              setPreviewTimeRemaining(PREVIEW_DURATION);
              audioRef.current.src = nextTrack.audio_url;
              audioRef.current.play().catch(() => {});
            }
            return nextIdx;
          });
          return currentQueue;
        });
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.pause();
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audioRef.current = null;
      };
    }
  }, []);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setQueue(currentQueue => {
      const idx = currentQueue.findIndex(t => t.id === track.id);
      if (idx >= 0) setCurrentIndex(idx);
      return currentQueue;
    });
    setProgress(0);
    setIsPreview(!isSupporterRef.current);
    setPreviewTimeRemaining(PREVIEW_DURATION);

    if (audioRef.current && track.audio_url) {
      audioRef.current.src = track.audio_url;
      audioRef.current.play().catch(e => {
        console.log('Playback failed:', e);
        // On mobile, user interaction is required
        // The button click should trigger this, but if it fails,
        // we set isPlaying to false so user can try again
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!audioRef.current.src && currentTrack.audio_url) {
        audioRef.current.src = currentTrack.audio_url;
      }
      audioRef.current.play().catch(e => {
        console.log('Playback failed:', e);
        setIsPlaying(false);
      });
    }
  }, [isPlaying, currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIdx = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIdx);
    const nextTrack = queue[nextIdx];
    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setProgress(0);
      setIsPreview(!isSupporterRef.current);
      setPreviewTimeRemaining(PREVIEW_DURATION);
      
      if (audioRef.current && nextTrack.audio_url) {
        audioRef.current.src = nextTrack.audio_url;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [queue, currentIndex]);

  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIdx);
    const prevTrack = queue[prevIdx];
    if (prevTrack) {
      setCurrentTrack(prevTrack);
      setProgress(0);
      setIsPreview(!isSupporterRef.current);
      setPreviewTimeRemaining(PREVIEW_DURATION);
      
      if (audioRef.current && prevTrack.audio_url) {
        audioRef.current.src = prevTrack.audio_url;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [queue, currentIndex]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v / 100;
    }
  }, []);

  const seek = useCallback((p: number) => {
    if (!audioRef.current || !duration) return;
    
    // Non-supporters can only seek within preview range
    if (isPreviewRef.current && !isSupporterRef.current) {
      const previewProgress = (PREVIEW_DURATION / duration) * 100;
      const maxSeek = Math.min(p, previewProgress);
      audioRef.current.currentTime = (maxSeek / 100) * duration;
      setProgress(maxSeek);
      setPreviewTimeRemaining(PREVIEW_DURATION - audioRef.current.currentTime);
    } else {
      audioRef.current.currentTime = (p / 100) * duration;
      setProgress(p);
    }
  }, [duration]);

  const upgradeToFull = useCallback(() => {
    setIsSupporter(true);
    setIsPreview(false);
    isSupporterRef.current = true;
    isPreviewRef.current = false;
  }, []);

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