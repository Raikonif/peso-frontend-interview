"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { productKeys } from "@/lib/queryKeys";

interface ApiStatusBannerProps {
  error: Error | null;
  isUsingFallback: boolean;
  onRetry?: () => void;
  isRetrying?: boolean;
}

/**
 * Banner that shows API connection status
 * Displays when using fallback data or when there's an error
 */
export function ApiStatusBanner({
  error,
  isUsingFallback,
  onRetry,
  isRetrying,
}: ApiStatusBannerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const queryClient = useQueryClient();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-retry when coming back online
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queryClient]);

  // Don't show anything if everything is fine
  if (!error && !isUsingFallback && isOnline) return null;

  // Offline status
  if (!isOnline) {
    return (
      <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📡</span>
          <div className="flex-1">
            <h3 className="font-medium text-amber-200">Sin conexión a internet</h3>
            <p className="text-sm text-amber-300/80">
              Mostrando datos guardados localmente. La aplicación se actualizará
              automáticamente cuando vuelvas a estar en línea.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Using fallback data
  if (isUsingFallback) {
    return (
      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <h3 className="font-medium text-blue-200">
                Mostrando datos de demostración
              </h3>
              <p className="text-sm text-blue-300/80">
                El servidor no está disponible. Mostrando productos de ejemplo
                mientras se restablece la conexión.
              </p>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              {isRetrying ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Conectando...
                </>
              ) : (
                <>🔄 Reintentar</>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Error with stale data available
  if (error) {
    return (
      <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-medium text-amber-200">
                Error de conexión
              </h3>
              <p className="text-sm text-amber-300/80">
                No se pudo actualizar los datos. Mostrando la última versión disponible.
              </p>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
            >
              {isRetrying ? "Reintentando..." : "🔄 Reintentar"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
