"use client";

import { useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { productKeys } from "./useProducts";

interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

/**
 * Hook for manual retry with exponential backoff
 */
export function useRetry(config: RetryConfig = {}) {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000 } = config;

  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [nextRetryIn, setNextRetryIn] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateDelay = useCallback(
    (attempt: number) => Math.min(baseDelay * 2 ** attempt, maxDelay),
    [baseDelay, maxDelay]
  );

  const retry = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      if (retryCount >= maxRetries) {
        return null;
      }

      setIsRetrying(true);
      const delay = calculateDelay(retryCount);
      setNextRetryIn(delay);

      return new Promise((resolve) => {
        timerRef.current = setTimeout(async () => {
          try {
            const result = await fn();
            setRetryCount(0);
            setIsRetrying(false);
            setNextRetryIn(null);
            resolve(result);
          } catch {
            setRetryCount((prev) => prev + 1);
            setIsRetrying(false);
            setNextRetryIn(null);
            resolve(null);
          }
        }, delay);
      });
    },
    [retryCount, maxRetries, calculateDelay]
  );

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setRetryCount(0);
    setIsRetrying(false);
    setNextRetryIn(null);
  }, []);

  return {
    retry,
    reset,
    retryCount,
    isRetrying,
    nextRetryIn,
    canRetry: retryCount < maxRetries,
    retriesRemaining: maxRetries - retryCount,
  };
}

/**
 * Hook for auto-retry when API becomes available
 */
export function useAutoRetry(
  queryKey: unknown[],
  options: { enabled?: boolean; interval?: number } = {}
) {
  const { enabled = true, interval = 30000 } = options;
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback(() => {
    if (!enabled || intervalRef.current) return;

    setIsPolling(true);
    intervalRef.current = setInterval(() => {
      queryClient.invalidateQueries({ queryKey });
    }, interval);
  }, [enabled, interval, queryClient, queryKey]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  return { startPolling, stopPolling, isPolling };
}

/**
 * Hook to prefetch product details on hover
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return useCallback(
    (id: number) => {
      queryClient.prefetchQuery({
        queryKey: productKeys.detail(id),
        queryFn: () =>
          import("../api/products").then((m) => m.productsApi.getById(id)),
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );
}
