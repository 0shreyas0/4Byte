import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api/fetcher';
import { fuzzySearch } from '@/algorithms';

export interface Item {
  _id: string;
  title: string;
  type?: 'lost' | 'found' | string;
  category?: string;
  description?: string;
  images?: string[];
  location?: {
    address: string;
  };
  date?: string;
  createdAt?: string;
  user?: {
    _id: string;
    name: string;
  };
  upvotes?: string[];
  downvotes?: string[];
}

export const useSearch = (maxResults: number, localItems?: Item[]) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const performLocalSearch = useCallback((searchTerm: string, items: Item[]) => {
    if (!searchTerm.trim()) return [];
    
    return items
      .map(item => ({
        item,
        score: Math.max(
          fuzzySearch(searchTerm, item.title),
          item.description ? fuzzySearch(searchTerm, item.description) * 0.8 : 0,
          item.category ? fuzzySearch(searchTerm, item.category) * 0.5 : 0
        )
      }))
      .filter(res => res.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(res => res.item)
      .slice(0, maxResults);
  }, [maxResults]);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setError(null);
      setShowResults(false);
      return;
    }

    if (localItems && localItems.length > 0) {
      const filtered = performLocalSearch(query, localItems);
      setResults(filtered);
      setShowResults(true);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const encodedQuery = encodeURIComponent(query.trim());
        const data = await api.get<Item[]>(`/items?search=${encodedQuery}`, {
          signal: abortController.signal,
        });

        if (!abortController.signal.aborted && Array.isArray(data)) {
          const ranked = data
            .map(item => ({
              item,
              score: fuzzySearch(query, item.title)
            }))
            .sort((a, b) => b.score - a.score)
            .map(res => res.item)
            .slice(0, maxResults);

          setResults(ranked);
          setShowResults(true);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        console.error('Search failed:', err);
        setError('Failed to fetch search results. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, maxResults, localItems, performLocalSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setShowResults(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    showResults,
    setShowResults,
    handleClear
  };
};
