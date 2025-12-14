import { useState, useMemo, useEffect } from 'react';
import { Work } from '@/types';

export interface UseSearchOptions {
  searchFields?: (keyof Work)[];
  debounceMs?: number;
}

/**
 * Hook for search functionality
 * Searches through works by title, tags, instrumentation, etc.
 */
export function useSearch<T extends Work>(
  items: T[],
  options: UseSearchOptions = {}
): {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: T[];
  isSearching: boolean;
} {
  const { searchFields = ['title', 'tags', 'instrumentation'], debounceMs = 300 } = options;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return items;
    }

    const searchLower = debouncedSearchTerm.toLowerCase().trim();

    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        
        if (Array.isArray(value)) {
          // Search in arrays (tags, instrumentation)
          return value.some(v => 
            v.toLowerCase().includes(searchLower)
          );
        }
        
        if (typeof value === 'string') {
          // Search in strings (title, description)
          return value.toLowerCase().includes(searchLower);
        }
        
        return false;
      });
    });
  }, [items, debouncedSearchTerm, searchFields]);

  const isSearching = searchTerm.trim().length > 0;

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    isSearching,
  };
}

