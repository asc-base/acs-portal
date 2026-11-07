import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  NewsBulletinsSchema,
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

  it("accepts bulletin images and legacy core timestamps during rollout", () => {
    const legacy = {
      ...bulletins[0],
      createdAt: "2026-10-08T08:00:00.000Z",
      updatedAt: "2026-10-08T08:00:00.000Z",
      deletedAt: null,
    };
    const current = { ...legacy, imageUrl: "https://example.test/bulletin.png" };

    expect(NewsBulletinsSchema.parse([legacy, current])).toEqual([legacy, current]);
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
    expect(NewsQuerySchema.parse({ page: "2", pageSize: "12", newsCategoryId: "1" })).toMatchObject({
      page: 2,
      pageSize: 12,
      newsCategoryId: 1,
    });
    expect(NewsQuerySchema.safeParse({ page: "not-a-page" }).success).toBe(false);
    expect(NewsQuerySchema.safeParse({ tagID: "16" }).success).toBe(false);
    expect(NewsQuerySchema.safeParse({ tagId: "16" }).success).toBe(false);
    expect(NewsResponseSchema.safeParse({ ...news, tag: { id: 16, name: "legacy" } }).success).toBe(false);
  });
});
