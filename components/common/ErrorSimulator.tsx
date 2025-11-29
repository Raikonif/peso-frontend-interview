"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";

interface ErrorSimulatorProps {
  onSimulateError: (errorType: string) => void;
}

export function ErrorSimulator({ onSimulateError }: ErrorSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const errorTypes = [
    {
      type: "500",
      label: "Error del Servidor (500)",
      description: "Simula un error interno del servidor",
      color: "bg-red-100 text-red-700",
    },
    {
      type: "404",
      label: "No Encontrado (404)",
      description: "Simula un recurso no encontrado",
      color: "bg-orange-100 text-orange-700",
    },
    {
      type: "timeout",
      label: "Timeout",
      description: "Simula una conexión que tarda demasiado",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      type: "network",
      label: "Error de Red",
      description: "Simula una pérdida de conexión",
      color: "bg-purple-100 text-purple-700",
    },
    {
      type: "invalid",
      label: "Datos Inválidos",
      description: "Simula respuesta con datos corruptos",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        title="Abrir simulador de errores"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80">
      <Card className="shadow-xl">
        <CardHeader className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            🔧 Simulador de Errores
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </CardHeader>
        <CardBody className="space-y-2">
          <p className="text-xs text-gray-600 mb-3">
            Usa estos botones para simular diferentes tipos de errores y ver
            cómo la aplicación los maneja.
          </p>
          {errorTypes.map((error) => (
            <button
              key={error.type}
              onClick={() => onSimulateError(error.type)}
              className={`w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02] ${error.color}`}
            >
              <span className="font-medium block">{error.label}</span>
              <span className="text-xs opacity-75">{error.description}</span>
            </button>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
