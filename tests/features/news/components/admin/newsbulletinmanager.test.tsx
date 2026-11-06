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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { INews } from "@/features/news/domain/news";
import type { NewsService } from "@/features/news/service/news.service";
import { NewsService as NewsServiceClass } from "@/features/news/service/news.service";
import { NewsBulletinManager } from "@/features/news/components/admin/newsbulletinmanager";

const service = vi.hoisted(() => ({
  getNews: vi.fn<NewsService["getNews"]>(),
  getNewsBulletins: vi.fn<NewsService["getNewsBulletins"]>(),
  setNewsBulletin: vi.fn<NewsService["setNewsBulletin"]>(),
}));
let enabled = new Set<number>();
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
  startDate: "2026-10-08T08:00:00.000Z",
  dueDate: null,
  createdDate: "2026-10-08T08:00:00.000Z",
  updatedDate: "2026-10-08T08:00:00.000Z",
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
  enabled = new Set([firstNews.id]);
  vi.spyOn(NewsServiceClass.prototype, "getNews").mockImplementation((...args) => service.getNews(...args));
  vi.spyOn(NewsServiceClass.prototype, "getNewsBulletins").mockImplementation((...args) => service.getNewsBulletins(...args));
  vi.spyOn(NewsServiceClass.prototype, "setNewsBulletin").mockImplementation((...args) => service.setNewsBulletin(...args));
  service.getNews.mockResolvedValue(page);
  service.getNewsBulletins.mockImplementation(async (type) =>
    Array.from(enabled, (newsID) => ({
      id: 91,
      type,
      news: newsID === firstNews.id ? firstNews : secondNews,
      thumbnailURL: firstNews.thumbnailURL,
    })),
  );
  service.setNewsBulletin.mockImplementation(async (id, _type, next) => {
    if (next) enabled.add(id);
    else enabled.delete(id);
    return {
      data: next
        ? {
            id: 91,
            newsID: id,
            type: _type,
            news: id === firstNews.id ? firstNews : secondNews,
          }
        : null,
      status: 200,
      statusCode: 200,
    };
  });
});

function renderManager(type: "HIGHLIGHT" | "ANNOUNCEMENT") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const view = render(
    <QueryClientProvider client={queryClient}>
      <NewsBulletinManager type={type} />
    </QueryClientProvider>,
  );
  return { ...view, queryClient };
}

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
      const { container } = renderManager(type);
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
    renderManager("HIGHLIGHT");
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
    renderManager("ANNOUNCEMENT");
    const [first, second] = await screen.findAllByRole("switch");
    fireEvent.click(first);
    await waitFor(() => expect(service.setNewsBulletin).toHaveBeenCalledWith(
      firstNews.id,
      "ANNOUNCEMENT",
      false,
    ));
    expect(first).toHaveProperty("disabled", true);
    expect(first).toHaveProperty("checked", true);
    expect(second).toHaveProperty("disabled", false);
    await act(async () => {
      enabled.delete(firstNews.id);
      pending.resolve({ data: null, status: 200, statusCode: 200 });
    });
    await waitFor(() => expect(first).toHaveProperty("checked", false));
    expect(first).toHaveProperty("disabled", false);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("retains membership after a failed enable and allows retry", async () => {
    const pending =
      deferred<Awaited<ReturnType<NewsService["setNewsBulletin"]>>>();
    service.setNewsBulletin.mockReturnValueOnce(pending.promise);
    renderManager("HIGHLIGHT");
    const switches = await screen.findAllByRole("switch");
    const target = switches[1];
    fireEvent.click(target);
    await waitFor(() => expect(service.setNewsBulletin).toHaveBeenCalledWith(
      secondNews.id,
      "HIGHLIGHT",
      true,
    ));
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
      renderManager("HIGHLIGHT");
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
