"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageData } from "@/types";
import { Download, ImageOff } from "lucide-react";

interface ImageCardProps {
  image: ImageData;
}

export default function ImageCard({ image }: ImageCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-lg bg-surface cursor-pointer transition-transform hover:scale-[0.98]">
      <div className="relative aspect-3/4">
        {imageError ? (
          <div className="absolute inset-0 bg-surface-light flex items-center justify-center">
            <ImageOff className="w-8 h-8 text-surface-muted" />
          </div>
        ) : (
          <Image
            src={image.imageUrl}
            alt={image.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}

        <div className="absolute top-3 right-3">
          <span className="capitalize px-3 py-1 text-xs font-medium bg-surface-light/90 text-foreground rounded-md backdrop-blur-sm">
            {image.category}
          </span>
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-text-primary font-medium text-lg mb-2 line-clamp-2">
              {image.title}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {image.author.avatar && (
                  <div className="w-6 h-6 rounded-full bg-surface-lighter overflow-hidden">
                    <Image
                      src={image.author.avatar}
                      alt={image.author.name}
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-sm text-surface-muted">
                  {image.author.name}
                </span>
              </div>

              <button
                className="p-2 bg-primary hover:opacity-80 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Download className="w-4 h-4 text-text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
