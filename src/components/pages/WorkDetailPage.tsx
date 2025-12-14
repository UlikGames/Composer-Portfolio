import { useParams, Link, useNavigate } from 'react-router-dom';
import { getWorkById } from '@/data/worksData';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

/**
 * Editorial Work Detail Page
 * Individual work with movements, audio, score download
 */
export const WorkDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { playTrackNow, addToQueue, currentTrack, isPlaying, togglePlay } = useAudioPlayer();

    const work = id ? getWorkById(id) : undefined;

    if (!work) {
        return (
            <div className="min-h-screen flex items-center justify-center px-8">
                <div className="text-center">
                    <h1 className="font-serif text-4xl mb-4">Work Not Found</h1>
                    <p className="text-warmGrey mb-8">The requested composition could not be found.</p>
                    <button
                        onClick={() => navigate('/works')}
                        className="btn-secondary"
                    >
                        Back to Works
                    </button>
                </div>
            </div>
        );
    }

    const scoreLinks = work.scores?.length
        ? work.scores
        : work.scoreUrl
            ? [{ title: 'Score', url: work.scoreUrl }]
            : [];

    const handlePlayAll = () => {
        if (work.movements && work.movements.length > 0) {
            const firstMovement = work.movements[0];
            if (firstMovement.audioUrl) {
                playTrackNow({ title: `${work.title} — ${firstMovement.title}`, src: firstMovement.audioUrl });
                work.movements.slice(1).forEach(m => {
                    if (m.audioUrl) {
                        addToQueue({ title: `${work.title} — ${m.title}`, src: m.audioUrl });
                    }
                });
            }
        } else if (work.audioUrl) {
            playTrackNow({ title: work.title, src: work.audioUrl });
        }
    };

    const handlePlayMovement = (movement: { title: string; audioUrl?: string }) => {
        if (movement.audioUrl) {
            playTrackNow({ title: `${work.title} — ${movement.title}`, src: movement.audioUrl });
        }
    };

    const handleQueueAll = () => {
        if (work.movements && work.movements.length > 0) {
            work.movements.forEach(m => {
                if (m.audioUrl) {
                    addToQueue({ title: `${work.title} — ${m.title}`, src: m.audioUrl });
                }
            });
        } else if (work.audioUrl) {
            addToQueue({ title: work.title, src: work.audioUrl });
        }
    };

    const isCurrentlyPlaying = (audioUrl?: string) => {
        return audioUrl && currentTrack?.src === audioUrl && isPlaying;
    };

    return (
        <div className="min-h-screen">
            {/* ============================================
          HERO SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16">
                <div className="max-w-luxury mx-auto">
                    {/* Back Link */}
                    {/* Back Link */}
                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center gap-2 text-micro uppercase tracking-editorial text-warmGrey link-interactive mb-8"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        Back to Works
                    </button>

                    <div className="grid md:grid-cols-12 gap-12 md:gap-16 mt-8">
                        {/* Image */}
                        <div className="md:col-span-5">
                            {(work.imageUrl || work.thumbnailUrl) && (
                                <div className="relative aspect-[3/4] overflow-hidden shadow-luxury-lg group">
                                    <img
                                        src={work.imageUrl || work.thumbnailUrl}
                                        alt={work.title}
                                        className="w-full h-full object-cover img-editorial"
                                    />
                                    {/* Inner Border */}
                                    <div className="absolute inset-0 shadow-inner-border pointer-events-none" />
                                    {/* Vertical Label */}
                                    <div className="absolute left-4 bottom-8 hidden lg:block">
                                        <p className="vertical-text text-micro uppercase tracking-editorial text-warmGrey">
                                            {work.year} / {work.instrumentation.join(', ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Work Info */}
                        <div className="md:col-span-6 md:col-start-7">
                            {/* Decorative Line */}
                            <div className="decorative-line mb-8" />

                            {/* Overline */}
                            <p className="text-micro uppercase tracking-editorial text-warmGrey mb-4">
                                {work.year} · {work.duration}
                            </p>

                            {/* Title */}
                            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight-luxury mb-6">
                                {work.title}
                            </h1>

                            {/* Artist */}
                            {work.artist && (
                                <p className="text-warmGrey text-lg mb-6">
                                    {work.artist}
                                </p>
                            )}

                            {/* Instrumentation */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                {work.instrumentation.map(inst => (
                                    <span
                                        key={inst}
                                        className="px-4 py-2 text-xs uppercase tracking-editorial border border-charcoal/20 text-warmGrey"
                                    >
                                        {inst}
                                    </span>
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {work.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="text-micro uppercase tracking-editorial text-warmGrey"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4">
                                {(work.audioUrl || (work.movements && work.movements.some(m => m.audioUrl))) && (
                                    <>
                                        <button onClick={handlePlayAll} className="btn-primary">
                                            <span className="btn-bg" />
                                            <span className="btn-text flex items-center gap-2">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                    <polygon points="5,3 19,12 5,21" />
                                                </svg>
                                                Play {work.movements ? 'All' : 'Now'}
                                            </span>
                                        </button>
                                        <button onClick={handleQueueAll} className="btn-secondary flex items-center gap-2">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                                            </svg>
                                            Queue {work.movements ? 'All' : ''}
                                        </button>
                                    </>
                                )}

                                {work.scoreAvailability === 'free' && scoreLinks.length > 0 && (
                                    scoreLinks.map(score => (
                                        <a
                                            key={score.url}
                                            href={score.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-secondary"
                                        >
                                            Download {score.title}
                                        </a>
                                    ))
                                )}

                                {work.scoreAvailability === 'request' && (
                                    <Link to="/contact" className="btn-secondary">
                                        Request Score
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
          MOVEMENTS SECTION
          ============================================ */}
            {work.movements && work.movements.length > 0 && (
                <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16 border-t border-charcoal/10">
                    <div className="max-w-luxury mx-auto">
                        <p className="text-micro uppercase tracking-editorial text-warmGrey mb-8">
                            {work.movements.length} Movements
                        </p>

                        <div className="space-y-0">
                            {work.movements.map((movement, index) => (
                                <article
                                    key={index}
                                    className="border-t border-charcoal/10 py-6 flex items-center justify-between gap-4 group hover:bg-taupe/20 transition-colors duration-500 px-4 -mx-4"
                                >
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        {/* Track Number */}
                                        <span className="text-micro uppercase tracking-editorial text-warmGrey w-8">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        {/* Movement Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-serif text-xl md:text-2xl truncate group-hover:text-gold transition-colors duration-500">
                                                {movement.title}
                                            </h3>
                                        </div>

                                        {/* Duration */}
                                        {movement.duration && (
                                            <span className="text-sm text-warmGrey">
                                                {movement.duration}
                                            </span>
                                        )}
                                    </div>

                                    {/* Play & Queue Buttons */}
                                    <div className="flex items-center gap-2">
                                        {movement.audioUrl && (
                                            <>
                                                <button
                                                    onClick={() => addToQueue({ title: `${work.title} — ${movement.title}`, src: movement.audioUrl! })}
                                                    className="h-10 w-10 border border-charcoal/20 dark:border-alabaster/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-500"
                                                    aria-label="Add to queue"
                                                    title="Add to queue"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => isCurrentlyPlaying(movement.audioUrl) ? togglePlay() : handlePlayMovement(movement)}
                                                    className="h-10 w-10 border border-charcoal/20 dark:border-alabaster/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-500"
                                                    aria-label={isCurrentlyPlaying(movement.audioUrl) ? 'Pause' : 'Play'}
                                                    title={isCurrentlyPlaying(movement.audioUrl) ? 'Pause' : 'Play'}
                                                >
                                                    {isCurrentlyPlaying(movement.audioUrl) ? (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                            <rect x="6" y="4" width="4" height="16" />
                                                            <rect x="14" y="4" width="4" height="16" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                            <polygon points="5,3 19,12 5,21" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
