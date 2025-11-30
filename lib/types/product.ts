// Types for FakeStore API Products

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CreateProductSerializer {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode?: number;
  retryable: boolean;
}

export type ProductCategory =
  | "electronics"
  | "jewelery"
  | "men's clothing"
  | "women's clothing";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];
