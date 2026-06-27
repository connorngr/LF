"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadSoundCloudApi } from "@/lib/soundcloud/api";
import { SOUND_CLOUD_CROSSFADE_MS } from "@/lib/soundcloud/constants";
import {
  bindLoopOnFinish,
  rampWidgetVolume,
  waitForWidgetReady,
} from "@/lib/soundcloud/widget";
import { SoundCloudConsent } from "@/types/soundcloud-consent";
import type { SoundCloudWidget } from "@/types/soundcloud";

type ActiveWidget = Readonly<{
  widget: SoundCloudWidget;
  unbindFinish: () => void;
}>;

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export function useSoundCloudCrossfade(
  consent: SoundCloudConsent,
  trackId: string | null,
) {
  const [mountTrackId, setMountTrackId] = useState<string | null>(null);
  const playingTrackRef = useRef<string | null>(null);
  const latestTrackRef = useRef<string | null>(trackId);
  const transitionGenerationRef = useRef(0);
  const activeWidgetRef = useRef<ActiveWidget | null>(null);
  const activeRampAbortRef = useRef<(() => void) | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeReadyResolverRef = useRef<
    ((iframe: HTMLIFrameElement) => void) | null
  >(null);
  const isDrainingRef = useRef(false);
  const drainTransitionsRef = useRef<() => Promise<void>>(() => Promise.resolve());

  useEffect(() => {
    latestTrackRef.current = trackId;
  }, [trackId]);

  const abortActiveRamp = () => {
    activeRampAbortRef.current?.();
    activeRampAbortRef.current = null;
  };

  const clearActiveWidget = () => {
    activeWidgetRef.current?.unbindFinish();
    activeWidgetRef.current = null;
  };

  const tearDownPlayer = async () => {
    abortActiveRamp();
    clearActiveWidget();
    iframeRef.current = null;
    setMountTrackId(null);
    await waitForNextFrame();
  };

  const waitForIframe = (): Promise<HTMLIFrameElement> => {
    if (iframeRef.current?.isConnected) {
      return Promise.resolve(iframeRef.current);
    }

    return new Promise((resolve) => {
      iframeReadyResolverRef.current = resolve;
    });
  };

  const setIframeRef = useCallback((node: HTMLIFrameElement | null) => {
    iframeRef.current = node;

    if (node?.isConnected && iframeReadyResolverRef.current) {
      iframeReadyResolverRef.current(node);
      iframeReadyResolverRef.current = null;
    }
  }, []);

  const runTransition = async (targetTrackId: string) => {
    const transitionGeneration = ++transitionGenerationRef.current;

    const isCancelled = () =>
      transitionGenerationRef.current !== transitionGeneration ||
      latestTrackRef.current !== targetTrackId;

    if (activeWidgetRef.current) {
      const fadeOut = rampWidgetVolume(
        activeWidgetRef.current.widget,
        100,
        0,
        SOUND_CLOUD_CROSSFADE_MS,
        isCancelled,
        0,
      );
      activeRampAbortRef.current = fadeOut.abort;
      await fadeOut.promise;
      activeRampAbortRef.current = null;

      if (!isCancelled()) {
        try {
          activeWidgetRef.current.widget.pause();
        } catch {
          // Detached iframe; safe to ignore.
        }
      }
    }

    await tearDownPlayer();
    if (isCancelled()) return;

    setMountTrackId(targetTrackId);

    const iframe = await waitForIframe();
    if (isCancelled() || !iframe.isConnected) {
      await tearDownPlayer();
      return;
    }

    try {
      const api = await loadSoundCloudApi();
      if (isCancelled()) {
        await tearDownPlayer();
        return;
      }

      const widget = api.Widget(iframe);
      await waitForWidgetReady(
        widget,
        api.Widget.Events.READY,
        isCancelled,
      );
      if (isCancelled()) {
        await tearDownPlayer();
        return;
      }

      const unbindFinish = bindLoopOnFinish(widget, api.Widget.Events.FINISH);
      activeWidgetRef.current = { widget, unbindFinish };

      widget.setVolume(0);
      widget.play();

      const fadeIn = rampWidgetVolume(
        widget,
        0,
        100,
        SOUND_CLOUD_CROSSFADE_MS,
        isCancelled,
        0,
      );
      activeRampAbortRef.current = fadeIn.abort;
      await fadeIn.promise;
      activeRampAbortRef.current = null;

      if (isCancelled()) return;

      playingTrackRef.current = targetTrackId;
    } catch {
      await tearDownPlayer();
    }
  };

  const drainTransitions = async () => {
    if (isDrainingRef.current) return;
    isDrainingRef.current = true;

    try {
      while (
        latestTrackRef.current &&
        playingTrackRef.current !== latestTrackRef.current
      ) {
        await runTransition(latestTrackRef.current);
      }
    } finally {
      isDrainingRef.current = false;

      if (
        latestTrackRef.current &&
        playingTrackRef.current !== latestTrackRef.current
      ) {
        void drainTransitionsRef.current();
      }
    }
  };

  useEffect(() => {
    drainTransitionsRef.current = drainTransitions;
  });

  useEffect(() => {
    if (consent !== SoundCloudConsent.Granted || !trackId) return;
    if (playingTrackRef.current === trackId) return;

    transitionGenerationRef.current += 1;
    abortActiveRamp();

    void drainTransitionsRef.current();
  }, [consent, trackId]);

  useEffect(() => {
    return () => {
      transitionGenerationRef.current += 1;
      abortActiveRamp();
      clearActiveWidget();
      iframeRef.current = null;
    };
  }, []);

  return {
    mountTrackId,
    setIframeRef,
  };
}
