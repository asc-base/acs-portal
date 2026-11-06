import { describe, expect, it } from "vitest";
import {
  CreateProjectFormSchema,
  CreateProjectRequestSchema,
  ProjectSchema,
  ProjectResponseSchema,
  ProjectPageResponseSchema,
  UpdateProjectFormSchema,
  UpdateProjectRequestSchema,
  projectFormToCreateRequest,
  projectFormToUpdateRequest,
} from "@/features/projects/schema/project";

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

describe("project form schemas", () => {
  it("accepts required metadata, valid URLs, and one entry in each required list", () => {
    expect(CreateProjectFormSchema.parse(project)).toEqual(project);
    expect(UpdateProjectFormSchema.parse(project)).toEqual(project);
  });

  it.each(Object.keys(project))("requires %s", (field) => {
    expect(
      CreateProjectFormSchema.safeParse({ ...project, [field]: undefined }).success,
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
      CreateProjectFormSchema.safeParse({ ...project, [field]: [] }).success,
    ).toBe(false);
  });

  it.each([
    "youtubeURL",
    "githubURL",
    "documentURL",
    "presentationURL",
  ])("rejects an invalid %s", (field) => {
    expect(
      CreateProjectFormSchema.safeParse({ ...project, [field]: "not a URL" })
        .success,
    ).toBe(false);
  });

  it.each([
    ["title", "   "],
    ["details", "   "],
  ])("rejects a blank %s", (field, value) => {
    expect(
      CreateProjectFormSchema.safeParse({ ...project, [field]: value }).success,
    ).toBe(false);
  });

  it("keeps focal-point coordinates optional", () => {
    expect(CreateProjectFormSchema.safeParse(project).success).toBe(true);
  });
});

describe("project request mapping", () => {
  it("keeps create member roles, selected IDs, and thumbnail focal points", () => {
    const form = {
      ...project,
      projectCourses: [{ value: 3 }, { value: 8 }],
      projectTypes: [{ value: 2 }],
      projectCategories: [{ value: 5 }],
      students: [{ userID: 7 }],
      advisors: [{ userID: 9 }],
      thumbnailFocalPointX: 0,
      thumbnailFocalPointY: 75,
    };

    expect(projectFormToCreateRequest(form)).toEqual({
      title: project.title,
      details: project.details,
      youtubeURL: project.youtubeURL,
      githubURL: project.githubURL,
      documentURL: project.documentURL,
      presentationURL: project.presentationURL,
      figmaURL: "",
      coursesID: [3, 8],
      tagsID: [2, 5],
      techStacks: ["TypeScript"],
      members: [
        { userID: 7, roleID: 2 },
        { userID: 9, roleID: 3 },
      ],
      thumbnailFocalPointX: 0,
      thumbnailFocalPointY: 75,
    });
  });

  it("creates only literal add/delete diffs for changed memberships", () => {
    const form = {
      ...project,
      projectCourses: [{ value: 8 }],
      projectTypes: [{ value: 2 }],
      projectCategories: [{ value: 5 }],
      students: [{ userID: 11 }],
      advisors: [{ userID: 10 }],
      thumbnailFocalPointX: 20,
      thumbnailFocalPointY: 80,
    };
    const current = {
      id: 17,
      course: [{ id: 3 }],
      tag: [{ id: 2, tagsGroupsId: 1 }, { id: 6, tagsGroupsId: 3 }],
      member: [
        { id: 7, role: { id: 2 } },
        { id: 9, role: { id: 3 } },
      ],
    };

    expect(projectFormToUpdateRequest(form, current)).toEqual({
      title: project.title,
      details: project.details,
      youtubeURL: project.youtubeURL,
      githubURL: project.githubURL,
      documentURL: project.documentURL,
      presentationURL: project.presentationURL,
      techStacks: ["TypeScript"],
      newtagsID: [5],
      deletedtagsID: [6],
      newMembers: [
        { userID: 11, roleID: 2 },
        { userID: 10, roleID: 3 },
      ],
      deletedmembersID: [7, 9],
      newCoursesID: [8],
      deletedCoursesID: [3],
      thumbnailFocalPointX: 20,
      thumbnailFocalPointY: 80,
    });
  });

  it("rejects malformed request IDs without imposing focal-point bounds", () => {
    const request = projectFormToCreateRequest(project);
    expect(CreateProjectRequestSchema.safeParse({ ...request, coursesID: [0] }).success).toBe(false);
    expect(CreateProjectRequestSchema.safeParse({ ...request, thumbnailFocalPointX: -20 }).success).toBe(true);
    expect(UpdateProjectRequestSchema.safeParse({ newMembers: [{ userID: 1, roleID: 0 }] }).success).toBe(false);
  });
});

describe("project response schemas", () => {
  const projectDTO = {
    id: 17,
    title: "Senior design project",
    details: "A project description",
    youtubeURL: "https://youtube.com/watch?v=123",
    githubURL: "https://github.com/kmutt/project",
    documentURL: "https://example.test/document",
    presentationURL: "https://example.test/presentation",
    figmaURL: null,
    thumbnailURL: "https://example.test/project.png",
    thumbnailContentType: null,
    thumbnailFocalPointX: null,
    thumbnailFocalPointY: 75,
    assetsURL: ["https://example.test/asset.png"],
    images: [{ imageUrl: "https://example.test/asset.png", contentType: null, sortOrder: 0 }],
    techStacks: ["TypeScript"],
    tag: [{ id: 2, name: "Software", tagsGroupsId: 1 }],
    member: [{ id: 7, email: "student@example.test", firstNameTh: "สมชาย", lastNameTh: "ใจดี", role: { id: 2, name: "Student" } }],
    course: [{
      id: 3,
      courseCode: "CPE101",
      courseNameTh: "การเขียนโปรแกรม",
      courseNameEn: "Programming",
      credits: "3(2-2-5)",
      detail: "Programming fundamentals",
      typeCourse: { id: 1, type: "Core" },
      curriculum: { id: 1, year: "2025", title: "ACS", documentURL: "https://example.test/curriculum.pdf", description: "Curriculum", thumbnailURL: "https://example.test/curriculum.png" },
      prerequisites: [],
    }],
  };

  it("accepts the current project DTO with optional legacy fields absent", () => {
    expect(ProjectSchema.parse(projectDTO)).toEqual(projectDTO);
    expect(ProjectResponseSchema.parse({ status: 200, statusCode: 200, data: projectDTO }).data).toEqual(projectDTO);
    expect(ProjectPageResponseSchema.parse({
      status: 200,
      data: { rows: [projectDTO], totalRecords: 1, page: 1, pageSize: 10 },
      msg: "Success",
      err: null,
      statusCode: 200,
    }).data.rows[0]).toEqual(projectDTO);
  });

  it("rejects a malformed member and malformed pagination", () => {
    expect(ProjectSchema.safeParse({ ...projectDTO, member: [{ id: 7 }] }).success).toBe(false);
    expect(ProjectPageResponseSchema.safeParse({ status: 200, data: { rows: [], totalRecords: "1", page: 1, pageSize: 10 } }).success).toBe(false);
  });
});
