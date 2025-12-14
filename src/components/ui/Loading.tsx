import { cn } from '@/utils/cn';

interface LoadingProps {
  className?: string;
  text?: string;
}

/**
 * Editorial Loading Spinner
 */
export const Loading = ({ className, text = 'Loading' }: LoadingProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 border border-charcoal/20" />
        <div className="absolute inset-0 border-t border-gold animate-spin" />
      </div>
      <p className="text-micro uppercase tracking-editorial text-warmGrey">{text}</p>
    </div>
  );
};

interface ImageLoadingProps {
  className?: string;
  aspectRatio?: 'square' | 'wide' | 'portrait';
}

/**
 * Editorial Image Loading Placeholder
 */
export const ImageLoading = ({ className, aspectRatio = 'portrait' }: ImageLoadingProps) => {
  const aspectClasses = {
    square: 'aspect-square',
    wide: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div className={cn(
      'w-full bg-taupe animate-pulse',
      aspectClasses[aspectRatio],
      className
    )}>
      <div className="h-full w-full flex items-center justify-center">
        <span className="font-serif text-4xl text-warmGrey/30">♪</span>
      </div>
    </div>
  );
};
