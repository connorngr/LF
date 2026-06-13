"use client";

import { useEffect, useRef } from "react";
import { loadSoundCloudApi } from "@/lib/soundcloud/api";
import { SOUND_CLOUD_PLAYER_SLOT_COUNT } from "@/lib/soundcloud/constants";
import {
  transitionToTrack,
  type CrossfadeEngineState,
} from "@/lib/soundcloud/crossfade-engine";
import { pauseAllSlotWidgets } from "@/lib/soundcloud/widget";
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
  const inFlightTrackRef = useRef<string | null>(null);
  const transitionGenerationRef = useRef(0);

  useEffect(() => {
    if (consent !== SoundCloudConsent.Granted || !trackId) return;
    if (playingTrackRef.current === trackId) return;
    if (inFlightTrackRef.current === trackId) return;

    const nextTrackId = trackId;
    const previousTrackId = playingTrackRef.current;
    const transitionGeneration = ++transitionGenerationRef.current;
    inFlightTrackRef.current = nextTrackId;

    engineStateRef.current.unbindFinish?.();
    pauseAllSlotWidgets(engineStateRef.current.slotWidgets);
    engineStateRef.current = {
      ...engineStateRef.current,
      unbindFinish: null,
    };

    const isCancelled = () =>
      transitionGenerationRef.current !== transitionGeneration;

    const callbacks = {
      setState: (partial: Partial<CrossfadeEngineState>) => {
        engineStateRef.current = {
          ...engineStateRef.current,
          ...partial,
        };
      },
      isCancelled,
    };

    void (async () => {
      try {
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

        if (isCancelled()) return;

        playingTrackRef.current = nextTrackId;
      } finally {
        if (inFlightTrackRef.current === nextTrackId) {
          inFlightTrackRef.current = null;
        }
      }
    })();
  }, [consent, trackId]);

  useEffect(() => {
    return () => {
      transitionGenerationRef.current += 1;
      engineStateRef.current.unbindFinish?.();
      pauseAllSlotWidgets(engineStateRef.current.slotWidgets);
      engineStateRef.current = {
        ...engineStateRef.current,
        unbindFinish: null,
      };
    };
  }, []);

  return {
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
