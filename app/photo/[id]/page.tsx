"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  useEffect(() => {
    router.push(`/`);
  }, [params.id]);
  return null;
}
