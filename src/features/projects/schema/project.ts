import { z } from "zod";
import { CourseSchema } from "@/features/courses/schema/course";
import { ProjectLookupSchema } from "@/shared/schema/references";
import { UserResponseSchema } from "@/shared/schema/profile-response";
import { PageMetadataSchema } from "@/shared/schema/page-metadata";

const projectFormSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกหัวข้อ"),
  detail: z.string().trim().min(1, "กรุณากรอกรายละเอียด"),
  youtubeURL: z.string().trim().url("กรุณากรอกลิงก์ YouTube ให้ถูกต้อง (ต้องเป็น URL)"),
  githubURL: z.string().trim().url("กรุณากรอกลิงก์ Github ให้ถูกต้อง (ต้องเป็น URL)"),
  documentURL: z.string().trim().url("กรุณากรอกลิงก์ Document ให้ถูกต้อง (ต้องเป็น URL)"),
  presentationURL: z.string().trim().url("กรุณากรอกลิงก์ Presentation ให้ถูกต้อง (ต้องเป็น URL)"),
  figmaURL: z.string().trim(),
  projectCourses: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกวิชา") })).min(1, "กรุณาเลือกวิชาอย่างน้อย 1 วิชา"),
  projectTypes: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกประเภท") })).min(1, "กรุณาเลือกอย่างน้อย 1 ประเภท"),
  projectCategories: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกหมวดหมู่") })).min(1, "กรุณาเลือกอย่างน้อย 1 หมวดหมู่"),
  projectFields: z.array(z.object({ value: z.number().min(1) })),
  techStacks: z.array(z.object({ value: z.string().trim().min(1, "ระบุ Tech Stack") })).min(1, "ระบุอย่างน้อย 1 Tech Stack"),
  students: z.array(z.object({ userID: z.number().min(1, "กรุณาเลือกนักศึกษา"), position: z.string().trim().optional() })).min(1, "กรุณาเพิ่มผู้จัดทำอย่างน้อย 1 คน"),
  advisors: z.array(z.object({ userID: z.number().min(1, "กรุณาเลือกอาจารย์"), position: z.string().trim().optional() })).min(1, "กรุณาเพิ่มอาจารย์ที่ปรึกษาอย่างน้อย 1 คน"),
  coAdvisors: z.array(z.object({ userID: z.number().min(1, "กรุณาเลือกอาจารย์"), position: z.string().trim().optional() })),
  thumbnailFocalPointX: z.number().optional(),
  thumbnailFocalPointY: z.number().optional(),
});

export const CreateProjectFormSchema = projectFormSchema;
export const UpdateProjectFormSchema = projectFormSchema;
export const updateProjectSchema = UpdateProjectFormSchema;

const requestFields = {
  title: z.string().min(1),
  detail: z.string().min(1),
  youtubeURL: z.string().min(1),
  githubURL: z.string().min(1),
  documentURL: z.string().min(1),
  presentationURL: z.string().min(1),
  figmaURL: z.string().nullable().optional(),
  thumbnailFocalPointX: z.number().optional(),
  thumbnailFocalPointY: z.number().optional(),
};
const projectId = z.number().int().min(1);
const projectMemberRequest = z.object({
  userID: projectId,
  memberType: z.enum(["STUDENT", "ADVISOR", "CO_ADVISOR"]),
  position: z.string().trim().min(1).optional(),
}).strict();
export const ProjectImageRequestSchema = z.union([
  z.object({ imageID: projectId }).strict(),
  z.object({ fileIndex: z.number().int().min(0) }).strict(),
]);
export type ProjectGalleryRequest = {
  gallery: z.infer<typeof ProjectImageRequestSchema>[];
  assets: File[];
};

export const CreateProjectRequestSchema = z.object({
  ...requestFields,
  courseIds: z.array(projectId),
  fieldIds: z.array(projectId),
  categoryIds: z.array(projectId),
  projectTypeIds: z.array(projectId),
  techStacks: z.array(z.string().trim().min(1)),
  members: z.array(projectMemberRequest).min(2),
  gallery: z.array(z.object({ fileIndex: z.number().int().min(0) }).strict()).min(1).max(10),
}).strict();

export const UpdateProjectRequestSchema = z.object({
  ...z.object(requestFields).partial().shape,
  figmaURL: z.string().nullable().optional(),
  courseIds: z.array(projectId).optional(),
  fieldIds: z.array(projectId).optional(),
  categoryIds: z.array(projectId).optional(),
  projectTypeIds: z.array(projectId).optional(),
  techStacks: z.array(z.string().trim().min(1)).optional(),
  members: z.array(projectMemberRequest).optional(),
  gallery: z.array(ProjectImageRequestSchema).min(1).max(10).optional(),
}).strict();

