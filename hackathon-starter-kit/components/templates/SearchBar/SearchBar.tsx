'use client';

import { useEffect, useRef } from 'react';
import { useSearch, Item } from './hooks/useSearchBar';
import { SearchInput } from './SearchInput';
import { ResultsDropdown } from './ResultsDropdown';

interface SearchBarProps {
  onItemSelect?: (item: Item) => void;
  placeholder?: string;
  maxResults?: number;
}

export default function SearchBar({
  onItemSelect,
  placeholder = 'Search for items...',
  maxResults = 6,
}: SearchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    showResults,
    setShowResults,
    handleClear
  } = useSearch(maxResults);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowResults]);

  const handleItemClick = (item: Item) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
    handleClear();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <SearchInput 
        placeholder={placeholder}
        query={query}
        setQuery={setQuery}
        onFocus={() => query && setShowResults(true)}
        onClear={handleClear}
      />

      {showResults && query && (
        <ResultsDropdown 
          loading={loading}
          error={error}
          results={results}
          query={query}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
}
