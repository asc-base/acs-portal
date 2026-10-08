import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { INews, INewsImage } from "@/features/news/domain/news";
import type { CreateNewsInputs } from "@/features/news/schema/news";
import { NewsRepository } from "@/features/news/repositories/news.repository";
import { NewsService } from "@/features/news/service/news.service";

const news: INews = {
  id: 7,
  title: "News title",
  detail: "News details",
  thumbnailURL: "https://example.test/legacy.png",
  thumbnailFocalPointX: 21,
  thumbnailFocalPointY: 79,
  startDate: new Date("2026-10-08T08:00:00.000Z"),
  dueDate: null,
  createdDate: new Date("2026-10-08T08:00:00.000Z"),
  updatedDate: new Date("2026-10-08T08:00:00.000Z"),
  tag: { id: 1, name: "News", tagsGroupsId: 1 },
};
const response = { data: news, status: 200, statusCode: 200 };
const image = (name: string) => new File([name], name, { type: "image/png" });
const createInput: CreateNewsInputs = {
  title: news.title,
  detail: news.detail,
  tagID: 1,
  startDate: "2026-10-08T15:00:00+07:00",
  thumbnail: image("card.png"),
};

let repository: NewsRepository;
let service: NewsService;

beforeEach(() => {
  repository = new NewsRepository("https://example.test");
  service = new NewsService(repository);
});
afterEach(() => vi.restoreAllMocks());

describe("news create multipart payload", () => {
  it("maps required fields to the API names and omits absent optional parts", async () => {
    const create = vi
      .spyOn(repository, "createNews")
      .mockResolvedValue(response);
    expect(await service.createNews(createInput)).toBe(news);
    const form = create.mock.calls[0][0];
    expect(Array.from(form.keys())).toEqual([
      "title",
      "detail",
      "newsCategoryId",
      "eventStartAt",
      "cardImage",
    ]);
    expect(form.get("title")).toBe(news.title);
    expect(form.get("detail")).toBe(news.detail);
    expect(form.get("newsCategoryId")).toBe("1");
    expect(form.get("eventStartAt")).toBe("2026-10-08T08:00:00.000Z");
    expect(form.get("cardImage")).toBe(createInput.thumbnail);
  });

  it("preserves detail image order, optional cover, ISO end date and zero focal points", async () => {
    const create = vi
      .spyOn(repository, "createNews")
      .mockResolvedValue(response);
    const thumbnailImage = image("thumbnail.png");
    const additionalImages = [image("second.png"), image("first.png")];
    await service.createNews({
      ...createInput,
      dueDate: "2026-10-09T15:00:00+07:00",
      thumbnailImage,
      additionalImages,
      cardFocalPointX: 0,
      cardFocalPointY: 100,
      thumbnailFocalPointX: 100,
      thumbnailFocalPointY: 0,
    });
    const form = create.mock.calls[0][0];
    expect(form.get("eventEndAt")).toBe("2026-10-09T08:00:00.000Z");
    expect(form.get("thumbnailImage")).toBe(thumbnailImage);
    expect(form.getAll("detailImages")).toEqual(additionalImages);
    expect(form.get("cardFocalPointX")).toBe("0");
    expect(form.get("cardFocalPointY")).toBe("100");
    expect(form.get("thumbnailFocalPointX")).toBe("100");
    expect(form.get("thumbnailFocalPointY")).toBe("0");
  });

  it("propagates a repository rejection", async () => {
    const error = new Error("Upload failed");
    vi.spyOn(repository, "createNews").mockRejectedValue(error);
    await expect(service.createNews(createInput)).rejects.toBe(error);
  });

  it("does not send a request when start-date conversion fails", async () => {
    const create = vi.spyOn(repository, "createNews");
    await expect(
      service.createNews({ ...createInput, startDate: "not-a-date" }),
    ).rejects.toBeInstanceOf(RangeError);
    expect(create).not.toHaveBeenCalled();
  });
});

