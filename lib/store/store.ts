import { configureStore } from "@reduxjs/toolkit";
import { productSlice, ProductsState } from "./productSlice";
import { uiSlice, UiState } from "./uiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      products: productSlice.reducer,
      ui: uiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types for serializable check
          ignoredActions: ["products/setError"],
        },
      }),
    devTools: process.env.NODE_ENV !== "production",
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = {
  products: ProductsState;
  ui: UiState;
};
export type AppDispatch = AppStore["dispatch"];
