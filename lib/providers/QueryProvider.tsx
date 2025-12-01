"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ApiError } from "../types/product";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: how long data is considered fresh
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Garbage collection time - keep data longer for fallback
            gcTime: 30 * 60 * 1000, // 30 minutes (longer to preserve stale data)
            // Retry configuration with exponential backoff
            retry: (failureCount, error) => {
              const apiError = error as unknown as ApiError;
              // Don't retry on non-retryable errors
              if (apiError?.retryable === false) return false;
              // Max 3 retries
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
            // Refetch on reconnect
            refetchOnReconnect: true,
            // Keep previous data while refetching (graceful degradation)
            placeholderData: (previousData: unknown) => previousData,
          },
          mutations: {
            retry: (failureCount, error) => {
              const apiError = error as unknown as ApiError;
              if (apiError?.retryable === false) return false;
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
