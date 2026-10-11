import { describe, expect, it } from "vitest";
import { CreateStudentCsvSchema } from "@/features/students/schema/student-csv";

const validStudent = {
  studentCode: "64000000001",
  email: "student@example.com",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
};

describe("CreateStudentCsvSchema", () => {
  it("accepts a valid student row", () => {
    expect(CreateStudentCsvSchema.safeParse(validStudent).success).toBe(true);
  });

  it("accepts empty optional English names and nickname", () => {
    expect(
      CreateStudentCsvSchema.safeParse({
        ...validStudent,
        firstNameEn: "",
        lastNameEn: "",
        nickName: "",
      }).success,
    ).toBe(true);
  });

  it.each([
    ["short student code", { studentCode: "123" }],
    ["non-numeric student code", { studentCode: "6400000000A" }],
    ["invalid email", { email: "not-an-email" }],
    ["missing Thai first name", { firstNameTh: undefined }],
    ["empty Thai last name", { lastNameTh: "   " }],
  ])("rejects %s", (_description, change) => {
    expect(CreateStudentCsvSchema.safeParse({ ...validStudent, ...change }).success).toBe(false);
  });
});
