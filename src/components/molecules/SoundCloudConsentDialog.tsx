"use client";

import { useEffect, useRef } from "react";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SoundCloudConsent } from "@/types/soundcloud-consent";

type SoundCloudConsentDialogProps = Readonly<{
  consent: SoundCloudConsent;
  onConsentChange: (consent: SoundCloudConsent) => void;
}>;

export function SoundCloudConsentDialog({
  consent,
  onConsentChange,
}: SoundCloudConsentDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (consent === SoundCloudConsent.Pending && !dialog.open) {
      dialog.showModal();
    } else if (consent !== SoundCloudConsent.Pending && dialog.open) {
      dialog.close();
    }
  }, [consent]);

  if (consent !== SoundCloudConsent.Pending) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-60 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-4 backdrop:bg-black/80 open:flex open:items-center open:justify-center"
      onCancel={() => onConsentChange(SoundCloudConsent.Denied)}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onConsentChange(SoundCloudConsent.Denied);
        }
      }}
    >
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Music className="size-5" aria-hidden />
          </div>
          <CardTitle>Play background music?</CardTitle>
          <CardDescription>
            This gallery includes a SoundCloud track. Allow playback so music can
            start while you browse.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => onConsentChange(SoundCloudConsent.Denied)}
          >
            Not now
          </Button>
          <Button
            type="button"
            className="flex-1 sm:flex-none"
            onClick={() => onConsentChange(SoundCloudConsent.Granted)}
          >
            Play music
          </Button>
        </CardFooter>
      </Card>
    </dialog>
  );
}
