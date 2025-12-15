import { Link } from 'react-router-dom';
import { WorkCardProps } from '@/types';
import { cn } from '@/utils/cn';
import { formatDurationShort } from '@/utils/formatDuration';
import { MouseEvent, useMemo, useState } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

/**
 * Editorial WorkCard Component
 * Grayscale-to-color images, border-top pattern, slow transitions
 */
export const WorkCard = ({
  work,
  className,
}: WorkCardProps) => {
  const imageUrl = work.thumbnailUrl || work.imageUrl;
  const [imageLoading, setImageLoading] = useState(!!imageUrl);
  const [imageError, setImageError] = useState(false);
  const { addToQueue, playTrackNow, currentTrack } = useAudioPlayer();

  const movementQueueTracks = useMemo(() => {
    return (work.movements ?? [])
      .filter(movement => movement.audioUrl)
      .map((movement, index) => {
        const label = movement.title || `Movement ${index + 1}`;
        return {
          src: movement.audioUrl as string,
          queueTitle: `${work.title} — ${label}`,
        };
      });
  }, [work.movements, work.title]);

  const queueTracks = useMemo(() => {
    if (movementQueueTracks.length > 0) {
      return movementQueueTracks;
    }
    if (work.audioUrl) {
      return [{ src: work.audioUrl, queueTitle: work.title }];
    }
    return [];
  }, [movementQueueTracks, work.audioUrl, work.title]);

  const scoreLinks = work.scores?.length
    ? work.scores
    : work.scoreUrl
      ? [{ title: 'Score', url: work.scoreUrl }]
      : [];

  const handleImageLoad = () => {
    setTimeout(() => {
      setImageLoading(false);
    }, 300);
  };

  const handleImageError = () => {
    setTimeout(() => {
      setImageLoading(false);
      setImageError(true);
    }, 300);
  };

  const handleQueue = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (queueTracks.length === 0) return;
    queueTracks.forEach(track => addToQueue({ title: track.queueTitle, src: track.src }));
  };

  const handlePlay = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (queueTracks.length === 0) return;
    playTrackNow({ title: queueTracks[0].queueTitle, src: queueTracks[0].src });
    queueTracks.slice(1).forEach(track => addToQueue({ title: track.queueTitle, src: track.src }));
  };

  const isCurrentWork = Boolean(currentTrack && queueTracks.some(track => track.src === currentTrack.src));

  return (
    <Link to={`/works/${work.id}`}>
      <article className={cn(
        'group border-t border-charcoal dark:border-alabaster/20 pt-8 transition-all duration-500 hover:bg-taupe/20 dark:hover:bg-charcoalLight/50 -mx-4 px-4 hover:-translate-y-1',
        className
      )}>
        {/* Image */}
        {imageUrl && (
          <div className="relative mb-6 w-full overflow-hidden aspect-[3/4] shadow-luxury">
            {imageLoading && !imageError && (
              <div className="absolute inset-0 bg-taupe animate-pulse" />
            )}
            {!imageError && (
              <img
                src={imageUrl}
                alt={work.title}
                className={cn(
                  'h-full w-full object-cover img-editorial',
                  imageLoading ? 'opacity-0 absolute' : 'opacity-100'
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            )}
            {imageError && (
              <div className="w-full h-full flex items-center justify-center bg-taupe">
                <span className="font-serif text-4xl text-warmGrey">♪</span>
              </div>
            )}
            {/* Inner Border */}
            <div className="absolute inset-0 shadow-inner-border pointer-events-none" />
            {/* Now Playing Badge */}
            {isCurrentWork && (
              <span className="absolute top-3 right-3 px-3 py-1 text-micro uppercase tracking-editorial bg-charcoal dark:bg-alabaster text-alabaster dark:text-charcoal">
                Now playing
              </span>
            )}
          </div>
        )}

        {/* Work Info */}
        <div>
          <p className="text-micro uppercase tracking-editorial text-warmGrey mb-2">
            {work.year} · {work.instrumentation.join(', ')}
          </p>
          <h3 className="font-serif text-2xl md:text-3xl mb-3 text-charcoal dark:text-alabaster group-hover:text-gold transition-colors duration-500">
            {work.title}
          </h3>
          <p className="text-sm text-warmGrey mb-4">
            {formatDurationShort(work.duration)} · {work.movements ? `${work.movements.length} movements` : 'Single movement'}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {work.tags.map(tag => (
              <span
                key={tag}
                className="text-micro uppercase tracking-editorial text-warmGrey"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Score Availability */}
          {work.scoreAvailability === 'free' && scoreLinks.length > 0 && (
            <p className="text-micro uppercase tracking-editorial text-gold mb-4">
              {scoreLinks.length > 1 ? 'Scores included' : 'Score included'}
            </p>
          )}
          {work.scoreAvailability === 'request' && (
            <p className="text-micro uppercase tracking-editorial text-warmGrey mb-4">
              Score by request
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              type="button"
              onClick={handleQueue}
              disabled={queueTracks.length === 0}
              className={cn(
                'text-xs uppercase tracking-editorial transition-colors duration-500',
                queueTracks.length > 0
                  ? 'text-charcoal dark:text-alabaster hover:text-gold'
                  : 'text-warmGrey/50 cursor-not-allowed'
              )}
            >
              + Queue
            </button>
            <button
              type="button"
              onClick={handlePlay}
              disabled={queueTracks.length === 0}
              className={cn(
                'text-xs uppercase tracking-editorial flex items-center gap-2 transition-colors duration-500',
                queueTracks.length > 0
                  ? 'text-charcoal dark:text-alabaster hover:text-gold'
                  : 'text-warmGrey/50 cursor-not-allowed'
              )}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Play
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};
