"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/products";
import { CreateProductDTO, ApiError } from "../types/product";
import { useAppDispatch } from "../store/hooks";
import {
  setProducts,
  addProduct,
  setSelectedProduct,
  setError,
  clearError,
} from "../store/productSlice";
import { addNotification } from "../store/uiSlice";

// Query keys for React Query
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (limit?: number) => [...productKeys.lists(), { limit }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, "categories"] as const,
  byCategory: (category: string) =>
    [...productKeys.all, "category", category] as const,
};

// Retry configuration with exponential backoff
const retryConfig = {
  retry: 3,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
};

/**
 * Hook to fetch all products
 */
export function useProducts(limit?: number) {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: productKeys.list(limit),
    queryFn: async () => {
      dispatch(clearError());
      const products = await productsApi.getAll(limit);
      dispatch(setProducts(products));
      return products;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    ...retryConfig,
    meta: {
      errorHandler: (error: ApiError) => {
        dispatch(setError(error));
      },
    },
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: number) {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      dispatch(clearError());
      const product = await productsApi.getById(id);
      dispatch(setSelectedProduct(product));
      return product;
    },
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
    ...retryConfig,
    meta: {
      errorHandler: (error: ApiError) => {
        dispatch(setError(error));
      },
    },
  });
}

/**
 * Hook to fetch products by category
 */
export function useProductsByCategory(category: string | null) {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: productKeys.byCategory(category || ""),
    queryFn: async () => {
      if (!category) return [];
      dispatch(clearError());
      return await productsApi.getByCategory(category);
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    ...retryConfig,
  });
}

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: productsApi.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories rarely change
    ...retryConfig,
  });
}

/**
 * Hook to create a new product
 */
export function useCreateProduct() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDTO) => productsApi.create(data),
    onSuccess: (newProduct) => {
      // Add to Redux store
      dispatch(addProduct(newProduct));

      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });

      // Show success notification
      dispatch(
        addNotification({
          type: "success",
          message: `Producto "${newProduct.title}" creado exitosamente`,
          duration: 5000,
        })
      );
    },
    onError: (error: ApiError) => {
      dispatch(setError(error));
      dispatch(
        addNotification({
          type: "error",
          message: error.message,
          duration: 8000,
        })
      );
    },
    ...retryConfig,
  });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      dispatch(
        addNotification({
          type: "success",
          message: "Producto eliminado exitosamente",
          duration: 5000,
        })
      );
    },
    onError: (error: ApiError) => {
      dispatch(
        addNotification({
          type: "error",
          message: error.message,
          duration: 8000,
        })
      );
    },
  });
}

/**
 * Hook to manually refetch products with retry
 */
export function useRefetchProducts() {
  const queryClient = useQueryClient();

  return {
    refetch: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
    refetchList: () =>
      queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
  };
}
