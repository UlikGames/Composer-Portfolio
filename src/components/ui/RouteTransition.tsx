import { ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLoader } from './PageLoader';
import { cn } from '@/utils/cn';

interface RouteTransitionProps {
  children: ReactNode;
}

/**
 * Editorial Route Transition
 * Smooth wipe animation on route changes
 */
export const RouteTransition = ({ children }: RouteTransitionProps) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'wipe-out' | 'wipe-in'>('idle');
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === previousPath.current) return;
    previousPath.current = location.pathname;
    setIsAnimating(true);
    setPhase('wipe-out');

    const outTimer = setTimeout(() => {
      setPhase('wipe-in');
      const inTimer = setTimeout(() => {
        setPhase('idle');
        setIsAnimating(false);
      }, 400);
      return () => clearTimeout(inTimer);
    }, 400);

    return () => clearTimeout(outTimer);
  }, [location.pathname]);

  return (
    <>
      {isAnimating && <PageLoader />}
      <div
        className={cn(
          'relative z-10 min-h-full transition-all duration-700 ease-out',
          phase === 'wipe-out' && 'opacity-0 translate-y-4',
          phase === 'wipe-in' && 'opacity-0 -translate-y-4',
          phase === 'idle' && 'opacity-100 translate-y-0'
        )}
        key={location.pathname}
      >
        {children}
      </div>
      {/* Editorial Wipe Overlay */}
      <div
        className={cn(
          'pointer-events-none fixed inset-0 z-[999]',
          'bg-taupe dark:bg-charcoal',
          'translate-x-[120%] transition-transform duration-700',
          phase === 'wipe-out' && 'translate-x-0',
          phase === 'wipe-in' && '-translate-x-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      />
    </>
  );
};
