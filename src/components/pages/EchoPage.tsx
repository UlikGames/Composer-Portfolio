import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkById } from '@/data/worksData';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Work } from '@/types';

/**
 * Hidden Easter Egg Page
 * Only accessible by typing "HANDE" anywhere on the site
 */
export const EchoPage = () => {
    const threeNocturnes = getWorkById('three-nocturnes');
    const linconnue = getWorkById('linconnue');
    const { playTrackNow, addToQueue } = useAudioPlayer();
    const [playMenuOpen, setPlayMenuOpen] = useState<string | null>(null);

    // Close menu on click outside or Escape
    useEffect(() => {
        if (!playMenuOpen) return;
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            if (!target?.closest('[data-play-menu]')) {
                setPlayMenuOpen(null);
            }
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setPlayMenuOpen(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [playMenuOpen]);

    const specialWorks = [threeNocturnes, linconnue].filter(Boolean) as Work[];

    const getPlayableMovements = (work: Work) => {
        return (work.movements ?? [])
            .map((movement, idx) => movement.audioUrl ? {
                src: movement.audioUrl,
                title: `${work.title} — ${movement.title || `Movement ${idx + 1}`}`,
                label: movement.title || `Movement ${idx + 1}`,
            } : null)
            .filter(Boolean) as { src: string; title: string; label: string }[];
    };

    const playWholeWork = (work: Work) => {
        const playableMovements = getPlayableMovements(work);
        if (playableMovements.length > 0) {
            const [first, ...rest] = playableMovements;
            playTrackNow({ title: first.title, src: first.src });
            rest.forEach(track => addToQueue({ title: track.title, src: track.src }));
        } else if (work.audioUrl) {
            playTrackNow({ title: work.title, src: work.audioUrl });
        }
        setPlayMenuOpen(null);
    };

    const playWorkFromMovement = (work: Work, startIndex: number) => {
        const playableMovements = getPlayableMovements(work);
        if (startIndex < 0 || startIndex >= playableMovements.length) return;
        const [first, ...rest] = playableMovements.slice(startIndex);
        playTrackNow({ title: first.title, src: first.src });
        rest.forEach(track => addToQueue({ title: track.title, src: track.src }));
        setPlayMenuOpen(null);
    };

    const handlePlayWork = (work: Work) => {
        const playableMovements = getPlayableMovements(work);
        if (playableMovements.length > 1) {
            setPlayMenuOpen(prev => prev === work.id ? null : work.id);
            return;
        }
        if (playableMovements.length === 1) {
            playTrackNow({ title: playableMovements[0].title, src: playableMovements[0].src });
            setPlayMenuOpen(null);
            return;
        }
        if (work.audioUrl) {
            playTrackNow({ title: work.title, src: work.audioUrl });
        }
        setPlayMenuOpen(null);
    };

    const handleAddToQueue = (work: Work) => {
        if (work.movements && work.movements.length > 0) {
            work.movements.forEach(m => {
                if (m.audioUrl) {
                    addToQueue({ title: `${work.title} — ${m.title}`, src: m.audioUrl });
                }
            });
        } else if (work.audioUrl) {
            addToQueue({ title: work.title, src: work.audioUrl });
        }
        setPlayMenuOpen(null);
    };

    return (
        <div className="min-h-screen px-6 sm:px-10 md:px-16 py-20">
            <div className="max-w-4xl mx-auto">
                {/* Header Section - Centered */}
                <div className="text-center mb-16">
                    {/* Decorative stars */}
                    <div className="text-gold text-4xl mb-8 animate-pulse">
                        ✧ · ˚ · ✦ · ˚ · ✧
                    </div>

                    {/* Title */}
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight-luxury mb-8 text-gold">
                        For Hande
                    </h1>

                    {/* Dedication */}
                    <p className="font-serif text-xl md:text-2xl leading-relaxed mb-6">
                        For my missing Hande.
                    </p>

                    {/* The piece / message */}
                    <div className="prose prose-lg dark:prose-invert mx-auto mb-8">
                        <p className="text-warmGrey italic leading-relaxed mb-6">
                            Some melodies are written for one person,
                            even if that person never hears them.
                        </p>
                        <p className="text-warmGrey italic leading-relaxed mb-6">
                            I'll keep the distance you asked for.
                            I just needed one page where you still exist.
                        </p>
                        <p className="text-warmGrey italic leading-relaxed">
                            These pieces were born from quiet nights,
                            from memories that refused to fade,
                            from a love that learned to speak in silence.
                        </p>
                    </div>

                    {/* Decorative line */}
                    <div className="decorative-line mx-auto" />
                </div>

                {/* Works Section */}
                <div className="mb-16">
                    <p className="text-micro uppercase tracking-editorial text-warmGrey mb-8 text-center">
                        The Music Written For You
                    </p>

                    {/* Work Cards Grid - Same structure as WorksPage */}
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {specialWorks.map((work) => (
                            <article
                                key={work.id}
                                className={`group flex flex-col h-full border-t border-charcoal dark:border-alabaster/20 pt-8 relative overflow-visible ${playMenuOpen === work.id ? 'z-50' : 'z-0'}`}
                            >
                                {/* Image */}
                                {(work.thumbnailUrl || work.imageUrl) && (
                                    <Link to={`/works/${work.id}`} className="block mb-6 overflow-hidden">
                                        <div className="relative aspect-[3/4] overflow-hidden shadow-luxury">
                                            <img
                                                src={work.thumbnailUrl || work.imageUrl}
                                                alt={work.title}
                                                className="w-full h-full object-cover img-editorial"
                                                loading="lazy"
                                            />
                                            {/* Inner Border */}
                                            <div className="absolute inset-0 shadow-inner-border pointer-events-none" />
                                        </div>
                                    </Link>
                                )}

                                {/* Work Info */}
                                <div className="flex flex-col flex-1">
                                    <p className="text-[10px] md:text-micro uppercase tracking-editorial text-warmGrey mb-1 md:mb-2 truncate">
                                        {work.year} · {work.instrumentation.join(', ')}
                                    </p>
                                    <h3 className="font-serif text-base md:text-2xl lg:text-3xl mb-2 md:mb-3 group-hover:text-gold transition-colors duration-500 leading-tight line-clamp-2 min-h-[2.5rem] md:min-h-[4rem]">
                                        <Link to={`/works/${work.id}`}>{work.title}</Link>
                                    </h3>
                                    <p className="text-xs md:text-sm text-warmGrey mb-2 md:mb-4">
                                        {work.duration} · {work.movements ? `${work.movements.length} mvts` : 'Single'}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {work.tags.slice(0, 5).map(tag => (
                                            <span
                                                key={tag}
                                                className="text-micro uppercase tracking-editorial text-warmGrey"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions - Same as WorksPage with dropdown menu */}
                                    <div className="flex items-center gap-2 md:gap-6 relative flex-wrap mt-auto" data-play-menu>
                                        {(work.audioUrl || (work.movements && work.movements.some(m => m.audioUrl))) && (
                                            <>
                                                <button
                                                    onClick={() => handlePlayWork(work)}
                                                    className="text-[9px] md:text-xs uppercase tracking-editorial text-charcoal dark:text-alabaster hover:text-gold transition-colors duration-500 flex items-center gap-1"
                                                >
                                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="md:w-3 md:h-3">
                                                        <polygon points="5,3 19,12 5,21" />
                                                    </svg>
                                                    Play
                                                </button>
                                                <button
                                                    onClick={() => handleAddToQueue(work)}
                                                    className="text-[9px] md:text-xs uppercase tracking-editorial text-charcoal dark:text-alabaster hover:text-gold transition-colors duration-500 flex items-center gap-1"
                                                    title="Add to queue"
                                                >
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="md:w-3.5 md:h-3.5">
                                                        <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                                                    </svg>
                                                    Queue
                                                </button>
                                            </>
                                        )}
                                        <Link
                                            to={`/works/${work.id}`}
                                            className="text-[9px] md:text-xs uppercase tracking-editorial text-charcoal dark:text-alabaster link-interactive"
                                        >
                                            Details →
                                        </Link>

                                        {/* Movement Selection Dropdown */}
                                        {playMenuOpen === work.id && getPlayableMovements(work).length > 1 && (
                                            <div
                                                className="absolute left-0 top-full mt-2 w-64 max-h-[60vh] overflow-y-auto border border-charcoal/10 dark:border-alabaster/10 bg-alabaster dark:bg-charcoal shadow-luxury-lg z-50 rounded-sm"
                                                data-play-menu
                                            >
                                                <button
                                                    onClick={() => playWholeWork(work)}
                                                    className="w-full text-left px-3 py-2 text-xs uppercase tracking-editorial text-charcoal dark:text-alabaster hover:bg-gold/10"
                                                >
                                                    Play all movements
                                                </button>
                                                <div className="border-t border-charcoal/10 dark:border-alabaster/10">
                                                    {getPlayableMovements(work).map((movement, idx) => (
                                                        <button
                                                            key={`${movement.src}-${idx}`}
                                                            onClick={() => playWorkFromMovement(work, idx)}
                                                            className="w-full text-left px-3 py-2 text-sm text-charcoal dark:text-alabaster hover:bg-taupe/20 dark:hover:bg-charcoalLight/30 flex items-center gap-2"
                                                        >
                                                            <span className="text-micro uppercase tracking-editorial text-warmGrey">{String(idx + 1).padStart(2, '0')}</span>
                                                            <span className="truncate">{movement.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Footer Section - Centered */}
                <div className="text-center">
                    {/* Back link */}
                    <Link
                        to="/works"
                        className="group inline-flex items-center gap-2 text-micro uppercase tracking-editorial text-warmGrey link-interactive"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        Back to Works
                    </Link>

                    {/* Bottom decorative stars */}
                    <div className="text-gold text-2xl mt-12 opacity-60">
                        ✧
                    </div>
                </div>
            </div>
        </div>
    );
};
