import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "@/lib/analytics/track";
import { GalleryTileLink } from "./GalleryTileLink";

vi.mock("@/lib/analytics/track", () => ({
  trackEvent: vi.fn(),
}));

describe("GalleryTileLink", () => {
  let defaultPrevented: boolean | null = null;
  const recordAndStopNavigation = (event: MouseEvent) => {
    defaultPrevented = event.defaultPrevented;
    // jsdom does not implement navigation; stop it after recording.
    event.preventDefault();
  };

  beforeEach(() => {
    defaultPrevented = null;
    window.addEventListener("click", recordAndStopNavigation);
  });

  afterEach(() => {
    window.removeEventListener("click", recordAndStopNavigation);
    vi.mocked(trackEvent).mockClear();
  });

  it("links to the photo route that the gallery modal intercepts", () => {
    render(<GalleryTileLink slug="summer-trip">Summer trip</GalleryTileLink>);

    expect(screen.getByRole("link", { name: "Summer trip" })).toHaveAttribute(
      "href",
      "/photo/summer-trip",
    );
  });

  // Umami's auto click tracker hijacks anchors carrying data-umami-event and
  // forces a full page load, which bypasses the intercepted modal route.
  it("does not opt into Umami's attribute-based click tracking", () => {
    const { container } = render(
      <GalleryTileLink slug="summer-trip">Summer trip</GalleryTileLink>,
    );

    expect(container.querySelector("[data-umami-event]")).toBeNull();
  });

  it("tracks the click without cancelling the navigation", () => {
    render(<GalleryTileLink slug="summer-trip">Summer trip</GalleryTileLink>);

    fireEvent.click(screen.getByRole("link", { name: "Summer trip" }));

    expect(trackEvent).toHaveBeenCalledWith("gallery_click", { slug: "summer-trip" });
    expect(defaultPrevented).toBe(false);
  });
});
