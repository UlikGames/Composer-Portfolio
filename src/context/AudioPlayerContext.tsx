import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { works } from '@/data/worksData';

export interface AudioTrack {
  title: string;
  src: string;
}

const libraryTracks: AudioTrack[] = (() => {
  const seen = new Map<string, AudioTrack>();
  works.forEach(work => {
    if (work.audioUrl) {
      const baseTrack = { title: work.title, src: work.audioUrl };
      if (!seen.has(baseTrack.src)) seen.set(baseTrack.src, baseTrack);
    }
    work.movements?.forEach((movement, idx) => {
      if (!movement.audioUrl) return;
      const label = movement.title || `Movement ${idx + 1}`;
      const movementTrack = { title: `${work.title} — ${label}`, src: movement.audioUrl };
      if (!seen.has(movementTrack.src)) seen.set(movementTrack.src, movementTrack);
    });
  });
  return Array.from(seen.values());
})();

const shuffleList = (tracks: AudioTrack[]): AudioTrack[] => {
  const arr = [...tracks];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

interface AudioPlayerContextValue {
  queue: AudioTrack[];
  currentIndex: number;
  currentTrack?: AudioTrack;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  addToQueue: (track: AudioTrack) => void;
  addMultipleToQueue: (tracks: AudioTrack[]) => void;
  playTrackNow: (track: AudioTrack) => void;
  forcePlayTrack: (track: AudioTrack) => void;
  playFromQueue: (index: number) => void;
  removeFromQueue: (index: number) => void;
  moveInQueue: (fromIndex: number, toIndex: number) => void;
  next: () => void;
  prev: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [history, setHistory] = useState<AudioTrack[]>([]); // Track history for going back
  const [shufflePool, setShufflePool] = useState<AudioTrack[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousTrackRef = useRef<AudioTrack | undefined>(undefined);
  const currentIndexRef = useRef(0);
  const lastPrevClickTime = useRef(0); // For double-click detection

  const currentTrack = queue[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      previousTrackRef.current = undefined;
      setIsPlaying(false);
      return;
    }

    if (previousTrackRef.current !== currentTrack) {
      audio.src = currentTrack.src;
      audio.currentTime = 0;
      previousTrackRef.current = currentTrack;
    }

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const buildShufflePool = useCallback((excludeSrc?: string) => {
    const base = excludeSrc
      ? libraryTracks.filter(track => track.src !== excludeSrc)
      : libraryTracks;
    return shuffleList(base);
  }, []);

  const pullFromShufflePool = useCallback((excludeSrc?: string): AudioTrack | null => {
    let pool = shufflePool;

    if (excludeSrc) {
      pool = pool.filter(track => track.src !== excludeSrc);
    }

    if (pool.length === 0) {
      pool = buildShufflePool(excludeSrc);
    }

    if (pool.length === 0) return null;

    const [nextTrack, ...rest] = pool;
    setShufflePool(rest);
    return nextTrack;
  }, [shufflePool, buildShufflePool]);

  const primeQueueWithRandomTrack = useCallback((excludeSrc?: string) => {
    if (queue.length > 0) return false;
    const nextTrack = pullFromShufflePool(excludeSrc);
    if (!nextTrack) return false;
    setQueue([nextTrack]);
    setCurrentIndex(0);
    setIsPlaying(true);
    return true;
  }, [queue.length, pullFromShufflePool]);

  // Add single track to queue (works even with shuffle on)
  const addToQueue = (track: AudioTrack) => {
    setQueue(prev => {
      // Allow duplicates
      const nextQueue = [...prev, track];
      if (nextQueue.length === 1) {
        setCurrentIndex(0);
        setIsPlaying(true);
      }
      return nextQueue;
    });
  };

  // Add multiple tracks to queue at once
  const addMultipleToQueue = (tracks: AudioTrack[]) => {
    setQueue(prev => {
      // Allow duplicates
      const nextQueue = [...prev, ...tracks];
      if (prev.length === 0 && nextQueue.length > 0) {
        setCurrentIndex(0);
        setIsPlaying(true);
      }
      return nextQueue;
    });
  };

  const playTrackNow = (track: AudioTrack) => {
    // Explicit play should override shuffle and start clean
    setIsShuffle(false);
    setShufflePool([]);
    setHistory([]);
    setQueue([track]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  // Force play a track (works even with shuffle on, keeps shuffle state)
  const forcePlayTrack = (track: AudioTrack) => {
    setQueue([track]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const playFromQueue = (index: number) => {
    if (isShuffle) return;
    if (index < 0 || index >= queue.length) return;
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const next = useCallback(() => {
    // Check if there are more tracks in queue first (works for both shuffle and normal mode)
    const hasMoreInQueue = currentIndex < queue.length - 1;

    if (hasMoreInQueue) {
      // In shuffle mode we treat the queue as "up next" and drop played items
      if (isShuffle) {
        const currentTrackForHistory = queue[currentIndex];
        if (currentTrackForHistory) {
          setHistory(prev => [...prev, currentTrackForHistory]);
        }
        setQueue(prev => {
          const nextQueue = prev.slice(currentIndex + 1);
          return nextQueue;
        });
        setCurrentIndex(0);
        setIsPlaying(true);
        return;
      }

      // Normal mode: keep queue intact and advance index
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
      return;
    }

    // Shuffle mode: pick a random track when queue is exhausted
    if (isShuffle) {
      const currentTrackForHistory = queue[currentIndex];
      const currentSrc = currentTrackForHistory?.src;
      const nextTrack = pullFromShufflePool(currentSrc);
      if (nextTrack) {
        // Save current track to history before switching
        if (currentTrackForHistory) {
          setHistory(prev => [...prev, currentTrackForHistory]);
        }
        setQueue([nextTrack]);
        setCurrentIndex(0);
        setIsPlaying(true);
      }
      return;
    }

    // Normal mode at end of queue - do nothing
  }, [queue, currentIndex, isShuffle]);

  const prev = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastPrevClickTime.current;
    const isDoubleClick = timeSinceLastClick < 2000; // 2 second window
    lastPrevClickTime.current = now;

    // If more than 3 seconds into the song, always restart first
    const currentTimeInSong = audioRef.current?.currentTime || 0;
    if (currentTimeInSong > 3 && !isDoubleClick) {
      audioRef.current!.currentTime = 0;
      return;
    }

    // Shuffle mode: prefer stepping back in the current queue; fall back to history
    if (isShuffle) {
      if (currentIndex > 0) {
        setCurrentIndex(prevIdx => Math.max(prevIdx - 1, 0));
        setIsPlaying(true);
        return;
      }

      if (history.length > 0) {
        const previousTrack = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setQueue(prevQueue => {
          const remaining = prevQueue.slice(currentIndex + 1);
          return [previousTrack, ...remaining];
        });
        setCurrentIndex(0);
        setIsPlaying(true);
        return;
      }

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      return;
    }

    // Normal mode: double-click goes back in queue, single click restarts
    if (isDoubleClick && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [isShuffle, history, audioRef, currentIndex]);

  const togglePlay = () => {
    if (queue.length === 0) {
      if (isShuffle) {
        const started = primeQueueWithRandomTrack();
        if (started) {
          return;
        }
      }
      return;
    }
    setIsPlaying(prev => !prev);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => {
      if (index < 0 || index >= prev.length) return prev;
      const newQueue = prev.filter((_, i) => i !== index);
      setCurrentIndex(prevIdx => {
        if (newQueue.length === 0) {
          setIsPlaying(false);
          return 0;
        }
        if (index < prevIdx) {
          return Math.max(prevIdx - 1, 0);
        }
        if (index === prevIdx) {
          return prevIdx >= newQueue.length ? 0 : prevIdx;
        }
        return prevIdx;
      });
      return newQueue;
    });
  };

  const moveInQueue = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || toIndex < 0) return;

    setQueue(prev => {
      if (fromIndex >= prev.length || toIndex >= prev.length) return prev;

      const newQueue = [...prev];
      const [removed] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, removed);

      // Adjust currentIndex if necessary
      setCurrentIndex(prevIdx => {
        if (prevIdx === fromIndex) return toIndex;
        if (prevIdx > fromIndex && prevIdx <= toIndex) return prevIdx - 1;
        if (prevIdx < fromIndex && prevIdx >= toIndex) return prevIdx + 1;
        return prevIdx;
      });

      return newQueue;
    });
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => {
      const nextState = !prev;
      if (nextState) {
        const seededPool = buildShufflePool(currentTrack?.src);
        setShufflePool(seededPool);
        primeQueueWithRandomTrack(currentTrack?.src);
      } else {
        setShufflePool([]);
      }
      return nextState;
    });
  };
  const toggleRepeat = () => setIsRepeat(prev => !prev);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }
      next();
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [next, isRepeat]);

  const value = useMemo(() => ({
    queue,
    currentIndex,
    currentTrack,
    isPlaying,
    isShuffle,
    isRepeat,
    addToQueue,
    addMultipleToQueue,
    playTrackNow,
    forcePlayTrack,
    playFromQueue,
    removeFromQueue,
    moveInQueue,
    next,
    prev,
    togglePlay,
    toggleShuffle,
    toggleRepeat,
    audioRef,
  }), [queue, currentIndex, currentTrack, isPlaying, isShuffle, isRepeat]);

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return ctx;
};
