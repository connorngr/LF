"use client";

import { useState } from "react";
import { SoundCloudConsentDialog } from "@/components/molecules/SoundCloudConsentDialog";
import { SoundCloudPlayerSlots } from "@/components/molecules/SoundCloudPlayerSlots";
import { useSoundCloudTrack } from "@/components/organisms/SoundCloudTrackProvider";
import { useSoundCloudCrossfade } from "@/lib/soundcloud/use-soundcloud-crossfade";
import { SoundCloudConsent } from "@/types/soundcloud-consent";
import { trackEvent } from "@/lib/analytics/track";

export function SoundCloudPlayer() {
  const { trackId } = useSoundCloudTrack();
  const [consent, setConsent] = useState(SoundCloudConsent.Pending);
  const { mountTrackId, setIframeRef } = useSoundCloudCrossfade(consent, trackId);

  if (!trackId) {
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
    setConsent(nextConsent);
  };

  return (
    <>
      <SoundCloudConsentDialog
        consent={consent}
        onConsentChange={handleConsentChange}
      />

      {consent === SoundCloudConsent.Granted && mountTrackId ? (
        <SoundCloudPlayerSlots
          trackId={mountTrackId}
          setIframeRef={setIframeRef}
        />
      ) : null}
    </>
  );
}
