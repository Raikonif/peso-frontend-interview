"use client";

import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  errorSimulation,
  errorDescriptions,
  SimulatedErrorType,
} from "@/lib/errorSimulation";
import { productKeys } from "@/lib/queryKeys";

/**
 * Error Simulation Toolbar
 * Displays at the top of the page to simulate various API error scenarios
 * for testing error handling, retry behavior, and recovery mechanisms
 */
export function ErrorSimulatorToolbar() {
  const queryClient = useQueryClient();
  const [activeError, setActiveError] = useState<SimulatedErrorType>("none");
  const [errorCount, setErrorCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Subscribe to error simulation state changes
  useEffect(() => {
    const updateState = () => {
      const state = errorSimulation.getState();
      setActiveError(state.activeError);
      setErrorCount(state.errorCount);
    };

    updateState();
    const unsubscribe = errorSimulation.subscribe(updateState);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSimulateError = useCallback(
    (errorType: SimulatedErrorType) => {
      // Clear React Query cache to force refetch
      queryClient.removeQueries({ queryKey: productKeys.all });

      // Set the error simulation (3 failures to show retry behavior)
      errorSimulation.setError(errorType, 3);

      // Trigger refetch
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    [queryClient]
  );

  const handleClearError = useCallback(() => {
    errorSimulation.clear();
    // Refetch with no errors
    queryClient.invalidateQueries({ queryKey: productKeys.all });
  }, [queryClient]);

  const errorTypes: SimulatedErrorType[] = [
    "500",
    "404",
    "timeout",
    "network",
    "empty",
    "invalid",
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      {/* Collapsed toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <span className="text-lg">🧪</span>
              <span>Simulador de Errores</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Active error indicator */}
            {activeError !== "none" && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-900/50 border border-red-700 rounded-full text-sm">
                <span className="animate-pulse">
                  {errorDescriptions[activeError].icon}
                </span>
                <span className="text-red-300">
                  {errorDescriptions[activeError].label}
                </span>
                <span className="text-red-400/70">
                  ({errorCount} restantes)
                </span>
                <button
                  onClick={handleClearError}
                  className="ml-1 text-red-400 hover:text-red-200"
                  title="Cancelar simulación"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Quick actions */}
          {!isExpanded && activeError === "none" && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-500">Simular:</span>
              {errorTypes.slice(0, 4).map((type) => (
                <button
                  key={type}
                  onClick={() => handleSimulateError(type)}
                  className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  title={errorDescriptions[type].description}
                >
                  {errorDescriptions[type].icon} {errorDescriptions[type].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="border-t border-slate-700 bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {errorTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleSimulateError(type)}
                  disabled={activeError !== "none"}
                  className={`
                    p-3 rounded-lg border transition-all text-left
                    ${
                      activeError === type
                        ? "bg-red-900/30 border-red-600 ring-2 ring-red-500"
                        : activeError !== "none"
                        ? "opacity-50 cursor-not-allowed bg-slate-800 border-slate-700"
                        : "bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">
                      {errorDescriptions[type].icon}
                    </span>
                    <span className="font-medium text-slate-200">
                      {errorDescriptions[type].label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {errorDescriptions[type].description}
                  </p>
                </button>
              ))}
            </div>

            {/* Info section */}
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                📋 Comportamiento del Sistema
              </h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>
                  • <strong>Retry automático:</strong> 3 intentos con backoff
                  exponencial (1s → 2s → 4s)
                </li>
                <li>
                  • <strong>Errores 5xx y red:</strong> Se reintentan
                  automáticamente
                </li>
                <li>
                  • <strong>Errores 4xx:</strong> No se reintentan (error del
                  cliente)
                </li>
                <li>
                  • <strong>Retry manual:</strong> Botón &quot;Reintentar&quot;
                  cuando fallan todos los intentos
                </li>
                <li>
                  • <strong>Auto-recuperación:</strong> Después de 3 fallos
                  simulados, la API vuelve a funcionar
                </li>
              </ul>
            </div>

            {activeError !== "none" && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleClearError}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors"
                >
                  ✓ Restaurar API Normal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