const queryPageNumber = z.union([z.number(), z.string()]).transform(Number).pipe(z.number());
const queryList = z.union([z.string(), z.array(z.string())]).transform((value) => Array.isArray(value) ? value : [value]);
export const QueryProjectSchema = z.object({
  page: queryPageNumber.optional(),
  pageSize: queryPageNumber.optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  fieldIds: queryList.optional(),
  categoryIds: queryList.optional(),
  projectTypeIds: queryList.optional(),
  courses: queryList.optional(),
  classBooks: queryList.optional(),
  search: z.string().optional(),
}).strict();
export const ProjectIdSchema = projectId;
export const ProjectSearchSchema = QueryProjectSchema.pick({ search: true });

export const ProjectImageSchema = z.object({
  imageID: z.number(),
  imageUrl: z.string(),
  contentType: z.string().nullable(),
  sortOrder: z.number(),
});
export const ProjectMemberSchema = z.object({
  user: UserResponseSchema,
  memberType: z.enum(["STUDENT", "ADVISOR", "CO_ADVISOR"]),
  position: z.string().nullable(),
});
export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  detail: z.string().nullable(),
  githubURL: z.string(),
  presentationURL: z.string(),
  documentURL: z.string(),
  figmaURL: z.string().nullable(),
  youtubeURL: z.string(),
  thumbnailURL: z.string(),
  thumbnailContentType: z.string().nullable(),
  imageID: z.number().nullable(),
  thumbnailFocalPointX: z.number().nullable(),
  thumbnailFocalPointY: z.number().nullable(),
  images: z.array(ProjectImageSchema),
  techStacks: z.array(ProjectLookupSchema),
  fields: z.array(ProjectLookupSchema),
  categories: z.array(ProjectLookupSchema),
  projectTypes: z.array(ProjectLookupSchema),
  members: z.array(ProjectMemberSchema),
  courses: z.array(CourseSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
}).strict();
export const ProjectPageSchema = z.object({ rows: z.array(ProjectSchema), ...PageMetadataSchema.shape });
export const ProjectResponseSchema = z.object({ status: z.number(), data: ProjectSchema }).passthrough();
export const ProjectPageResponseSchema = z.object({ status: z.number(), data: ProjectPageSchema }).passthrough();

function requestMembers(data: ProjectFormValues) {
  return [
    ...data.students.map(({ userID, position }) => ({ userID, memberType: "STUDENT" as const, ...(position && { position }) })),
    ...data.advisors.map(({ userID, position }) => ({ userID, memberType: "ADVISOR" as const, ...(position && { position }) })),
    ...data.coAdvisors.map(({ userID, position }) => ({ userID, memberType: "CO_ADVISOR" as const, ...(position && { position }) })),
  ];
}

export function projectFormToCreateRequest(data: ProjectFormValues, gallery: ProjectGalleryRequest) {
  return CreateProjectRequestSchema.parse({
    title: data.title,
    detail: data.detail,
    youtubeURL: data.youtubeURL,
    githubURL: data.githubURL,
    documentURL: data.documentURL,
    presentationURL: data.presentationURL,
    figmaURL: data.figmaURL || null,
    courseIds: data.projectCourses.map(({ value }) => value),
    fieldIds: data.projectFields.map(({ value }) => value),
    categoryIds: data.projectCategories.map(({ value }) => value),
    projectTypeIds: data.projectTypes.map(({ value }) => value),
    techStacks: data.techStacks.map(({ value }) => value),
    members: requestMembers(data),
    gallery: gallery.gallery,
    thumbnailFocalPointX: data.thumbnailFocalPointX,
    thumbnailFocalPointY: data.thumbnailFocalPointY,
  });
}

export function projectFormToUpdateRequest(
  data: ProjectFormValues,
  gallery: ProjectGalleryRequest,
) {
  return UpdateProjectRequestSchema.parse({
    title: data.title,
    detail: data.detail,
    youtubeURL: data.youtubeURL,
    githubURL: data.githubURL,
    documentURL: data.documentURL,
    presentationURL: data.presentationURL,
    figmaURL: data.figmaURL || null,
    courseIds: data.projectCourses.map(({ value }) => value),
    fieldIds: data.projectFields.map(({ value }) => value),
    categoryIds: data.projectCategories.map(({ value }) => value),
    projectTypeIds: data.projectTypes.map(({ value }) => value),
    techStacks: data.techStacks.map(({ value }) => value),
    members: requestMembers(data),
    gallery: gallery.gallery,
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
