import { describe, expect, it, vi } from "vitest";
import type { ApiResponse, Pageable } from "@/shared/types/response";
import type { IStudent, ICreateStudent } from "@/features/students/domain/student";
import type { IStudentRepository } from "@/features/students/ports/student.repository";
import type { CreateStudentCsv } from "@/features/students/schema/student-csv";
import { StudentService } from "@/features/students/service/student.service";

const student: IStudent = {
  id: 1,
  email: "student@example.com",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  student: {
    id: 2,
    studentCode: "64000000001",
    classBookID: 3,
    skills: [],
  },
};
const response = <T>(data: T): ApiResponse<T> => ({
  data,
  status: 200,
  statusCode: 200,
});
const page: Pageable<IStudent> = {
  rows: [student],
  totalRecords: 1,
  page: 1,
  pageSize: 10,
};
const validCreate: ICreateStudent = {
  prefixID: 1,
  studentCode: "64000000001",
  email: "student@example.com",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  firstNameEn: null,
  lastNameEn: null,
  nickName: "",
  facebook: "",
  github: undefined,
  classBookID: 3,
  imageFocalPointX: 0,
  imageFocalPointY: 100,
};
const image = (name: string) => new File([name], name, { type: "image/png" });

function createRepository() {
  return {
    getStudents: vi.fn<IStudentRepository["getStudents"]>().mockResolvedValue(response(page)),
    getStudentById: vi.fn<IStudentRepository["getStudentById"]>().mockResolvedValue(response(student)),
    getStudentByUserId: vi.fn<IStudentRepository["getStudentByUserId"]>().mockResolvedValue(response(student)),
    createStudent: vi.fn<IStudentRepository["createStudent"]>().mockResolvedValue(response(student)),
    deleteStudent: vi.fn<IStudentRepository["deleteStudent"]>().mockResolvedValue(response(student)),
    updateStudent: vi.fn<IStudentRepository["updateStudent"]>().mockResolvedValue(response(student)),
    createStudentBatch: vi.fn<IStudentRepository["createStudentBatch"]>().mockResolvedValue(response(null)),
  } satisfies IStudentRepository;
}

