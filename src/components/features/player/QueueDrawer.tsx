import { useState } from 'react';
import { AudioTrack } from '@/context/AudioPlayerContext';
import { cn } from '@/utils/cn';

interface QueueDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    queue: AudioTrack[];
    currentIndex: number;
    onPlayFromQueue: (index: number) => void;
    onRemoveFromQueue: (index: number) => void;
    onMoveInQueue: (fromIndex: number, toIndex: number) => void;
    artworkMap: Map<string, string>;
}

export const QueueDrawer = ({
    isOpen,
    onClose,
    queue,
    currentIndex,
    onPlayFromQueue,
    onRemoveFromQueue,
    onMoveInQueue,
    artworkMap,
}: QueueDrawerProps) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    if (!isOpen) return null;

    // Current track and upcoming tracks only
    const currentTrack = queue[currentIndex];
    const upcomingTracks = queue.slice(currentIndex + 1);

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
            onMoveInQueue(fromIndex, toIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="absolute bottom-full right-0 mb-4 w-full max-w-md border border-charcoal/10 dark:border-alabaster/10 bg-alabaster/95 dark:bg-charcoal/95 p-4 shadow-luxury-lg backdrop-blur-xl animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-micro uppercase tracking-editorial text-warmGrey">Play Queue</h3>
                <button
                    onClick={onClose}
                    className="text-warmGrey hover:text-charcoal dark:hover:text-alabaster transition-colors duration-500"
                    aria-label="Close queue"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto scrollbar-thin pr-2">
                {!currentTrack && upcomingTracks.length === 0 ? (
                    <p className="text-sm text-warmGrey py-8 text-center font-serif italic">Queue is empty</p>
                ) : (
                    <>
                        {/* Now Playing */}
                        {currentTrack && (
                            <>
                                <p className="text-micro uppercase tracking-editorial text-gold mb-2">Now Playing</p>
                                <div className="flex items-center gap-3 p-2 bg-gold/10 mb-4">
                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-taupe">
                                        {artworkMap.get(currentTrack.src) ? (
                                            <img src={artworkMap.get(currentTrack.src)} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-warmGrey">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-charcoal/20">
                                            <div className="h-2 w-2 bg-gold animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm text-gold font-medium">
                                            {currentTrack.title}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Up Next */}
                        {upcomingTracks.length > 0 && (
                            <>
                                <p className="text-micro uppercase tracking-editorial text-warmGrey mb-2">Up Next</p>
                                {upcomingTracks.map((track, relativeIndex) => {
                                    const actualIndex = currentIndex + 1 + relativeIndex;
                                    const artwork = artworkMap.get(track.src);
                                    const isDragging = draggedIndex === actualIndex;
                                    const isDragOver = dragOverIndex === actualIndex;

                                    return (
                                        <div
                                            key={`${track.src}-${actualIndex}`}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, actualIndex)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={(e) => handleDragOver(e, actualIndex)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, actualIndex)}
                                            className={cn(
                                                "group flex items-center gap-3 p-2 transition-all duration-200 cursor-grab active:cursor-grabbing hover:bg-taupe/30",
                                                isDragging && "opacity-50",
                                                isDragOver && "border-t-2 border-gold"
                                            )}
                                        >
                                            {/* Drag Handle */}
                                            <div className="flex-shrink-0 text-warmGrey/50 hover:text-warmGrey transition-colors">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
                                                </svg>
                                            </div>

                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-taupe">
                                                {artwork ? (
                                                    <img src={artwork} alt="" className="h-full w-full object-cover grayscale" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-warmGrey">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-sm text-charcoal dark:text-alabaster">
                                                    {track.title}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <button
                                                    onClick={() => onPlayFromQueue(actualIndex)}
                                                    className="text-warmGrey hover:text-charcoal dark:hover:text-alabaster transition-colors duration-500"
                                                    title="Play"
                                                    aria-label="Play this track"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                        <polygon points="5,3 19,12 5,21" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => onRemoveFromQueue(actualIndex)}
                                                    className="text-warmGrey hover:text-gold transition-colors duration-500"
                                                    title="Remove"
                                                    aria-label="Remove from queue"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M18 6L6 18M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {upcomingTracks.length === 0 && currentTrack && (
                            <p className="text-sm text-warmGrey py-4 text-center font-serif italic">No more tracks in queue</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
