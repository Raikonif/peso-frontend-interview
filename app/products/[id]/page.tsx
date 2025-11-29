"use client";

import { use } from "react";
import { useProduct } from "@/lib/hooks/useProducts";
import { ProductDetail } from "@/components/products/ProductDetail";
import { Header } from "@/components/common/Header";
import { ApiError } from "@/lib/types/product";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const productId = parseInt(id, 10);

  const {
    data: product,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useProduct(productId);

  return (
    <div className="min-h-screen">
      <Header showCreateButton={false} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail
          product={product}
          isLoading={isLoading}
          error={error as ApiError | null}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      </main>
    </div>
  );
}
