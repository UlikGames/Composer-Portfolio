import { Link } from 'react-router-dom';
import { HeroProps } from '@/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

/**
 * Hero component with background image support
 * Used on HomePage for striking first impression
 */
export const Hero = ({
  title,
  subtitle,
  description,
  backgroundImage,
  primaryCTA,
  secondaryCTA,
  className,
}: HeroProps & { className?: string }) => {
  return (
    <div className={cn('relative min-h-[60vh] md:h-[calc(100vh-80px)] w-full flex items-center justify-center py-12 md:py-0', className)}>
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            aria-hidden="true"
            onError={(e) => {
              // Hide image if it fails to load, fallback to gradient
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-background-light/70 dark:bg-background-dark/70"></div>
        </div>
      )}
      
      {/* Gradient Background Fallback (when no image) */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-background-light dark:from-background-dark to-surface-light dark:to-surface-dark">
          <div className="absolute inset-0 bg-background-light/70 dark:bg-background-dark/70"></div>
        </div>
      )}
      
      {/* Content */}
      <Container className="relative z-10 text-center px-4 md:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-text-light dark:text-text-dark mb-3 md:mb-4 animate-fade-in">
          {title}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-text-light/90 dark:text-text-dark/90 mb-3 md:mb-4 animate-fade-in-delay">
          {subtitle}
        </p>
        <p className="text-base md:text-lg text-text-muted-light dark:text-text-muted-dark mb-6 md:mb-8 max-w-2xl mx-auto px-4 animate-fade-in-delay-2">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center animate-fade-in-delay-3">
          <Link to={primaryCTA.href} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              {primaryCTA.label}
            </Button>
          </Link>
          {secondaryCTA && (
            <Link to={secondaryCTA.href} className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                {secondaryCTA.label}
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </div>
  );
};

