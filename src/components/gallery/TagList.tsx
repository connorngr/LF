"use client";

import { Category } from "@/types";
import Tag from "./Tag";

interface TagListProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export default function TagList({
  categories,
  selectedCategory,
  onCategoryChange,
}: Readonly<TagListProps>) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
      <button
        onClick={() => onCategoryChange(null)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
          selectedCategory === null
            ? "bg-primary text-text-primary"
            : "bg-surface text-surface-muted hover:bg-surface-light"
        }`}
      >
        <span className="text-sm font-medium">All</span>
      </button>
      {categories.map((category) => (
        <Tag
          key={category.id}
          category={category}
          isSelected={selectedCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
        />
      ))}
    </div>
  );
}
