// Error simulation state - stored in memory for simplicity
// This allows intercepting API calls to simulate different error scenarios

export type SimulatedErrorType =
  | "none"
  | "500"
  | "404"
  | "timeout"
  | "network"
  | "empty"
  | "invalid";

interface ErrorSimulationState {
  activeError: SimulatedErrorType;
  errorCount: number; // How many requests should fail
  listeners: Set<() => void>;
}

const state: ErrorSimulationState = {
  activeError: "none",
  errorCount: 0,
  listeners: new Set(),
};

export const errorSimulation = {
  /**
   * Set the error to simulate
   * @param errorType - Type of error to simulate
   * @param count - Number of requests to fail (default: 3, to show retry behavior)
   */
  setError: (errorType: SimulatedErrorType, count: number = 3) => {
    state.activeError = errorType;
    state.errorCount = count;
    state.listeners.forEach((listener) => listener());

    if (errorType !== "none") {
      console.log(
        `[Error Simulation] Activated: ${errorType} for next ${count} requests`
      );
    }
  },

  /**
   * Clear any active error simulation
   */
  clear: () => {
    state.activeError = "none";
    state.errorCount = 0;
    state.listeners.forEach((listener) => listener());
    console.log("[Error Simulation] Cleared");
  },

  /**
   * Get current simulation state
   */
  getState: () => ({
    activeError: state.activeError,
    errorCount: state.errorCount,
  }),

  /**
   * Check if should simulate error and decrement counter
   */
  shouldSimulateError: (): SimulatedErrorType => {
    if (state.activeError === "none" || state.errorCount <= 0) {
      return "none";
    }

    state.errorCount--;
    const errorType = state.activeError;

    // Auto-clear when count reaches 0
    if (state.errorCount <= 0) {
      console.log(
        "[Error Simulation] All simulated errors consumed, auto-clearing"
      );
      state.activeError = "none";
      state.listeners.forEach((listener) => listener());
    }

    return errorType;
  },

  /**
   * Subscribe to state changes
   */
  subscribe: (listener: () => void) => {
    state.listeners.add(listener);
    return () => state.listeners.delete(listener);
  },
};

/**
 * Error descriptions for UI
 */
export const errorDescriptions: Record<
  SimulatedErrorType,
  { label: string; description: string; icon: string }
> = {
  none: {
    label: "Normal",
    description: "Sin simulación de errores",
    icon: "✓",
  },
  "500": {
    label: "Error 500",
    description: "Error interno del servidor",
    icon: "🔥",
  },
  "404": {
    label: "Error 404",
    description: "Recurso no encontrado",
    icon: "🔍",
  },
  timeout: {
    label: "Timeout",
    description: "La conexión tarda demasiado",
    icon: "⏱️",
  },
  network: {
    label: "Red",
    description: "Sin conexión a internet",
    icon: "📡",
  },
  empty: {
    label: "Vacío",
    description: "Respuesta vacía del servidor",
    icon: "📭",
  },
  invalid: {
    label: "Inválido",
    description: "Datos corruptos o malformados",
    icon: "💔",
  },
};
