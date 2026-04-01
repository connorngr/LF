import { Category } from "@/schemas";

interface TagProps {
  category: Category;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function Tag({
  category,
  isSelected = false,
  onClick,
}: Readonly<TagProps>) {
  return (
    <button
      key={category.id}
      onClick={onClick}
      className={`flex items-center gap-sm px-md py-sm rounded-full whitespace-nowrap transition-colors ${
        isSelected
          ? "bg-primary text-text-primary"
          : "bg-surface text-surface-muted hover:bg-surface-light"
      }`}
    >
      <span>{category.icon}</span>
      <span className="text-sm font-medium text-foreground">{category.name}</span>
    </button>
  );
}
