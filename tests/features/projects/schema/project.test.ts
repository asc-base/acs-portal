import { describe, expect, it } from "vitest";
import { updateProjectSchema } from "@/features/projects/schema/project";

const project = {
  title: "Senior design project",
  details: "A project description",
  youtubeURL: "https://youtube.com/watch?v=123",
  githubURL: "https://github.com/kmutt/project",
  documentURL: "https://example.test/document",
  presentationURL: "https://example.test/presentation",
  projectCourses: [{ value: 1 }],
  projectTypes: [{ value: 1 }],
  projectCategories: [{ value: 1 }],
  techStacks: [{ value: "TypeScript" }],
  students: [{ userID: 1 }],
  advisors: [{ userID: 1 }],
};

describe("project form schema", () => {
  it("accepts required metadata, valid URLs, and one entry in each required list", () => {
    expect(updateProjectSchema.parse(project)).toEqual(project);
  });

  it.each(Object.keys(project))("requires %s", (field) => {
    expect(
      updateProjectSchema.safeParse({ ...project, [field]: undefined }).success,
    ).toBe(false);
  });

  it.each([
    "projectCourses",
    "projectTypes",
    "projectCategories",
    "techStacks",
    "students",
    "advisors",
  ])("requires at least one %s entry", (field) => {
    expect(
      updateProjectSchema.safeParse({ ...project, [field]: [] }).success,
    ).toBe(false);
  });

  it.each([
    "youtubeURL",
    "githubURL",
    "documentURL",
    "presentationURL",
  ])("rejects an invalid %s", (field) => {
    expect(
      updateProjectSchema.safeParse({ ...project, [field]: "not a URL" })
        .success,
    ).toBe(false);
  });

  it.each([
    ["title", "   "],
    ["details", "   "],
  ])("rejects a blank %s", (field, value) => {
    expect(
      updateProjectSchema.safeParse({ ...project, [field]: value }).success,
    ).toBe(false);
  });

  it("keeps focal-point coordinates optional", () => {
    expect(updateProjectSchema.safeParse(project).success).toBe(true);
  });
});
