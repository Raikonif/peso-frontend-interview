"use client";

import { ApiError } from "@/lib/types/product";
import { Button } from "../ui/Button";

interface ErrorMessageProps {
  error: ApiError | Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export function ErrorMessage({
  error,
  onRetry,
  isRetrying = false,
  className = "",
}: ErrorMessageProps) {
  if (!error) return null;

  const apiError = error as ApiError;
  const isApiError = "code" in error && "retryable" in error;

  const getErrorIcon = () => {
    if (!isApiError) return "❌";
    switch (apiError.code) {
      case "NETWORK_ERROR":
        return "📡";
      case "TIMEOUT":
        return "⏱️";
      case "NOT_FOUND":
        return "🔍";
      case "SERVER_ERROR":
      case "BAD_GATEWAY":
      case "SERVICE_UNAVAILABLE":
        return "🔧";
      default:
        return "⚠️";
    }
  };

  const getErrorTitle = () => {
    if (!isApiError) return "Error inesperado";
    switch (apiError.code) {
      case "NETWORK_ERROR":
        return "Sin conexión";
      case "TIMEOUT":
        return "Tiempo de espera agotado";
      case "NOT_FOUND":
        return "No encontrado";
      case "SERVER_ERROR":
        return "Error del servidor";
      case "BAD_REQUEST":
        return "Solicitud inválida";
      default:
        return "Error";
    }
  };

  return (
    <div
      className={`bg-red-900/20 border border-red-700/50 rounded-xl p-6 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl" aria-hidden="true">
          {getErrorIcon()}
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-400">
            {getErrorTitle()}
          </h3>
          <p className="mt-1 text-red-300">
            {isApiError ? apiError.message : error.message}
          </p>

          {isApiError && apiError.statusCode && (
            <p className="mt-2 text-sm text-red-400/80">
              Código de error: {apiError.statusCode}
            </p>
          )}

          {onRetry && isApiError && apiError.retryable && (
            <div className="mt-4">
              <Button
                variant="danger"
                size="sm"
                onClick={onRetry}
                isLoading={isRetrying}
              >
                {isRetrying ? "Reintentando..." : "Reintentar"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
