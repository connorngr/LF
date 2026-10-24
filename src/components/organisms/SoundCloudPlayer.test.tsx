import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SoundCloudPlayer } from "@/components/organisms/SoundCloudPlayer";
import { SoundCloudTrackProvider } from "@/components/organisms/SoundCloudTrackProvider";
import {
  readSoundCloudConsent,
  resetVisitorPrefsCacheForTests,
  writeSoundCloudConsent,
} from "@/lib/visitor-prefs";
import { SoundCloudConsent } from "@/types/soundcloud-consent";

vi.mock("@/lib/soundcloud/use-soundcloud-crossfade", () => ({
  useSoundCloudCrossfade: () => ({ mountTrackId: null, setIframeRef: () => {} }),
}));

function Player() {
  return (
    <SoundCloudTrackProvider initialTrackId="123">
      <SoundCloudPlayer />
    </SoundCloudTrackProvider>
  );
}

describe("SoundCloudPlayer consent persistence", () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function close() {
      this.removeAttribute("open");
    };
  });

  beforeEach(() => {
    window.localStorage.clear();
    resetVisitorPrefsCacheForTests();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows the dialog when no choice is stored and remembers the answer", () => {
    render(<Player />);
    fireEvent.click(screen.getByRole("button", { name: "Play music" }));

    expect(readSoundCloudConsent()).toBe(SoundCloudConsent.Granted);
    expect(screen.queryByText("Play background music?")).toBeNull();
    expect(screen.getByRole("button", { name: /Music on/ })).toBeTruthy();
  });

  it("does not show the dialog for a stored choice and lets the visitor toggle it", () => {
    writeSoundCloudConsent(SoundCloudConsent.Denied);
    render(<Player />);

    expect(screen.queryByText("Play background music?")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Music off/ }));
    expect(readSoundCloudConsent()).toBe(SoundCloudConsent.Granted);
  });

  it("renders nothing on the server and hydrates without a mismatch", async () => {
    writeSoundCloudConsent(SoundCloudConsent.Granted);
    const html = renderToString(<Player />);
    expect(html).toBe("");

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    const onRecoverableError = vi.fn();

    await act(async () => {
      hydrateRoot(container, <Player />, { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(container.querySelector("dialog")).toBeNull();
    expect(container.querySelector('button[aria-pressed="true"]')).not.toBeNull();
    container.remove();
  });
});
