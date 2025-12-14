import { FilterButtonProps } from '@/types';
import { cn } from '@/utils/cn';

/**
 * Filter button component with active state
 * Used in FilterBar for instrumentation and tag filters
 */
export const FilterButton = ({
  label,
  active,
  onClick,
}: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'pill-filter hover-lift group text-xs md:text-sm font-medium',
        'focus:outline-none focus:ring-2 focus:ring-charcoal dark:focus:ring-alabaster focus:ring-offset-2 dark:focus:ring-offset-charcoal',
        active && 'is-active'
      )}
      aria-pressed={active}
    >
      {active && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="animate-fade-in">
          <path d="M9 16.17L4.83 12l-1.41 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      )}
      {label}
    </button>
  );
};
