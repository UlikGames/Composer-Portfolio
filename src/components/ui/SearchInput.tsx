import { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

/**
 * Search input - minimalist with border-bottom focus
 */
export const SearchInput = ({ className, onClear, value, ...props }: SearchInputProps) => {
  const hasValue = value && String(value).length > 0;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-text-muted-light dark:text-text-muted-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        className={cn(
          'w-full pl-10 pr-10 py-2.5',
          'border border-border-light dark:border-border-dark',
          'bg-transparent',
          'text-text-light dark:text-text-dark text-sm',
          'placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark',
          'focus:outline-none focus:border-text-light dark:focus:border-text-dark',
          'transition-colors duration-200',
          className
        )}
        value={value}
        {...props}
      />
      {hasValue && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Clear search"
        >
          <svg
            className="h-4 w-4 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
