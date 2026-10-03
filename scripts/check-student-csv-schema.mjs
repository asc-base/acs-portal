import assert from "node:assert/strict";
import { CreateStudentCsvSchema } from "../src/core/schema/student-csv.ts";

const validStudent = {
  studentCode: "64000000001",
  email: "student@example.com",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
};

assert.equal(CreateStudentCsvSchema.safeParse(validStudent).success, true);
assert.equal(
  CreateStudentCsvSchema.safeParse({ ...validStudent, studentCode: "123" })
    .success,
  false,
);
assert.equal(
  CreateStudentCsvSchema.safeParse({
    ...validStudent,
    email: "not-an-email",
  }).success,
  false,
);
assert.equal(
  CreateStudentCsvSchema.safeParse({
    ...validStudent,
    firstNameEn: "",
    lastNameEn: "",
    nickName: "",
  }).success,
  true,
);
