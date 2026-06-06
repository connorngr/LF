"use client";

import { useEffect, useRef, useState } from "react";
import { loadSoundCloudApi } from "@/lib/soundcloud/api";
import { SOUND_CLOUD_PLAYER_SLOT_COUNT } from "@/lib/soundcloud/constants";
import {
  transitionToTrack,
  type CrossfadeEngineState,
} from "@/lib/soundcloud/crossfade-engine";
import { SoundCloudConsent } from "@/types/soundcloud-consent";

function createEmptySlotArray<T>(fill: T): T[] {
  return Array.from({ length: SOUND_CLOUD_PLAYER_SLOT_COUNT }, () => fill);
}

export function useSoundCloudCrossfade(
  consent: SoundCloudConsent,
  trackId: string | null,
) {
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>(
    createEmptySlotArray(null),
  );
  const engineStateRef = useRef<CrossfadeEngineState>({
    iframeRefs: createEmptySlotArray(null),
    slotWidgets: createEmptySlotArray(null),
    activeSlot: 0,
    unbindFinish: null,
  });
  const playingTrackRef = useRef<string | null>(null);
  const transitionGenerationRef = useRef(0);
  const [slotSrcs, setSlotSrcs] = useState<(string | null)[]>(
    createEmptySlotArray(null),
  );

  useEffect(() => {
    if (consent !== SoundCloudConsent.Granted || !trackId) return;

    const nextTrackId = trackId;
    if (playingTrackRef.current === nextTrackId) return;

    const previousTrackId = playingTrackRef.current;
    playingTrackRef.current = nextTrackId;
    const transitionGeneration = ++transitionGenerationRef.current;
    const isCancelled = () =>
      transitionGenerationRef.current !== transitionGeneration;

    const callbacks = {
      setSlotSrc: (slotIndex: number, src: string) => {
        setSlotSrcs((current) => {
          const updated = [...current];
          updated[slotIndex] = src;
          return updated;
        });
      },
      setState: (partial: Partial<CrossfadeEngineState>) => {
        engineStateRef.current = {
          ...engineStateRef.current,
          ...partial,
        };
      },
      isCancelled,
    };

    void (async () => {
      const api = await loadSoundCloudApi();
      if (isCancelled()) return;

      engineStateRef.current = {
        ...engineStateRef.current,
        iframeRefs: iframeRefs.current,
      };
      engineStateRef.current = await transitionToTrack(
        api,
        callbacks,
        engineStateRef.current,
        previousTrackId,
        nextTrackId,
      );
    })();
  }, [consent, trackId]);

  useEffect(() => {
    return () => {
      transitionGenerationRef.current += 1;
      engineStateRef.current.unbindFinish?.();
      engineStateRef.current = {
        ...engineStateRef.current,
        unbindFinish: null,
      };
    };
  }, []);

  return {
    slotSrcs,
    setIframeRef: (slotIndex: number, node: HTMLIFrameElement | null) => {
      iframeRefs.current[slotIndex] = node;
      const iframeRefsCopy = [...engineStateRef.current.iframeRefs];
      iframeRefsCopy[slotIndex] = node;
      engineStateRef.current = {
        ...engineStateRef.current,
        iframeRefs: iframeRefsCopy,
      };
    },
  };
}
