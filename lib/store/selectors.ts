import { RootState } from "./store";
import { Notification } from "./uiSlice";
import { Product, ApiError } from "../types/product";

// UI Selectors
export const selectNotifications = (state: RootState): Notification[] =>
  state.ui.notifications;

export const selectIsCreateModalOpen = (state: RootState): boolean =>
  state.ui.isCreateModalOpen;

export const selectSelectedCategory = (state: RootState): string | null =>
  state.ui.selectedCategory;

export const selectSearchQuery = (state: RootState): string =>
  state.ui.searchQuery;

// Product Selectors
export const selectProducts = (state: RootState): Product[] =>
  state.products.items;

export const selectSelectedProduct = (state: RootState): Product | null =>
  state.products.selectedProduct;

export const selectProductsLoading = (state: RootState): boolean =>
  state.products.isLoading;

export const selectProductsError = (state: RootState): ApiError | null =>
  state.products.error;

export const selectLastFetch = (state: RootState): number | null =>
  state.products.lastFetch;
