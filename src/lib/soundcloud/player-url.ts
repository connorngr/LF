const SOUNDCLOUD_PLAYER_ORIGIN = "https://w.soundcloud.com/player/";

export function extractTrackIdFromPlayerHref(playerHref: string): string | null {
  try {
    const playerUrl = new URL(playerHref);
    const trackUrl = playerUrl.searchParams.get("url");
    if (!trackUrl) return null;

    const decoded = decodeURIComponent(trackUrl);

    const soundcloudUriMatch = /soundcloud:tracks:(\d+)/.exec(decoded);
    if (soundcloudUriMatch?.[1]) return soundcloudUriMatch[1];

    const apiPathMatch = /\/tracks\/(\d+)/.exec(decoded);
    return apiPathMatch?.[1] ?? null;
  } catch {
    return null;
  }
}

export function buildSoundCloudPlayerBase(trackId: string): string {
  const trackApiUrl = `https://api.soundcloud.com/tracks/${trackId}`;
  const playerUrl = new URL(SOUNDCLOUD_PLAYER_ORIGIN);
  playerUrl.searchParams.set("url", trackApiUrl);
  return playerUrl.toString();
}

export function buildSoundCloudPlayerSrc(
  trackId: string,
  autoPlay: boolean,
): string {
  const playerBase = buildSoundCloudPlayerBase(trackId);
  const playerUrl = new URL(playerBase);
  playerUrl.searchParams.set("color", "#ff5500");
  playerUrl.searchParams.set("auto_play", String(autoPlay));
  playerUrl.searchParams.set("hide_related", "true");
  playerUrl.searchParams.set("show_comments", "false");
  playerUrl.searchParams.set("show_user", "false");
  playerUrl.searchParams.set("show_reposts", "false");
  playerUrl.searchParams.set("show_teaser", "false");
  return playerUrl.toString();
}
