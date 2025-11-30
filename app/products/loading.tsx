import { ProductDetailSkeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
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
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailSkeleton />
      </main>
    </div>
  );
}
