import { useState, useCallback } from 'react';

// Simple store implementation using a custom hook pattern for now
// In a real app, you might use Zustand or Redux

export function useInvestigationStore() {
  const [unreadCount, setUnreadCount] = useState(0);

  const incrementUnreadMessagesCount = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
  }, []);

  const resetUnreadMessagesCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    unreadCount,
    incrementUnreadMessagesCount,
    resetUnreadMessagesCount,
  };
}
