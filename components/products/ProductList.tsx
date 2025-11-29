"use client";

import { Product } from "@/lib/types/product";
import { ProductCard } from "./ProductCard";
import { ProductListSkeleton } from "../ui/Skeleton";
import { ErrorMessage } from "../common/ErrorMessage";
import { ProductsEmptyState } from "../common/EmptyState";
import { ApiError } from "@/lib/types/product";

interface ProductListProps {
  products: Product[] | undefined;
  isLoading: boolean;
  error: ApiError | Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
  onCreateClick?: () => void;
}

export function ProductList({
  products,
  isLoading,
  error,
  onRetry,
  isRetrying,
  onCreateClick,
}: ProductListProps) {
  // Loading state
  if (isLoading) {
    return <ProductListSkeleton count={8} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage error={error} onRetry={onRetry} isRetrying={isRetrying} />
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return <ProductsEmptyState onCreateClick={onCreateClick} />;
  }

  // Success state
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
