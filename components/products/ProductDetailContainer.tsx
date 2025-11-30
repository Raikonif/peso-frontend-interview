"use client";

import { useProduct } from "@/lib/hooks/useProducts";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ApiError } from "@/lib/types/product";

interface ProductDetailContainerProps {
  productId: number;
}

export function ProductDetailContainer({
  productId,
}: ProductDetailContainerProps) {
  const {
    data: product,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useProduct(productId);

  return (
    <ProductDetail
      product={product}
      isLoading={isLoading}
      error={error as ApiError | null}
      onRetry={() => refetch()}
      isRetrying={isFetching}
    />
  );
}
