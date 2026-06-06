import { iframelyApiKey } from "@/lib/env";
import { iframelyResponseSchema } from "@/schemas/iframely";
import { extractTrackIdFromPlayerHref } from "@/lib/soundcloud";

export type ResolvedSoundCloudTrack = Readonly<{
  trackId: string;
  playerHref: string;
}>;

export async function resolveSoundCloudTrack(
  soundCloudUrl: string,
): Promise<ResolvedSoundCloudTrack> {
  const apiUrl = new URL("https://iframe.ly/api/iframely");
  apiUrl.searchParams.set("url", soundCloudUrl);
  apiUrl.searchParams.set("api_key", iframelyApiKey);

  const response = await fetch(apiUrl.toString(), {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error("Failed to resolve SoundCloud URL");
  }

  const parsed = iframelyResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Invalid SoundCloud embed response");
  }

  const playerHref = parsed.data.links.player[0].href;
  const trackId = extractTrackIdFromPlayerHref(playerHref);

  if (!trackId) {
    throw new Error("Could not extract track ID from SoundCloud embed");
  }

  return { trackId, playerHref };
}
