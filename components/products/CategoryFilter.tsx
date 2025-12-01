"use client";

import { useCategories } from "@/lib/hooks/useProducts";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { formatCategory } from "@/lib/helpers/formatCategory";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  disabled?: boolean;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  disabled = false,
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
    // Show placeholder buttons when categories unavailable
    const placeholderCategories = ["electronics", "clothing", "jewelery"];
    return (
      <div className={`flex flex-wrap gap-2 ${disabled ? "opacity-50" : ""}`}>
        <Button
          variant={selectedCategory === null ? "primary" : "secondary"}
          size="sm"
          onClick={() => onSelectCategory(null)}
          disabled={disabled}
        >
          Todos
        </Button>
        {placeholderCategories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "primary" : "secondary"}
            size="sm"
            onClick={() => onSelectCategory(category)}
            disabled={disabled}
          >
            {formatCategory(category)}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${disabled ? "opacity-50" : ""}`}>
      <Button
        variant={selectedCategory === null ? "primary" : "secondary"}
        size="sm"
        onClick={() => onSelectCategory(null)}
        disabled={disabled}
      >
        Todos
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "primary" : "secondary"}
          size="sm"
          onClick={() => onSelectCategory(category)}
          disabled={disabled}
        >
          {formatCategory(category)}
        </Button>
      ))}
    </div>
  );
}
