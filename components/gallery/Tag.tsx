import { Category } from "@/types";

interface TagProps {
  category: Category;
}

export default function Tag({ category }: TagProps) {
  return (
    <button
      key={category.id}
      className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors bg-primary text-white"
    >
      <span>{category.icon}</span>
      <span className="text-sm font-medium">{category.name}</span>
    </button>
  );
}
