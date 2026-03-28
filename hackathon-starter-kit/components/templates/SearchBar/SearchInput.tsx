import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface SearchInputProps {
  placeholder: string;
  query: string;
  setQuery: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  query,
  setQuery,
  onFocus,
  onClear
}) => {
  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        className="pl-10 pr-10 h-10 w-full"
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

      {query && (
        <button
          onClick={onClear}
          className="absolute right-3 top-3 h-4 w-4"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      )}
    </div>
  );
};
