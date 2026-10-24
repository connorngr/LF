import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PostImageManager, type EditableImage } from "./PostImageManager";

function makeImages(count: number): EditableImage[] {
  return Array.from({ length: count }, (_, index) => ({
    kind: "existing",
    id: `id-${index}`,
    src: `https://example.com/${index}.jpg`,
  }));
}

function renderManager(images: EditableImage[] | null) {
  const handlers = { onMove: vi.fn(), onRemove: vi.fn(), onAddFiles: vi.fn() };
  render(
    <PostImageManager
      postId="post"
      images={images}
      loadError={null}
      error={null}
      disabled={false}
      {...handlers}
    />,
  );
  return handlers;
}

describe("PostImageManager", () => {
  it("shows the counter and calls move/remove handlers", () => {
    const handlers = renderManager(makeImages(3));
    expect(screen.getByText("3 / 10")).toBeInTheDocument();
    expect(screen.getByLabelText("Move image 1 up")).toBeDisabled();
    expect(screen.getByLabelText("Move image 3 down")).toBeDisabled();

    fireEvent.click(screen.getByLabelText("Move image 2 up"));
    expect(handlers.onMove).toHaveBeenCalledWith(1, -1);
    fireEvent.click(screen.getByLabelText("Remove image 3"));
    expect(handlers.onRemove).toHaveBeenCalledWith(2);
  });

  it("disables adding at the limit", () => {
    renderManager(makeImages(10));
    expect(screen.getByText("10 / 10")).toBeInTheDocument();
    expect(screen.getByText("Image limit reached")).toBeInTheDocument();
    expect(screen.getByLabelText("Image limit reached")).toBeDisabled();
  });

  it("keeps the last image", () => {
    renderManager(makeImages(1));
    expect(screen.getByLabelText("Remove image 1")).toBeDisabled();
  });

  it("disables adding while images load", () => {
    renderManager(null);
    expect(screen.getByText("Loading images...")).toBeInTheDocument();
    expect(screen.getByLabelText("Add images")).toBeDisabled();
  });
});
