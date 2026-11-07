import { describe, expect, it } from "vitest";
import {
  CreateProjectFormSchema,
  CreateProjectRequestSchema,
  ProjectSchema,
  ProjectResponseSchema,
  ProjectPageResponseSchema,
  UpdateProjectFormSchema,
  UpdateProjectRequestSchema,
  QueryProjectSchema,
  projectFormToCreateRequest,
  projectFormToUpdateRequest,
} from "@/features/projects/schema/project";

const form = {
  title: "Senior design project",
  detail: "A project description",
  youtubeURL: "https://youtube.com/watch?v=123",
  githubURL: "https://github.com/kmutt/project",
  documentURL: "https://example.test/document",
  presentationURL: "https://example.test/presentation",
  figmaURL: "",
  projectCourses: [{ value: 1 }],
  projectTypes: [{ value: 1 }],
  projectCategories: [{ value: 1 }],
  projectFields: [],
  techStacks: [{ value: "TypeScript" }],
  students: [{ userID: 7, position: "Frontend" }],
  advisors: [{ userID: 9, position: "" }],
  coAdvisors: [],
};
const gallery = { gallery: [{ fileIndex: 0 }], assets: [new File(["image"], "project.png", { type: "image/png" })] };

describe("project form schemas", () => {
  it("accepts required metadata, URL values, and the required member groups", () => {
    expect(CreateProjectFormSchema.parse(form)).toEqual(form);
    expect(UpdateProjectFormSchema.parse(form)).toEqual(form);
  });

  it.each(["projectCourses", "projectTypes", "projectCategories", "techStacks", "students", "advisors"])(
    "requires at least one %s entry",
    (field) => expect(CreateProjectFormSchema.safeParse({ ...form, [field]: [] }).success).toBe(false),
  );

  it.each(["youtubeURL", "githubURL", "documentURL", "presentationURL"])(
    "rejects an invalid %s",
    (field) => expect(CreateProjectFormSchema.safeParse({ ...form, [field]: "not a URL" }).success).toBe(false),
  );

  it.each([["title", "   "], ["detail", "   "]])("rejects a blank %s", (field, value) => {
    expect(CreateProjectFormSchema.safeParse({ ...form, [field]: value }).success).toBe(false);
  });
});

describe("project request mapping", () => {
  it("maps cohorts, classifications, member types, tech stacks, gallery order, and focal points", () => {
    const data = {
      ...form,
      projectCourses: [{ value: 3 }, { value: 8 }],
      projectTypes: [{ value: 2 }],
      projectCategories: [{ value: 5 }],
      projectFields: [{ value: 4 }],
      students: [{ userID: 7, position: "Backend" }],
      advisors: [{ userID: 9, position: "" }],
      coAdvisors: [{ userID: 10, position: "Research" }],
      thumbnailFocalPointX: 0,
      thumbnailFocalPointY: 75,
    };

    expect(projectFormToCreateRequest(data, gallery)).toEqual({
      title: form.title,
      detail: form.detail,
      youtubeURL: form.youtubeURL,
      githubURL: form.githubURL,
      documentURL: form.documentURL,
      presentationURL: form.presentationURL,
      figmaURL: null,
      courseIds: [3, 8],
      fieldIds: [4],
      categoryIds: [5],
      projectTypeIds: [2],
      techStacks: ["TypeScript"],
      members: [
        { userID: 7, memberType: "STUDENT", position: "Backend" },
        { userID: 9, memberType: "ADVISOR" },
        { userID: 10, memberType: "CO_ADVISOR", position: "Research" },
      ],
      gallery: [{ fileIndex: 0 }],
      thumbnailFocalPointX: 0,
      thumbnailFocalPointY: 75,
    });
  });

  it("replaces relations on update and permits clearing the optional Figma link", () => {
    const request = projectFormToUpdateRequest(
      { ...form, figmaURL: "", students: [{ userID: 11 }], advisors: [{ userID: 9 }], coAdvisors: [] },
      { gallery: [{ imageID: 41 }, { fileIndex: 0 }], assets: gallery.assets },
    );
    expect(request).toMatchObject({
      detail: form.detail,
      figmaURL: null,
      members: [
        { userID: 11, memberType: "STUDENT" },
        { userID: 9, memberType: "ADVISOR" },
      ],
      gallery: [{ imageID: 41 }, { fileIndex: 0 }],
    });
    expect(UpdateProjectRequestSchema.safeParse({ figmaURL: null, members: [], gallery: [] }).success).toBe(false);
  });

  it("rejects invalid relation IDs and duplicate or out-of-range gallery sources", () => {
    const request = projectFormToCreateRequest(form, gallery);
    expect(CreateProjectRequestSchema.safeParse({ ...request, courseIds: [0] }).success).toBe(false);
    expect(CreateProjectRequestSchema.safeParse({ ...request, gallery: [{ fileIndex: 1 }] }).success).toBe(true);
    expect(UpdateProjectRequestSchema.safeParse({ members: [{ userID: 1, memberType: "ADMIN" }] }).success).toBe(false);
  });
});

describe("project response schemas", () => {
  const projectDTO = {
    id: 17,
    title: "Senior design project",
    detail: "A project description",
    youtubeURL: "https://youtube.com/watch?v=123",
    githubURL: "https://github.com/kmutt/project",
    documentURL: "https://example.test/document",
    presentationURL: "https://example.test/presentation",
    figmaURL: null,
    thumbnailURL: "https://example.test/project.png",
    thumbnailContentType: null,
    imageID: 8,
    thumbnailFocalPointX: null,
    thumbnailFocalPointY: 75,
    images: [{ imageID: 4, imageUrl: "https://example.test/asset.png", contentType: "image/png", sortOrder: 0 }],
    techStacks: [{ id: 3, name: "TypeScript" }],
    fields: [],
    categories: [],
    projectTypes: [],
    members: [{ user: { id: 7, email: "student@example.test", firstNameTh: "สมชาย", lastNameTh: "ใจดี" }, memberType: "STUDENT", position: null }],
    courses: [{
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

  it("accepts project lookup relations and parses the page envelope", () => {
    expect(ProjectSchema.parse(projectDTO)).toEqual(projectDTO);
    expect(ProjectResponseSchema.parse({ status: 200, statusCode: 200, data: projectDTO }).data).toEqual(projectDTO);
    expect(ProjectPageResponseSchema.parse({ status: 200, data: { rows: [projectDTO], totalRecords: 1, page: 1, pageSize: 10 } }).data.rows[0]).toEqual(projectDTO);
  });

  it("rejects malformed members, pagination, and retired project filters", () => {
    expect(ProjectSchema.safeParse({ ...projectDTO, members: [{ user: { id: 7 }, memberType: "STUDENT" }] }).success).toBe(false);
    expect(ProjectPageResponseSchema.safeParse({ status: 200, data: { rows: [], totalRecords: "1", page: 1, pageSize: 10 } }).success).toBe(false);
    expect(QueryProjectSchema.safeParse({ fields: "16" }).success).toBe(false);
    expect(QueryProjectSchema.safeParse({ tagID: "16" }).success).toBe(false);
    expect(QueryProjectSchema.parse({ classBooks: "3" }).classBooks).toEqual(["3"]);
  });
});
