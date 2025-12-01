import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { serverApi } from "@/lib/api/server";
import { productKeys } from "@/lib/queryKeys";

// Server Component - fetches data on the server
export default async function HomePage() {
  // Create a new QueryClient for each request (SSR best practice)
  const queryClient = new QueryClient();

  // Prefetch products on the server (with error handling for build resilience)
  try {
    await queryClient.prefetchQuery({
      queryKey: productKeys.list(20),
      queryFn: () => serverApi.getProducts(20),
    });
  } catch {
    // If prefetch fails, the client will fetch on hydration
    console.warn("Failed to prefetch products, will fetch on client");
  }

  // Prefetch categories for the filter
  try {
    await queryClient.prefetchQuery({
      queryKey: productKeys.categories(),
      queryFn: () => serverApi.getCategories(),
    });
  } catch {
    console.warn("Failed to prefetch categories, will fetch on client");
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title - Server rendered, no JS needed */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">
            Catálogo de Productos
          </h1>
          <p className="mt-2 text-slate-400">
            Explora nuestra colección de productos de alta calidad
          </p>
        </div>

        {/* Hydration boundary passes server-fetched data to client */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductCatalog />
        </HydrationBoundary>
      </main>

      {/* Footer - Server rendered, no JS needed */}
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
