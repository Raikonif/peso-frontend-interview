"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ProductDetailSkeleton } from "../ui/Skeleton";
import { ErrorMessage } from "../common/ErrorMessage";
import { EmptyState } from "../common/EmptyState";
import { ApiError } from "@/lib/types/product";

interface ProductDetailProps {
  product: Product | undefined;
  isLoading: boolean;
  error: ApiError | Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ProductDetail({
  product,
  isLoading,
  error,
  onRetry,
  isRetrying,
}: ProductDetailProps) {
  // Loading state
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={onRetry}
        isRetrying={isRetrying}
        className="max-w-2xl mx-auto"
      />
    );
  }

  // Empty/Not found state
  if (!product) {
    return (
      <EmptyState
        icon={
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        title="Producto no encontrado"
        description="El producto que buscas no existe o ha sido eliminado."
        action={
          <Link href="/">
            <Button variant="primary">Volver al inicio</Button>
          </Link>
        }
      />
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>
          <li>
            <span className="text-gray-900 font-medium line-clamp-1">
              {product.title}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="relative w-full h-96 md:h-[500px]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Info section */}
        <div className="flex flex-col">
          {/* Category */}
          <Badge variant="info" size="md">
            {formatCategory(product.category)}
          </Badge>

          {/* Title */}
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
            {product.title}
          </h1>

          {/* Price */}
          <p className="mt-4 text-4xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </p>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(product.rating.rate)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } fill-current`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating.rate.toFixed(1)} ({product.rating.count} reseñas)
            </span>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Descripción</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product details */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Detalles del producto
            </h2>
            <dl className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">ID del producto</dt>
                <dd className="font-medium text-gray-900">#{product.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Categoría</dt>
                <dd className="font-medium text-gray-900">
                  {formatCategory(product.category)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Valoración promedio</dt>
                <dd className="font-medium text-gray-900">
                  {product.rating.rate}/5
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Total de reseñas</dt>
                <dd className="font-medium text-gray-900">
                  {product.rating.count}
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="lg" className="flex-1">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Agregar al carrito
            </Button>
            <Button variant="secondary" size="lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Favoritos
            </Button>
          </div>

          {/* Back button */}
          <div className="mt-6">
            <Link href="/">
              <Button variant="ghost">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Volver al catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
