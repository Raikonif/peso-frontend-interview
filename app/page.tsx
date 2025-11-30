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
import { Header } from "@/components/common/Header";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/types/product";

export default function HomePage() {
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

  const handleOpenCreateModal = () => {
    dispatch(setCreateModalOpen(true));
  };

  const handleCloseCreateModal = () => {
    dispatch(setCreateModalOpen(false));
  };

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen">
      <Header onCreateClick={handleOpenCreateModal} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">
            Catálogo de Productos
          </h1>
          <p className="mt-2 text-slate-400">
            Explora nuestra colección de productos de alta calidad
          </p>
        </div>

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
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "producto" : "productos"}{" "}
              encontrados
            </p>
            {isFetching && !isLoading && (
              <span className="text-sm text-indigo-400 flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Actualizando...
              </span>
            )}
          </div>
        )}

        {/* Products list */}
        <ProductList
          products={filteredProducts}
          isLoading={isLoading}
          error={error as ApiError | null}
          onRetry={handleRetry}
          isRetrying={isFetching}
          onCreateClick={handleOpenCreateModal}
        />
      </main>

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Crear Nuevo Producto"
        size="lg"
      >
        <ProductForm
          onSuccess={handleCloseCreateModal}
          onCancel={handleCloseCreateModal}
        />
      </Modal>

      {/* Footer */}
      <footer className="bg-[#1a1a24] border-t border-[#2a2a3a] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400 text-sm">
            <p>
              Demo de aplicación frontend con manejo robusto de errores y
              resiliencia
            </p>
            <p className="mt-2">
              Usando{" "}
              <a
                href="https://fakestoreapi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                FakeStore API
              </a>{" "}
              • Next.js • Redux Toolkit • React Query
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
