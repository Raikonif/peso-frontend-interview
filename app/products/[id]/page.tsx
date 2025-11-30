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

// Generate static pages for all products at build time
export async function generateStaticParams() {
  const products = await serverApi.getProducts();
  return products.map((product) => ({
    id: String(product.id),
  }));
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  // Create a new QueryClient for each request
  const queryClient = new QueryClient();

  // Prefetch the product on the server
  await queryClient.prefetchQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => serverApi.getProduct(productId),
  });

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
