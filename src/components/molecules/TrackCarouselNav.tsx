"use client";

import { useEffect, useRef } from "react";
import { useCarousel } from "@/components/ui/carousel";
import { trackEvent } from "@/lib/analytics/track";

type TrackCarouselNavProps = Readonly<{
  slug: string;
}>;

export function TrackCarouselNav({ slug }: TrackCarouselNavProps) {
  const { api } = useCarousel();
  const previousIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();

      if (previousIndexRef.current === null) {
        previousIndexRef.current = index;
        return;
      }

      if (previousIndexRef.current === index) return;

      const direction = index > previousIndexRef.current ? "next" : "prev";
      trackEvent("carousel_navigate", { slug, direction, index });
      previousIndexRef.current = index;
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, slug]);

  return null;
}
