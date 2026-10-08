import { describe, expect, it } from "vitest";
import {
  CreateCurriculumSchema,
  CreateCurriculumRequestSchema,
  CurriculumPageSchema,
  CurriculumSchema,
  QueryCurriculumSchema,
  UpdateCurriculumSchema,
} from "@/features/curriculum/schema/curriculum";

const validCurriculum = {
  title: "Curriculum 2025",
  year: "2025",
  documentURL: "https://drive.google.com/file/d/curriculum/view",
  description: "Undergraduate curriculum",
};

describe("curriculum schemas", () => {
  it("requires all create fields and accepts a document URL", () => {
    expect(CreateCurriculumSchema.safeParse(validCurriculum).success).toBe(true);

    for (const field of Object.keys(validCurriculum)) {
      expect(
        CreateCurriculumSchema.safeParse({
          ...validCurriculum,
          [field]: undefined,
        }).success,
      ).toBe(false);
    }
  });

  it("requires the thumbnail file on a create request", () => {
    const request = {
      ...validCurriculum,
      thumbnailFile: new File(["image"], "curriculum.png", {
        type: "image/png",
      }),
    };
    expect(CreateCurriculumRequestSchema.safeParse(request).success).toBe(true);
    expect(
      CreateCurriculumRequestSchema.safeParse(validCurriculum).success,
    ).toBe(false);
  });

  it.each(["", "not a URL", "/curriculum.pdf", "https://"]) (
    "rejects document URL %s",
    (documentURL) => {
      expect(
        CreateCurriculumSchema.safeParse({ ...validCurriculum, documentURL })
          .success,
      ).toBe(false);
    },
  );

  it("accepts partial updates while validating supplied fields", () => {
    expect(UpdateCurriculumSchema.safeParse({}).success).toBe(true);
    expect(UpdateCurriculumSchema.safeParse({ title: "Revised" }).success).toBe(
      true,
    );
    expect(
      UpdateCurriculumSchema.safeParse({ documentURL: validCurriculum.documentURL })
        .success,
    ).toBe(true);
    expect(UpdateCurriculumSchema.safeParse({ documentURL: null }).success).toBe(
      false,
    );
    expect(UpdateCurriculumSchema.safeParse({ title: " " }).success).toBe(false);
  });

  it("parses curriculum query filters and rejects invalid pagination", () => {
    expect(
      QueryCurriculumSchema.parse({ page: "2", pageSize: "25", year: "2025" }),
    ).toEqual({ page: 2, pageSize: 25, year: "2025" });
    expect(QueryCurriculumSchema.safeParse({ page: 0 }).success).toBe(false);
    expect(QueryCurriculumSchema.safeParse({ pageSize: 1.5 }).success).toBe(
      false,
    );
  });

  it("accepts nullable optional response metadata from the curriculum DTO", () => {
    const curriculum = {
      id: 42,
      title: "Curriculum 2025",
      year: "2025",
      documentURL: validCurriculum.documentURL,
      description: validCurriculum.description,
      thumbnailURL: "https://example.test/curriculum.png",
      thumbnailContentType: null,
      thumbnailFocalPointX: null,
      thumbnailFocalPointY: 75,
    };
    expect(CurriculumSchema.parse(curriculum)).toEqual(curriculum);
    expect(
      CurriculumPageSchema.safeParse({
        rows: [curriculum],
        totalRecords: 1,
        page: 1,
        pageSize: 10,
      }).success,
    ).toBe(true);
    expect(
      CurriculumPageSchema.safeParse({
        rows: [{ ...curriculum, thumbnailURL: undefined }],
        totalRecords: 1,
        page: 1,
        pageSize: 10,
      }).success,
    ).toBe(false);
  });
});
