import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { works } from '@/data/worksData';
import { cn } from '@/utils/cn';

interface Movement {
    title: string;
    audioUrl: string;
    isCurrentTrack: boolean;
}

interface FullscreenPlayerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FullscreenPlayer = ({ isOpen, onClose }: FullscreenPlayerProps) => {
    const {
        currentTrack,
        isPlaying,
        isLoading,
        isShuffle,
        isRepeat,
        isQueueEnded,
        queue,
        currentIndex,
        prev,
        next,
        togglePlay,
        toggleShuffle,
        toggleRepeat,
        forcePlayTrack,

        addToQueue,
        addMultipleToQueue,
        removeFromQueue,
        moveInQueue,
        audioRef,
    } = useAudioPlayer();

    const [, forceUpdate] = useState(0);
    const [showMovements, setShowMovements] = useState(false);
    const [showCatalog, setShowCatalog] = useState(false);
    const [expandedWorks, setExpandedWorks] = useState<Set<string>>(new Set());

    const [activeTab, setActiveTab] = useState<'browse' | 'queue'>('browse');

    // Toast State
    const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);
    const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = (message: string) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast({ message, visible: true });
        toastTimeoutRef.current = setTimeout(() => {
            setToast(prev => prev ? { ...prev, visible: false } : null);
            // Fully remove after animation
            setTimeout(() => setToast(null), 300);
        }, 3000);
    };

    // Drag and Drop State
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, actualIndex: number) => {
        setDraggedIndex(actualIndex);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', actualIndex.toString());
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '0.5';
        }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '1';
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragOver = (e: React.DragEvent, actualIndex: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedIndex !== null && draggedIndex !== actualIndex) {
            setDragOverIndex(actualIndex);
        }
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(fromIndex) && fromIndex !== toIndex) {
            moveInQueue(fromIndex, toIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Touch event handlers for mobile reordering
    const touchStartY = useRef<number>(0);
    const touchStartIndex = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent, index: number) => {
        touchStartY.current = e.touches[0].clientY;
        touchStartIndex.current = index;
        setDraggedIndex(index);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartIndex.current === null) return;

        const touch = e.touches[0];
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const queueItem = elements.find(el => el.getAttribute('data-queue-index'));

        if (queueItem) {
            const overIndex = parseInt(queueItem.getAttribute('data-queue-index')!, 10);
            if (overIndex !== touchStartIndex.current) {
                setDragOverIndex(overIndex);
            }
        }
    };

    const handleTouchEnd = () => {
        if (touchStartIndex.current !== null && dragOverIndex !== null && touchStartIndex.current !== dragOverIndex) {
            moveInQueue(touchStartIndex.current, dragOverIndex);
        }
        touchStartIndex.current = null;
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Build artwork map and find work info for current track
    const { artworkMap, workInfoMap, movementsMap } = useMemo(() => {
        const artworkMap = new Map<string, string>();
        const workInfoMap = new Map<string, {
            workTitle: string;
            movementTitle?: string;
            totalMovements?: number;
            movementIndex?: number;
            workId?: string;
        }>();
        const movementsMap = new Map<string, Movement[]>();

        works.forEach(work => {
            const art = work.thumbnailUrl || work.imageUrl;
            const workId = work.title;

            if (work.audioUrl) {
                if (art) artworkMap.set(work.audioUrl, art);
                workInfoMap.set(work.audioUrl, { workTitle: work.title, workId });
            }

            // Build movements list for this work
            if (work.movements && work.movements.length > 0) {
                const movementsList: Movement[] = work.movements
                    .filter(m => m.audioUrl)
                    .map((movement, idx) => ({
                        title: movement.title || `Movement ${idx + 1}`,
                        audioUrl: movement.audioUrl!,
                        isCurrentTrack: false,
                    }));

                // Store movements for each movement's audioUrl
                work.movements.forEach((movement, idx) => {
                    if (movement.audioUrl) {
                        if (art) artworkMap.set(movement.audioUrl, art);
                        workInfoMap.set(movement.audioUrl, {
                            workTitle: work.title,
                            movementTitle: movement.title || `Movement ${idx + 1}`,
                            totalMovements: work.movements?.length,
                            movementIndex: idx + 1,
                            workId,
                        });
                        movementsMap.set(movement.audioUrl, movementsList);
                    }
                });
            }
        });

        return { artworkMap, workInfoMap, movementsMap };
    }, []);

    const currentArtwork = currentTrack ? artworkMap.get(currentTrack.src) : null;
    const currentWorkInfo = currentTrack ? workInfoMap.get(currentTrack.src) : null;
    const currentMovements = currentTrack ? movementsMap.get(currentTrack.src) : null;

    // Mark the current track in movements
    const movementsWithCurrent = currentMovements?.map(m => ({
        ...m,
        isCurrentTrack: m.audioUrl === currentTrack?.src,
    }));

    // Time state
    const audio = audioRef.current;
    const currentTime = audio?.currentTime || 0;
    const duration = audio?.duration || 0;

    const formatTime = (time: number) => {
        if (!Number.isFinite(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const time = Number(e.target.value);
        audio.currentTime = time;
    };

    const handlePlayMovement = (audioUrl: string, title: string) => {
        // Use forcePlayTrack to play immediately (turns off shuffle if needed)
        forcePlayTrack({ title, src: audioUrl });
        setShowMovements(false);
    };

    const handleAddToQueue = (audioUrl: string, title: string) => {
        addToQueue({ title, src: audioUrl });
        showToast(`Added to queue: ${title}`);
    };

    const toggleWorkExpanded = (workTitle: string) => {
        setExpandedWorks(prev => {
            const next = new Set(prev);
            if (next.has(workTitle)) {
                next.delete(workTitle);
            } else {
                next.add(workTitle);
            }
            return next;
        });
    };

    const handleAddAllToQueue = (work: typeof works[0]) => {
        if (!work.movements) return;
        const tracks = work.movements
            .filter(m => m.audioUrl)
            .map((m, idx) => ({
                title: `${work.title} — ${m.title || `Movement ${idx + 1}`}`,
                src: m.audioUrl!
            }));
        addMultipleToQueue(tracks);
        showToast(`Added ${tracks.length} tracks to queue`);
    };

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (showCatalog) {
                setShowCatalog(false);
            } else if (showMovements) {
                setShowMovements(false);
            } else {
                onClose();
            }
        } else if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        } else if (e.key === 'ArrowRight') {
            next();
        } else if (e.key === 'ArrowLeft') {
            prev();
        } else if (e.key === 'r' || e.key === 'R') {
            toggleRepeat();
        } else if (e.key === 's' || e.key === 'S') {
            toggleShuffle();
        } else if (e.key === 'm' || e.key === 'M') {
            if (movementsWithCurrent && movementsWithCurrent.length > 1) {
                setShowMovements(!showMovements);
            }
        } else if (e.key === 'q' || e.key === 'Q') {
            setShowCatalog(!showCatalog);
        }
    }, [onClose, togglePlay, next, prev, toggleRepeat, toggleShuffle, showMovements, showCatalog, movementsWithCurrent]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    // Force re-render for time updates
    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            forceUpdate(n => n + 1);
        }, 250);
        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    // Determine display title
    const displayTitle = currentWorkInfo?.movementTitle
        ? currentWorkInfo.movementTitle
        : (currentTrack?.title || 'No track selected');

    const displayWorkTitle = currentWorkInfo?.movementTitle
        ? currentWorkInfo.workTitle
        : null;

    const hasMovements = movementsWithCurrent && movementsWithCurrent.length > 1;

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-[200] flex items-center justify-center",
                "animate-fade-in"
            )}
        >
            {/* Blurred Background */}
            <div className="absolute inset-0 overflow-hidden">
                {currentArtwork ? (
                    <img
                        src={currentArtwork}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-60"
                    />
                ) : (
                    <div className="absolute inset-0 bg-charcoal" />
                )}
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-charcoal/80" />
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-3 text-alabaster/70 hover:text-alabaster transition-colors duration-300"
                aria-label="Close fullscreen player"
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>

            {/* Movements Panel */}
            {showMovements && hasMovements && (
                <div className={cn(
                    "bg-charcoal/95 backdrop-blur-xl rounded-lg border border-alabaster/10 p-4 flex flex-col",
                    // Mobile: Full screen overlay
                    "fixed inset-4 z-50 max-h-[calc(100vh-2rem)] overflow-y-auto",
                    // Desktop: Positioned panel
                    "md:absolute md:inset-auto md:top-6 md:left-6 md:max-w-xs md:max-h-96"
                )}>
                    {/* Mobile close button */}
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm uppercase tracking-editorial text-alabaster/60">
                            {currentWorkInfo?.workTitle}
                        </h3>
                        <button
                            onClick={() => setShowMovements(false)}
                            className="md:hidden p-1 text-alabaster/50 hover:text-alabaster"
                            aria-label="Close movements"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                        {movementsWithCurrent?.map((movement, idx) => (
                            <button
                                key={movement.audioUrl}
                                onClick={() => handlePlayMovement(movement.audioUrl, `${currentWorkInfo?.workTitle} — ${movement.title}`)}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-md transition-all duration-200",
                                    movement.isCurrentTrack
                                        ? "bg-gold/20 text-gold"
                                        : "text-alabaster/80 hover:bg-alabaster/10 hover:text-alabaster"
                                )}
                            >
                                <span className="text-xs text-alabaster/40 mr-2">{idx + 1}.</span>
                                {movement.title}
                                {movement.isCurrentTrack && (
                                    <span className="ml-2 text-xs text-gold">▶ Playing</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Catalog Panel - Right side */}
            {showCatalog && (
                <div className={cn(
                    "bg-charcoal/95 backdrop-blur-xl rounded-lg border border-alabaster/10 flex flex-col",
                    // Mobile: Full screen overlay
                    "fixed inset-4 z-50",
                    // Desktop: Positioned panel
                    "md:absolute md:inset-auto md:top-6 md:right-20 md:bottom-20 md:w-80"
                )}>
                    <div className="flex border-b border-alabaster/10">
                        <button
                            onClick={() => setActiveTab('browse')}
                            className={cn(
                                "flex-1 py-3 text-xs uppercase tracking-editorial transition-colors",
                                activeTab === 'browse'
                                    ? "text-gold bg-alabaster/5"
                                    : "text-alabaster/40 hover:text-alabaster/60 hover:bg-alabaster/5"
                            )}
                        >
                            Browse
                        </button>
                        <button
                            onClick={() => setActiveTab('queue')}
                            className={cn(
                                "flex-1 py-3 text-xs uppercase tracking-editorial transition-colors relative",
                                activeTab === 'queue'
                                    ? "text-gold bg-alabaster/5"
                                    : "text-alabaster/40 hover:text-alabaster/60 hover:bg-alabaster/5"
                            )}
                        >
                            Up Next
                            {queue.length > currentIndex + 1 && (
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                            )}
                        </button>
                        {/* Mobile close button */}
                        <button
                            onClick={() => setShowCatalog(false)}
                            className="md:hidden px-3 py-3 text-alabaster/50 hover:text-alabaster"
                            aria-label="Close catalog"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'browse' ? (
                            <div className="p-4 space-y-2">
                                {works.map(work => {
                                    const workArt = work.thumbnailUrl || work.imageUrl;
                                    const hasMultiple = work.movements && work.movements.length > 0;
                                    const isCurrentWork = currentTrack?.src === work.audioUrl ||
                                        work.movements?.some(m => m.audioUrl === currentTrack?.src);
                                    const isExpanded = expandedWorks.has(work.title);

                                    return (
                                        <div key={work.title} className="border-b border-alabaster/10 pb-2">
                                            {/* Work header - clickable to expand */}
                                            <div
                                                onClick={() => hasMultiple ? toggleWorkExpanded(work.title) : null}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-2 rounded transition-all",
                                                    hasMultiple && "hover:bg-alabaster/5 cursor-pointer",
                                                    !hasMultiple && "cursor-default"
                                                )}
                                                role={hasMultiple ? "button" : undefined}
                                                tabIndex={hasMultiple ? 0 : undefined}
                                                onKeyDown={hasMultiple ? (e) => e.key === 'Enter' && toggleWorkExpanded(work.title) : undefined}
                                            >
                                                {workArt && (
                                                    <img
                                                        src={workArt}
                                                        alt=""
                                                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className={cn(
                                                        "text-sm font-medium truncate",
                                                        isCurrentWork ? "text-gold" : "text-alabaster"
                                                    )}>
                                                        {work.title}
                                                    </p>
                                                    <p className="text-xs text-alabaster/40">
                                                        {hasMultiple ? `${work.movements!.length} movements` : 'Single work'}
                                                    </p>
                                                </div>
                                                {hasMultiple && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddAllToQueue(work);
                                                            }}
                                                            className="px-2 py-1 text-xs bg-alabaster/10 text-alabaster/60 rounded hover:bg-alabaster/20 hover:text-alabaster transition-all relative z-10"
                                                            title="Add all movements to queue"
                                                        >
                                                            + All
                                                        </button>
                                                        <svg
                                                            className={cn(
                                                                "w-4 h-4 text-alabaster/40 transition-transform",
                                                                isExpanded && "rotate-180"
                                                            )}
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M7 10l5 5 5-5z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {!hasMultiple && work.audioUrl && (
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePlayMovement(work.audioUrl!, work.title);
                                                            }}
                                                            className="px-2 py-1 text-xs bg-gold/20 text-gold rounded hover:bg-gold/30 transition-all"
                                                            title="Play now"
                                                        >
                                                            ▶
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddToQueue(work.audioUrl!, work.title);
                                                            }}
                                                            className="px-2 py-1 text-xs bg-alabaster/10 text-alabaster/60 rounded hover:bg-alabaster/20 hover:text-alabaster transition-all"
                                                            title="Add to queue"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Movements dropdown */}
                                            {hasMultiple && isExpanded && (
                                                <div className="ml-4 mt-1 space-y-1 border-l border-alabaster/10 pl-3">
                                                    {work.movements!
                                                        .filter(m => m.audioUrl)
                                                        .map((movement, idx) => {
                                                            const isPlaying = currentTrack?.src === movement.audioUrl;
                                                            const movTitle = movement.title || `Movement ${idx + 1}`;
                                                            const fullTitle = `${work.title} — ${movTitle}`;
                                                            return (
                                                                <div
                                                                    key={movement.audioUrl}
                                                                    className={cn(
                                                                        "flex items-center gap-2 px-2 py-1.5 rounded text-xs",
                                                                        isPlaying
                                                                            ? "bg-gold/20 text-gold"
                                                                            : "text-alabaster/60"
                                                                    )}
                                                                >
                                                                    <span className="flex-1 truncate">
                                                                        {idx + 1}. {movTitle}
                                                                        {isPlaying && <span className="ml-1">▶</span>}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handlePlayMovement(movement.audioUrl!, fullTitle)}
                                                                        className="px-2 py-0.5 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-all"
                                                                        title="Play now"
                                                                    >
                                                                        ▶
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleAddToQueue(movement.audioUrl!, fullTitle)}
                                                                        className="px-2 py-0.5 bg-alabaster/10 text-alabaster/60 rounded hover:bg-alabaster/20 hover:text-alabaster transition-all"
                                                                        title="Add to queue"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            // Queue View
                            <div className="p-4 space-y-2">
                                {queue.length > currentIndex + 1 ? (
                                    <>
                                        <div className="text-xs text-alabaster/40 mb-2 uppercase tracking-wider pl-2">
                                            Playing Next
                                        </div>
                                        {queue.slice(currentIndex + 1).map((track, i) => {
                                            const realIndex = currentIndex + 1 + i;
                                            const isDragging = draggedIndex === realIndex;
                                            const isDragOver = dragOverIndex === realIndex;

                                            return (
                                                <div
                                                    key={`${track.src}-${realIndex}`}
                                                    data-queue-index={realIndex}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, realIndex)}
                                                    onDragEnd={handleDragEnd}
                                                    onDragOver={(e) => handleDragOver(e, realIndex)}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={(e) => handleDrop(e, realIndex)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-2 rounded bg-alabaster/5 hover:bg-alabaster/10 transition-colors group",
                                                        isDragging && "opacity-50 bg-gold/10",
                                                        isDragOver && "border-t-2 border-gold"
                                                    )}
                                                >
                                                    {/* Drag Handle - touch here to reorder */}
                                                    <div
                                                        className="flex-shrink-0 text-alabaster/30 hover:text-alabaster transition-colors cursor-grab active:cursor-grabbing touch-none p-1"
                                                        onTouchStart={(e) => handleTouchStart(e, realIndex)}
                                                        onTouchMove={handleTouchMove}
                                                        onTouchEnd={handleTouchEnd}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs text-alabaster/30 font-mono w-4">
                                                        {i + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-alabaster/80 truncate">
                                                            {track.title}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromQueue(realIndex)}
                                                        className="p-1 text-alabaster/40 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 transition-all"
                                                        title="Remove from queue"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M18 6L6 18M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <div className="text-center py-10 text-alabaster/30">
                                        <p className="text-sm">Queue is empty</p>
                                        <p className="text-xs mt-1">Add tracks from the Browse tab</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content - Responsive Layout */}
            <div className={cn(
                "relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8",
                // Desktop: Horizontal layout
                "md:flex md:items-center md:gap-16",
                // Mobile: Vertical layout
                "flex flex-col items-center gap-6 md:gap-8 md:flex-row"
            )}>
                {/* Album Artwork */}
                <div className={cn(
                    "relative shrink-0",
                    // Mobile: Responsive square based on screen width
                    "w-56 h-56 sm:w-64 sm:h-64",
                    // Desktop: Much larger
                    "md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] xl:w-[500px] xl:h-[500px]"
                )}>
                    {currentArtwork ? (
                        <img
                            src={currentArtwork}
                            alt="Album Art"
                            className={cn(
                                "w-full h-full object-cover rounded-lg shadow-2xl",
                                isPlaying && "animate-pulse-slow"
                            )}
                        />
                    ) : (
                        <div className="w-full h-full rounded-lg bg-charcoalLight flex items-center justify-center">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-warmGrey">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                    )}

                    {/* Glow effect under artwork */}
                    {currentArtwork && (
                        <div
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full blur-2xl opacity-50"
                            style={{
                                backgroundImage: `url(${currentArtwork})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                    )}
                </div>

                {/* Track Info & Controls */}
                <div className={cn(
                    "flex flex-col",
                    // Mobile: Center aligned
                    "items-center text-center",
                    // Desktop: Left aligned
                    "md:items-start md:text-left md:flex-1"
                )}>
                    {/* Now Playing Status */}
                    <div className="flex items-center gap-3 mb-4">
                        {isLoading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm uppercase tracking-editorial text-gold">
                                    Loading
                                </span>
                            </>
                        ) : isQueueEnded ? (
                            <>
                                <span className="text-sm uppercase tracking-editorial text-alabaster/60">
                                    Queue Ended
                                </span>
                                <span className="text-alabaster/30">·</span>
                                <button
                                    onClick={toggleShuffle}
                                    className="text-sm uppercase tracking-editorial text-gold hover:text-gold/80 transition-colors flex items-center gap-2 group"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
                                        <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                                    </svg>
                                    <span className="underline underline-offset-4 group-hover:no-underline">Shuffle All</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {isPlaying && (
                                    <span className="flex gap-0.5">
                                        <span className="w-1 h-4 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1 h-4 bg-gold rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1 h-4 bg-gold rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                                    </span>
                                )}
                                <span className="text-sm uppercase tracking-editorial text-gold">
                                    {isPlaying ? 'Now Playing' : 'Paused'}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Work Title (if showing movement) */}
                    {displayWorkTitle && (
                        <button
                            onClick={() => hasMovements && setShowMovements(!showMovements)}
                            className={cn(
                                "text-sm uppercase tracking-editorial text-alabaster/40 mb-2 transition-colors",
                                hasMovements && "hover:text-gold cursor-pointer"
                            )}
                        >
                            {displayWorkTitle}
                            {hasMovements && (
                                <svg
                                    className="inline-block ml-1 w-3 h-3"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Track/Movement Title */}
                    <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-alabaster mb-2 leading-tight">
                        {displayTitle}
                    </h1>

                    {/* Movement indicator - clickable */}
                    {hasMovements && (
                        <button
                            onClick={() => setShowMovements(!showMovements)}
                            className="text-sm text-alabaster/50 mb-2 hover:text-gold transition-colors flex items-center gap-1"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            Movement {currentWorkInfo?.movementIndex} of {currentWorkInfo?.totalMovements}
                        </button>
                    )}

                    {/* Composer Info */}
                    <p className="text-lg text-alabaster/60 mb-8">
                        Ulvin Najafov
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-[280px] sm:max-w-md mb-6 md:mb-8">
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1.5 bg-alabaster/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-4 
                [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:bg-alabaster 
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-125"
                            style={{
                                background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
                            }}
                        />
                        <div className="flex justify-between mt-2 text-xs sm:text-sm text-alabaster/50 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center gap-3 sm:gap-6 mb-6 md:mb-8">
                        {/* Shuffle */}
                        <button
                            onClick={toggleShuffle}
                            className={cn(
                                "p-2 sm:p-3 rounded-full transition-all duration-300",
                                isShuffle
                                    ? "text-gold bg-gold/20"
                                    : "text-alabaster/50 hover:text-alabaster"
                            )}
                            aria-label="Toggle shuffle"
                            title={isShuffle ? "Shuffle on" : "Shuffle off"}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="sm:w-6 sm:h-6">
                                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                            </svg>
                        </button>

                        {/* Previous */}
                        <button
                            onClick={prev}
                            className="p-2 sm:p-3 text-alabaster/70 hover:text-alabaster transition-colors duration-300"
                            aria-label="Previous track"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="sm:w-8 sm:h-8">
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                            </svg>
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            className="p-4 sm:p-5 bg-alabaster text-charcoal rounded-full hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl"
                            aria-label={isLoading ? 'Loading' : isPlaying ? 'Pause' : 'Play'}
                        >
                            {isLoading ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-8 sm:h-8 animate-spin">
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                </svg>
                            ) : isPlaying ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="sm:w-8 sm:h-8">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="sm:w-8 sm:h-8">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>

                        {/* Next */}
                        <button
                            onClick={next}
                            className="p-2 sm:p-3 text-alabaster/70 hover:text-alabaster transition-colors duration-300"
                            aria-label="Next track"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="sm:w-8 sm:h-8">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                            </svg>
                        </button>

                        {/* Repeat */}
                        <button
                            onClick={toggleRepeat}
                            className={cn(
                                "p-2 sm:p-3 rounded-full transition-all duration-300",
                                isRepeat
                                    ? "text-gold bg-gold/20"
                                    : "text-alabaster/50 hover:text-alabaster"
                            )}
                            aria-label="Toggle repeat"
                            title={isRepeat ? "Repeat on" : "Repeat off"}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="sm:w-6 sm:h-6">
                                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                            </svg>
                        </button>

                        {/* Browse/Catalog */}
                        <button
                            onClick={() => setShowCatalog(!showCatalog)}
                            className={cn(
                                "p-2 sm:p-3 rounded-full transition-all duration-300",
                                showCatalog
                                    ? "text-gold bg-gold/20"
                                    : "text-alabaster/50 hover:text-alabaster"
                            )}
                            aria-label="Browse music"
                            title="Browse all music"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="sm:w-6 sm:h-6">
                                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                            </svg>
                        </button>
                    </div>

                    {/* Status Messages */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        {isShuffle && (
                            <p className="text-gold/70 flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                                </svg>
                                Shuffle
                            </p>
                        )}
                        {isRepeat && (
                            <p className="text-gold/70 flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                                </svg>
                                Repeat
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Keyboard Hints */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex gap-6 text-xs text-alabaster/60">
                <span><kbd className="px-2 py-1 bg-alabaster/20 rounded">Space</kbd> Play/Pause</span>
                <span><kbd className="px-2 py-1 bg-alabaster/20 rounded">←</kbd> <kbd className="px-2 py-1 bg-alabaster/20 rounded">→</kbd> Prev/Next</span>
                <span><kbd className="px-2 py-1 bg-alabaster/20 rounded">S</kbd> Shuffle</span>
                <span><kbd className="px-2 py-1 bg-alabaster/20 rounded">R</kbd> Repeat</span>
                <span><kbd className="px-2 py-1 bg-alabaster/20 rounded">Q</kbd> Browse</span>
                {hasMovements && <span><kbd className="px-2 py-1 bg-alabaster/20 rounded">M</kbd> Movements</span>}
                <span><kbd className="px-2 py-1 bg-alabaster/20 rounded">Esc</kbd> Close</span>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div
                    className={cn(
                        "absolute bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 transform",
                        toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                >
                    <div className="bg-charcoal/90 backdrop-blur-md border border-gold/20 text-gold px-6 py-3 rounded-full shadow-luxury text-sm font-medium flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        {toast.message}
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};
