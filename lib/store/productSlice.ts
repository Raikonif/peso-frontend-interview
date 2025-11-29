import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ApiError } from "../types/product";

export interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: ApiError | null;
  lastFetch: number | null;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  lastFetch: null,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.lastFetch = Date.now();
      state.error = null;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      // Add to beginning of list for visibility
      state.items.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedProduct?.id === action.payload.id) {
        state.selectedProduct = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      if (state.selectedProduct?.id === action.payload) {
        state.selectedProduct = null;
      }
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<ApiError | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  setSelectedProduct,
  setLoading,
  setError,
  clearError,
} = productSlice.actions;

// Selectors
export const selectProducts = (state: { products: ProductsState }) =>
  state.products.items;
export const selectSelectedProduct = (state: { products: ProductsState }) =>
  state.products.selectedProduct;
export const selectProductsLoading = (state: { products: ProductsState }) =>
  state.products.isLoading;
export const selectProductsError = (state: { products: ProductsState }) =>
  state.products.error;
export const selectLastFetch = (state: { products: ProductsState }) =>
  state.products.lastFetch;
