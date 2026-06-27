"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SoundCloudTrackContextValue = Readonly<{
  trackId: string | null;
  setTrackId: (trackId: string | null) => void;
}>;

const SoundCloudTrackContext = createContext<SoundCloudTrackContextValue | null>(
  null,
);

type SoundCloudTrackProviderProps = Readonly<{
  initialTrackId: string | null;
  children: ReactNode;
}>;

export function SoundCloudTrackProvider({
  initialTrackId,
  children,
}: SoundCloudTrackProviderProps) {
  const [trackId, setTrackId] = useState(initialTrackId);

  const value = useMemo(
    () => ({ trackId, setTrackId }),
    [trackId],
  );

  return (
    <SoundCloudTrackContext.Provider value={value}>
      {children}
    </SoundCloudTrackContext.Provider>
  );
}

export function useSoundCloudTrack(): SoundCloudTrackContextValue {
  const context = useContext(SoundCloudTrackContext);
  if (!context) {
    throw new Error("useSoundCloudTrack must be used within SoundCloudTrackProvider");
  }
  return context;
}
