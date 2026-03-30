"use client";

import { useState } from "react";
import ImageGallery from "@/components/gallery/ImageGallery";
import Header from "@/components/layout/Header";
import TagList from "@/components/gallery/TagList";
import PersonalInfoSection from "@/components/common/PersonalInfoSection";
import { ImageData } from "@/types";
import { categories, sampleImages, samplePersonalInfo } from "@/types/mockData";

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

const groupImagesByFolder = (images: ImageData[]) => {
  const grouped = new Map<string, ImageData[]>();
  images.forEach((image) => {
    if (!grouped.has(image.folder)) {
      grouped.set(image.folder, []);
    }
    grouped.get(image.folder)!.push(image);
  });
  return Array.from(grouped.entries());
};

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFollowClick = () => {
    console.log("Follow clicked!");
  };

  const filteredImages = sampleImages.filter(
    (image) =>
      matchesCategory(image, selectedCategory) &&
      matchesSearch(image, searchQuery),
  );

  const groupedImages = groupImagesByFolder(filteredImages);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div>
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        <div className="mb-xl">
          <PersonalInfoSection
            info={samplePersonalInfo}
            onFollowClick={handleFollowClick}
          />
        </div>

        <TagList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div>
          {groupedImages.map(([folder, images]) => (
            <div key={folder} className="mb-xl">
              <h2 className="text-2xl font-bold mb-lg text-primary">{folder}</h2>
              <ImageGallery images={images} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
