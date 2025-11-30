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

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

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

        {/* Category filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Results info */}
      {!isLoading && !error && (
        <p className="mb-4 text-sm text-slate-400">
          {filteredProducts.length === products?.length
            ? `Mostrando ${products?.length || 0} productos`
            : `Mostrando ${filteredProducts.length} de ${
                products?.length || 0
              } productos`}
          {isFetching && (
            <span className="ml-2 text-indigo-400">(actualizando...)</span>
          )}
        </p>
      )}

      {/* Product list */}
      <ProductList
        products={filteredProducts}
        isLoading={isLoading}
        error={error as ApiError | null}
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