describe("news update multipart payload", () => {
  it("uploads each replacement once and includes modern deletion/order metadata", async () => {
    const update = vi
      .spyOn(repository, "updateNews")
      .mockResolvedValue(response);
    const card = image("card.png");
    const thumbnail = image("thumbnail.png");
    const details = [image("second.png"), image("first.png")];
    const order = JSON.stringify(["12", "new:0", "new:1"]);
    expect(
      await service.updateNews(news.id, {
        title: "Edited title",
        newsCategoryId: 3,
        eventStartAt: "2026-10-08T08:00:00.000Z",
        thumbnail: card,
        cardImage: image("unused.png"),
        thumbnailImage: thumbnail,
        detailImages: details,
        deletedImageIds: [11, 13],
        detailImageOrder: order,
        cardFocalPointX: 0,
        thumbnailFocalPointY: 0,
      }),
    ).toBe(news);
    expect(update.mock.calls[0][0]).toBe(news.id);
    const form = update.mock.calls[0][1];
    expect(form.get("title")).toBe("Edited title");
    expect(form.get("newsCategoryId")).toBe("3");
    expect(form.get("eventStartAt")).toBe("2026-10-08T08:00:00.000Z");
    expect(form.getAll("cardImage")).toEqual([card]);
    expect(form.getAll("thumbnailImage")).toEqual([thumbnail]);
    expect(form.getAll("detailImages")).toEqual(details);
    expect(form.get("deletedImageIds")).toBe("[11,13]");
    expect(form.get("detailImageOrder")).toBe(order);
    expect(form.get("cardFocalPointX")).toBe("0");
    expect(form.get("thumbnailFocalPointY")).toBe("0");
    expect(form.has("thumbnail")).toBe(false);
  });

  it("supports legacy detail uploads/deletions and a canonical card replacement", async () => {
    const update = vi
      .spyOn(repository, "updateNews")
      .mockResolvedValue(response);
    const card = image("replacement.png");
    const details = [image("legacy.png")];
    await service.updateNews(news.id, {
      thumbnail: news.thumbnailURL,
      cardImage: card,
      newAdditionalImages: details,
      deletedAdditionalImagesId: [4],
    });
    const form = update.mock.calls[0][1];
    expect(form.getAll("cardImage")).toEqual([card]);
    expect(form.getAll("detailImages")).toEqual(details);
    expect(form.get("deletedAdditionalImagesId")).toBe("[4]");
    expect(form.has("newAdditionalImages")).toBe(false);
    expect(form.has("thumbnail")).toBe(false);
  });

  it.each([false, true])(
    "canonical detailImages wins over legacy uploads (empty: %s)",
    async (empty) => {
      const update = vi
        .spyOn(repository, "updateNews")
        .mockResolvedValue(response);
      const details = empty ? [] : [image("canonical.png")];
      await service.updateNews(news.id, {
        detailImages: details,
        newAdditionalImages: [image("legacy.png")],
      });
      expect(update.mock.calls[0][1].getAll("detailImages")).toEqual(details);
    },
  );

  it("omits unchanged URLs, null/undefined values and empty deletion arrays", async () => {
    const update = vi
      .spyOn(repository, "updateNews")
      .mockResolvedValue(response);
    await service.updateNews(news.id, {
      title: undefined,
      thumbnail: news.thumbnailURL,
      thumbnailImage: "https://example.test/thumbnail.png",
      eventEndAt: null,
      deletedImageIds: [],
      deletedAdditionalImagesId: [],
    });
    expect(Array.from(update.mock.calls[0][1].entries())).toEqual([]);
  });

  it("clears the end date with an explicit multipart null marker", async () => {
    const update = vi
      .spyOn(repository, "updateNews")
      .mockResolvedValue(response);
    await service.updateNews(news.id, { dueDate: "", eventEndAt: null });
    expect(Array.from(update.mock.calls[0][1].entries())).toEqual([
      ["eventEndAt", "null"],
    ]);
  });

  it("returns null when the repository rejects", async () => {
    const error = new Error("Save failed");
    vi.spyOn(repository, "updateNews").mockRejectedValue(error);
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await service.updateNews(news.id, { title: "Changed" })).toBeNull();
    expect(log).toHaveBeenCalledWith("Failed to update news:", error);
  });
});

describe("bulletin presentation rules", () => {
  const images: INewsImage[] = [
    {
      id: 1,
      imageID: 1,
      imageType: "DETAIL",
      imageUrl: "detail.png",
      focalPointX: 10,
      focalPointY: 10,
      sortOrder: 0,
    },
    {
      id: 2,
      imageID: 2,
      imageType: "CARD",
      imageUrl: "card.png",
      focalPointX: 0,
      focalPointY: 100,
      sortOrder: 0,
    },
    {
      id: 3,
      imageID: 3,
      imageType: "THUMBNAIL",
      imageUrl: "thumbnail.png",
      focalPointX: 100,
      focalPointY: 0,
      sortOrder: 0,
    },
  ];

  it.each([
    ["HIGHLIGHT", "thumbnail.png", 100, 0],
    ["ANNOUNCEMENT", "card.png", 0, 100],
  ] as const)(
    "selects the correct image/focal points for %s",
    async (type, url, x, y) => {
      const nestedNews = { ...news, images };
      vi.spyOn(repository, "getNewsBulletins").mockResolvedValue({
        status: 200,
        statusCode: 200,
        data: [{ id: 91, newsID: news.id, type, news: nestedNews }],
      });
      expect(await service.getNewsBulletins(type)).toEqual([
        {
          id: 91,
          type,
          news: nestedNews,
          thumbnailURL: url,
          thumbnailFocalPointX: x,
          thumbnailFocalPointY: y,
        },
      ]);
    },
  );

  it.each(["HIGHLIGHT", "ANNOUNCEMENT"] as const)(
    "falls back to legacy image/focal points when %s has no matching media",
    async (type) => {
      vi.spyOn(repository, "getNewsBulletins").mockResolvedValue({
        status: 200,
        statusCode: 200,
        data: [
          {
            id: 91,
            newsID: news.id,
            type,
            news: { ...news, images: [images[0]] },
          },
        ],
      });
      expect((await service.getNewsBulletins(type))[0]).toMatchObject({
        thumbnailURL: news.thumbnailURL,
        thumbnailFocalPointX: 21,
        thumbnailFocalPointY: 79,
      });
    },
  );

  it("falls back for null focal coordinates without replacing the selected image", async () => {
    vi.spyOn(repository, "getNewsBulletins").mockResolvedValue({
      status: 200,
      statusCode: 200,
      data: [
        {
          id: 91,
          newsID: news.id,
          type: "HIGHLIGHT",
          news: {
            ...news,
            images: [{ ...images[2], focalPointX: null, focalPointY: null }],
          },
        },
      ],
    });
    expect((await service.getNewsBulletins("HIGHLIGHT"))[0]).toMatchObject({
      thumbnailURL: "thumbnail.png",
      thumbnailFocalPointX: 21,
      thumbnailFocalPointY: 79,
    });
  });

  it("returns an empty list and propagates load failures", async () => {
    const get = vi
      .spyOn(repository, "getNewsBulletins")
      .mockResolvedValue({ data: [], status: 200, statusCode: 200 });
    expect(await service.getNewsBulletins("HIGHLIGHT")).toEqual([]);
    const error = new Error("Bulletins unavailable");
    get.mockRejectedValueOnce(error);
    await expect(service.getNewsBulletins("HIGHLIGHT")).rejects.toBe(error);
  });
});
