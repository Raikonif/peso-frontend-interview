import { Product } from "../types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://fakestoreapi.com";

/**
 * Server-side API functions for SSR data fetching
 * These functions are used in Server Components and don't use axios
 * to keep the server bundle small
 */
export const serverApi = {
  /**
   * Fetch all products (server-side)
   */
  getProducts: async (limit?: number): Promise<Product[]> => {
    const url = limit
      ? `${API_BASE_URL}/products?limit=${limit}`
      : `${API_BASE_URL}/products`;

    const response = await fetch(url, {
      next: {
        revalidate: 60, // Revalidate every 60 seconds (ISR)
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Fetch a single product by ID (server-side)
   */
  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Fetch all categories (server-side)
   */
  getCategories: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/products/categories`, {
      next: {
        revalidate: 300, // Categories change less frequently
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    return response.json();
  },
};
