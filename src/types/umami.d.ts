type UmamiEventData = Record<string, string | number | boolean | undefined>;

interface UmamiTracker {
  track: (
    eventOrPayload?: string | UmamiEventData | ((props: UmamiEventData) => UmamiEventData),
    data?: UmamiEventData,
  ) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
    umamiBeforeSendHandler?: (type: string, payload: { url?: string; urlPath?: string }) => false | unknown;
  }
}

export {};
