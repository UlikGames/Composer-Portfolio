import { useEffect, useState } from 'react';

/**
 * Editorial Back to Top Button
 */
export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 h-12 w-12 border border-charcoal/20 dark:border-alabaster/20 bg-alabaster dark:bg-charcoal text-charcoal dark:text-alabaster flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-500 shadow-luxury animate-fade-in"
      aria-label="Back to top"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};
