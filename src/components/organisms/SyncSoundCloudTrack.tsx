"use client";

import { useEffect, useRef } from "react";
import { useSoundCloudTrack } from "@/components/organisms/SoundCloudTrackProvider";
import { trackEvent } from "@/lib/analytics/track";

type SyncSoundCloudTrackProps = Readonly<{
  trackId: string;
  slug?: string;
}>;

export function SyncSoundCloudTrack({ trackId, slug }: SyncSoundCloudTrackProps) {
  const { setTrackId } = useSoundCloudTrack();
  const previousTrackIdRef = useRef<string | null>(null);

  useEffect(() => {
    setTrackId(trackId);

    if (previousTrackIdRef.current === trackId) return;
    previousTrackIdRef.current = trackId;
    trackEvent("soundcloud_track_change", { trackId, slug });
  }, [trackId, slug, setTrackId]);

  return null;
}
