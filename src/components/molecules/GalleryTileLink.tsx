"use client";

import Link, { useLinkStatus } from "next/link";
import { trackEvent } from "@/lib/analytics/track";

type GalleryTileLinkProps = Readonly<{
  slug: string;
  className?: string;
  children: React.ReactNode;
}>;

// Tracks clicks via `umami.track()` instead of `data-umami-event`. Umami's
// auto click tracker calls preventDefault() on annotated anchors and then sets
// `location.href`, which turns the soft navigation into a full page load and
// skips the `@gallerymodal/(.)photo/[id]` intercept.
export function GalleryTileLink({ slug, className, children }: GalleryTileLinkProps) {
  return (
    <Link
      href={`/photo/${slug}`}
      className={className}
      onClick={() => trackEvent("gallery_click", { slug })}
    >
      {children}
      <GalleryTilePendingIndicator />
    </Link>
  );
}

function GalleryTilePendingIndicator() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 transition-opacity duration-150 motion-reduce:transition-none ${
        pending ? "opacity-100" : "opacity-0"
      }`}
    >
      {pending ? (
        <span className="size-6 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin" />
      ) : null}
    </span>
  );
}
