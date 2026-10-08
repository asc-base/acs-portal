import type { IProject } from "@/features/projects/schema/project";

export const projectFixture: IProject = {
  id: 17,
  title: "Senior design project",
  details: "A project description",
  youtubeURL: "https://youtube.com/watch?v=123",
  githubURL: "https://github.com/kmutt/project",
  documentURL: "https://example.test/document",
  presentationURL: "https://example.test/presentation",
  thumbnailURL: "https://example.test/project.png",
  thumbnailContentType: null,
  thumbnailFocalPointX: null,
  thumbnailFocalPointY: 75,
  assetsURL: ["https://example.test/asset.png"],
  images: [{ imageUrl: "https://example.test/asset.png", contentType: null, sortOrder: 0 }],
  techStacks: ["TypeScript"],
  tag: [{ id: 2, name: "Software", tagsGroupsId: 1 }],
  member: [{
    id: 7,
    email: "student@example.test",
    firstNameTh: "สมชาย",
    lastNameTh: "ใจดี",
    role: { id: 2, name: "Student" },
  }],
  course: [{
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
