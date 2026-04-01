"use client";
import { sampleImages } from "@/types/mockData";
import { ImageOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function ImageDetail() {
  const { id } = useParams();
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };
  const findImage = sampleImages.find((image) => image.id === id);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    });
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", () => {});
    };
  }, []);

  return (
    <div className="z-50 fixed inset-0 bg-black/50 flex items-center justify-center overflow-hidden m-0 cursor-pointer">
      <div
        className="bg-white rounded-lg p-4 cursor-default"
        ref={containerRef}
      >
        <div className="flex justify-between items-start gap-lg">
          <h1 className="text-2xl font-bold mb-4 text-primary">
            {findImage?.title}
          </h1>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>

        {findImage && !imageError ? (
          <img
            src={findImage.imageUrl}
            alt={findImage.title}
            className="max-w-[80vw] max-h-[80vh] h-auto rounded-lg"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="bg-surface-light flex items-center justify-center p-2xl">
            <ImageOff className="w-8 h-8 text-surface-muted" />
          </div>
        )}
        <p className="text-md text-surface-muted flex justify-end w-full mt-sm">
          Author: {findImage?.author.name}
        </p>
      </div>
    </div>
  );
}
