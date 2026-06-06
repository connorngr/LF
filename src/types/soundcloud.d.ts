export type SoundCloudWidget = {
  bind: (event: string, listener: () => void) => void;
  unbind: (event: string) => void;
  play: () => void;
  pause: () => void;
  seekTo: (milliseconds: number) => void;
  setVolume: (volume: number) => void;
  load: (
    url: string,
    options?: Readonly<{ auto_play?: boolean }>,
  ) => void;
};

export type SoundCloudWidgetEvents = Readonly<{
  FINISH: string;
  READY: string;
}>;

export type SoundCloudAPI = {
  Widget: {
    (iframe: HTMLIFrameElement | string): SoundCloudWidget;
    Events: SoundCloudWidgetEvents;
  };
};

declare global {
  var SC: SoundCloudAPI | undefined;
}

export {};
