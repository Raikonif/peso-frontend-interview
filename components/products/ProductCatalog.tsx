"use client";

import { useState, useMemo } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  selectSearchQuery,
  selectIsCreateModalOpen,
} from "@/lib/store/selectors";
import { setSearchQuery, setCreateModalOpen } from "@/lib/store/uiSlice";
import { ProductList } from "@/components/products/ProductList";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductForm } from "@/components/products/ProductForm";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ApiStatusBanner } from "@/components/common/ApiStatusBanner";
import { fallbackProducts } from "@/lib/fallbackData";
import { ApiError } from "@/lib/types/product";

export function ProductCatalog() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const isCreateModalOpen = useAppSelector(selectIsCreateModalOpen);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data: products,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useProducts(20);

  // Determine if we should use fallback data
  const hasError = !!error;
  const hasData = products && products.length > 0;
  const isUsingFallback = hasError && !hasData;

  // Use real data if available, otherwise fallback
  const displayProducts = hasData ? products : hasError ? fallbackProducts : [];

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    if (!displayProducts || displayProducts.length === 0) return [];

    return displayProducts.filter((product) => {
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [displayProducts, searchQuery, selectedCategory]);

  const handleCloseCreateModal = () => {
    dispatch(setCreateModalOpen(false));
  };

  const handleOpenCreateModal = () => {
    dispatch(setCreateModalOpen(true));
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <>
      {/* API Status Banner - shows when there's an error or using fallback */}
      <ApiStatusBanner
        error={error as Error | null}
        isUsingFallback={isUsingFallback}
        onRetry={handleRetry}
        isRetrying={isFetching}
      />

      {/* Filters section */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="max-w-md">
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            aria-label="Buscar productos"
          />
        </div>

        {/* Category filter - disable when using fallback */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          disabled={isUsingFallback}
        />
      </div>

      {/* Results info */}
      {!isLoading && (
        <p className="mb-4 text-sm text-slate-400">
          {isUsingFallback ? (
            <span className="text-blue-400">
              📦 {filteredProducts.length} productos de demostración
            </span>
          ) : (
            <>
              {filteredProducts.length === displayProducts?.length
                ? `Mostrando ${displayProducts?.length || 0} productos`
                : `Mostrando ${filteredProducts.length} de ${
                    displayProducts?.length || 0
                  } productos`}
              {isFetching && (
                <span className="ml-2 text-indigo-400">(actualizando...)</span>
              )}
              {hasError && hasData && (
                <span className="ml-2 text-amber-400">(datos en caché)</span>
              )}
            </>
          )}
        </p>
      )}

      {/* Product list - shows fallback or real data */}
      <ProductList
        products={filteredProducts}
        isLoading={isLoading}
        error={!isUsingFallback && !hasData ? (error as ApiError | null) : null}
        onRetry={handleRetry}
        isRetrying={isFetching}
        onCreateClick={handleOpenCreateModal}
      />

      {/* Create product modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Crear nuevo producto"
      >
        <ProductForm
          onSuccess={handleCloseCreateModal}
          onCancel={handleCloseCreateModal}
        />
      </Modal>
    </>
  );
}
