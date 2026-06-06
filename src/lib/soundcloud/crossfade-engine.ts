import { SOUND_CLOUD_CROSSFADE_MS } from "@/lib/soundcloud/constants";
import { buildSoundCloudPlayerSrc } from "@/lib/soundcloud/player-url";
import {
  bindLoopOnFinish,
  loadIframeSrc,
  rampWidgetVolume,
  waitForWidgetReady,
} from "@/lib/soundcloud/widget";
import type { SoundCloudAPI, SoundCloudWidget } from "@/types/soundcloud";

export type PlayerSlot = Readonly<{
  widget: SoundCloudWidget;
  finishEvent: string;
}>;

export type CrossfadeEngineState = Readonly<{
  iframeRefs: (HTMLIFrameElement | null)[];
  slotWidgets: (PlayerSlot | null)[];
  activeSlot: number;
  unbindFinish: (() => void) | null;
}>;

export type CrossfadeEngineCallbacks = Readonly<{
  setSlotSrc: (slotIndex: number, src: string) => void;
  setState: (state: Partial<CrossfadeEngineState>) => void;
  isCancelled: () => boolean;
}>;

async function prepareSlot(
  api: SoundCloudAPI,
  callbacks: CrossfadeEngineCallbacks,
  state: CrossfadeEngineState,
  slotIndex: number,
  nextTrack: string,
): Promise<PlayerSlot | null> {
  const nextSrc = buildSoundCloudPlayerSrc(nextTrack, false);
  callbacks.setSlotSrc(slotIndex, nextSrc);

  const iframe = state.iframeRefs[slotIndex];
  if (!iframe) return null;

  await loadIframeSrc(iframe, nextSrc);
  if (callbacks.isCancelled() || !iframe.isConnected) return null;

  try {
    const widget = api.Widget(iframe);
    await waitForWidgetReady(
      widget,
      api.Widget.Events.READY,
      callbacks.isCancelled,
    );
    if (callbacks.isCancelled()) return null;

    return {
      widget,
      finishEvent: api.Widget.Events.FINISH,
    };
  } catch {
    return null;
  }
}

function attachLoopHandler(
  callbacks: CrossfadeEngineCallbacks,
  state: CrossfadeEngineState,
  slot: PlayerSlot,
): CrossfadeEngineState {
  state.unbindFinish?.();

  const unbindFinish = bindLoopOnFinish(slot.widget, slot.finishEvent);
  callbacks.setState({ unbindFinish });

  return { ...state, unbindFinish };
}

async function fadeInSlot(
  api: SoundCloudAPI,
  callbacks: CrossfadeEngineCallbacks,
  state: CrossfadeEngineState,
  slotIndex: number,
  nextTrack: string,
): Promise<CrossfadeEngineState> {
  const slot = await prepareSlot(
    api,
    callbacks,
    state,
    slotIndex,
    nextTrack,
  );
  if (!slot) return state;

  const slotWidgets = [...state.slotWidgets];
  slotWidgets[slotIndex] = slot;

  let nextState: CrossfadeEngineState = {
    ...state,
    slotWidgets,
    activeSlot: slotIndex,
  };

  slot.widget.setVolume(0);
  slot.widget.play();

  nextState = attachLoopHandler(callbacks, nextState, slot);

  await rampWidgetVolume(
    slot.widget,
    0,
    100,
    SOUND_CLOUD_CROSSFADE_MS,
    callbacks.isCancelled,
  );

  return nextState;
}

async function crossfadeToSlot(
  api: SoundCloudAPI,
  callbacks: CrossfadeEngineCallbacks,
  state: CrossfadeEngineState,
  slotIndex: number,
  nextTrack: string,
): Promise<CrossfadeEngineState> {
  const outgoingIndex = state.activeSlot;
  const outgoing = state.slotWidgets[outgoingIndex];
  const incoming = await prepareSlot(
    api,
    callbacks,
    state,
    slotIndex,
    nextTrack,
  );
  if (!incoming) return state;

  const slotWidgets = [...state.slotWidgets];
  slotWidgets[slotIndex] = incoming;

  incoming.widget.setVolume(0);
  incoming.widget.play();

  const fadeOut = outgoing
    ? rampWidgetVolume(
        outgoing.widget,
        100,
        0,
        SOUND_CLOUD_CROSSFADE_MS,
        callbacks.isCancelled,
      )
    : Promise.resolve();

  const fadeIn = rampWidgetVolume(
    incoming.widget,
    0,
    100,
    SOUND_CLOUD_CROSSFADE_MS,
    callbacks.isCancelled,
  );

  await Promise.all([fadeOut, fadeIn]);
  if (callbacks.isCancelled()) return state;

  try {
    outgoing?.widget.pause();
  } catch {
    // Outgoing widget may already be detached.
  }

  let nextState: CrossfadeEngineState = {
    ...state,
    slotWidgets,
    activeSlot: slotIndex,
  };

  nextState = attachLoopHandler(callbacks, nextState, incoming);

  return nextState;
}

export async function transitionToTrack(
  api: SoundCloudAPI,
  callbacks: CrossfadeEngineCallbacks,
  state: CrossfadeEngineState,
  previousTrackId: string | null,
  nextTrackId: string,
): Promise<CrossfadeEngineState> {
  if (!previousTrackId) {
    return fadeInSlot(api, callbacks, state, 0, nextTrackId);
  }

  const incomingSlot = state.activeSlot === 0 ? 1 : 0;
  return crossfadeToSlot(api, callbacks, state, incomingSlot, nextTrackId);
}
