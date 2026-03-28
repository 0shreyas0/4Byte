/**
 * Debounce function to limit how often a function can be called.
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function to ensure a function is called at most once in a specified time.
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Simple UUID generator.
 */
export const uuid = () => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * Deep clone an object.
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Group an array of objects by a key.
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, currentValue) => {
    const groupKey = String(currentValue[key]);
    (result[groupKey] = result[groupKey] || []).push(currentValue);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Sort an array of objects by a key.
 */
export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Fuzzy search algorithm that returns a score representing how well a target matches a query.
 */
export const fuzzySearch = (query: string, target: string): number => {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  
  if (q === t) return 100;
  if (t.includes(q)) return 80 + (q.length / t.length) * 20;
  
  let score = 0;
  let lastIndex = -1;
  let consecutiveMatches = 0;
  
  for (let i = 0; i < q.length; i++) {
    const char = q[i];
    const index = t.indexOf(char, lastIndex + 1);
    
    if (index === -1) return 0; // Not a fuzzy match
    
    // Penalize distance
    const distance = index - lastIndex - 1;
    score -= distance;
    
    // Reward consecutive matches
    if (distance === 0) {
      consecutiveMatches++;
      score += consecutiveMatches * 2;
    } else {
      consecutiveMatches = 0;
    }
    
    // Reward matching at start of words
    if (index === 0 || t[index - 1] === ' ') {
      score += 10;
    }
    
    lastIndex = index;
  }
  
  return Math.max(1, score + q.length * 5);
};
