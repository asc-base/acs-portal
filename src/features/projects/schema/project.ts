import { z } from "zod";
import { CourseSchema } from "@/features/courses/schema/course";
import { RoleSchema, TagSchema } from "@/shared/schema/references";
import { UserResponseSchema } from "@/shared/schema/profile-response";
import { PageMetadataSchema } from "@/shared/schema/page-metadata";

const projectFormSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกหัวข้อ"),
  details: z.string().trim().min(1, "กรุณากรอกรายละเอียด"),
  youtubeURL: z.string().trim().url("กรุณากรอกลิงก์ YouTube ให้ถูกต้อง (ต้องเป็น URL)"),
  githubURL: z.string().trim().url("กรุณากรอกลิงก์ Github ให้ถูกต้อง (ต้องเป็น URL)"),
  documentURL: z.string().trim().url("กรุณากรอกลิงก์ Document ให้ถูกต้อง (ต้องเป็น URL)"),
  presentationURL: z.string().trim().url("กรุณากรอกลิงก์ Presentation ให้ถูกต้อง (ต้องเป็น URL)"),
  projectCourses: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกวิชา") })).min(1, "กรุณาเลือกวิชาอย่างน้อย 1 วิชา"),
  projectTypes: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกประเภท") })).min(1, "กรุณาเลือกอย่างน้อย 1 ประเภท"),
  projectCategories: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกหมวดหมู่") })).min(1, "กรุณาเลือกอย่างน้อย 1 หมวดหมู่"),
  techStacks: z.array(z.object({ value: z.string().trim().min(1, "ระบุ Tech Stack") })).min(1, "ระบุอย่างน้อย 1 Tech Stack"),
  students: z.array(z.object({ userID: z.number().min(1, "กรุณาเลือกนักศึกษา") })).min(1, "กรุณาเพิ่มผู้จัดทำอย่างน้อย 1 คน"),
  advisors: z.array(z.object({ userID: z.number().min(1, "กรุณาเลือกอาจารย์") })).min(1, "กรุณาเพิ่มอาจารย์ที่ปรึกษาอย่างน้อย 1 คน"),
  thumbnailFocalPointX: z.number().optional(),
  thumbnailFocalPointY: z.number().optional(),
});

export const CreateProjectFormSchema = projectFormSchema;
export const UpdateProjectFormSchema = projectFormSchema;
export const updateProjectSchema = UpdateProjectFormSchema;

const requestFields = {
  title: z.string(),
  details: z.string(),
  youtubeURL: z.string(),
  githubURL: z.string(),
  documentURL: z.string(),
  presentationURL: z.string(),
  figmaURL: z.string().optional(),
  thumbnailFocalPointX: z.number().optional(),
  thumbnailFocalPointY: z.number().optional(),
};
const projectId = z.number().int().min(1);
const projectMemberRequest = z.object({ userID: projectId, roleID: projectId });

export const CreateProjectRequestSchema = z.object({
  ...requestFields,
  coursesID: z.array(projectId),
  tagsID: z.array(projectId),
  techStacks: z.array(z.string()),
  members: z.array(projectMemberRequest),
});

export const UpdateProjectRequestSchema = z.object({
  ...z.object(requestFields).partial().shape,
  figmaURL: z.string().nullable().optional(),
  newtagsID: z.array(projectId).optional(),
  deletedtagsID: z.array(projectId).optional(),
  newMembers: z.array(projectMemberRequest).optional(),
  deletedmembersID: z.array(projectId).optional(),
  newCoursesID: z.array(projectId).optional(),
  deletedCoursesID: z.array(projectId).optional(),
  techStacks: z.array(z.string()).optional(),
});

const queryPageNumber = z
  .union([z.number(), z.string()])
  .transform(Number)
  .pipe(z.number());
const queryList = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => (Array.isArray(value) ? value : [value]));

export const QueryProjectSchema = z.object({
  page: queryPageNumber.optional(),
  pageSize: queryPageNumber.optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  fields: queryList.optional(),
  categories: queryList.optional(),
  types: queryList.optional(),
  courses: queryList.optional(),
  classBooks: queryList.optional(),
  search: z.string().optional(),
});
export const ProjectIdSchema = projectId;

export const ProjectSearchSchema = QueryProjectSchema.pick({ search: true });

export const ProjectImageSchema = z.object({
  imageUrl: z.string(),
  contentType: z.string().nullable(),
  sortOrder: z.number(),
});

