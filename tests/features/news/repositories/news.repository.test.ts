import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpHelper } from "@/shared/lib/http";
import { NewsService } from "@/features/news/service/news.service";
import { NewsRepository } from "@/features/news/repositories/news.repository";

afterEach(() => vi.restoreAllMocks());

describe("news query construction", () => {
  it("encodes populated filters without allowing search text to introduce parameters", async () => {
    const http = new HttpHelper();
    const get = vi.spyOn(http, "get").mockResolvedValue({ data: { rows: [] } });
    const repository = new NewsRepository("https://example.test", http);
    await repository.getNews(
      2,
      12,
      3,
      "createdAt",
      "desc",
      "ข่าว A&B? x=1",
      "title & detail",
    );
    const url = get.mock.calls[0][0];
    expect(url).toBe(
      "/v1/news/?page=2&pageSize=12&tagID=3&orderBy=createdAt&sortBy=desc&search=%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%20A%26B%3F%20x%3D1&searchBy=title%20%26%20detail",
    );
    const params = new URL(url, "https://example.test").searchParams;
    expect(params.get("search")).toBe("ข่าว A&B? x=1");
    expect(params.get("searchBy")).toBe("title & detail");
    expect(params.has("x")).toBe(false);
  });

  it.each([undefined, 0])(
    "omits empty optional filters (tagID: %s)",
    async (tagID) => {
      const http = new HttpHelper();
      const get = vi
        .spyOn(http, "get")
        .mockResolvedValue({ data: { rows: [] } });
      await new NewsRepository("", http).getNews(1, 9, tagID, "", "", "", "");
      expect(get).toHaveBeenCalledWith("/v1/news/?page=1&pageSize=9");
    },
  );

  it("applies service ordering defaults while preserving response pagination", async () => {
    const page = { rows: [], totalRecords: 0, page: 1, pageSize: 9 };
    const http = new HttpHelper();
    const get = vi.spyOn(http, "get").mockResolvedValue({ data: page });
    const service = new NewsService(new NewsRepository("", http));
    expect(await service.getNews(1, 9)).toBe(page);
    expect(get).toHaveBeenCalledWith(
      "/v1/news/?page=1&pageSize=9&orderBy=startDate&sortBy=desc",
    );
  });
});

describe("bulletin enable/disable requests", () => {
  it.each(["HIGHLIGHT", "ANNOUNCEMENT"] as const)(
    "enables and disables %s at the same resource",
    async (type) => {
      const http = new HttpHelper();
      const put = vi.spyOn(http, "put").mockResolvedValue({ data: null });
      const remove = vi.spyOn(http, "delete").mockResolvedValue({ data: null });
      const repository = new NewsRepository("", http);
      const path = `/v1/news/7/bulletins/${type}`;
      await repository.setNewsBulletin(7, type, true);
      expect(put).toHaveBeenCalledWith(path, expect.any(FormData));
      expect(Array.from((put.mock.calls[0][1] as FormData).entries())).toEqual(
        [],
      );
      expect(remove).not.toHaveBeenCalled();
      await repository.setNewsBulletin(7, type, false);
      expect(remove).toHaveBeenCalledWith(path);
      expect(put).toHaveBeenCalledTimes(1);
    },
  );

  it("propagates a failed mutation for the manager to handle", async () => {
    const http = new HttpHelper();
    const error = new Error("Forbidden");
    vi.spyOn(http, "put").mockRejectedValue(error);
    await expect(
      new NewsRepository("", http).setNewsBulletin(7, "HIGHLIGHT", true),
    ).rejects.toBe(error);
  });
});
