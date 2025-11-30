interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "avatar";
  width?: string | number;
  height?: string | number;
  count?: number;
  animated?: boolean;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  count = 1,
  animated = true,
}: SkeletonProps) {
  const baseStyles = animated ? "skeleton-shimmer" : "bg-[#2a2a3a]";

  const variants = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    avatar: "rounded-full w-10 h-10",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={{
              ...style,
              animationDelay: `${i * 0.1}s`,
            }}
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

// Product Card Skeleton - LinkedIn/Facebook style
export function ProductCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl shadow-xl overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image placeholder */}
      <div className="relative w-full h-48 bg-[#151520]">
        <Skeleton className="w-full h-full" />
        {/* Floating badge skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton width={70} height={24} className="rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Category badge */}
        <Skeleton width={80} height={22} className="rounded-full" />

        {/* Title - 2 lines */}
        <div className="space-y-2">
          <Skeleton height={20} width="90%" />
          <Skeleton height={20} width="70%" />
        </div>

        {/* Description - 2 lines */}
        <div className="space-y-2">
          <Skeleton height={14} width="100%" />
          <Skeleton height={14} width="85%" />
        </div>

        {/* Footer: Price and Rating */}
        <div className="pt-4 border-t border-[#2a2a3a] flex items-center justify-between">
          <Skeleton height={28} width={90} />
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton height={16} width={50} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Product List Skeleton with staggered animation
export function ProductListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-fadeInUp"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <ProductCardSkeleton index={i} />
        </div>
      ))}
    </div>
  );
}

// Product Detail Skeleton - LinkedIn/Facebook style
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton width={50} height={16} />
        <Skeleton width={16} height={16} variant="circular" />
        <Skeleton width={150} height={16} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image section */}
        <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl shadow-xl p-8 animate-fadeInUp">
          <Skeleton className="w-full h-96 md:h-[500px]" />
        </div>

        {/* Info section */}
        <div
          className="flex flex-col space-y-6 animate-fadeInUp"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Category badge */}
          <Skeleton width={100} height={28} className="rounded-full" />

          {/* Title */}
          <div className="space-y-3">
            <Skeleton height={36} width="95%" />
            <Skeleton height={36} width="70%" />
          </div>

          {/* Price */}
          <Skeleton height={48} width={150} />

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="circular" width={20} height={20} />
              ))}
            </div>
            <Skeleton width={120} height={20} />
          </div>

          {/* Description section */}
          <div className="pt-4 space-y-3">
            <Skeleton height={24} width={120} />
            <div className="space-y-2">
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="95%" />
              <Skeleton height={16} width="90%" />
              <Skeleton height={16} width="80%" />
            </div>
          </div>

          {/* Product details grid */}
          <div className="pt-4 space-y-3">
            <Skeleton height={24} width={180} />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton height={14} width={80} />
                  <Skeleton height={18} width={100} />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Skeleton height={52} className="flex-1" />
            <Skeleton height={52} width={140} />
          </div>

          {/* Back button */}
          <Skeleton height={44} width={180} />
        </div>
      </div>
    </div>
  );
}

// Generic content skeleton for feeds
export function ContentSkeleton() {
  return (
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-4 space-y-4">
      {/* Header with avatar */}
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="40%" />
          <Skeleton height={12} width="25%" />
        </div>
      </div>

      {/* Content lines */}
      <div className="space-y-2">
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="90%" />
        <Skeleton height={16} width="75%" />
      </div>

      {/* Image placeholder */}
      <Skeleton height={200} className="w-full" />

      {/* Actions */}
      <div className="flex items-center gap-6 pt-2">
        <Skeleton width={60} height={20} />
        <Skeleton width={60} height={20} />
        <Skeleton width={60} height={20} />
      </div>
    </div>
  );
}
