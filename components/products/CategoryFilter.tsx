"use client";

import { useCategories } from "@/lib/hooks/useProducts";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { formatCategory } from "@/lib/helpers/formatCategory";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width={100} height={36} variant="rectangular" />
        ))}
      </div>
    );
  }

  if (error || !categories) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "primary" : "secondary"}
        size="sm"
        onClick={() => onSelectCategory(null)}
      >
        Todos
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "primary" : "secondary"}
          size="sm"
          onClick={() => onSelectCategory(category)}
        >
          {formatCategory(category)}
        </Button>
      ))}
    </div>
  );
}
