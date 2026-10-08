// @vitest-environment jsdom
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/features/home/components/public/home";
import { newsItem } from "../../test-data";

const titles = [
  "ข่าวประชาสัมพันธ์",
  "ความสำเร็จนักศึกษา",
  "งานกิจกรรมนักศึกษา",
];
const props = {
  initNewsActivity: Array.from({ length: 6 }, (_, i) => newsItem(i + 1)),
  initNewsComplete: Array.from({ length: 6 }, (_, i) => newsItem(i + 11)),
  initNewsActivityStudent: Array.from({ length: 6 }, (_, i) =>
    newsItem(i + 21),
  ),
};
const originalWidth = window.innerWidth;

const resize = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
  fireEvent(window, new Event("resize"));
};
const section = (title: string) => {
  const element = screen.getByRole("heading", { name: title }).parentElement
    ?.parentElement;
  if (!element) throw new Error(`Missing section ${title}`);
  return within(element);
};
const firstImage = (title: string) =>
  section(title).getAllByRole("img")[0].getAttribute("alt");

afterEach(() => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: originalWidth,
  });
  vi.restoreAllMocks();
});

describe("home news navigation", () => {
  it.each([
    [767, 1],
    [768, 2],
    [1279, 2],
    [1280, 3],
  ])("moves by %s-width step in both directions and wraps", (width, step) => {
    resize(width);
    render(<HomePage {...props} />);
    const [previous, next] = section(titles[0]).getAllByRole("button");
    fireEvent.click(previous);
    expect(firstImage(titles[0])).toBe(`News ${7 - step}`);
    fireEvent.click(next);
    expect(firstImage(titles[0])).toBe("News 1");
    fireEvent.click(next);
    expect(firstImage(titles[0])).toBe(`News ${1 + step}`);
    for (let i = 0; i < 6; i++) fireEvent.click(next);
    expect(firstImage(titles[0])).toBe(`News ${1 + step}`);
  });

  it("updates the step when the mounted page resizes", () => {
    resize(767);
    render(<HomePage {...props} />);
    const next = section(titles[0]).getAllByRole("button")[1];
    fireEvent.click(next);
    expect(firstImage(titles[0])).toBe("News 2");
    act(() => resize(768));
    fireEvent.click(next);
    expect(firstImage(titles[0])).toBe("News 4");
    act(() => resize(1280));
    fireEvent.click(next);
    expect(firstImage(titles[0])).toBe("News 1");
  });

  it.each(titles)(
    "keeps %s navigation independent from the other categories",
    (title) => {
      resize(767);
      render(<HomePage {...props} />);
      fireEvent.click(section(title).getAllByRole("button")[1]);
      titles.forEach((name, i) => {
        expect(firstImage(name)).toBe(
          `News ${i * 10 + 1 + Number(name === title)}`,
        );
        const link = section(name).getByRole("link", { name: "อ่านทั้งหมด" });
        const query = new URL(
          link.getAttribute("href")!,
          "https://example.test",
        ).searchParams;
        expect(query.get("category")).toBe(name);
        expect(query.get("tagId")).toBe(String(16 + i));
        expect(query.get("page")).toBe("1");
        expect(query.get("pageSize")).toBe("12");
      });
      expect(
        section(title)
          .getAllByRole("img")[0]
          .closest("a")
          ?.getAttribute("href"),
      ).toBe(`/news/${titles.indexOf(title) * 10 + 2}`);
    },
  );

  it("renders distinct empty states without navigation or optional sections", () => {
    render(
      <HomePage
        initNewsActivity={[]}
        initNewsComplete={[]}
        initNewsActivityStudent={[]}
      />,
    );
    [
      "ไม่พบข้อมูลข่าวสารในขณะนี้",
      "ไม่พบข้อมูลความสำเร็จในขณะนี้",
      "ไม่พบข้อมูลกิจกรรมในขณะนี้",
    ].forEach((text) => expect(screen.getByText(text)).toBeTruthy());
    titles.forEach((title) => {
      expect(section(title).queryAllByRole("button")).toHaveLength(0);
      expect(
        section(title).getByRole("link", { name: "อ่านทั้งหมด" }),
      ).toBeTruthy();
    });
    expect(screen.queryByText("งานกิจกรรมเร็ว ๆ นี้")).toBeNull();
    expect(screen.queryByText("ประชาสัมพันธ์สำคัญ")).toBeNull();
  });

  it("limits upcoming activities to four and keeps the empty-announcement fallback", () => {
    render(<HomePage {...props} initAnnoucement={[]} initNewsHighlight={[]} />);
    const upcoming = screen.getByRole("heading", {
      name: "งานกิจกรรมเร็ว ๆ นี้",
    }).parentElement!;
    expect(
      within(upcoming)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/news/1", "/news/2", "/news/3", "/news/4"]);
    expect(
      screen
        .getByRole("img", { name: "Default Announcement" })
        .closest("a")
        ?.getAttribute("href"),
    ).toBe("/news/51");
    expect(screen.queryByRole("img", { name: "Highlight News" })).toBeNull();
  });

  it("removes its resize listener on unmount", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<HomePage {...props} />);
    const listener = add.mock.calls.find(([event]) => event === "resize")?.[1];
    expect(listener).toBeTypeOf("function");
    unmount();
    expect(remove).toHaveBeenCalledWith("resize", listener);
  });
});
