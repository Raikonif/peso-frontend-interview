import { ProductListSkeleton } from "@/components/ui/Skeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <header className="bg-[#1a1a24] border-b border-[#2a2a3a] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 skeleton-shimmer rounded-lg" />
              <div className="w-24 h-6 skeleton-shimmer rounded" />
            </div>
            <div className="w-36 h-10 skeleton-shimmer rounded-lg" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title skeleton */}
        <div className="mb-8 space-y-3">
          <Skeleton height={36} width={280} />
          <Skeleton height={20} width={380} />
        </div>

        {/* Filters section skeleton */}
        <div className="mb-8 space-y-4">
          {/* Search skeleton */}
          <div className="max-w-md">
            <Skeleton height={42} className="w-full rounded-lg" />
          </div>

          {/* Category filter skeleton */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                width={90 + i * 10}
                height={36}
                className="rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Results info skeleton */}
        <div className="mb-6">
          <Skeleton height={20} width={150} />
        </div>

        {/* Products list skeleton */}
        <ProductListSkeleton count={8} />
      </main>

      {/* Footer skeleton */}
      <footer className="bg-[#1a1a24] border-t border-[#2a2a3a] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-3">
            <Skeleton height={16} width={400} />
            <Skeleton height={16} width={300} />
          </div>
        </div>
      </footer>
    </div>
  );
}
