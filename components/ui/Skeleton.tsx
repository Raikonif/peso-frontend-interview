interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gray-200";

  const variants = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton height={20} width="60%" />
        <Skeleton height={16} count={2} />
        <div className="flex justify-between items-center pt-2">
          <Skeleton height={24} width={80} />
          <Skeleton height={16} width={60} />
        </div>
      </div>
    </div>
  );
}

// Product List Skeleton
export function ProductListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="w-full h-96 md:h-[500px]" />
        <div className="space-y-4">
          <Skeleton height={12} width={100} />
          <Skeleton height={32} width="80%" />
          <Skeleton height={36} width={120} />
          <div className="flex items-center gap-2">
            <Skeleton height={20} width={100} />
            <Skeleton height={20} width={80} />
          </div>
          <div className="pt-4">
            <Skeleton height={20} width={120} />
            <Skeleton height={16} count={5} className="mt-2" />
          </div>
          <div className="pt-6 flex gap-4">
            <Skeleton height={48} width={150} />
            <Skeleton height={48} width={150} />
          </div>
        </div>
      </div>
    </div>
  );
}
