import { useMemo } from 'react';
import { works } from '@/data/worksData';
import { Work, FilterState } from '@/types';

/**
 * Hook to filter works based on instrumentation and tags
 */
export const useWorks = (filters: FilterState): Work[] => {
  return useMemo(() => {
    return works.filter(work => {
      // Filter by instrumentation
      if (filters.instrumentation.length > 0) {
        const hasInstrumentation = filters.instrumentation.some(filter =>
          work.instrumentation.includes(filter)
        );
        if (!hasInstrumentation) return false;
      }
      
      // Filter by tags
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some(filter =>
          work.tags.includes(filter)
        );
        if (!hasTag) return false;
      }
      
      return true;
    });
  }, [filters]);
};

/**
 * Hook to get a single work by ID
 */
export const useWork = (id: string | undefined): Work | undefined => {
  return useMemo(() => {
    if (!id) return undefined;
    return works.find(work => work.id === id);
  }, [id]);
};
