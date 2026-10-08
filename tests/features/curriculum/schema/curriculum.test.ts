import { describe, expect, it } from "vitest";
import { CreateCurriculumSchema, UpdateCurriculumSchema } from "@/features/curriculum/schema/curriculum";

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
});
