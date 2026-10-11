import { describe, expect, it } from "vitest";
import {
  CoursePageResponseSchema,
  CourseResponseSchema,
  CreateCourseFormSchema,
  CreateCourseRequestSchema,
  QueryCourseSchema,
  UpdateCourseFormSchema,
  UpdateCourseRequestSchema,
} from "@/features/courses/schema/course";

const courseFields = {
  typeCourseID: 1,
  courseCode: "CS101",
  credits: "3 (3-0-6)",
  courseNameEn: "Introduction to Programming (1)",
  courseNameTh: "การเขียนโปรแกรมเบื้องต้น 1",
  detail: "An introductory course",
};

const courseResponse = {
  id: 7,
  courseCode: courseFields.courseCode,
  courseNameTh: courseFields.courseNameTh,
  courseNameEn: courseFields.courseNameEn,
  credits: courseFields.credits,
  detail: courseFields.detail,
  typeCourse: { id: 1, type: "Core", description: "Core course" },
  curriculum: {
    id: 2,
    year: "2026",
    title: "Computer Science",
    documentURL: "https://example.test/curriculum.pdf",
    description: "Undergraduate curriculum",
    thumbnailURL: "https://example.test/curriculum.png",
  },
  prerequisites: [
    {
      id: 3,
      courseCode: "CS100",
      courseNameTh: "พื้นฐานคอมพิวเตอร์",
      courseNameEn: "Computer Fundamentals",
      credits: "3 (3-0-6)",
      detail: "Introductory course",
    },
  ],
};

describe("course schemas", () => {
  it("keeps prerequisite form rows separate from the create request ID list", () => {
    expect(
      CreateCourseFormSchema.parse({ ...courseFields, preCoursesID: [{ id: 3 }] }),
    ).toEqual({ ...courseFields, preCoursesID: [{ id: 3 }] });
    expect(
      CreateCourseRequestSchema.parse({
        ...courseFields,
        curriculumID: 2,
        preCoursesID: [3],
      }),
    ).toEqual({ ...courseFields, curriculumID: 2, preCoursesID: [3] });
    expect(
      CreateCourseRequestSchema.safeParse({
        ...courseFields,
        curriculumID: 2,
        preCoursesID: [{ id: 3 }],
      }).success,
    ).toBe(false);
  });

  it("preserves update prerequisite diffs as request ID arrays", () => {
    expect(
      UpdateCourseFormSchema.parse({
        ...courseFields,
        preCoursesID: [{ id: 3 }],
      }).preCoursesID,
    ).toEqual([{ id: 3 }]);
    expect(
      UpdateCourseRequestSchema.parse({
        curriculumID: 2,
        newPrecourseId: [3],
        deletePrecourseId: [4],
      }),
    ).toEqual({
      curriculumID: 2,
      newPrecourseId: [3],
      deletePrecourseId: [4],
    });
  });

  it("retains form validation and parses URL query values without losing false or zero", () => {
    expect(
      CreateCourseFormSchema.safeParse({
        ...courseFields,
        courseCode: "  ",
        preCoursesID: [],
      }).success,
    ).toBe(false);
    expect(
      QueryCourseSchema.parse({
        page: "0",
        pageSize: 10,
        prerequisite: "false",
        curriculumID: "0",
        typeCourseID: 0,
        search: "C++ & systems",
      }),
    ).toEqual({
      page: 0,
      pageSize: 10,
      prerequisite: false,
      curriculumID: 0,
      typeCourseID: 0,
      search: "C++ & systems",
    });
  });

  it("parses the real course DTO with prerequisite summaries and JSON-safe fields", () => {
    expect(
      CourseResponseSchema.parse({
        status: 201,
        data: courseResponse,
        msg: "Created",
        err: null,
      }).data,
    ).toEqual(courseResponse);
    expect(
      CoursePageResponseSchema.safeParse({
        status: 200,
        data: {
          rows: [{ id: 7 }],
          totalRecords: 1,
          page: 1,
          pageSize: 10,
        },
        msg: "OK",
        err: null,
      }).success,
    ).toBe(false);
  });
});
