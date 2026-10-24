import { Skeleton } from "@/components/ui/skeleton";
import { LoadingPhotoPlaceholder } from "./LoadingPhoto";

// Mirrors the ImageDetail frame (photo area + details aside) so swapping the
// route loading state for the real content causes no layout shift.
export function ImageDetailSkeleton() {
  return (
    <article aria-busy="true">
      <div className="relative grid overflow-hidden rounded-2xl bg-card lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="relative min-w-0">
          <figure className="relative flex aspect-photo max-h-[80vh] min-h-[80vh] w-full items-center justify-center">
            <LoadingPhotoPlaceholder />
          </figure>
        </div>

        <aside className="flex items-center justify-between gap-3 bg-background/85 px-3 py-2.5 lg:flex-col lg:items-stretch lg:justify-between lg:px-4 lg:py-5">
          <div className="hidden space-y-3 lg:block">
            <Skeleton className="h-3 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 lg:w-full">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-14" />
          </div>
        </aside>
      </div>
    </article>
  );
}
