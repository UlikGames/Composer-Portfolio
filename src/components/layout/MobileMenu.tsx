import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MobileMenuProps } from '@/types';
import { cn } from '@/utils/cn';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { works } from '@/data/worksData';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/works', label: 'Works' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Editorial Mobile Menu - Full screen overlay
 */
export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const { currentTrack, isPlaying, togglePlay } = useAudioPlayer();
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

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
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      setIsEntering(false);
      requestAnimationFrame(() => setIsEntering(true));
    } else if (isVisible) {
      setIsClosing(true);
      setIsEntering(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onClose]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[1200] bg-charcoal/80 dark:bg-charcoal/90 backdrop-blur-lg transition-opacity duration-300",
          isClosing || !isEntering ? "opacity-0" : "opacity-100"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'fixed inset-0 sm:inset-y-0 sm:right-0 z-[1210]',
          'w-full sm:w-[24rem]',
          'bg-alabaster/98 dark:bg-charcoal/98 backdrop-blur-xl',
          'shadow-2xl',
          'transition-all duration-300 sm:duration-400 ease-out',
          (isClosing || !isEntering) ? 'opacity-0 translate-y-4 sm:translate-x-6' : 'opacity-100 translate-y-0 sm:translate-x-0'
        )}
      >
        <div className="relative flex flex-col h-full">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex flex-col justify-center items-center w-10 h-10 text-charcoal dark:text-alabaster hover:text-gold transition-colors duration-500 transform transition-transform duration-300 hover:rotate-90 active:scale-90"
            aria-label="Close menu"
          >
            <span className="w-6 h-px bg-current rotate-45 translate-y-px" />
            <span className="w-6 h-px bg-current -rotate-45 -translate-y-px" />
          </button>

          {/* Navigation Links */}
          <nav className="flex-1 p-8 pt-24">
            <p className="text-micro uppercase tracking-editorial text-warmGrey mb-8">
              Navigate
            </p>
            <ul className="space-y-6">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className={cn(
                      'block font-serif text-3xl transition-colors duration-500 link-interactive',
                      location.pathname === link.to
                        ? 'text-charcoal dark:text-alabaster'
                        : 'text-warmGrey hover:text-charcoal dark:hover:text-alabaster'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Now Playing */}
            {currentTrack && (
              <div className="mt-12 pt-8 border-t border-charcoal/10 dark:border-alabaster/10">
                <div className="flex items-center gap-4">
                  {artworkMap.get(currentTrack.src) ? (
                    <img
                      src={artworkMap.get(currentTrack.src)}
                      alt={currentTrack.title}
                      className="h-12 w-12 object-cover grayscale"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-taupe dark:bg-warmGrey/30 flex items-center justify-center text-xs font-medium text-charcoal dark:text-alabaster">
                      {currentTrack.title.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-micro uppercase tracking-editorial text-warmGrey">
                      Now Playing
                    </p>
                    <p className="truncate font-serif text-charcoal dark:text-alabaster">
                      {currentTrack.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="h-10 w-10 border border-charcoal/20 dark:border-alabaster/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-500"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};
