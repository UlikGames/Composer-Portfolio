import { ContainerProps } from '@/types';
import { cn } from '@/utils/cn';

/**
 * Editorial Container Component
 * 1600px max width with generous padding
 */
export const Container = ({
  children,
  className,
  maxWidth = 'xl',
}: ContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto w-full px-8 md:px-16',
        maxWidthStyles[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
};

const maxWidthStyles = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-luxury',
  '2xl': 'max-w-luxury',
  full: 'max-w-full',
};