export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  details: z.string(),
  githubURL: z.string(),
  presentationURL: z.string(),
  documentURL: z.string(),
  figmaURL: z.string().nullable().optional(),
  youtubeURL: z.string(),
  thumbnailURL: z.string(),
  thumbnailContentType: z.string().nullable().optional(),
  thumbnailFocalPointX: z.number().nullable().optional(),
  thumbnailFocalPointY: z.number().nullable().optional(),
  assetsURL: z.array(z.string()),
  images: z.array(ProjectImageSchema).optional(),
  techStacks: z.array(z.string()),
  tag: z.array(TagSchema),
  member: z.array(UserResponseSchema.extend({ role: RoleSchema })),
  course: z.array(CourseSchema),
});

export const ProjectPageSchema = z.object({
  rows: z.array(ProjectSchema),
  ...PageMetadataSchema.shape,
});

export const ProjectResponseSchema = z
  .object({ status: z.number(), data: ProjectSchema })
  .passthrough();
export const ProjectPageResponseSchema = z
  .object({ status: z.number(), data: ProjectPageSchema })
  .passthrough();

type ProjectRelations = {
  course: { id: number }[];
  tag: { id: number; tagsGroupsId: number }[];
  member: { id: number; role: { id: number } }[];
};

export function projectFormToCreateRequest(data: ProjectFormValues) {
  return CreateProjectRequestSchema.parse({
    title: data.title,
    details: data.details,
    youtubeURL: data.youtubeURL,
    githubURL: data.githubURL,
    documentURL: data.documentURL,
    presentationURL: data.presentationURL,
    figmaURL: "",
    coursesID: data.projectCourses.map(({ value }) => Number(value)),
    tagsID: [...data.projectTypes, ...data.projectCategories].map(({ value }) => Number(value)),
    techStacks: data.techStacks.map(({ value }) => value),
    members: [
      ...data.students.map(({ userID }) => ({ userID: Number(userID), roleID: 2 })),
      ...data.advisors.map(({ userID }) => ({ userID: Number(userID), roleID: 3 })),
    ],
    thumbnailFocalPointX: data.thumbnailFocalPointX,
    thumbnailFocalPointY: data.thumbnailFocalPointY,
  });
}

export function projectFormToUpdateRequest(
  data: ProjectFormValues,
  current: ProjectRelations,
) {
  const oldCourses = current.course.map(({ id }) => id);
  const oldTags = current.tag
    .filter(({ tagsGroupsId }) => tagsGroupsId === 1 || tagsGroupsId === 3)
    .map(({ id }) => id);
  const oldStudents = current.member.filter(({ role }) => role.id === 2).map(({ id }) => id);
  const oldAdvisors = current.member.filter(({ role }) => role.id === 3).map(({ id }) => id);
  const courses = data.projectCourses.map(({ value }) => Number(value));
  const tags = [...data.projectTypes, ...data.projectCategories].map(({ value }) => Number(value));
  const students = data.students.map(({ userID }) => Number(userID));
  const advisors = data.advisors.map(({ userID }) => Number(userID));

  return UpdateProjectRequestSchema.parse({
    title: data.title,
    details: data.details,
    youtubeURL: data.youtubeURL,
    githubURL: data.githubURL,
    documentURL: data.documentURL,
    presentationURL: data.presentationURL,
    techStacks: data.techStacks.map(({ value }) => value).filter(Boolean),
    newtagsID: tags.filter((id) => !oldTags.includes(id)),
    deletedtagsID: oldTags.filter((id) => !tags.includes(id)),
    newMembers: [
      ...students.filter((id) => !oldStudents.includes(id)).map((userID) => ({ userID, roleID: 2 })),
      ...advisors.filter((id) => !oldAdvisors.includes(id)).map((userID) => ({ userID, roleID: 3 })),
    ],
    deletedmembersID: [
      ...oldStudents.filter((id) => !students.includes(id)),
      ...oldAdvisors.filter((id) => !advisors.includes(id)),
    ],
    newCoursesID: courses.filter((id) => !oldCourses.includes(id)),
    deletedCoursesID: oldCourses.filter((id) => !courses.includes(id)),
    thumbnailFocalPointX: data.thumbnailFocalPointX,
    thumbnailFocalPointY: data.thumbnailFocalPointY,
  });
}

export type ProjectFormInput = z.input<typeof projectFormSchema>;
export type ProjectFormValues = z.output<typeof projectFormSchema>;
export type CreateProjectRequest = z.output<typeof CreateProjectRequestSchema>;
export type UpdateProjectRequest = z.output<typeof UpdateProjectRequestSchema>;
export type QueryProjectInput = z.input<typeof QueryProjectSchema>;
export type QueryProject = z.output<typeof QueryProjectSchema>;
export type ProjectSearch = z.input<typeof ProjectSearchSchema>;
export type IProject = z.infer<typeof ProjectSchema>;
export type ProjectPage = z.infer<typeof ProjectPageSchema>;
export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;
export type ProjectPageResponse = z.infer<typeof ProjectPageResponseSchema>;
export type ProjectId = z.infer<typeof ProjectIdSchema>;
