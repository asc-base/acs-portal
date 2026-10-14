import type { IProject } from "@/features/projects/schema/project";

export const projectFixture: IProject = {
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
  thumbnailFocalPointX: null,
  thumbnailFocalPointY: 75,
  imageID: null,
  images: [{ imageID: 22, imageUrl: "https://example.test/asset.png", contentType: "image/png", sortOrder: 0 }],
  techStacks: [{ id: 1, name: "TypeScript" }],
  fields: [{ id: 1, name: "Artificial intelligence" }],
  categories: [{ id: 1, name: "Education" }],
  projectTypes: [{ id: 1, name: "Research" }],
  members: [{
    user: {
      id: 7,
      email: "student@example.test",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
    },
    memberType: "STUDENT",
    position: null,
  }],
  courses: [{
    id: 3,
    courseCode: "CPE101",
    courseNameTh: "การเขียนโปรแกรม",
    courseNameEn: "Programming",
    credits: "3(2-2-5)",
    detail: "Programming fundamentals",
    typeCourse: { id: 1, type: "Core" },
    curriculum: {
      id: 1,
      year: "2025",
      title: "ACS",
      documentURL: "https://example.test/curriculum.pdf",
      description: "Curriculum",
      thumbnailURL: "https://example.test/curriculum.png",
    },
    prerequisites: [],
  }],
};

export const projectPageFixture = {
  rows: [projectFixture],
  totalRecords: 1,
  page: 1,
  pageSize: 10,
};

export const projectEnvelope = <T>(data: T) => ({
  status: 200,
  statusCode: 200,
  msg: "Success",
  err: null,
  data,
});
