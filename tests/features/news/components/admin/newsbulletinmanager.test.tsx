// @vitest-environment jsdom
import { createElement, type CSSProperties } from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { INews } from "@/features/news/domain/news";
import type { NewsService } from "@/features/news/service/news.service";
import { NewsBulletinManager } from "@/features/news/components/admin/newsbulletinmanager";

const service = vi.hoisted(() => ({
  getNews: vi.fn<NewsService["getNews"]>(),
  getNewsBulletins: vi.fn<NewsService["getNewsBulletins"]>(),
  setNewsBulletin: vi.fn<NewsService["setNewsBulletin"]>(),
}));
vi.mock("@/features/news/client", () => ({ newsService: service }));
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    style,
  }: {
    src: string;
    alt: string;
    style?: CSSProperties;
  }) => createElement("img", { src, alt, style }),
}));

const firstNews: INews = {
  id: 7,
  title: "First news",
  detail: "News details",
  thumbnailURL: "https://example.test/legacy.png",
  images: [
    {
      id: 1,
      imageID: 1,
      imageType: "CARD",
      imageUrl: "https://example.test/card.png",
      focalPointX: 0,
      focalPointY: 100,
      sortOrder: 0,
    },
    {
      id: 2,
      imageID: 2,
      imageType: "THUMBNAIL",
      imageUrl: "https://example.test/thumbnail.png",
      focalPointX: 100,
      focalPointY: 0,
      sortOrder: 0,
    },
  ],
  startDate: new Date("2026-10-08T08:00:00.000Z"),
  dueDate: null,
  createdDate: new Date("2026-10-08T08:00:00.000Z"),
  updatedDate: new Date("2026-10-08T08:00:00.000Z"),
  tag: { id: 1, name: "Legacy category", tagsGroupsId: 1 },
  category: { id: 2, name: "Current category", code: "CURRENT" },
};
const secondNews: INews = {
  ...firstNews,
  id: 8,
  title: "Second news",
  category: null,
  images: undefined,
};
const page = {
  rows: [firstNews, secondNews],
  page: 1,
  pageSize: 12,
  totalRecords: 25,
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  vi.resetAllMocks();
  service.getNews.mockResolvedValue(page);
  service.getNewsBulletins.mockImplementation(async (type) => [
    {
      id: 91,
      type,
      news: firstNews,
      thumbnailURL: firstNews.thumbnailURL,
    },
  ]);
  service.setNewsBulletin.mockResolvedValue({
    data: null,
    status: 200,
    statusCode: 200,
  });
});

