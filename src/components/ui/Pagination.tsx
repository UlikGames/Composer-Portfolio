import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Pagination - minimalist design
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={cn('flex items-center justify-center gap-2', className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'px-4 py-2 text-xs uppercase tracking-widest',
          'border border-border-light dark:border-border-dark',
          'text-text-light dark:text-text-dark',
          'hover:bg-surface-light dark:hover:bg-surface-dark',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-colors'
        )}
        aria-label="Previous page"
      >
        Prev
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-text-muted-light dark:text-text-muted-dark"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'w-10 h-10 text-sm font-medium',
                'border transition-colors',
                isActive
                  ? 'bg-text-light dark:bg-text-dark text-white dark:text-black border-text-light dark:border-text-dark'
                  : 'border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:bg-surface-light dark:hover:bg-surface-dark'
              )}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'px-4 py-2 text-xs uppercase tracking-widest',
          'border border-border-light dark:border-border-dark',
          'text-text-light dark:text-text-dark',
          'hover:bg-surface-light dark:hover:bg-surface-dark',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-colors'
        )}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
};
