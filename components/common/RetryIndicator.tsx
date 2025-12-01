"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface RetryIndicatorProps {
  className?: string;
}

/**
 * Component that shows retry status in the UI
 * Displays when React Query is retrying failed requests
 */
export function RetryIndicator({ className = "" }: RetryIndicatorProps) {
  const queryClient = useQueryClient();
  const [retryInfo, setRetryInfo] = useState<{
    isRetrying: boolean;
    failureCount: number;
    queryKey: string;
  } | null>(null);

  useEffect(() => {
    // Subscribe to query cache changes
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === "updated" &&
        event.query.state.fetchStatus === "fetching"
      ) {
        const failureCount = event.query.state.fetchFailureCount;

        if (failureCount > 0) {
          setRetryInfo({
            isRetrying: true,
            failureCount,
            queryKey: JSON.stringify(event.query.queryKey),
          });
        }
      }

      // Clear retry info when query succeeds or fails completely
      if (
        event.type === "updated" &&
        (event.query.state.status === "success" ||
          event.query.state.status === "error")
      ) {
        setRetryInfo(null);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  // Don't show if not retrying
  if (!retryInfo?.isRetrying) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 animate-pulse ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-amber-900/90 border border-amber-600 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Spinning retry icon */}
          <div className="relative">
            <svg
              className="w-5 h-5 text-amber-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          <div className="text-sm">
            <p className="font-medium text-amber-200">
              Reintentando conexión...
            </p>
            <p className="text-amber-400/80 text-xs">
              Intento {retryInfo.failureCount + 1} de 3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to get retry information for a specific query
 */
export function useRetryStatus(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState({
    isRetrying: false,
    failureCount: 0,
    maxRetries: 3,
  });

  useEffect(() => {
    const checkStatus = () => {
      const query = queryClient.getQueryCache().find({ queryKey });
      if (query) {
        const failureCount = query.state.fetchFailureCount;
        setStatus({
          isRetrying:
            failureCount > 0 && query.state.fetchStatus === "fetching",
          failureCount,
          maxRetries: 3,
        });
      }
    };

    // Initial check
    checkStatus();

    // Subscribe to changes
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (JSON.stringify(event.query.queryKey) === JSON.stringify(queryKey)) {
        checkStatus();
      }
    });

    return () => unsubscribe();
  }, [queryClient, queryKey]);

  return status;
}
