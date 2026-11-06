import { describe, expect, it } from "vitest";
import { CreateNewsSchema, FocalPointSchema, UpdateNewsSchema } from "@/features/news/schema/news";

const image = new File(["image"], "cover.png", { type: "image/png" });
const createInput = {
  title: "News title",
  detail: "News details",
  tagID: 1,
  startDate: "2026-10-08T08:00:00.000Z",
  thumbnail: image,
};
const updateInput = {
  title: "News title",
  tag: 1,
  startDate: createInput.startDate,
  thumbnail: "https://example.test/cover.png",
};

describe("CreateNewsSchema", () => {
  it("accepts a required cover with optional end date and images omitted", () => {
    expect(CreateNewsSchema.parse(createInput)).toEqual(createInput);
  });

  it("accepts an end date, a separate thumbnail, and ten detail images", () => {
    const input = {
      ...createInput,
      dueDate: "2026-10-09T08:00:00.000Z",
      thumbnailImage: image,
      additionalImages: Array.from({ length: 10 }, () => image),
    };
    expect(CreateNewsSchema.parse(input)).toEqual(input);
  });

  it.each([
    ["missing title", { title: undefined }, "title"],
    ["empty title", { title: "" }, "title"],
    ["missing detail", { detail: undefined }, "detail"],
    ["empty detail", { detail: "" }, "detail"],
    ["unselected category", { tagID: 0 }, "tagID"],
    ["string category", { tagID: "1" }, "tagID"],
    ["missing start date", { startDate: undefined }, "startDate"],
    ["empty start date", { startDate: "" }, "startDate"],
    ["invalid start date", { startDate: "not-a-date" }, "startDate"],
    ["missing cover", { thumbnail: undefined }, "thumbnail"],
    ["cover URL instead of file", { thumbnail: "cover.png" }, "thumbnail"],
    [
      "invalid optional thumbnail",
      { thumbnailImage: "cover.png" },
      "thumbnailImage",
    ],
    [
      "eleven detail images",
      { additionalImages: Array.from({ length: 11 }, () => image) },
      "additionalImages",
    ],
  ])("rejects %s at the relevant field", (_, change, field) => {
    const result = CreateNewsSchema.safeParse({ ...createInput, ...change });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(
        true,
      );
    }
  });
});

describe("UpdateNewsSchema", () => {
  it("accepts existing image URLs and an omitted optional end date/thumbnail", () => {
    expect(UpdateNewsSchema.parse(updateInput)).toEqual(updateInput);
  });

  it("accepts replacement files and an empty end date used to clear it", () => {
    const input = {
      ...updateInput,
      dueDate: "",
      thumbnail: image,
      thumbnailImage: image,
    };
    expect(UpdateNewsSchema.parse(input)).toEqual(input);
  });

  it.each([
    ["missing title", { title: undefined }, "title"],
    ["missing category", { tag: undefined }, "tag"],
    ["empty start date", { startDate: "" }, "startDate"],
    ["invalid start date", { startDate: "not-a-date" }, "startDate"],
    ["missing cover", { thumbnail: undefined }, "thumbnail"],
    ["blank cover URL", { thumbnail: "  " }, "thumbnail"],
    [
      "blank optional thumbnail URL",
      { thumbnailImage: "  " },
      "thumbnailImage",
    ],
  ])("rejects %s at the relevant field", (_, change, field) => {
    const result = UpdateNewsSchema.safeParse({ ...updateInput, ...change });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(
        true,
      );
    }
  });
});

describe("news focal points", () => {
  it("accepts omitted values and the inclusive zero/100 boundaries", () => {
    expect(FocalPointSchema.parse({})).toEqual({});
    const points = {
      cardFocalPointX: 0,
      cardFocalPointY: 100,
      thumbnailFocalPointX: 100,
      thumbnailFocalPointY: 0,
    };
    expect(CreateNewsSchema.parse({ ...createInput, ...points })).toMatchObject(
      points,
    );
    expect(UpdateNewsSchema.parse({ ...updateInput, ...points })).toMatchObject(
      points,
    );
  });

  it.each(Object.keys(FocalPointSchema.shape))(
    "rejects out-of-range %s in both forms",
    (field) => {
      for (const value of [-1, 101]) {
        expect(
          CreateNewsSchema.safeParse({ ...createInput, [field]: value })
            .success,
        ).toBe(false);
        expect(
          UpdateNewsSchema.safeParse({ ...updateInput, [field]: value })
            .success,
        ).toBe(false);
      }
    },
  );
});
