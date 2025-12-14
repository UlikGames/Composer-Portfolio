import { cn } from '@/utils/cn';

interface PlayerControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
    className?: string;
}

export const PlayerControls = ({
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
    className,
}: PlayerControlsProps) => {
    return (
        <div className={cn("flex items-center gap-4", className)}>
            {/* Previous Button */}
            <button
                onClick={onPrev}
                disabled={!hasPrev}
                className={cn(
                    "relative p-2 rounded-full transition-all duration-300",
                    "text-warmGrey",
                    hasPrev && "hover:text-charcoal dark:hover:text-alabaster hover:bg-charcoal/10 dark:hover:bg-alabaster/10 hover:scale-110 active:scale-95",
                    !hasPrev && "opacity-30 cursor-not-allowed"
                )}
                aria-label="Previous track"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
            </button>

            {/* Play/Pause Button */}
            <button
                onClick={onPlayPause}
                className={cn(
                    "flex h-12 w-12 items-center justify-center transition-all duration-300",
                    "bg-charcoal dark:bg-alabaster text-alabaster dark:text-charcoal",
                    "hover:bg-gold hover:scale-110 hover:shadow-lg hover:shadow-gold/30",
                    "active:scale-95"
                )}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                    </svg>
                )}
            </button>

            {/* Next Button */}
            <button
                onClick={onNext}
                disabled={!hasNext}
                className={cn(
                    "relative p-2 rounded-full transition-all duration-300",
                    "text-warmGrey",
                    hasNext && "hover:text-charcoal dark:hover:text-alabaster hover:bg-charcoal/10 dark:hover:bg-alabaster/10 hover:scale-110 active:scale-95",
                    !hasNext && "opacity-30 cursor-not-allowed"
                )}
                aria-label="Next track"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
            </button>
        </div>
    );
};
