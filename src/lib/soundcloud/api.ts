import type { SoundCloudAPI } from "@/types/soundcloud";

const SOUNDCLOUD_API_SCRIPT = "https://w.soundcloud.com/player/api.js";

function getSoundCloudApi(): SoundCloudAPI | undefined {
  return globalThis.SC;
}

function assertSoundCloudApi(): SoundCloudAPI {
  const api = getSoundCloudApi();
  if (!api?.Widget) {
    throw new Error("SoundCloud Widget API failed to load");
  }
  return api;
}

async function waitForScript(script: HTMLScriptElement): Promise<SoundCloudAPI> {
  await new Promise<void>((resolve, reject) => {
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("SoundCloud Widget API failed to load")),
      { once: true },
    );
  });
  return assertSoundCloudApi();
}

export async function loadSoundCloudApi(): Promise<SoundCloudAPI> {
  const existingApi = getSoundCloudApi();
  if (existingApi?.Widget) {
    return existingApi;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[data-soundcloud-widget-api="true"]',
  );
  if (existingScript) {
    const loadedApi = getSoundCloudApi();
    if (loadedApi?.Widget) {
      return loadedApi;
    }
    return waitForScript(existingScript);
  }

  const script = document.createElement("script");
  script.src = SOUNDCLOUD_API_SCRIPT;
  script.async = true;
  script.dataset.soundcloudWidgetApi = "true";
  document.body.appendChild(script);

  return waitForScript(script);
}
