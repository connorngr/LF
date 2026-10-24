"use client";

import { Music, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

type SoundCloudMusicToggleProps = Readonly<{
  isOn: boolean;
  onToggle: () => void;
}>;

export function SoundCloudMusicToggle({
  isOn,
  onToggle,
}: SoundCloudMusicToggleProps) {
  const Icon = isOn ? Music : VolumeX;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="fixed bottom-4 left-4 z-50 rounded-full bg-background/80 shadow-md backdrop-blur-sm"
      aria-pressed={isOn}
      aria-label={isOn ? "Music on. Turn music off" : "Music off. Turn music on"}
      title={isOn ? "Music: on" : "Music: off"}
      onClick={onToggle}
    >
      <Icon className="size-4" aria-hidden />
    </Button>
  );
}
