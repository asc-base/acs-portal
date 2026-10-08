import { describe, expect, it } from "vitest";
import { createCourseSchema, updateCourseSchema } from "@/features/courses/schema/course";

const courseFields = {
  typeCourseID: 1,
  courseCode: "CS101",
  credits: "3 (3-0-6)",
  courseNameEn: "Introduction to Programming (1)",
  courseNameTh: "การเขียนโปรแกรมเบื้องต้น 1",
  detail: "An introductory course",
};

describe("course schemas", () => {
  it("accepts required fields and prerequisites on create", () => {
    expect(
      createCourseSchema.parse({
        ...courseFields,
        preCoursesID: [{ id: 12 }],
      }),
    ).toEqual({ ...courseFields, preCoursesID: [{ id: 12 }] });
  });

  it("allows prerequisites to be omitted on update", () => {
    expect(updateCourseSchema.parse(courseFields)).toEqual(courseFields);
  });

  it("currently requires the create form to send an empty prerequisite list", () => {
    expect(createCourseSchema.safeParse(courseFields).success).toBe(false);
    expect(
      createCourseSchema.safeParse({ ...courseFields, preCoursesID: [] })
        .success,
    ).toBe(true);
  });

  it.each([
    ["courseCode", "   "],
    ["credits", "   "],
    ["detail", "   "],
    ["typeCourseID", 0],
    ["typeCourseID", "1"],
    ["courseNameEn", "การเขียนโปรแกรม"],
    ["courseNameTh", "Intro to Programming"],
  ])("rejects invalid %s value %s", (field, value) => {
    expect(
      updateCourseSchema.safeParse({ ...courseFields, [field]: value })
        .success,
    ).toBe(false);
  });
});
