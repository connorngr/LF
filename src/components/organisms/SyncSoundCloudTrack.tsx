"use client";

import { useEffect } from "react";
import { useSoundCloudTrack } from "@/components/organisms/SoundCloudTrackProvider";

type SyncSoundCloudTrackProps = Readonly<{
  trackId: string;
}>;

export function SyncSoundCloudTrack({ trackId }: SyncSoundCloudTrackProps) {
  const { setTrackId } = useSoundCloudTrack();

  useEffect(() => {
    setTrackId(trackId);
  }, [trackId, setTrackId]);

  return null;
}
