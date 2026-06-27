import { SOUND_CLOUD_WIDGET_READY_TIMEOUT_MS } from "@/lib/soundcloud/constants";
import type { SoundCloudWidget } from "@/types/soundcloud";

export function bindLoopOnFinish(
  widget: SoundCloudWidget,
  finishEvent: string,
): () => void {
  const loopOnFinish = () => {
    try {
      widget.seekTo(0);
      widget.play();
    } catch {
      // Widget iframe may already be gone after track change.
    }
  };

  widget.bind(finishEvent, loopOnFinish);
  return () => {
    try {
      widget.unbind(finishEvent);
    } catch {
      // Detached iframe; safe to ignore.
    }
  };
}

export type VolumeRamp = Readonly<{
  promise: Promise<void>;
  abort: () => void;
}>;

export function rampWidgetVolume(
  widget: SoundCloudWidget,
  from: number,
  to: number,
  durationMs: number,
  isCancelled?: () => boolean,
  onAbortVolume?: number,
): VolumeRamp {
  let frameId = 0;
  let settled = false;

  const settle = (resolve: () => void) => {
    if (settled) return;
    settled = true;
    cancelAnimationFrame(frameId);
    resolve();
  };

  const abort = () => {
    if (settled) return;
    settled = true;
    cancelAnimationFrame(frameId);

    if (onAbortVolume !== undefined) {
      try {
        widget.setVolume(onAbortVolume);
      } catch {
        // Detached iframe; safe to ignore.
      }
    }
  };

  const promise = new Promise<void>((resolve) => {
    const start = performance.now();

    const step = (now: number) => {
      if (settled || isCancelled?.()) {
        settle(resolve);
        return;
      }

      const progress = Math.min((now - start) / durationMs, 1);
      const volume = from + (to - from) * progress;

      try {
        widget.setVolume(volume);
      } catch {
        settle(resolve);
        return;
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
        return;
      }

      settle(resolve);
    };

    frameId = requestAnimationFrame(step);
  });

  return { promise, abort };
}

export function waitForWidgetReady(
  widget: SoundCloudWidget,
  readyEvent: string,
  isCancelled?: () => boolean,
): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;

    const settle = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);

      try {
        widget.unbind(readyEvent);
      } catch {
        // Detached iframe; safe to ignore.
      }

      resolve();
    };

    const timeoutId = setTimeout(settle, SOUND_CLOUD_WIDGET_READY_TIMEOUT_MS);

    widget.bind(readyEvent, () => {
      if (isCancelled?.()) {
        settle();
        return;
      }

      settle();
    });

    if (isCancelled?.()) {
      settle();
    }
  });
}
