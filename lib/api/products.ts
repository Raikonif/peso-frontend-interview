import { apiClient, validateResponse } from "./client";
import { Product, CreateProductSerializer } from "../types/product";

// Validators
const isValidProduct = (product: unknown): product is Product => {
  if (!product || typeof product !== "object") return false;
  const p = product as Product;
  return (
    typeof p.id === "number" &&
    typeof p.title === "string" &&
    typeof p.price === "number" &&
    typeof p.description === "string" &&
    typeof p.category === "string" &&
    typeof p.image === "string"
  );
};

const isValidProductArray = (data: unknown): data is Product[] => {
  return Array.isArray(data) && data.every(isValidProduct);
};

// API Functions
export const productsApi = {
  /**
   * Get all products with optional limit
   */
  getAll: async (limit?: number): Promise<Product[]> => {
    const url = limit ? `/products?limit=${limit}` : "/products";
    const response = await apiClient.get<Product[]>(url);
    return validateResponse(response, isValidProductArray);
  },

  /**
   * Get a single product by ID
   */
  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return validateResponse(response, isValidProduct);
  },

  /**
   * Get products by category
   */
  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(
      `/products/category/${encodeURIComponent(category)}`
    );
    return validateResponse(response, isValidProductArray);
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>("/products/categories");
    return validateResponse(response, (data) => Array.isArray(data));
  },

  /**
   * Create a new product
   * Note: FakeStore API simulates creation, returns the product with a new ID
   */
  create: async (product: CreateProductSerializer): Promise<Product> => {
    const response = await apiClient.post<Product>("/products", product);
    return validateResponse(response);
  },

  /**
   * Update a product
   */
  update: async (
    id: number,
    product: Partial<CreateProductSerializer>
  ): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, product);
    return validateResponse(response);
  },

  /**
   * Delete a product
   */
  delete: async (id: number): Promise<Product> => {
    const response = await apiClient.delete<Product>(`/products/${id}`);
    return validateResponse(response);
  },
};
