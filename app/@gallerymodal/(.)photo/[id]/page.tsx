import { ImageDetail } from "@/components/gallery/ImageDetail";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Gallery",
    description: "Gallery",
  };
};

export default function Gallery() {
  return (
    <div className="fixed top-5 left-5">
      <ImageDetail />
    </div>
  );
}
