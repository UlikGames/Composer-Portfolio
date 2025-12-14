import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from '@/components/features/ThemeToggle';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/works', label: 'Works' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
];

/**
 * Editorial Header Component
 * Minimal, elegant navigation with Playfair Display logo
 */
export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { isShuffle, isPlaying, currentTrack, toggleShuffle, togglePlay } = useAudioPlayer();

    const hasTrack = Boolean(currentTrack);

    const handleListenClick = () => {
        if (!isShuffle && !hasTrack) {
            // No track and no shuffle - enable shuffle mode
            toggleShuffle();
        } else {
            // Either has a track or shuffle is on - toggle play/pause
            togglePlay();
        }
    };

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 bg-alabaster/95 dark:bg-charcoal/95 backdrop-blur-sm border-b border-charcoal/10 dark:border-alabaster/10"
                style={{ '--header-height': '80px' } as React.CSSProperties}
            >
                <div className="max-w-luxury mx-auto px-8 md:px-16">
                    <div className="flex items-center justify-between h-20 md:h-24">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="font-serif text-xl md:text-2xl tracking-tight text-charcoal dark:text-alabaster link-interactive"
                        >
                            Ulvin Najafov
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`
                                        relative text-xs uppercase tracking-editorial font-medium link-interactive
                                        transition-all duration-300 group
                                        ${location.pathname === link.to
                                            ? 'text-charcoal dark:text-alabaster'
                                            : 'text-warmGrey hover:text-charcoal dark:hover:text-alabaster'
                                        }
                                    `}
                                >
                                    {link.label}
                                    <span className={`
                                        absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300
                                        ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'}
                                    `} />
                                </Link>
                            ))}

                            {/* Listen Button */}
                            <button
                                onClick={handleListenClick}
                                className={`
                                    flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-editorial font-medium
                                    border rounded-full transition-all duration-300
                                    ${isPlaying || hasTrack || isShuffle
                                        ? 'bg-gold border-gold text-charcoal'
                                        : 'border-charcoal/20 dark:border-alabaster/20 text-charcoal dark:text-alabaster hover:border-gold hover:text-gold'
                                    }
                                `}
                                aria-label={isPlaying ? 'Pause' : hasTrack ? 'Resume' : 'Play'}
                            >
                                {isPlaying ? (
                                    <>
                                        <span className="flex gap-0.5">
                                            <span className="w-0.5 h-3 bg-current animate-pulse" style={{ animationDelay: '0ms' }} />
                                            <span className="w-0.5 h-3 bg-current animate-pulse" style={{ animationDelay: '150ms' }} />
                                            <span className="w-0.5 h-3 bg-current animate-pulse" style={{ animationDelay: '300ms' }} />
                                        </span>
                                        Playing
                                    </>
                                ) : hasTrack || isShuffle ? (
                                    <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5,3 19,12 5,21" />
                                        </svg>
                                        Paused
                                    </>
                                ) : (
                                    <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5,3 19,12 5,21" />
                                        </svg>
                                        Listen
                                    </>
                                )}
                            </button>

                            {/* Theme Toggle */}
                            <ThemeToggle className="ml-4" />
                        </nav>

                        {/* Mobile: Listen + Theme Toggle + Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            {/* Mobile Listen Button */}
                            <button
                                onClick={handleListenClick}
                                className={`
                                    p-3 rounded-full transition-all duration-300
                                    ${isPlaying || hasTrack || isShuffle
                                        ? 'bg-gold text-charcoal'
                                        : 'bg-alabaster/90 dark:bg-charcoal/90 border border-charcoal/15 dark:border-alabaster/15 text-charcoal dark:text-alabaster'
                                    }
                                `}
                                aria-label={isPlaying ? 'Pause' : hasTrack ? 'Resume' : 'Play'}
                            >
                                {isPlaying ? (
                                    <span className="flex gap-0.5">
                                        <span className="w-0.5 h-3 bg-current animate-pulse" style={{ animationDelay: '0ms' }} />
                                        <span className="w-0.5 h-3 bg-current animate-pulse" style={{ animationDelay: '150ms' }} />
                                        <span className="w-0.5 h-3 bg-current animate-pulse" style={{ animationDelay: '300ms' }} />
                                    </span>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5,3 19,12 5,21" />
                                    </svg>
                                )}
                            </button>
                            <ThemeToggle />
                            <button
                                className="flex flex-col gap-1.5 p-3 rounded-full bg-alabaster/90 dark:bg-charcoal/90 border border-charcoal/15 dark:border-alabaster/15 shadow-md hover:shadow-lg transition-all duration-300 text-charcoal dark:text-alabaster"
                                onClick={() => setIsMobileMenuOpen(true)}
                                aria-label="Open menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="w-6 h-[2px] bg-current rounded-full transition-all duration-300" />
                                <span className="w-6 h-[2px] bg-current rounded-full transition-all duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
        </>
    );
};