describe("StudentService multipart requests", () => {
  it("creates a student, skips empty optional values, and includes zero focal points", async () => {
    const repository = createRepository();
    const service = new StudentService(repository);

    expect(await service.createStudent(validCreate)).toBe(student);

    const form = repository.createStudent.mock.calls[0]![0];
    expect(form.get("studentCode")).toBe("64000000001");
    expect(form.get("email")).toBe("student@example.com");
    expect(form.get("prefixID")).toBe("1");
    expect(form.get("classBookID")).toBe("3");
    expect(form.get("imageFocalPointX")).toBe("0");
    expect(form.get("imageFocalPointY")).toBe("100");
    expect(form.has("firstNameEn")).toBe(false);
    expect(form.has("lastNameEn")).toBe(false);
    expect(form.has("nickName")).toBe(false);
    expect(form.has("facebook")).toBe(false);
    expect(form.has("imageFile")).toBe(false);
  });

  it("adds an optional create image", async () => {
    const repository = createRepository();
    const service = new StudentService(repository);
    const profileImage = image("student.png");

    await service.createStudent({ ...validCreate, imageFile: profileImage });

    expect(repository.createStudent.mock.calls[0]![0].get("imageFile")).toBe(profileImage);
  });

  it("repeats skills and appends image and classBookID on update", async () => {
    const repository = createRepository();
    const service = new StudentService(repository);
    const profileImage = image("updated.png");

    expect(
      await service.updateStudent(7, {
        classBookID: 42,
        imageFile: profileImage,
          email: "edited@example.com",
          skills: ["TypeScript", "React"],
          facebook: "",
          linkedin: null,
          imageFocalPointX: 0,
          imageFocalPointY: 100,
      }),
    ).toBe(student);

    const [form, studentID] = repository.updateStudent.mock.calls[0]!;
    expect(studentID).toBe(7);
    expect(form.get("email")).toBe("edited@example.com");
    expect(form.getAll("skills")).toEqual(["TypeScript", "React"]);
    expect(form.get("imageFocalPointX")).toBe("0");
    expect(form.get("imageFocalPointY")).toBe("100");
    expect(form.get("imageFile")).toBe(profileImage);
    expect(form.get("classBookID")).toBe("42");
    expect(form.has("facebook")).toBe(false);
    expect(form.has("linkedin")).toBe(false);
  });

  it("propagates update failures", async () => {
    const repository = createRepository();
    const error = new Error("Save failed");
    repository.updateStudent.mockRejectedValue(error);
    const service = new StudentService(repository);

    await expect(
      service.updateStudent(7, { classBookID: 42, email: "edited@example.com" }),
    ).rejects.toBe(error);
  });

  it("passes through a supplied CSV file with classBookID", async () => {
    const repository = createRepository();
    const service = new StudentService(repository);
    const csv = new File(["studentCode,email"], "input.csv", { type: "text/csv" });

    await expect(service.createStudentBatch({ classBookID: 42, file: csv })).resolves.toBeNull();

    const form = repository.createStudentBatch.mock.calls[0]![0];
    expect(form.get("file")).toBe(csv);
    expect(form.get("classBookID")).toBe("42");
  });

  it("quotes CSV values and escapes embedded quotes, commas, and newlines", async () => {
    const repository = createRepository();
    const service = new StudentService(repository);
    const rows: CreateStudentCsv[] = [
      {
        studentCode: "64000000001",
        email: "student@example.com",
        firstNameTh: 'สมชาย, "A"\nB',
        lastNameTh: "ใจดี",
      },
    ];

    await service.createStudentBatch({ classBookID: 42, students: rows });

    const form = repository.createStudentBatch.mock.calls[0]![0];
    const csv = form.get("file") as File;
    expect(csv.name).toBe("students.csv");
    expect(csv.type).toBe("text/csv");
    expect(form.get("classBookID")).toBe("42");
    expect(await csv.text()).toBe(
      [
        "studentCode,email,firstNameTh,lastNameTh,firstNameEn,lastNameEn,nickName",
        '"64000000001","student@example.com","สมชาย, ""A""\nB","ใจดี","","",""',
      ].join("\n"),
    );
  });
});

describe("StudentService repository errors", () => {
  it("propagates failures from every operation except the existing update catch", async () => {
    const repository = createRepository();
    const service = new StudentService(repository);
    const error = new Error("Repository unavailable");
    repository.getStudents.mockRejectedValueOnce(error);
    repository.getStudentById.mockRejectedValueOnce(error);
    repository.getStudentByUserId.mockRejectedValueOnce(error);
    repository.createStudent.mockRejectedValueOnce(error);
    repository.deleteStudent.mockRejectedValueOnce(error);
    repository.createStudentBatch.mockRejectedValueOnce(error);

    await expect(service.getStudents({})).rejects.toBe(error);
    await expect(service.getStudentById(1)).rejects.toBe(error);
    await expect(service.getStudentByUserId(1)).rejects.toBe(error);
    await expect(service.createStudent(validCreate)).rejects.toBe(error);
    await expect(service.deleteStudent(1)).rejects.toBe(error);
    await expect(
      service.createStudentBatch({
        classBookID: 42,
        file: new File(["students"], "students.csv", { type: "text/csv" }),
      }),
    ).rejects.toBe(error);
  });

  it("parses query strings before repository serialization", async () => {
    const repository = createRepository();
    const service = new StudentService(repository);

    await service.getStudents({ page: "2", pageSize: "5", classBookID: "3" });

    expect(repository.getStudents).toHaveBeenCalledWith({
      page: 2,
      pageSize: 5,
      classBookID: 3,
    });
    await expect(service.getStudents({ page: "bad" })).rejects.toThrow();
  });

  it("preserves an absent user profile as null", async () => {
    const repository = createRepository();
    repository.getStudentByUserId.mockResolvedValueOnce(response(null));
    const service = new StudentService(repository);

    await expect(service.getStudentByUserId(4)).resolves.toBeNull();
  });

  it("rejects invalid public IDs before calling the repository", async () => {
    const repository = createRepository();
    const service = new StudentService(repository);

    await expect(service.getStudentById(Number.NaN)).rejects.toThrow();
    expect(repository.getStudentById).not.toHaveBeenCalled();
  });
});
