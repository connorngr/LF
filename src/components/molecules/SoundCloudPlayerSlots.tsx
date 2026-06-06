"use client";

import { SOUND_CLOUD_PLAYER_SLOT_COUNT } from "@/lib/soundcloud/constants";

type SoundCloudPlayerSlotsProps = Readonly<{
  slotSrcs: (string | null)[];
  setIframeRef: (slotIndex: number, node: HTMLIFrameElement | null) => void;
}>;

const SLOT_KEYS = Array.from(
  { length: SOUND_CLOUD_PLAYER_SLOT_COUNT },
  (_, index) => `soundcloud-slot-${index}`,
);

export function SoundCloudPlayerSlots({
  slotSrcs,
  setIframeRef,
}: SoundCloudPlayerSlotsProps) {
  return (
    <div className="sr-only" aria-hidden="true">
      {SLOT_KEYS.map((slotKey, slotIndex) => (
        <iframe
          key={slotKey}
          ref={(node) => setIframeRef(slotIndex, node)}
          title={`SoundCloud player ${slotIndex + 1}`}
          width="100%"
          height="166"
          allow="autoplay; encrypted-media"
          src={slotSrcs[slotIndex] ?? undefined}
        />
      ))}
    </div>
  );
}
