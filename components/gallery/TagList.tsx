"use client";

import { Category } from "@/types";

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
            ? "bg-primary text-white"
            : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
        }`}
      >
        <span className="text-sm font-medium">All</span>
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            selectedCategory === category.id
              ? "bg-primary text-white"
              : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          <span>{category.icon}</span>
          <span className="text-sm font-medium">{category.name}</span>
        </button>
      ))}
    </div>
  );
}
