import { CardProps } from '@/types';
import { cn } from '@/utils/cn';

/**
 * Editorial Card Component
 * Border-top pattern with subtle shadow evolution
 */
export const Card = ({
  children,
  className,
  variant = 'default',
}: CardProps) => {
  return (
    <div
      className={cn(
        // Base styles - Editorial pattern
        'bg-transparent border-t border-charcoal',
        'transition-all duration-500',
        // Variant styles
        variant === 'elevated' && [
          'shadow-luxury-sm hover:shadow-luxury',
          'hover:bg-alabaster/50',
        ],
        variant === 'default' && [
          'hover:bg-taupe/20',
        ],
        className
      )}
    >
      {children}
    </div>
  );
};
