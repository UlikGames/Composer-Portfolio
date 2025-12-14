import { ReactNode, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLoader } from './PageLoader';
import { cn } from '@/utils/cn';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Page transition wrapper component
 * Provides smooth transitions between pages with loading state
 */
export const PageTransition = ({ children, className }: PageTransitionProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'entering' | 'entered' | 'exiting'>('entered');
  const prevPathnameRef = useRef(location.pathname);

  useEffect(() => {
    // Only trigger transition if pathname actually changed
    if (location.pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = location.pathname;
      
      setTransitionStage('exiting');
      setIsLoading(true);
      
      // Wait for exit animation
      const exitTimer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('entering');
        
        // Wait for enter animation
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
      setTransitionStage('entered');
      setIsLoading(false);
    }
  }, [location]);

  return (
    <>
      {/* Loading overlay */}
      {isLoading && <PageLoader />}

      {/* Page content with transition */}
      <div
        className={cn(
          'min-h-full transition-all duration-300 ease-in-out',
          transitionStage === 'exiting' && 'opacity-0 translate-y-4',
          transitionStage === 'entering' && 'opacity-0 translate-y-4',
          transitionStage === 'entered' && 'opacity-100 translate-y-0',
          className
        )}
        key={displayLocation.pathname}
      >
        {children}
      </div>
    </>
  );
};

