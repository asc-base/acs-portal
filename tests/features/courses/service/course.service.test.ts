import { describe, expect, it, vi } from "vitest";
import type { CoursePage } from "@/features/courses/schema/course";
import type {
  ICourse,
  ICreateCourse,
  IUpdateCourse,
  QueryCourse,
} from "@/features/courses/domain/course";
import type { ICourseRepository } from "@/features/courses/ports/course.repository";
import { CourseService } from "@/features/courses/service/course.service";

const course: ICourse = {
  id: 7,
  courseCode: "CS101",
  courseNameTh: "การเขียนโปรแกรมเบื้องต้น",
  courseNameEn: "Introduction to Programming",
  credits: "3 (3-0-6)",
  detail: "An introductory course",
  curriculum: {
    id: 2,
    year: "2026",
    title: "Computer Science",
    documentURL: "",
    description: "",
    thumbnailURL: "",
  },
  prerequisites: [],
  typeCourse: {
    id: 1,
    type: "Core",
    description: "Core course",
  },
};
const page: CoursePage = {
  rows: [course],
  totalRecords: 1,
  page: 1,
  pageSize: 10,
};
const response = <T>(data: T) => ({
  data,
  status: 200,
  statusCode: 200,
  msg: "Success",
  err: null,
});

function createRepository() {
  return {
    getCourse: vi
      .fn<ICourseRepository["getCourse"]>()
      .mockResolvedValue(response(page)),
    getCourseById: vi
      .fn<ICourseRepository["getCourseById"]>()
      .mockResolvedValue(response(course)),
    createCourse: vi
      .fn<ICourseRepository["createCourse"]>()
      .mockResolvedValue(response(course)),
    updateCourse: vi
      .fn<ICourseRepository["updateCourse"]>()
      .mockResolvedValue(response(course)),
    deleteCourse: vi
      .fn<ICourseRepository["deleteCourse"]>()
      .mockResolvedValue(response(course)),
    createCourseBatch: vi
      .fn<ICourseRepository["createCourseBatch"]>()
      .mockResolvedValue(response(null)),
  } satisfies ICourseRepository;
}

describe("CourseService result handling", () => {
  it("unwraps list and CRUD response data and preserves a missing course", async () => {
    const repository = createRepository();
    const service = new CourseService(repository);
    const query: QueryCourse = { curriculumID: "2", page: 1 };
    const create: ICreateCourse = {
      courseCode: "CS101",
      typeCourseID: 1,
      courseNameTh: course.courseNameTh,
      courseNameEn: course.courseNameEn,
      credits: course.credits,
      detail: course.detail,
      curriculumID: 2,
    };
    const update: IUpdateCourse = { courseCode: "CS101A", curriculumID: 2 };

    await expect(service.getCourse(query)).resolves.toBe(page);
    expect(repository.getCourse).toHaveBeenCalledWith({ curriculumID: 2, page: 1 });
    await expect(service.getCourseById(course.id)).resolves.toBe(course);
    await expect(service.createCourse(create)).resolves.toBe(course);
    await expect(service.updateCourse(course.id, update)).resolves.toBe(course);
    await expect(service.deleteCourse(course.id)).resolves.toBe(course);
    repository.getCourseById.mockResolvedValueOnce(null);
    await expect(service.getCourseById(404)).resolves.toBeNull();
  });

  it("rejects malformed query input before calling the repository", async () => {
    const repository = createRepository();
    const service = new CourseService(repository);

    await expect(service.getCourse({ page: "not-a-number" })).rejects.toThrow();
    expect(repository.getCourse).not.toHaveBeenCalled();
  });

  it("wraps a batch file in the backend's file FormData field", async () => {
    const repository = createRepository();
    const service = new CourseService(repository);
    const file = new File(["courseCode,credits"], "courses.csv", {
      type: "text/csv",
    });

    await expect(service.createCourseBatch(file)).resolves.toBeNull();

    const form = repository.createCourseBatch.mock.calls[0]![0];
    expect(form.get("file")).toBe(file);
    expect(form.get("file")).toMatchObject({ name: "courses.csv" });
  });
});
