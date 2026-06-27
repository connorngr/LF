"use client";

import { buildSoundCloudPlayerSrc } from "@/lib/soundcloud/player-url";

type SoundCloudPlayerSlotsProps = Readonly<{
  trackId: string;
  setIframeRef: (node: HTMLIFrameElement | null) => void;
}>;

export function SoundCloudPlayerSlots({
  trackId,
  setIframeRef,
}: SoundCloudPlayerSlotsProps) {
  return (
    <div className="sr-only" aria-hidden="true">
      <iframe
        key={trackId}
        ref={setIframeRef}
        src={buildSoundCloudPlayerSrc(trackId, false)}
        title="SoundCloud player"
        width="100%"
        height="166"
        allow="autoplay; encrypted-media"
        className="pointer-events-none"
        tabIndex={-1}
      />
    </div>
  );
}
