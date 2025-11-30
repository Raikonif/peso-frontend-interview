"use client";

import Image from "next/image";
import Link from "next/link";

import { Product } from "@/lib/types/product";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

import { usePrefetchProduct } from "@/lib/hooks/useRetry";
import { colorCategory } from "@/lib/helpers/colorCategory";
import { formatPrice } from "@/lib/helpers/formatPrice";
import { formatCategory } from "@/lib/helpers/formatCategory";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const prefetch = usePrefetchProduct();

  return (
    <Link
      href={`/products/${product.id}`}
      onMouseEnter={() => prefetch(product.id)}
    >
      <Card hoverable className="h-full flex flex-col">
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
              <span className="text-sm text-slate-300">
                {product.rating.rate.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">
                ({product.rating.count})
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
