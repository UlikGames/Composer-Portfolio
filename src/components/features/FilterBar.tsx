import { useState } from 'react';
import { FilterBarProps } from '@/types';
import { FilterButton } from './FilterButton';
import { cn } from '@/utils/cn';

/**
 * Filter bar component for filtering works by instrumentation and tags
 * Collapsible sections on mobile to save space
 */
export const FilterBar = ({
  instrumentationFilters,
  tagFilters,
  activeInstrumentation,
  activeTags,
  onInstrumentationChange,
  onTagChange,
}: FilterBarProps) => {
  const [instrumentationOpen, setInstrumentationOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  const handleInstrumentationToggle = (filter: string) => {
    if (activeInstrumentation.includes(filter)) {
      onInstrumentationChange(activeInstrumentation.filter(f => f !== filter));
    } else {
      onInstrumentationChange([...activeInstrumentation, filter]);
    }
  };

  const handleTagToggle = (filter: string) => {
    if (activeTags.includes(filter)) {
      onTagChange(activeTags.filter(f => f !== filter));
    } else {
      onTagChange([...activeTags, filter]);
    }
  };

  return (
    <div className="space-y-3 md:space-y-6 mb-6 md:mb-8">
      {/* Instrumentation Filters */}
      <div>
        <button
          onClick={() => setInstrumentationOpen(!instrumentationOpen)}
          className="flex items-center justify-between w-full md:pointer-events-none"
        >
          <h3 className="text-sm md:text-lg font-bold text-text-light dark:text-text-dark">
            Instrumentation
            {activeInstrumentation.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gold">({activeInstrumentation.length})</span>
            )}
          </h3>
          <svg
            className={cn(
              "w-4 h-4 md:hidden text-warmGrey transition-transform",
              instrumentationOpen && "rotate-180"
            )}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        <div className={cn(
          "overflow-hidden transition-all duration-300 md:overflow-visible",
          instrumentationOpen ? "max-h-96 mt-3" : "max-h-0 md:max-h-none md:mt-4"
        )}>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {instrumentationFilters.map(filter => (
              <FilterButton
                key={filter}
                label={filter}
                active={activeInstrumentation.includes(filter)}
                onClick={() => handleInstrumentationToggle(filter)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tag Filters */}
      <div>
        <button
          onClick={() => setTagsOpen(!tagsOpen)}
          className="flex items-center justify-between w-full md:pointer-events-none"
        >
          <h3 className="text-sm md:text-lg font-bold text-text-light dark:text-text-dark">
            Style
            {activeTags.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gold">({activeTags.length})</span>
            )}
          </h3>
          <svg
            className={cn(
              "w-4 h-4 md:hidden text-warmGrey transition-transform",
              tagsOpen && "rotate-180"
            )}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        <div className={cn(
          "overflow-hidden transition-all duration-300 md:overflow-visible",
          tagsOpen ? "max-h-[500px] mt-3" : "max-h-0 md:max-h-none md:mt-4"
        )}>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {tagFilters.map(filter => (
              <FilterButton
                key={filter}
                label={filter}
                active={activeTags.includes(filter)}
                onClick={() => handleTagToggle(filter)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(activeInstrumentation.length > 0 || activeTags.length > 0) && (
        <div className="pt-2">
          <button
            onClick={() => {
              onInstrumentationChange([]);
              onTagChange([]);
            }}
            className="text-sm text-gold hover:underline focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
