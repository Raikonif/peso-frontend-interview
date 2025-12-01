import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import axiosRetry, { isNetworkOrIdempotentRequestError } from "axios-retry";
import { ApiError } from "../types/product";
import { errorSimulation, SimulatedErrorType } from "../errorSimulation";

// Base API configuration
const BASE_URL = process.env.DATABASE_URL || "https://fakestoreapi.com";
// const BASE_URL = "";
const TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error simulation interceptor (runs before request)
apiClient.interceptors.request.use(
  async (config) => {
    const errorType = errorSimulation.shouldSimulateError();

    if (errorType !== "none") {
      console.log(`[Error Simulation] Simulating ${errorType} error`);

      // Create simulated errors
      const simulatedErrors: Record<SimulatedErrorType, () => never> = {
        none: () => {
          throw new Error("Should not reach here");
        },
        "500": () => {
          const error = new AxiosError(
            "Internal Server Error",
            "ERR_BAD_RESPONSE",
            config,
            null,
            {
              status: 500,
              statusText: "Internal Server Error",
              headers: {},
              config,
              data: { error: "Simulated server error" },
            } as AxiosResponse
          );
          throw error;
        },
        "404": () => {
          const error = new AxiosError(
            "Not Found",
            "ERR_BAD_REQUEST",
            config,
            null,
            {
              status: 404,
              statusText: "Not Found",
              headers: {},
              config,
              data: { error: "Resource not found" },
            } as AxiosResponse
          );
          throw error;
        },
        timeout: () => {
          const error = new AxiosError(
            "timeout of 10000ms exceeded",
            "ECONNABORTED",
            config
          );
          throw error;
        },
        network: () => {
          const error = new AxiosError("Network Error", "ERR_NETWORK", config);
          throw error;
        },
        empty: () => {
          const error = new AxiosError(
            "Empty Response",
            "ERR_BAD_RESPONSE",
            config,
            null,
            {
              status: 200,
              statusText: "OK",
              headers: {},
              config,
              data: null, // Empty response
            } as AxiosResponse
          );
          throw error;
        },
        invalid: () => {
          const error = new AxiosError(
            "Invalid JSON",
            "ERR_BAD_RESPONSE",
            config,
            null,
            {
              status: 200,
              statusText: "OK",
              headers: {},
              config,
              data: "<<<invalid json data>>>", // Malformed data
            } as AxiosResponse
          );
          throw error;
        },
      };

      simulatedErrors[errorType]();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Configure axios-retry for automatic retries
axiosRetry(apiClient, {
  retries: MAX_RETRIES,
  retryDelay: (retryCount) => {
    // Exponential backoff: 1s, 2s, 4s
    return Math.min(1000 * Math.pow(2, retryCount - 1), 8000);
  },
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    if (isNetworkOrIdempotentRequestError(error)) {
      return true;
    }

    const status = error.response?.status;
    if (!status) return true; // Network error

    // Retry on server errors (5xx) and rate limiting (429)
    return status >= 500 || status === 429;
  },
  onRetry: (retryCount, error, requestConfig) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Retry] Attempt ${retryCount}/${MAX_RETRIES} for ${requestConfig.method?.toUpperCase()} ${
          requestConfig.url
        }`
      );
      console.log(`[API Retry] Error: ${error.message}`);
    }
  },
});

// Error classification helper
export function classifyError(error: AxiosError): ApiError {
  const statusCode = error.response?.status;

  // Timeout error
  if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
    return {
      message:
        "La conexión tardó demasiado. Por favor, verifica tu conexión a internet e intenta nuevamente.",
      code: "TIMEOUT",
      statusCode: 408,
      retryable: true,
    };
  }

  // Network error (no response)
  if (!error.response) {
    return {
      message:
        "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      code: "NETWORK_ERROR",
      retryable: true,
    };
  }

  // HTTP error responses
  switch (statusCode) {
    case 400:
      return {
        message:
          "Los datos enviados no son válidos. Por favor, revisa el formulario.",
        code: "BAD_REQUEST",
        statusCode,
        retryable: false,
      };
    case 401:
      return {
        message: "No tienes autorización para realizar esta acción.",
        code: "UNAUTHORIZED",
        statusCode,
        retryable: false,
      };
    case 403:
      return {
        message: "No tienes permisos para acceder a este recurso.",
        code: "FORBIDDEN",
        statusCode,
        retryable: false,
      };
    case 404:
      return {
        message: "El recurso solicitado no fue encontrado.",
        code: "NOT_FOUND",
        statusCode,
        retryable: false,
      };
    case 429:
      return {
        message:
          "Demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.",
        code: "TOO_MANY_REQUESTS",
        statusCode,
        retryable: true,
      };
    case 500:
      return {
        message:
          "Error interno del servidor. Nuestro equipo ha sido notificado.",
        code: "SERVER_ERROR",
        statusCode,
        retryable: true,
      };
    case 502:
      return {
        message:
          "El servidor no está disponible temporalmente. Intenta en unos minutos.",
        code: "BAD_GATEWAY",
        statusCode,
        retryable: true,
      };
    case 503:
      return {
        message:
          "El servicio no está disponible. Por favor, intenta más tarde.",
        code: "SERVICE_UNAVAILABLE",
        statusCode,
        retryable: true,
      };
    case 504:
      return {
        message:
          "El servidor tardó demasiado en responder. Intenta nuevamente.",
        code: "GATEWAY_TIMEOUT",
        statusCode,
        retryable: true,
      };
    default:
      return {
        message: `Error inesperado (código ${statusCode}). Por favor, intenta nuevamente.`,
        code: "UNKNOWN_ERROR",
        statusCode,
        retryable: true,
      };
  }
}

// Validate response data
export function validateResponse<T>(
  response: AxiosResponse<T>,
  validator?: (data: T) => boolean
): T {
  const { data } = response;

  // Check for empty response
  if (data === null || data === undefined) {
    throw {
      message: "El servidor devolvió una respuesta vacía.",
      code: "EMPTY_RESPONSE",
      retryable: true,
    } as ApiError;
  }

  // Check for incomplete/invalid response if validator provided
  if (validator && !validator(data)) {
    throw {
      message: "El servidor devolvió datos incompletos o inválidos.",
      code: "INVALID_RESPONSE",
      retryable: true,
    } as ApiError;
  }

  return data;
}

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const classifiedError = classifyError(error);
    return Promise.reject(classifiedError);
  }
);

// Request interceptor for logging (development)
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);
