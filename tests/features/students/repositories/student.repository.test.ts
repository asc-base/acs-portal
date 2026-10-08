import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { HttpHelper } from "@/shared/lib/http";
import type { IStudent } from "@/features/students/domain/student";
import { StudentRepository } from "@/features/students/repositories/student.repository";

const student: IStudent = {
  id: 1,
  email: "student@example.com",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  student: {
    id: 2,
    studentCode: "64000000001",
    classBookID: 3,
    skills: ["TypeScript"],
  },
};
const response = <T>(data: T) => ({ data, status: 200, statusCode: 200 });

describe("student response parsing", () => {
  it("accepts a valid profile response", async () => {
    const http = new HttpHelper();
    vi.spyOn(http, "get").mockResolvedValue(response(student));
    const repository = new StudentRepository("", http);

    await expect(repository.getStudentById(student.id)).resolves.toEqual(response(student));
  });

  it("rejects malformed profile and list row shapes", async () => {
    const http = new HttpHelper();
    const get = vi.spyOn(http, "get");
    const repository = new StudentRepository("", http);
    get.mockResolvedValueOnce(response({ ...student, student: { ...student.student, skills: "TypeScript" } }));
    await expect(repository.getStudentById(student.id)).rejects.toBeInstanceOf(ZodError);

    get.mockResolvedValueOnce(
      response({ rows: [{ ...student, student: undefined }], totalRecords: 1, page: 1, pageSize: 10 }),
    );
    await expect(repository.getStudents({})).rejects.toBeInstanceOf(ZodError);
  });
});
