"use client";

import { useState } from "react";
import ImageGallery from "@/components/gallery/ImageGallery";
import Header from "@/components/layout/Header";
import TagList from "@/components/gallery/TagList";
import { ImageData } from "@/types";
import { categories, sampleImages } from "@/types/mockData";

const matchesCategory = (image: ImageData, category: string | null) => {
  if (!category) return true;
  return image.category.toLowerCase() === category.toLowerCase();
};

const matchesSearch = (image: ImageData, query: string) => {
  if (!query) return true;
  const lowerQuery = query.toLowerCase();
  return (
    image.title.toLowerCase().includes(lowerQuery) ||
    image.author.name.toLowerCase().includes(lowerQuery)
  );
};

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredImages = sampleImages.filter(
    (image) =>
      matchesCategory(image, selectedCategory) &&
      matchesSearch(image, searchQuery),
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div>
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <TagList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <ImageGallery images={filteredImages} />
      </div>
    </div>
  );
}
