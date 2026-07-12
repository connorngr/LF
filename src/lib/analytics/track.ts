type UmamiEventData = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, data?: UmamiEventData): void {
  if (typeof window === "undefined") return;

  const payload = data
    ? Object.fromEntries(
        Object.entries(data).flatMap(([key, value]) =>
          value === undefined ? [] : [[key, String(value)]],
        ),
      )
    : undefined;

  window.umami?.track(name, payload);
}
