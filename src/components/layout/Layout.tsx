import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LayoutProps } from '@/types';
import { SkipLink } from '@/components/ui/SkipLink';
import { GlobalAudioPlayer } from '@/components/features/GlobalAudioPlayer';
import { BackToTop } from '@/components/ui/BackToTop';

/**
 * Editorial Layout Component
 * Wraps all pages with header, footer, and decorative elements
 */
export const Layout = ({ children }: LayoutProps) => {
  const [isFooterVisible, setFooterVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setFooterRef = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          setFooterVisible(entry?.isIntersecting ?? false);
        },
        { threshold: 0.2 }
      );

      observerRef.current.observe(node);
    } else {
      setFooterVisible(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-alabaster dark:bg-charcoal text-charcoal dark:text-alabaster transition-colors duration-300">
      <SkipLink />

      {/* Paper Noise Texture Overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Editorial Grid Lines (Desktop Only) */}
      <div className="editorial-grid-lines" aria-hidden="true">
        <div className="grid-line" />
        <div className="grid-line" />
      </div>

      <Header />

      <main
        id="main-content"
        className="relative z-10 flex-1 bg-transparent pt-20 md:pt-24 pb-20 md:pb-24"
        tabIndex={-1}
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>

      <Footer ref={setFooterRef} />
      <GlobalAudioPlayer isFooterVisible={isFooterVisible} />
      <BackToTop />
    </div>
  );
};
