"use client";
import { sampleImages } from "@/types/mockData";
import { useParams, useRouter } from "next/navigation";

export function ImageDetail() {
  const { id } = useParams();
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };
  const findImage = sampleImages.find((image) => image.id === id);

  return (
    <div>
      <h1>Gallery {id}</h1>
      {findImage && <img src={findImage.imageUrl} alt={findImage.title} />}
      <button onClick={handleClose}>Close</button>
    </div>
  );
}
