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

export function rampWidgetVolume(
  widget: SoundCloudWidget,
  from: number,
  to: number,
  durationMs: number,
  isCancelled?: () => boolean,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();

    const step = (now: number) => {
      if (isCancelled?.()) {
        resolve();
        return;
      }

      const progress = Math.min((now - start) / durationMs, 1);
      const volume = from + (to - from) * progress;

      try {
        widget.setVolume(volume);
      } catch {
        resolve();
        return;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      resolve();
    };

    requestAnimationFrame(step);
  });
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

export function loadIframeSrc(
  iframe: HTMLIFrameElement,
  nextSrc: string,
): Promise<void> {
  if (iframe.src === nextSrc) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const handleLoad = () => {
      iframe.removeEventListener("load", handleLoad);
      resolve();
    };

    iframe.addEventListener("load", handleLoad);
    iframe.src = nextSrc;
  });
}
