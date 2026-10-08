import { describe, expect, it } from "vitest";
import { CreateStudentSchema, UpdateStudentSchema } from "@/features/students/schema/student";

const validStudent = {
  prefixID: 1,
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  firstNameEn: "Somchai",
  lastNameEn: "Jaidee",
  email: "student@example.com",
  studentCode: "64000000001",
};

describe.each([
  ["create", CreateStudentSchema],
  ["update", UpdateStudentSchema],
])("%s student schema", (_name, schema) => {
  it("accepts valid profile fields and boundary focal points", () => {
    const input = {
      ...validStudent,
      imageFocalPointX: 0,
      imageFocalPointY: 100,
    };

    expect(schema.parse(input)).toMatchObject(input);
  });

  it.each([
    ["missing student code", { studentCode: undefined }, "studentCode"],
    ["non-numeric student code", { studentCode: "6400000000A" }, "studentCode"],
    ["student code over 11 digits", { studentCode: "640000000001" }, "studentCode"],
    ["missing Thai first name", { firstNameTh: undefined }, "firstNameTh"],
    ["empty Thai last name", { lastNameTh: "   " }, "lastNameTh"],
    ["non-English first name", { firstNameEn: "สมชาย" }, "firstNameEn"],
    ["invalid email", { email: "not-an-email" }, "email"],
    ["unselected prefix", { prefixID: null }, "prefixID"],
    ["non-numeric focal point", { imageFocalPointX: "0" }, "imageFocalPointX"],
  ])("rejects %s", (_description, change, field) => {
    const result = schema.safeParse({ ...validStudent, ...change });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true);
    }
  });
});

describe("student social links", () => {
  it("accepts Facebook and Instagram URLs on create", () => {
    expect(
      CreateStudentSchema.safeParse({
        ...validStudent,
        facebook: "https://www.facebook.com/student",
        instagram: "https://www.instagram.com/student",
      }).success,
    ).toBe(true);
  });

  it.each([
    ["Facebook", { facebook: "https://example.com/student" }],
    ["Instagram", { instagram: "http://example.com/student" }],
  ])("rejects an invalid %s URL", (_name, change) => {
    const result = CreateStudentSchema.safeParse({ ...validStudent, ...change });

    expect(result.success).toBe(false);
  });
});
