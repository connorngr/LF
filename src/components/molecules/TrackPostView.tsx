"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/track";

type TrackPostViewProps = Readonly<{
  slug: string;
  imageCount: number;
}>;

export function TrackPostView({ slug, imageCount }: TrackPostViewProps) {
  const trackedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (trackedSlugRef.current === slug) return;
    trackedSlugRef.current = slug;
    trackEvent("post_view", { slug, imageCount });
  }, [slug, imageCount]);

  return null;
}
