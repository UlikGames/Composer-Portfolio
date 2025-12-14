import { ReactNode, useEffect, useState, useRef } from 'react';
import { useLocation, Location } from 'react-router-dom';
import { PageLoader } from './PageLoader';
import { cn } from '@/utils/cn';

interface PageTransitionWrapperProps {
  children: (location: Location) => ReactNode;
}

/**
 * Page transition wrapper that delays route changes for smooth transitions
 * Provides smooth page transitions with loading states
 */
export const PageTransitionWrapper = ({ children }: PageTransitionWrapperProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isLoading, setIsLoading] = useState(false);
  const [transitionStage, setTransitionStage] = useState<'entering' | 'entered' | 'exiting'>('entered');
  const prevPathnameRef = useRef(location.pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip transition on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setDisplayLocation(location);
      return;
    }

    // Only trigger transition if pathname actually changed
    if (location.pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = location.pathname;
      
      // Start exit animation
      setTransitionStage('exiting');
      setIsLoading(true);

      // After exit animation, update location and start enter animation
      const exitTimer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('entering');

        // After enter animation starts, complete the transition
        const enterTimer = setTimeout(() => {
          setTransitionStage('entered');
          setIsLoading(false);
        }, 150);

        return () => clearTimeout(enterTimer);
      }, 200);

      return () => clearTimeout(exitTimer);
    } else {
      // Same route, just update display location
      setDisplayLocation(location);
    }
  }, [location]);

  return (
    <>
      {/* Loading overlay during transition */}
      {isLoading && <PageLoader />}

      {/* Animated page container */}
      <div
        className={cn(
          'min-h-full transition-all duration-300 ease-in-out',
          transitionStage === 'exiting' && 'opacity-0 translate-y-4',
          transitionStage === 'entering' && 'opacity-0 translate-y-4',
          transitionStage === 'entered' && 'opacity-100 translate-y-0'
        )}
        key={displayLocation.pathname}
      >
        {children(displayLocation)}
      </div>
    </>
  );
};

