import { beforeEach, describe, expect, it, vi } from "vitest";
import MainPage from "@/app/(public)/home/page";
import { createNewsServerService } from "@/features/news/server";
import { bulletin, newsItem } from "./test-data";

vi.mock("@/features/news/server", () => ({ createNewsServerService: vi.fn() }));

const getNews = vi.fn();
const getNewsBulletins = vi.fn();
const activity = [newsItem(16)];
const complete = [newsItem(17)];
const student = [newsItem(18)];
const announcement = [bulletin(1)];
const highlight = [bulletin(2)];

beforeEach(() => {
  vi.resetAllMocks();
  const service = { getNews, getNewsBulletins } as unknown as Awaited<
    ReturnType<typeof createNewsServerService>
  >;
  vi.mocked(createNewsServerService).mockResolvedValue(service);
  getNews.mockImplementation(async (_page, _size, tagId) => ({
    rows: { 16: activity, 17: complete, 18: student }[tagId as 16 | 17 | 18],
  }));
  getNewsBulletins.mockImplementation(async (type) =>
    type === "ANNOUNCEMENT" ? announcement : highlight,
  );
});

describe("async home page", () => {
  it("creates the service and maps the five request results to the correct props", async () => {
    const page = await MainPage();
    expect(createNewsServerService).toHaveBeenCalledOnce();
    expect(getNews.mock.calls).toEqual([
      [1, 6, 16],
      [1, 6, 17],
      [1, 6, 18],
    ]);
    expect(getNewsBulletins.mock.calls).toEqual([
      ["ANNOUNCEMENT"],
      ["HIGHLIGHT"],
    ]);
    expect(page.props).toEqual({
      initNewsActivity: activity,
      initNewsComplete: complete,
      initNewsActivityStudent: student,
      initAnnoucement: announcement,
      initNewsHighlight: highlight,
    });
  });

  it.each([0, 1, 2, 3, 4])(
    "isolates failure of request %s from other successful requests",
    async (failed) => {
      getNews.mockImplementation(async (_page, _size, tagId) => {
        if (tagId - 16 === failed) throw new Error("News unavailable");
        return {
          rows: { 16: activity, 17: complete, 18: student }[
            tagId as 16 | 17 | 18
          ],
        };
      });
      getNewsBulletins.mockImplementation(async (type) => {
        if ((type === "ANNOUNCEMENT" ? 3 : 4) === failed)
          throw new Error("Bulletins unavailable");
        return type === "ANNOUNCEMENT" ? announcement : highlight;
      });
      const page = await MainPage();
      expect(Object.values(page.props)).toEqual(
        [activity, complete, student, announcement, highlight].map(
          (value, i) => (i === failed ? [] : value),
        ),
      );
    },
  );

  it("uses empty arrays for successful news responses without rows and for all request failures", async () => {
    getNews.mockResolvedValue({});
    getNewsBulletins.mockRejectedValue(new Error("Unavailable"));
    expect((await MainPage()).props).toEqual({
      initNewsActivity: [],
      initNewsComplete: [],
      initNewsActivityStudent: [],
      initAnnoucement: [],
      initNewsHighlight: [],
    });
    getNews.mockRejectedValue(new Error("Unavailable"));
    expect(Object.values((await MainPage()).props)).toEqual([
      [],
      [],
      [],
      [],
      [],
    ]);
  });

  it("propagates a service factory failure before starting requests", async () => {
    const failure = new Error("Factory unavailable");
    vi.mocked(createNewsServerService).mockRejectedValue(failure);
    await expect(MainPage()).rejects.toBe(failure);
    expect(getNews).not.toHaveBeenCalled();
    expect(getNewsBulletins).not.toHaveBeenCalled();
  });
});
