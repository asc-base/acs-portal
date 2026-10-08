// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Carousel } from "@/features/home/components/carousel";
import NewsHighlightCarousel from "@/features/home/components/newshighlightcarousel";
import { bulletin } from "../test-data";

// Next's image optimizer is outside these component tests.
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    style,
    className,
  }: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={style} className={className} />
  ),
}));
vi.mock("next/link", () => ({
  default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}));

const items = [bulletin(1), bulletin(2), bulletin(3)];
const advance = (milliseconds: number) =>
  act(() => vi.advanceTimersByTime(milliseconds));
const track = () =>
  screen.getAllByRole("img")[0].closest("a")!.parentElement!.parentElement!;
const imageOrder = () =>
  screen.queryAllByRole("img").map((image) => image.getAttribute("alt"));

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("announcement carousel", () => {
  it.each([0, 1])(
    "renders %s items without indicators or an autoplay timer",
    (count) => {
      render(<Carousel items={items.slice(0, count)} autoPlay />);
      expect(screen.queryAllByRole("button")).toHaveLength(0);
      expect(vi.getTimerCount()).toBe(0);
      const image = screen.getByRole("img", {
        name: count ? "Slide 1" : "Default Announcement",
      });
      expect(image.getAttribute("src")).toBe(
        count ? "/bulletin-1.jpg" : "/carousel.jpg",
      );
      expect(image.closest("a")?.getAttribute("href")).toBe(
        count ? "/news/1" : "/news/51",
      );
    },
  );

  it("selects indicators, honors image focal points, and does not autoplay by default", () => {
    const focal = {
      ...items[0],
      news: { ...items[0].news, cardFocalPointX: 20, cardFocalPointY: 75 },
    };
    render(<Carousel items={[focal, ...items.slice(1)]} />);
    expect(
      screen.getByRole("img", { name: "Slide 1" }).style.objectPosition,
    ).toBe("20% 75%");
    expect(
      screen.getByRole("img", { name: "Slide 2" }).style.objectPosition,
    ).toBe("50% 50%");
    fireEvent.click(screen.getByRole("button", { name: "Go to slide 3" }));
    expect(track().style.transform).toBe("translateX(-200%)");
    advance(9000);
    expect(track().style.transform).toBe("translateX(-200%)");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("autoplays once per interval, wraps, and hides indicators independently", () => {
    render(
      <Carousel
        items={items}
        autoPlay
        autoPlayInterval={1000}
        showIndicators={false}
      />,
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    advance(999);
    expect(track().style.transform).toBe("translateX(-0%)");
    advance(1);
    expect(track().style.transform).toBe("translateX(-100%)");
    advance(2000);
    expect(track().style.transform).toBe("translateX(-0%)");
  });

  it("replaces changed timers and cleans up on disable and unmount", () => {
    const { rerender, unmount } = render(
      <Carousel items={items} autoPlay autoPlayInterval={1000} />,
    );
    advance(500);
    rerender(<Carousel items={items} autoPlay autoPlayInterval={2000} />);
    expect(vi.getTimerCount()).toBe(1);
    advance(1000);
    expect(track().style.transform).toBe("translateX(-0%)");
    advance(1000);
    expect(track().style.transform).toBe("translateX(-100%)");
    rerender(<Carousel items={items} autoPlay={false} />);
    expect(vi.getTimerCount()).toBe(0);
    advance(9000);
    expect(track().style.transform).toBe("translateX(-100%)");
    rerender(<Carousel items={items} autoPlay />);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("highlight carousel", () => {
  it.each([0, 1])("renders %s items without a timer", (count) => {
    const { container } = render(
      <NewsHighlightCarousel newsHighlight={items.slice(0, count)} />,
    );
    expect(screen.queryAllByRole("img")).toHaveLength(count);
    expect(vi.getTimerCount()).toBe(0);
    if (!count) expect(container.innerHTML).toBe("");
    else expect(screen.getByRole("link").getAttribute("href")).toBe("/news/1");
  });

  it("shows five items, rotates the entire list at 5000ms, and wraps", () => {
    const six = Array.from({ length: 6 }, (_, i) => bulletin(i + 1));
    render(<NewsHighlightCarousel newsHighlight={six} />);
    expect(imageOrder()).toEqual([
      "News 1",
      "News 2",
      "News 3",
      "News 4",
      "News 5",
    ]);
    advance(4999);
    expect(imageOrder()[0]).toBe("News 1");
    advance(1);
    expect(imageOrder()).toEqual([
      "News 2",
      "News 3",
      "News 4",
      "News 5",
      "News 6",
    ]);
    advance(25000);
    expect(imageOrder()).toEqual([
      "News 1",
      "News 2",
      "News 3",
      "News 4",
      "News 5",
    ]);
  });

  it("resets on new data, replaces its timer, and cleans up for one/empty items and unmount", () => {
    const { rerender, unmount } = render(
      <NewsHighlightCarousel newsHighlight={items} />,
    );
    advance(5000);
    expect(imageOrder()[0]).toBe("News 2");
    advance(2000);
    rerender(
      <NewsHighlightCarousel newsHighlight={[bulletin(8), bulletin(9)]} />,
    );
    expect(imageOrder()).toEqual(["News 8", "News 9"]);
    expect(vi.getTimerCount()).toBe(1);
    advance(3000);
    expect(imageOrder()[0]).toBe("News 8");
    advance(2000);
    expect(imageOrder()[0]).toBe("News 9");
    rerender(<NewsHighlightCarousel newsHighlight={[bulletin(8)]} />);
    expect(vi.getTimerCount()).toBe(0);
    rerender(<NewsHighlightCarousel newsHighlight={[]} />);
    expect(imageOrder()).toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
    rerender(<NewsHighlightCarousel newsHighlight={items} />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("prefers main highlights and side nested thumbnails, including focal points", () => {
    const main = {
      ...bulletin(1),
      news: { ...newsFor(1), highlightURL: "/highlight.jpg" },
    };
    const side = {
      ...bulletin(2),
      thumbnailFocalPointX: 30,
      thumbnailFocalPointY: 70,
      news: {
        ...newsFor(2),
        highlightURL: "/side-highlight.jpg",
        images: [
          {
            id: 1,
            imageID: 1,
            imageType: "THUMBNAIL" as const,
            imageUrl: "/nested.jpg",
            focalPointX: null,
            focalPointY: null,
            sortOrder: 0,
          },
        ],
      },
    };
    render(<NewsHighlightCarousel newsHighlight={[main, side]} />);
    const [mainImage, sideImage] = screen.getAllByRole("img");
    expect(mainImage.getAttribute("src")).toBe("/highlight.jpg");
    expect(mainImage.style.objectPosition).toBe("50% 50%");
    expect(sideImage.getAttribute("src")).toBe("/nested.jpg");
    expect(sideImage.style.objectPosition).toBe("30% 70%");
  });

  it.each(["", "   ", "/null.jpg", "/undefined.jpg"])(
    "falls back from invalid URL %j to thumbnail, highlight, then hero",
    (invalid) => {
      const { rerender } = render(
        <NewsHighlightCarousel
          newsHighlight={[
            {
              ...bulletin(1),
              news: { ...newsFor(1), highlightURL: invalid },
            },
          ]}
        />,
      );
      expect(screen.getByRole("img").getAttribute("src")).toBe(
        "/bulletin-1.jpg",
      );
      rerender(
        <NewsHighlightCarousel
          newsHighlight={[
            bulletin(1),
            {
              ...bulletin(2),
              thumbnailURL: invalid,
              news: { ...newsFor(2), highlightURL: "/valid.jpg" },
            },
          ]}
        />,
      );
      expect(
        screen.getByRole("img", { name: "News 2" }).getAttribute("src"),
      ).toBe("/valid.jpg");
      rerender(
        <NewsHighlightCarousel
          newsHighlight={[
            {
              ...bulletin(1),
              thumbnailURL: invalid,
              news: { ...newsFor(1), highlightURL: invalid },
            },
          ]}
        />,
      );
      expect(screen.getByRole("img").getAttribute("src")).toBe("/hero.jpg");
    },
  );
});

const newsFor = (id: number) => bulletin(id).news;
