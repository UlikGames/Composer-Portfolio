import { FilterBarProps } from '@/types';
import { FilterButton } from './FilterButton';

/**
 * Filter bar component for filtering works by instrumentation and tags
 */
export const FilterBar = ({
  instrumentationFilters,
  tagFilters,
  activeInstrumentation,
  activeTags,
  onInstrumentationChange,
  onTagChange,
}: FilterBarProps) => {
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
    <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
      {/* Instrumentation Filters */}
      <div>
        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-text-light dark:text-text-dark">
          Filter by Instrumentation
        </h3>
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

      {/* Tag Filters */}
      <div>
        <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-text-light dark:text-text-dark">
          Filter by Tags
        </h3>
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

      {/* Clear Filters Button */}
      {(activeInstrumentation.length > 0 || activeTags.length > 0) && (
        <div className="pt-2">
          <button
            onClick={() => {
              onInstrumentationChange([]);
              onTagChange([]);
            }}
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

