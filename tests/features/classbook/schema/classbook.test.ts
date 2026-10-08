import { describe, expect, it } from "vitest";
import { createClassbookSchema, updateClassBookSchema } from "@/features/classbook/schema/classbook";

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
