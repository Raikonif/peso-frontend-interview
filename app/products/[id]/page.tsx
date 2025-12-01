import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { ProductDetailContainer } from "@/components/products/ProductDetailContainer";
import { serverApi } from "@/lib/api/server";
import { productKeys } from "@/lib/queryKeys";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static pages for products 1-20 at build time
// We use hardcoded IDs to avoid API calls during build (FakeStoreAPI blocks Vercel builds)
export function generateStaticParams() {
  // FakeStoreAPI has products with IDs 1-20
  return Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
  }));
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  // Create a new QueryClient for each request
  const queryClient = new QueryClient();

  // Prefetch the product on the server (with error handling for build resilience)
  try {
    await queryClient.prefetchQuery({
      queryKey: productKeys.detail(productId),
      queryFn: () => serverApi.getProduct(productId),
    });
  } catch {
    // If prefetch fails, the client will fetch on hydration
    console.warn(
      `Failed to prefetch product ${productId}, will fetch on client`
    );
  }

  return (
    <div className="min-h-screen">
      <Header showCreateButton={false} />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductDetailContainer productId={productId} />
        </HydrationBoundary>
      </main>
    </div>
  );
}
