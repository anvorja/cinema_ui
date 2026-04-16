// src/lib/queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes — no refetch on component remount
      staleTime: 5 * 60 * 1000,
      // Keep unused data in memory for 10 minutes
      gcTime: 10 * 60 * 1000,
      // One retry on failure; avoids hammering a struggling backend
      retry: 1,
      // Never refetch just because the window regains focus
      refetchOnWindowFocus: false,
    },
  },
});
