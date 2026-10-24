import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GalleryYearNav } from "./GalleryYearNav";

// Viewport-relative top of each year section, read by the nav on scroll.
const sectionTops = new Map<number, number>();

function renderWithSections(years: number[]) {
  return render(
    <>
      <GalleryYearNav years={years} />
      {years.map((year) => (
        <section key={year} id={`gallery-year-${year}`} data-gallery-year={year}>
          <h2 id={`gallery-year-${year}-heading`} tabIndex={-1}>
            {year}
          </h2>
        </section>
      ))}
    </>,
  );
}

function scrollTo(tops: Record<number, number>, scrollY = 100) {
  for (const [year, top] of Object.entries(tops)) sectionTops.set(Number(year), top);
  act(() => {
    window.scrollY = scrollY;
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("GalleryYearNav", () => {
  const scrollIntoView = vi.fn();
  let reducedMotion = false;

  beforeEach(() => {
    sectionTops.clear();
    reducedMotion = false;
    window.scrollY = 0;
    // Run the throttled update synchronously; returning 0 leaves it re-armable.
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const year = Number(this.dataset.galleryYear);
      return { top: sectionTops.get(year) ?? 10_000 } as DOMRect;
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 5_000,
    });
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({ matches: reducedMotion && query.includes("reduce") })),
    );
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    scrollIntoView.mockClear();
  });

  it("links every year to its section and marks the newest year active", () => {
    renderWithSections([2026, 2025, 2024]);

    const nav = screen.getByRole("navigation", { name: "Gallery years" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "2025" })).toHaveAttribute(
      "href",
      "#gallery-year-2025",
    );
    expect(screen.getByRole("link", { name: "2026" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "2024" })).not.toHaveAttribute("aria-current");
  });

  it("highlights the last year whose section has scrolled under the nav", () => {
    renderWithSections([2026, 2025, 2024]);

    scrollTo({ 2026: -900, 2025: 0, 2024: 900 });
    expect(screen.getByRole("link", { name: "2025" })).toHaveAttribute(
      "aria-current",
      "location",
    );

    scrollTo({ 2026: -900, 2025: 300, 2024: 900 });
    expect(screen.getByRole("link", { name: "2026" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("highlights the last year at the bottom of the page", () => {
    renderWithSections([2026, 2025, 2024]);

    // 2024 is too short to reach the nav, but the page cannot scroll further.
    scrollTo({ 2026: -2_000, 2025: -400, 2024: 300 }, 5_000 - window.innerHeight);
    expect(screen.getByRole("link", { name: "2024" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("smooth-scrolls to the year and focuses its heading on click", () => {
    renderWithSections([2026, 2025]);

    fireEvent.click(screen.getByRole("link", { name: "2025" }));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(document.activeElement).toBe(document.getElementById("gallery-year-2025-heading"));
    expect(screen.getByRole("link", { name: "2025" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("keeps the clicked year active while its jump scrolls, then tracks again", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    renderWithSections([2026, 2025, 2024]);

    fireEvent.click(screen.getByRole("link", { name: "2025" }));
    // The jump ends at the bottom of the page with 2025 short of the nav line.
    scrollTo({ 2026: -900, 2025: 200, 2024: 600 }, 5_000 - window.innerHeight);
    expect(screen.getByRole("link", { name: "2025" })).toHaveAttribute(
      "aria-current",
      "location",
    );

    act(() => {
      vi.advanceTimersByTime(200);
    });
    scrollTo({ 2026: 0, 2025: 900, 2024: 1_800 });
    expect(screen.getByRole("link", { name: "2026" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    vi.useRealTimers();
  });

  it("jumps without animation when reduced motion is preferred", () => {
    reducedMotion = true;
    renderWithSections([2026, 2025]);

    fireEvent.click(screen.getByRole("link", { name: "2025" }));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
  });
});
