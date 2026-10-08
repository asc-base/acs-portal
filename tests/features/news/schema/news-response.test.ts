import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  NewsBulletinsSchema,
  NewsFeatureResponseSchema,
  NewsPageSchema,
  NewsQuerySchema,
  NewsResponseSchema,
} from "@/features/news/schema/news";

const news = JSON.parse(
  readFileSync(new URL("../fixtures/news.json", import.meta.url), "utf8"),
);
const bulletins = JSON.parse(
  readFileSync(
    new URL("../fixtures/news-bulletins.json", import.meta.url),
    "utf8",
  ),
);

describe("news response schemas", () => {
  it("accepts current news DTOs with JSON dates and nullable media/category fields", () => {
    expect(NewsResponseSchema.parse(news)).toEqual(news);
    expect(typeof NewsResponseSchema.parse(news).startDate).toBe("string");
  });

  it("accepts current bulletin DTOs when optional legacy fields are absent", () => {
    expect(NewsBulletinsSchema.parse(bulletins)).toEqual(bulletins);
  });

  it("accepts the current news-feature DTO around its nested news response", () => {
    const feature = {
      id: 91,
      newsID: news.id,
      tagID: 26,
      thumbnailURL: "https://example.test/feature.png",
      news,
    };
    expect(NewsFeatureResponseSchema.parse(feature)).toEqual(feature);
  });

  it("validates paginated response metadata and rows", () => {
    expect(
      NewsPageSchema.parse({
        rows: [news],
        totalRecords: 1,
        page: 1,
        pageSize: 12,
      }).rows,
    ).toEqual([news]);
    expect(
      NewsPageSchema.safeParse({ rows: [news], totalRecords: "1", page: 1, pageSize: 12 })
        .success,
    ).toBe(false);
  });

  it("normalizes Next.js query strings and rejects nonnumeric pagination", () => {
    expect(NewsQuerySchema.parse({ page: "2", pageSize: "12", tagID: "16" })).toMatchObject({
      page: 2,
      pageSize: 12,
      tagID: 16,
    });
    expect(NewsQuerySchema.safeParse({ page: "not-a-page" }).success).toBe(false);
  });
});
