"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Product } from "@/lib/types/product";
import { useDeleteProduct } from "@/lib/hooks/useProducts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ProductFormModal } from "./ProductFormModal";

import { usePrefetchProduct } from "@/lib/hooks/useRetry";
import { colorCategory } from "@/lib/helpers/colorCategory";
import { formatPrice } from "@/lib/helpers/formatPrice";
import { formatCategory } from "@/lib/helpers/formatCategory";

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

export function ProductCard({ product, showActions = true }: ProductCardProps) {
  const prefetch = usePrefetchProduct();
  const deleteProduct = useDeleteProduct();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    await deleteProduct.mutateAsync(product.id);
    setIsDeleteModalOpen(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <Link
        href={`/products/${product.id}`}
        onMouseEnter={() => prefetch(product.id)}
      >
        <Card hoverable className="h-full flex flex-col group">
          {/* Image container */}
          <div className="relative w-full h-48 bg-[#151520] p-4">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-4"
              loading="lazy"
            />

            {/* Action buttons overlay */}
            {showActions && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleEditClick}
                  className="p-2! rounded-full!"
                  aria-label="Editar producto"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="p-2! rounded-full!"
                  aria-label="Eliminar producto"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">
            {/* Category badge */}
            <div className="w-full justify-end flex">
              <Badge variant={colorCategory(product.category)} size="sm">
                {formatCategory(product.category)}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="mt-2 text-lg font-semibold text-slate-100 line-clamp-2">
              {product.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-slate-400 line-clamp-2 flex-1">
              {product.description}
            </p>

            {/* Footer: Price and Rating */}
            <div className="mt-4 pt-4 border-t border-[#2a2a3a] flex items-center justify-between">
              <span className="text-xl font-bold gradient-text">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-amber-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                {/* <span className="text-sm text-slate-300">
                  {product.rating.rate.toFixed(1)}
                </span> */}
                {/* <span className="text-xs text-slate-500">
                  ({product.rating.count})
                </span> */}
              </div>
            </div>
          </div>
        </Card>
      </Link>

      {/* Edit Modal */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        message={`¿Estás seguro de que deseas eliminar "${product.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={deleteProduct.isPending}
      />
    </>
  );
}
