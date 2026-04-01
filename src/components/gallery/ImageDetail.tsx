"use client";
import { sampleImages } from "@/types/mockData";
import { ImageOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ImageDetail() {
  const { id } = useParams();
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };
  const findImage = sampleImages.find((image) => image.id === id);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="z-50 fixed inset-0 bg-black/50 flex items-center justify-center overflow-hidden m-0">
      <div className="bg-white rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          {findImage?.title}
        </h1>
        {findImage && !imageError ? (
          <img
            src={findImage.imageUrl}
            alt={findImage.title}
            className="max-w-[80vw] max-h-[80vh] h-auto rounded-lg"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="bg-surface-light flex items-center justify-center max-w-[20vw] max-h-[20vh] p-2xl">
            <ImageOff className="w-8 h-8 text-surface-muted" />
          </div>
        )}
        <div className="flex justify-between items-center gap-lg">
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Close
          </button>
          <p className="text-md text-surface-muted">
            Author: {findImage?.author.name}
          </p>
        </div>
      </div>
    </div>
  );
}
