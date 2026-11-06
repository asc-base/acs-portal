import { describe, expect, it } from "vitest";
import {
  CreateStudentRequestSchema,
  CreateStudentSchema,
  QueryStudentSchema,
  StudentPageSchema,
  UpdateStudentRequestSchema,
  UpdateStudentSchema,
} from "@/features/students/schema/student";

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

describe("student request and query schemas", () => {
  it("parses query-string numbers without changing filter values", () => {
    expect(
      QueryStudentSchema.parse({
        page: "2",
        pageSize: "5",
        classBookID: "3",
        search: "somchai",
        orderBy: "studentCode",
        sortBy: "desc",
      }),
    ).toEqual({
      page: 2,
      pageSize: 5,
      classBookID: 3,
      search: "somchai",
      orderBy: "studentCode",
      sortBy: "desc",
    });
  });

  it("keeps multipart files and skills in validated requests", () => {
    const profileImage = new File(["image"], "profile.png", { type: "image/png" });
    expect(
      CreateStudentRequestSchema.parse({
        ...validStudent,
        classBookID: 3,
        imageFile: profileImage,
        skills: ["React"],
      }),
    ).toMatchObject({ classBookID: 3, imageFile: profileImage, skills: ["React"] });
    expect(
      UpdateStudentRequestSchema.parse({
        classBookID: 3,
        skills: ["React"],
        imageFile: profileImage,
      }),
    ).toMatchObject({ classBookID: 3, imageFile: profileImage, skills: ["React"] });
    expect(
      UpdateStudentRequestSchema.safeParse({ classBookID: 3, email: "bad" })
        .success,
    ).toBe(false);
  });

  it("validates pagination metadata and response rows", () => {
    const row = {
      id: 1,
      email: "student@example.com",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      student: {
        id: 2,
        studentCode: "64000000001",
        classBookID: null,
        skills: [],
      },
    };
    expect(
      StudentPageSchema.parse({ rows: [row], totalRecords: 1, page: 1, pageSize: 10 }),
    ).toEqual({ rows: [row], totalRecords: 1, page: 1, pageSize: 10 });
    expect(
      StudentPageSchema.safeParse({ rows: [row], totalRecords: "1", page: 1, pageSize: 10 })
        .success,
    ).toBe(false);
  });
});
