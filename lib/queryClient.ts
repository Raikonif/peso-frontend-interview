import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./types/product";

// Type guard para ApiError
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "retryable" in error
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry con backoff exponencial
      retry: (failureCount, error) => {
        // No reintentar en errores 404
        if (isApiError(error) && error.statusCode === 404) {
          return false;
        }
        // Máximo 3 reintentos
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => {
        // Backoff exponencial: 1s, 2s, 4s
        return Math.min(1000 * 2 ** attemptIndex, 8000);
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos (anteriormente cacheTime)
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
      retryDelay: 1000,
    },
  },
});
