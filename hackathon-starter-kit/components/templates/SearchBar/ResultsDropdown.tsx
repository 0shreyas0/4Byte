import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { ResultItem } from './ResultItem';
import { Item } from './hooks/useSearchBar';

interface ResultsDropdownProps {
  loading: boolean;
  error: string | null;
  results: Item[];
  query: string;
  onItemClick: (item: Item) => void;
}

export const ResultsDropdown: React.FC<ResultsDropdownProps> = ({
  loading,
  error,
  results,
  query,
  onItemClick
}) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8 px-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
          <span className="text-sm text-muted-foreground">
            Searching...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 flex items-start gap-3 text-sm bg-destructive/10 border-t border-destructive/20">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-action text-destructive">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          {results.map((item) => (
            <ResultItem 
              key={item._id} 
              item={item} 
              onClick={onItemClick} 
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && results.length === 0 && query && (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No items found for "{query}"
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search terms
          </p>
        </div>
      )}
    </div>
  );
};
