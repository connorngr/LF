"use client";

import { useSyncExternalStore } from "react";
import { SoundCloudMusicToggle } from "@/components/atoms/SoundCloudMusicToggle";
import { SoundCloudConsentDialog } from "@/components/molecules/SoundCloudConsentDialog";
import { SoundCloudPlayerSlots } from "@/components/molecules/SoundCloudPlayerSlots";
import { useSoundCloudTrack } from "@/components/organisms/SoundCloudTrackProvider";
import { useSoundCloudCrossfade } from "@/lib/soundcloud/use-soundcloud-crossfade";
import {
  readSoundCloudConsent,
  subscribeVisitorPrefs,
  writeSoundCloudConsent,
} from "@/lib/visitor-prefs";
import { SoundCloudConsent } from "@/types/soundcloud-consent";
import { trackEvent } from "@/lib/analytics/track";

// Unknown on the server and during hydration, so nothing consent-related
// renders until the stored choice has been read on the client.
const getServerConsent = () => null;

export function SoundCloudPlayer() {
  const { trackId } = useSoundCloudTrack();
  const storedConsent = useSyncExternalStore(
    subscribeVisitorPrefs,
    readSoundCloudConsent,
    getServerConsent,
  );
  const consent = storedConsent ?? SoundCloudConsent.Pending;
  const { mountTrackId, setIframeRef } = useSoundCloudCrossfade(consent, trackId);

  if (!trackId || storedConsent === null) {
    return null;
  }

  const handleConsentChange = (nextConsent: SoundCloudConsent) => {
    if (
      nextConsent === SoundCloudConsent.Granted ||
      nextConsent === SoundCloudConsent.Denied
    ) {
      trackEvent("soundcloud_consent", {
        choice: nextConsent === SoundCloudConsent.Granted ? "granted" : "denied",
      });
    }
    writeSoundCloudConsent(nextConsent);
  };

  return (
    <>
      <SoundCloudConsentDialog
        consent={consent}
        onConsentChange={handleConsentChange}
      />

      {consent !== SoundCloudConsent.Pending ? (
        <SoundCloudMusicToggle
          isOn={consent === SoundCloudConsent.Granted}
          onToggle={() =>
            handleConsentChange(
              consent === SoundCloudConsent.Granted
                ? SoundCloudConsent.Denied
                : SoundCloudConsent.Granted,
            )
          }
        />
      ) : null}

      {consent === SoundCloudConsent.Granted && mountTrackId ? (
        <SoundCloudPlayerSlots
          trackId={mountTrackId}
          setIframeRef={setIframeRef}
        />
      ) : null}
    </>
  );
}
