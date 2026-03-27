'use client';

import { ImageData } from '@/types';
import ImageCard from './ImageCard';

interface ImageGalleryProps {
  images: ImageData[];
}

export default function ImageGallery({ images }: Readonly<ImageGalleryProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id}>
          <ImageCard image={image} />
        </div>
      ))}
    </div>
  );
}
