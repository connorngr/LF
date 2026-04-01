'use client';

import { ImageData } from '@/schemas';
import ImageCard from './ImageCard';
import Link from 'next/link';

interface ImageGalleryProps {
  images: ImageData[];
}

export default function ImageGallery({ images }: Readonly<ImageGalleryProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id}>
          <Link href={`/photo/${image.id}`}>
            <ImageCard image={image} />
          </Link>
        </div>
      ))}
    </div>
  );
}
