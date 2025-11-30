// Query keys for React Query - shared between server and client
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (limit?: number) => [...productKeys.lists(), { limit }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, "categories"] as const,
  byCategory: (category: string) =>
    [...productKeys.all, "category", category] as const,
};
