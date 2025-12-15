import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { works, getInstrumentationFilters, getTagFilters } from '@/data/worksData';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

const ITEMS_PER_PAGE = 12;

/**
 * Editorial Works Page
 * Catalog with filtering, search, pagination, and grid layout
 */
export const WorksPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeInstrumentation, setActiveInstrumentation] = useState<string[]>([]);
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [playMenuOpen, setPlayMenuOpen] = useState<string | null>(null);
    const [showInstrumentation, setShowInstrumentation] = useState(false);
    const [showStyle, setShowStyle] = useState(false);
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

    // Get current page from URL, default to 1
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const { playTrackNow, addToQueue } = useAudioPlayer();

    const instrumentationFilters = getInstrumentationFilters();
    const tagFilters = getTagFilters();

    // Filter works
    const filteredWorks = useMemo(() => {
        return works.filter(work => {
            // Search query filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    work.title.toLowerCase().includes(query) ||
                    work.instrumentation.some(i => i.toLowerCase().includes(query)) ||
                    work.tags.some(t => t.toLowerCase().includes(query));
                if (!matchesSearch) return false;
            }

            // Instrumentation filter
            if (activeInstrumentation.length > 0) {
                const hasInstrumentation = activeInstrumentation.some(filter =>
                    work.instrumentation.includes(filter)
                );
                if (!hasInstrumentation) return false;
            }

            // Tags filter
            if (activeTags.length > 0) {
                const hasTag = activeTags.some(filter =>
                    work.tags.includes(filter)
                );
                if (!hasTag) return false;
            }

            return true;
        });
    }, [searchQuery, activeInstrumentation, activeTags]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredWorks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedWorks = filteredWorks.slice(startIndex, endIndex);

    // Track previous filter values
    const prevFiltersRef = useRef({
        searchQuery: '',
        activeInstrumentation: [] as string[],
        activeTags: [] as string[]
    });

    // Reset to page 1 when filters actually change (not on mount)
    useEffect(() => {
        const prevFilters = prevFiltersRef.current;
        const filtersChanged =
            prevFilters.searchQuery !== searchQuery ||
            JSON.stringify(prevFilters.activeInstrumentation) !== JSON.stringify(activeInstrumentation) ||
            JSON.stringify(prevFilters.activeTags) !== JSON.stringify(activeTags);

        // Update the ref with current values
        prevFiltersRef.current = {
            searchQuery,
            activeInstrumentation,
            activeTags
        };

        // Only reset page if filters actually changed AND this isn't the first render
        if (filtersChanged && (prevFilters.searchQuery !== '' || prevFilters.activeInstrumentation.length > 0 || prevFilters.activeTags.length > 0)) {
            if (searchParams.get('page')) {
                setSearchParams(prev => {
                    prev.delete('page');
                    return prev;
                }, { replace: true });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, activeInstrumentation, activeTags]);

    const getPlayableMovements = (work: typeof works[0]) => {
        return (work.movements ?? [])
            .map((movement, idx) => movement.audioUrl ? {
                src: movement.audioUrl,
                title: `${work.title} — ${movement.title || `Movement ${idx + 1}`}`,
                label: movement.title || `Movement ${idx + 1}`,
            } : null)
            .filter(Boolean) as { src: string; title: string; label: string }[];
    };

    const playWholeWork = (work: typeof works[0]) => {
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

    const playWorkFromMovement = (work: typeof works[0], startIndex: number) => {
        const playableMovements = getPlayableMovements(work);
        if (startIndex < 0 || startIndex >= playableMovements.length) return;
        const [first, ...rest] = playableMovements.slice(startIndex);
        playTrackNow({ title: first.title, src: first.src });
        rest.forEach(track => addToQueue({ title: track.title, src: track.src }));
        setPlayMenuOpen(null);
    };

    const handlePlayWork = (work: typeof works[0]) => {
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

    const handleAddToQueue = (work: typeof works[0]) => {
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

    const toggleFilter = (filter: string, type: 'instrumentation' | 'tag') => {
        if (type === 'instrumentation') {
            setActiveInstrumentation(prev =>
                prev.includes(filter)
                    ? prev.filter(f => f !== filter)
                    : [...prev, filter]
            );
        } else {
            setActiveTags(prev =>
                prev.includes(filter)
                    ? prev.filter(f => f !== filter)
                    : [...prev, filter]
            );
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setActiveInstrumentation([]);
        setActiveTags([]);
        setSearchParams({}, { replace: true });
    };

    const goToPage = (page: number) => {
        if (page === 1) {
            setSearchParams(prev => {
                prev.delete('page');
                return prev;
            });
        } else {
            setSearchParams({ page: page.toString() });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen">
            {/* ============================================
          HEADER SECTION
          ============================================ */}
            <section className="py-20 md:py-32 px-6 sm:px-10 md:px-16">
                <div className="max-w-luxury mx-auto">
                    {/* Decorative Line */}
                    <div className="decorative-line mb-8" />

                    {/* Overline */}
                    <p className="text-micro uppercase tracking-editorial text-warmGrey mb-6">
                        Complete Catalog
                    </p>

                    {/* Page Title */}
                    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight-luxury mb-8">
                        Musical <em className="text-gold">Works</em>
                    </h1>

                    {/* Description */}
                    <p className="text-warmGrey text-lg md:text-xl max-w-2xl leading-relaxed">
                        Explore the complete collection of compositions—from intimate piano
                        pieces to grand orchestral works.
                    </p>
                </div>
            </section>

            {/* ============================================
          FILTERS SECTION
          ============================================ */}
            <section className="px-6 sm:px-10 md:px-16 border-t border-charcoal/10 dark:border-alabaster/10">
                <div className="max-w-luxury mx-auto py-8">
                    {/* Search */}
                    <div className="mb-8">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title, instrument, or tag..."
                            className="editorial-input max-w-md"
                        />
                    </div>

                    {/* Filter Groups */}
                    <div className="space-y-6">
                        {/* Instrumentation */}
                        <div>
                            <button
                                onClick={() => setShowInstrumentation(!showInstrumentation)}
                                className="flex items-center justify-between w-full md:pointer-events-none py-2"
                            >
                                <p className="text-micro uppercase tracking-editorial text-warmGrey">
                                    Instrumentation
                                    {activeInstrumentation.length > 0 && (
                                        <span className="ml-2 text-gold">({activeInstrumentation.length})</span>
                                    )}
                                </p>
                                <svg
                                    className={`w-4 h-4 md:hidden text-warmGrey transition-transform ${showInstrumentation ? 'rotate-180' : ''}`}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 md:overflow-visible ${showInstrumentation ? 'max-h-96 mt-2' : 'max-h-0 md:max-h-none md:mt-3'}`}>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {instrumentationFilters.map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => toggleFilter(filter, 'instrumentation')}
                                            aria-pressed={activeInstrumentation.includes(filter)}
                                            className={`pill-filter hover-lift text-xs uppercase tracking-editorial ${activeInstrumentation.includes(filter) ? 'is-active' : ''}`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <button
                                onClick={() => setShowStyle(!showStyle)}
                                className="flex items-center justify-between w-full md:pointer-events-none py-2"
                            >
                                <p className="text-micro uppercase tracking-editorial text-warmGrey">
                                    Style
                                    {activeTags.length > 0 && (
                                        <span className="ml-2 text-gold">({activeTags.length})</span>
                                    )}
                                </p>
                                <svg
                                    className={`w-4 h-4 md:hidden text-warmGrey transition-transform ${showStyle ? 'rotate-180' : ''}`}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 md:overflow-visible ${showStyle ? 'max-h-[500px] mt-2' : 'max-h-0 md:max-h-none md:mt-3'}`}>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {tagFilters.map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => toggleFilter(filter, 'tag')}
                                            aria-pressed={activeTags.includes(filter)}
                                            className={`pill-filter hover-lift text-xs uppercase tracking-editorial ${activeTags.includes(filter) ? 'is-active' : ''}`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Active Filters Summary */}
                    {(activeInstrumentation.length > 0 || activeTags.length > 0) && (
                        <div className="mt-6 pt-6 border-t border-charcoal/10 dark:border-alabaster/10 flex flex-wrap items-center gap-3">
                            <span className="text-micro uppercase tracking-editorial text-warmGrey">
                                Active filters:
                            </span>
                            {activeInstrumentation.map(filter => (
                                <button
                                    key={`inst-${filter}`}
                                    type="button"
                                    onClick={() => toggleFilter(filter, 'instrumentation')}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-charcoal border border-gold/50 hover:bg-gold/25 transition-colors duration-300 dark:text-charcoal dark:bg-gold/20 dark:border-gold/60"
                                    aria-label={`Remove ${filter} filter`}
                                >
                                    {filter}
                                    <span aria-hidden="true">×</span>
                                </button>
                            ))}
                            {activeTags.map(filter => (
                                <button
                                    key={`tag-${filter}`}
                                    type="button"
                                    onClick={() => toggleFilter(filter, 'tag')}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-charcoal border border-gold/50 hover:bg-gold/25 transition-colors duration-300 dark:text-charcoal dark:bg-gold/20 dark:border-gold/60"
                                    aria-label={`Remove ${filter} filter`}
                                >
                                    {filter}
                                    <span aria-hidden="true">×</span>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-xs uppercase tracking-editorial text-charcoal dark:text-alabaster link-interactive"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="mt-8 pt-8 border-t border-charcoal/10 dark:border-alabaster/10">
                        <p className="text-micro uppercase tracking-editorial text-warmGrey">
                            Showing {startIndex + 1}–{Math.min(endIndex, filteredWorks.length)} of {filteredWorks.length} works
                        </p>
                    </div>
                </div>
            </section>

            {/* ============================================
          WORKS GRID
          ============================================ */}
            <section className="py-12 md:py-20 px-6 sm:px-10 md:px-16">
                <div className="max-w-luxury mx-auto">
                    {paginatedWorks.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="font-serif text-2xl text-warmGrey mb-4">
                                No works found
                            </p>
                            <button
                                onClick={clearFilters}
                                className="text-xs uppercase tracking-editorial text-charcoal dark:text-alabaster link-interactive"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-12">
                                {paginatedWorks.map((work, index) => (
                                    <article
                                        key={work.id}
                                        className={`group border-t border-charcoal dark:border-alabaster/20 pt-8 animate-fade-in-up relative overflow-visible ${playMenuOpen === work.id ? 'z-50' : 'z-0'}`}
                                        style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
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
                                        <div className="flex flex-col">
                                            <p className="text-[10px] md:text-micro uppercase tracking-editorial text-warmGrey mb-1 md:mb-2">
                                                {work.year} · {work.instrumentation.join(', ')}
                                            </p>
                                            <h3 className="font-serif text-lg md:text-2xl lg:text-3xl mb-2 md:mb-3 group-hover:text-gold transition-colors duration-500 leading-tight">
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

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 md:gap-6 relative flex-wrap" data-play-menu>
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-16 pt-8 border-t border-charcoal/10 dark:border-alabaster/10">
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3">
                                        {/* Previous Button */}
                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`
                                                w-full sm:w-auto px-4 py-2 text-xs uppercase tracking-editorial border transition-all duration-500 text-center
                                                ${currentPage === 1
                                                    ? 'text-warmGrey/50 border-charcoal/10 dark:border-alabaster/10 cursor-not-allowed'
                                                    : 'text-charcoal dark:text-alabaster border-charcoal/20 dark:border-alabaster/20 hover:border-charcoal dark:hover:border-alabaster hover:text-charcoal dark:hover:text-alabaster'
                                                }
                                            `}
                                        >
                                            ← Previous
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => goToPage(page)}
                                                    className={`
                                                        w-10 h-10 text-xs uppercase tracking-editorial border transition-all duration-500
                                                        ${page === currentPage
                                                            ? 'bg-charcoal dark:bg-alabaster text-alabaster dark:text-charcoal border-charcoal dark:border-alabaster'
                                                            : 'text-charcoal dark:text-alabaster border-charcoal/20 dark:border-alabaster/20 hover:border-charcoal dark:hover:border-alabaster'
                                                        }
                                                    `}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`
                                                w-full sm:w-auto px-4 py-2 text-xs uppercase tracking-editorial border transition-all duration-500 text-center
                                                ${currentPage === totalPages
                                                    ? 'text-warmGrey/50 border-charcoal/10 dark:border-alabaster/10 cursor-not-allowed'
                                                    : 'text-charcoal dark:text-alabaster border-charcoal/20 dark:border-alabaster/20 hover:border-charcoal dark:hover:border-alabaster hover:text-charcoal dark:hover:text-alabaster'
                                                }
                                            `}
                                        >
                                            Next →
                                        </button>
                                    </div>

                                    {/* Page Info */}
                                    <p className="text-center mt-6 text-micro uppercase tracking-editorial text-warmGrey">
                                        Page {currentPage} of {totalPages}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