describe("NewsBulletinManager", () => {
  it.each([
    [
      "HIGHLIGHT",
      "ข่าว Highlight",
      "https://example.test/thumbnail.png",
      "100% 0%",
    ],
    [
      "ANNOUNCEMENT",
      "ข่าวประชาสัมพันธ์สำคัญ",
      "https://example.test/card.png",
      "0% 100%",
    ],
  ] as const)(
    "loads %s membership and selects its corresponding image",
    async (type, heading, imageURL, position) => {
      const pending =
        deferred<Awaited<ReturnType<NewsService["getNewsBulletins"]>>>();
      service.getNewsBulletins.mockReturnValueOnce(pending.promise);
      const { container } = render(<NewsBulletinManager type={type} />);
      expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
      expect(screen.queryByText(firstNews.title)).toBeNull();
      await act(async () => {
        pending.resolve([
          {
            id: 91,
            type,
            news: firstNews,
            thumbnailURL: firstNews.thumbnailURL,
          },
        ]);
      });
      const switches = await screen.findAllByRole("switch");
      expect(service.getNews).toHaveBeenCalledWith(
        1,
        12,
        undefined,
        "createdAt",
        "desc",
        undefined,
        "title",
      );
      expect(service.getNewsBulletins).toHaveBeenCalledWith(type);
      expect(switches[0]).toHaveProperty("checked", true);
      expect(switches[1]).toHaveProperty("checked", false);
      expect(screen.getByText("Current category")).toBeTruthy();
      expect(screen.getByText("Legacy category")).toBeTruthy();
      const images = container.querySelectorAll("img");
      expect(images[0].getAttribute("src")).toBe(imageURL);
      expect(images[0].style.objectPosition).toBe(position);
      expect(images[1].getAttribute("src")).toBe(secondNews.thumbnailURL);
      expect(images[1].style.objectPosition).toBe("50% 50%");
      expect(screen.getByRole("button", { name: "Go to page 3" })).toBeTruthy();
    },
  );

  it("searches only on submit, trims the term, resets page and retains search while paginating", async () => {
    render(<NewsBulletinManager type="HIGHLIGHT" />);
    await screen.findByText(firstNews.title);
    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }));
    await waitFor(() =>
      expect(service.getNews).toHaveBeenLastCalledWith(
        2,
        12,
        undefined,
        "createdAt",
        "desc",
        undefined,
        "title",
      ),
    );
    const callsBeforeTyping = service.getNews.mock.calls.length;
    fireEvent.change(screen.getByRole("textbox", { name: "ค้นหาข่าว" }), {
      target: { value: "  ข่าว A&B  " },
    });
    expect(service.getNews).toHaveBeenCalledTimes(callsBeforeTyping);
    fireEvent.click(screen.getByRole("button", { name: "ค้นหา" }));
    await waitFor(() =>
      expect(service.getNews).toHaveBeenLastCalledWith(
        1,
        12,
        undefined,
        "createdAt",
        "desc",
        "ข่าว A&B",
        "title",
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }));
    await waitFor(() =>
      expect(service.getNews).toHaveBeenLastCalledWith(
        2,
        12,
        undefined,
        "createdAt",
        "desc",
        "ข่าว A&B",
        "title",
      ),
    );
    fireEvent.change(screen.getByRole("textbox", { name: "ค้นหาข่าว" }), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: "ค้นหา" }));
    await waitFor(() =>
      expect(service.getNews).toHaveBeenLastCalledWith(
        1,
        12,
        undefined,
        "createdAt",
        "desc",
        undefined,
        "title",
      ),
    );
  });

  it("keeps an enabled switch checked while disabling it and applies success after the request", async () => {
    const pending =
      deferred<Awaited<ReturnType<NewsService["setNewsBulletin"]>>>();
    service.setNewsBulletin.mockReturnValueOnce(pending.promise);
    render(<NewsBulletinManager type="ANNOUNCEMENT" />);
    const [first, second] = await screen.findAllByRole("switch");
    fireEvent.click(first);
    expect(service.setNewsBulletin).toHaveBeenCalledWith(
      firstNews.id,
      "ANNOUNCEMENT",
      false,
    );
    expect(first).toHaveProperty("disabled", true);
    expect(first).toHaveProperty("checked", true);
    expect(second).toHaveProperty("disabled", false);
    await act(async () => {
      pending.resolve({ data: null, status: 200, statusCode: 200 });
    });
    expect(first).toHaveProperty("checked", false);
    expect(first).toHaveProperty("disabled", false);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("retains membership after a failed enable and allows retry", async () => {
    const pending =
      deferred<Awaited<ReturnType<NewsService["setNewsBulletin"]>>>();
    service.setNewsBulletin.mockReturnValueOnce(pending.promise);
    render(<NewsBulletinManager type="HIGHLIGHT" />);
    const switches = await screen.findAllByRole("switch");
    const target = switches[1];
    fireEvent.click(target);
    expect(service.setNewsBulletin).toHaveBeenCalledWith(
      secondNews.id,
      "HIGHLIGHT",
      true,
    );
    expect(target).toHaveProperty("disabled", true);
    expect(target).toHaveProperty("checked", false);
    await act(async () => pending.reject(new Error("Save failed")));
    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "โหลดหรือบันทึกข้อมูลไม่สำเร็จ",
    );
    expect(target).toHaveProperty("disabled", false);
    expect(target).toHaveProperty("checked", false);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(target);
    await waitFor(() => expect(target).toHaveProperty("checked", true));
    expect(target).toHaveProperty("disabled", false);
    expect(service.setNewsBulletin).toHaveBeenCalledTimes(2);
    expect(service.setNewsBulletin).toHaveBeenLastCalledWith(
      secondNews.id,
      "HIGHLIGHT",
      true,
    );
    expect(switches[0]).toHaveProperty("checked", true);
  });

  it.each(["news", "bulletins"] as const)(
    "shows a failed %s load and retries when a new search is submitted",
    async (source) => {
      const error = new Error("Load failed");
      if (source === "news") service.getNews.mockRejectedValueOnce(error);
      else service.getNewsBulletins.mockRejectedValueOnce(error);
      render(<NewsBulletinManager type="HIGHLIGHT" />);
      expect(await screen.findByRole("alert")).toHaveProperty(
        "textContent",
        "โหลดหรือบันทึกข้อมูลไม่สำเร็จ",
      );
      expect(screen.queryByText(firstNews.title)).toBeNull();
      fireEvent.change(screen.getByRole("textbox", { name: "ค้นหาข่าว" }), {
        target: { value: "retry" },
      });
      fireEvent.click(screen.getByRole("button", { name: "ค้นหา" }));
      expect(await screen.findByText(firstNews.title)).toBeTruthy();
      expect(service.getNews).toHaveBeenLastCalledWith(
        1,
        12,
        undefined,
        "createdAt",
        "desc",
        "retry",
        "title",
      );
    },
  );
});
