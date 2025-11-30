"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../api/products";
import {
  Product,
  CreateProductSerializer,
  UpdateProductSerializer,
  ApiError,
} from "../types/product";
import { useAppDispatch } from "../store/hooks";
import {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
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
 * Uses optimistic update since FakeStoreAPI doesn't persist data
 */
export function useCreateProduct() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductSerializer) => productsApi.create(data),
    onSuccess: (newProduct) => {
      // Add to Redux store
      dispatch(addProduct(newProduct));

      // Optimistically update React Query cache (since API doesn't persist)
      queryClient.setQueriesData<Product[]>(
        { queryKey: productKeys.lists() },
        (oldData) => {
          if (!oldData) return [newProduct];
          return [newProduct, ...oldData];
        }
      );

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
 * Uses optimistic update since FakeStoreAPI doesn't persist data
 */
export function useDeleteProduct() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from Redux store for immediate UI update
      dispatch(removeProduct(deletedId));

      // Optimistically update React Query cache (since API doesn't persist)
      queryClient.setQueriesData<Product[]>(
        { queryKey: productKeys.lists() },
        (oldData) => {
          if (!oldData) return [];
          return oldData.filter((product) => product.id !== deletedId);
        }
      );

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
          message: error.message || "Error al eliminar el producto",
          duration: 8000,
        })
      );
    },
  });
}

/**
 * Hook to update a product
 * Uses optimistic update since FakeStoreAPI doesn't persist data
 */
export function useUpdateProduct() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductSerializer) =>
      productsApi.update(id, data),
    onSuccess: (updatedProduct, { id }) => {
      // Update in Redux store for immediate UI update
      dispatch(updateProduct(updatedProduct));

      // Optimistically update React Query cache (since API doesn't persist)
      queryClient.setQueriesData<Product[]>(
        { queryKey: productKeys.lists() },
        (oldData) => {
          if (!oldData) return [];
          return oldData.map((product) =>
            product.id === id ? { ...product, ...updatedProduct } : product
          );
        }
      );

      // Also update detail cache
      queryClient.setQueryData<Product>(productKeys.detail(id), (oldData) =>
        oldData ? { ...oldData, ...updatedProduct } : updatedProduct
      );

      dispatch(
        addNotification({
          type: "success",
          message: `Producto "${updatedProduct.title}" actualizado exitosamente`,
          duration: 5000,
        })
      );
    },
    onError: (error: ApiError) => {
      dispatch(setError(error));
      dispatch(
        addNotification({
          type: "error",
          message: error.message || "Error al actualizar el producto",
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
