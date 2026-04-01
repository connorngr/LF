import { sampleImages } from "@/types/mockData";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const image = sampleImages.find((img) => img.id === params.id);

  return {
    title: image?.title || "Gallery",
    description: image?.title || "Gallery",
  };
};

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <p>Direct access to /photo/{params.id}</p>
    </div>
  );
}
