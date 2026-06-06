"use client";

import { useState } from "react";
import { SoundCloudConsentDialog } from "@/components/molecules/SoundCloudConsentDialog";
import { SoundCloudPlayerSlots } from "@/components/molecules/SoundCloudPlayerSlots";
import { useSoundCloudTrack } from "@/components/organisms/SoundCloudTrackProvider";
import { useSoundCloudCrossfade } from "@/lib/soundcloud/use-soundcloud-crossfade";
import { SoundCloudConsent } from "@/types/soundcloud-consent";

export function SoundCloudPlayer() {
  const { trackId } = useSoundCloudTrack();
  const [consent, setConsent] = useState(SoundCloudConsent.Pending);
  const { slotSrcs, setIframeRef } = useSoundCloudCrossfade(consent, trackId);

  return (
    <>
      <SoundCloudConsentDialog
        consent={consent}
        onConsentChange={setConsent}
      />

      {consent === SoundCloudConsent.Granted ? (
        <SoundCloudPlayerSlots
          slotSrcs={slotSrcs}
          setIframeRef={setIframeRef}
        />
      ) : null}
    </>
  );
}
