import { Product } from "./types/product";

/**
 * Fallback data to display when the API is unavailable
 * This provides graceful degradation - users see something instead of an error
 */
export const fallbackProducts: Product[] = [
  {
    id: -1,
    title: "Producto de ejemplo",
    price: 99.99,
    description:
      "Este es un producto de demostración mostrado mientras se restablece la conexión con el servidor.",
    category: "demo",
    image: "https://via.placeholder.com/300x300?text=Demo+Product",
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: -2,
    title: "Camiseta Premium",
    price: 29.99,
    description:
      "Camiseta de algodón de alta calidad. Datos de demostración mientras el servidor no está disponible.",
    category: "clothing",
    image: "https://via.placeholder.com/300x300?text=T-Shirt",
    rating: { rate: 4.2, count: 85 },
  },
  {
    id: -3,
    title: "Auriculares Inalámbricos",
    price: 149.99,
    description:
      "Auriculares Bluetooth con cancelación de ruido. Producto de demostración.",
    category: "electronics",
    image: "https://via.placeholder.com/300x300?text=Headphones",
    rating: { rate: 4.7, count: 230 },
  },
  {
    id: -4,
    title: "Reloj Inteligente",
    price: 199.99,
    description:
      "Smartwatch con monitor de actividad física. Datos mostrados sin conexión.",
    category: "electronics",
    image: "https://via.placeholder.com/300x300?text=Smartwatch",
    rating: { rate: 4.3, count: 156 },
  },
];

/**
 * Get fallback data with a demo banner
 */
export function getFallbackMessage(): string {
  return "Mostrando datos de demostración. La conexión con el servidor se restablecerá automáticamente.";
}
