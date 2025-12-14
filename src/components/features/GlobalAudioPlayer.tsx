import { useEffect, useMemo, useState } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { cn } from '@/utils/cn';
import { works } from '@/data/worksData';
import { PlayerControls } from './player/PlayerControls';
import { QueueDrawer } from './player/QueueDrawer';
import { FullscreenPlayer } from './player/FullscreenPlayer';

interface GlobalAudioPlayerProps {
  isFooterVisible?: boolean;
}

export const GlobalAudioPlayer = (_props: GlobalAudioPlayerProps) => {
  const {
    queue,
    currentTrack,
    currentIndex,
    isPlaying,
    isShuffle,
    isRepeat,
    prev,
    next,
    togglePlay,
    toggleShuffle,
    toggleRepeat,
    playFromQueue,
    removeFromQueue,
    moveInQueue,
    audioRef,
  } = useAudioPlayer();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasTrack = Boolean(currentTrack);
  // Always enable prev/next when there's a track (prev restarts, next goes to random in shuffle or does nothing)
  const hasNext = hasTrack;
  const hasPrev = hasTrack;

  const artworkMap = useMemo(() => {
    const map = new Map<string, string>();
    works.forEach(work => {
      const art = work.thumbnailUrl || work.imageUrl;
      if (!art) return;
      if (work.audioUrl) map.set(work.audioUrl, art);
      work.movements?.forEach(movement => {
        if (movement.audioUrl) {
          map.set(movement.audioUrl, art);
        }
      });
    });
    return map;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [audioRef]);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  if (!hasTrack && queue.length === 0) return null;

  const currentArtwork = currentTrack ? artworkMap.get(currentTrack.src) : null;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const isStacked = isExpanded && isCompact;
  const showStatusLabel = !isCompact || isExpanded;

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500",
        (isExpanded || isCompact) ? "w-[calc(100%-2rem)] max-w-2xl px-0 md:px-4" : "w-auto"
      )}
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Queue Drawer */}
      <QueueDrawer
        isOpen={showQueue}
        onClose={() => setShowQueue(false)}
        queue={queue}
        currentIndex={currentIndex}
        onPlayFromQueue={playFromQueue}
        onRemoveFromQueue={removeFromQueue}
        onMoveInQueue={moveInQueue}
        artworkMap={artworkMap}
      />

      {/* Main Capsule - Editorial Style */}
      <div className={cn(
        "relative flex gap-4 border backdrop-blur-xl shadow-luxury-lg transition-all duration-500 overflow-hidden",
        "bg-alabaster/95 dark:bg-charcoal/95 text-charcoal dark:text-alabaster border-charcoal/10 dark:border-alabaster/10",
        isStacked ? "flex-col p-4 space-y-4" : "items-center",
        !isStacked && (isExpanded ? "p-4 pr-6" : "p-2 pr-6"),
        isHovered && !isExpanded && "shadow-luxury-button-hover"
      )}>

        {/* Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gold transition-all duration-200"
          style={{ width: `${progress}%` }}
        />

        {/* Artwork / Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(true)}
          className={cn(
            "relative shrink-0 overflow-hidden transition-all duration-500",
            isExpanded ? (isStacked ? "h-24 w-full" : "h-16 w-16") : "h-12 w-12",
            isStacked ? "mx-auto w-full" : undefined
          )}
        >
          {currentArtwork ? (
            <img
              src={currentArtwork}
              alt="Album Art"
              className={cn(
                "h-full w-full object-cover transition-transform duration-700 grayscale",
                isPlaying && "grayscale-0 scale-105"
              )}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-taupe text-warmGrey">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/20 opacity-0 hover:opacity-100 transition-opacity duration-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              {isExpanded ? (
                <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
              ) : (
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              )}
            </svg>
          </div>
        </button>

        {/* Track Info */}
        <div className={cn(
          "flex flex-col min-w-0 transition-all duration-500",
          isStacked ? "w-full" : isExpanded ? "flex-1" : "w-24 md:w-48"
        )}>
          {showStatusLabel && (
            <div className="flex items-center gap-2">
              <span className="text-micro uppercase tracking-editorial text-gold">
                {isPlaying ? 'Now Playing' : 'Paused'}
              </span>
            </div>
          )}
          <p className="truncate font-serif text-charcoal dark:text-alabaster text-lg leading-tight">
            {currentTrack?.title}
          </p>
          {isExpanded && (
            <div className={cn(
              "flex items-center gap-2 text-xs text-warmGrey mt-1 font-mono",
              isStacked && "mt-3"
            )}>
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-charcoal/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-gold"
              />
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={cn(
          "flex items-center gap-2",
          isStacked && "w-full justify-between"
        )}>
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            onNext={next}
            onPrev={prev}
            hasNext={hasNext}
            hasPrev={hasPrev}
            className={cn(isExpanded ? "scale-100" : "scale-90", isStacked && "scale-100")}
          />

          {!isStacked && <div className="w-[1px] h-8 bg-charcoal/10 mx-2" />}

          {/* Shuffle Button */}
          <button
            onClick={toggleShuffle}
            className={cn(
              "p-2 rounded-full transition-all duration-300 relative",
              "hover:scale-110 active:scale-95",
              isShuffle
                ? "text-gold bg-gold/20"
                : "text-warmGrey hover:text-charcoal dark:hover:text-alabaster hover:bg-charcoal/10 dark:hover:bg-alabaster/10"
            )}
            aria-label="Toggle shuffle"
            title={isShuffle ? "Shuffle on (playing random tracks)" : "Shuffle off"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
            </svg>
            {isShuffle && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full animate-pulse" />
            )}
          </button>

          {/* Repeat Button */}
          <button
            onClick={toggleRepeat}
            className={cn(
              "p-2 rounded-full transition-all duration-300 relative",
              "hover:scale-110 active:scale-95",
              isRepeat
                ? "text-gold bg-gold/20"
                : "text-warmGrey hover:text-charcoal dark:hover:text-alabaster hover:bg-charcoal/10 dark:hover:bg-alabaster/10"
            )}
            aria-label="Toggle repeat"
            title={isRepeat ? "Repeat on" : "Repeat off"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
            {isRepeat && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full animate-pulse" />
            )}
          </button>

          {/* Queue Button */}
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={cn(
              "p-2 rounded-full transition-all duration-300 relative",
              "hover:scale-110 active:scale-95",
              showQueue
                ? "text-gold bg-gold/20"
                : "text-warmGrey hover:text-charcoal dark:hover:text-alabaster hover:bg-charcoal/10 dark:hover:bg-alabaster/10"
            )}
            aria-label="Toggle queue"
            title="Queue"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
            </svg>
            {showQueue && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen Player */}
      <FullscreenPlayer
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </div>
  );
};
