import { describe, expect, it } from "vitest";
import {
  ClassBookPageSchema,
  ClassBookSchema,
  ClassBookQuerySchema,
  CreateClassbookRequestSchema,
  UpdateClassbookRequestSchema,
  createClassbookSchema,
  updateClassBookSchema,
} from "@/features/classbook/schema/classbook";

const validClassbook = {
  classof: "68",
  firstYearAcademic: "2025",
  curriculumID: 1,
};

describe.each([
  ["create", createClassbookSchema],
  ["update", updateClassBookSchema],
])("%s classbook schema", (_name, schema) => {
  it("accepts valid class and academic year values", () => {
    expect(schema.parse(validClassbook)).toEqual(validClassbook);
  });

  it.each([
    ["nondigit class", { classof: "68A" }, "classof"],
    ["nondigit year", { firstYearAcademic: "20A5" }, "firstYearAcademic"],
    ["short year", { firstYearAcademic: "202" }, "firstYearAcademic"],
    ["long year", { firstYearAcademic: "20250" }, "firstYearAcademic"],
    ["zero curriculum ID", { curriculumID: 0 }, "curriculumID"],
    ["negative curriculum ID", { curriculumID: -1 }, "curriculumID"],
  ])("rejects %s", (_description, change, field) => {
    const result = schema.safeParse({ ...validClassbook, ...change });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(
        true,
      );
    }
  });
});

describe("classbook boundary schemas", () => {
  it("requires the thumbnail on create and preserves the optional update file", () => {
    const thumbnailFile = new File(["image"], "classbook.png", {
      type: "image/png",
    });
    expect(
      CreateClassbookRequestSchema.parse({ ...validClassbook, thumbnailFile }),
    ).toMatchObject({ thumbnailFile });
    expect(
      CreateClassbookRequestSchema.safeParse(validClassbook).success,
    ).toBe(false);
    expect(UpdateClassbookRequestSchema.parse({ classof: "69" })).toEqual({
      classof: "69",
    });
    expect(
      UpdateClassbookRequestSchema.safeParse({ curriculumID: 0 }).success,
    ).toBe(false);
  });

  it("normalizes URL pagination while retaining supported filters", () => {
    expect(
      ClassBookQuerySchema.parse({
        page: "2",
        pageSize: "15",
        search: "Class A",
        curriculumID: "4",
      }),
    ).toEqual({
      page: 2,
      pageSize: 15,
      search: "Class A",
      curriculumID: 4,
    });
    expect(ClassBookQuerySchema.safeParse({ page: 0 }).success).toBe(false);
    expect(ClassBookQuerySchema.safeParse({ sortBy: "sideways" }).success).toBe(
      false,
    );
  });

  it("accepts the current classbook DTO with nullable optional media metadata", () => {
    const curriculum = {
      id: 3,
      year: "2025",
      title: "Applied Computer Science",
      documentURL: "https://example.test/curriculum.pdf",
      description: "Undergraduate curriculum",
      thumbnailURL: "https://example.test/curriculum.png",
    };
    const classbook = {
      id: 42,
      classof: "68",
      firstYearAcademic: "2025",
      thumbnailURL: "https://example.test/classbook.png",
      thumbnailContentType: null,
      imageFocalPointX: null,
      curriculumID: 3,
      curriculum,
    };

    expect(ClassBookSchema.parse(classbook)).toEqual(classbook);
    expect(
      ClassBookPageSchema.parse({
        rows: [classbook],
        totalRecords: 1,
        page: 1,
        pageSize: 10,
      }).rows,
    ).toEqual([classbook]);
    expect(
      ClassBookSchema.safeParse({ ...classbook, thumbnailURL: undefined })
        .success,
    ).toBe(false);
  });
});
