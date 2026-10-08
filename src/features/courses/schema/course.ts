import { z } from "zod";
import { CurriculumSchema } from "@/features/curriculum/schema/curriculum";
import { TypeCourseSchema } from "@/features/master-data/schema/master-data";
import { PageMetadataSchema } from "@/shared/schema/page-metadata";

const commonCourseSchema = z.object({
  typeCourseID: z.number().min(1, "กรุณาเลือกกลุ่มวิชา"),
  courseCode: z.string().trim().min(1, "กรุณากรอกรหัสวิชา"),
  credits: z.string().trim().min(1, "กรุณากรอกหน่วยกิต"),
  courseNameEn: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อวิชาภาษาอังกฤษ")
    .regex(/^[A-Za-z0-9\s()/-]+$/, "กรุณากรอกชื่อวิชาเป็นภาษาอังกฤษ"),
  courseNameTh: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อวิชาภาษาไทย")
    .regex(/^[\p{Script=Thai}0-9\s()/-]+$/u, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
  detail: z.string().trim().min(1, "กรุณากรอกหน่วยกิต"),
});

const courseId = z.number().int().min(1);

export const CreateCourseFormSchema = commonCourseSchema.extend({
  preCoursesID: z.array(z.object({ id: z.number().optional() })),
});

export const UpdateCourseFormSchema = commonCourseSchema.extend({
  preCoursesID: z
    .array(z.object({ id: z.number().optional() }))
    .optional(),
});

export const CreateCourseRequestSchema = commonCourseSchema.extend({
  curriculumID: courseId,
  preCoursesID: z.array(courseId).optional(),
});

export const UpdateCourseRequestSchema = commonCourseSchema
  .partial()
  .extend({
    curriculumID: courseId,
    newPrecourseId: z.array(courseId).optional(),
    deletePrecourseId: z.array(courseId).optional(),
  });

export const CourseBatchRequestSchema = z.object({ file: z.file() });

const queryNumber = z
  .union([z.number(), z.string()])
  .transform(Number)
  .pipe(z.number());

export const QueryCourseSchema = z.object({
  page: queryNumber.optional(),
  pageSize: queryNumber.optional(),
  prerequisite: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((value) => value === true || value === "true")
    .optional(),
  curriculumID: queryNumber.optional(),
  typeCourseID: queryNumber.optional(),
  search: z.string().optional(),
  orderBy: z.string().optional(),
  sortBy: z.enum(["asc", "desc"]).optional(),
});
export const CourseSearchSchema = QueryCourseSchema.pick({ search: true });

export const CourseIdSchema = courseId;

export const CoursePrerequisiteSchema = z.object({
  id: z.number(),
  courseCode: z.string(),
  courseNameTh: z.string(),
  courseNameEn: z.string(),
  credits: z.string(),
  detail: z.string(),
});

export const CourseSchema = z.object({
  id: z.number(),
  courseCode: z.string(),
  courseNameTh: z.string(),
  courseNameEn: z.string(),
  credits: z.string(),
  detail: z.string(),
  typeCourse: TypeCourseSchema,
  curriculum: CurriculumSchema,
  prerequisites: z.array(CoursePrerequisiteSchema),
});

export const CoursePageSchema = z.object({
  rows: z.array(CourseSchema),
  ...PageMetadataSchema.shape,
});

export const CourseResponseSchema = z
  .object({ status: z.number(), data: CourseSchema })
  .passthrough();
export const NullableCourseResponseSchema = z
  .object({ status: z.number(), data: CourseSchema.nullable() })
  .passthrough();
export const CoursePageResponseSchema = z
  .object({ status: z.number(), data: CoursePageSchema })
  .passthrough();
export const CourseBatchResponseSchema = z
  .object({ status: z.number(), data: z.null() })
  .passthrough();

export type CreateCourseFormInput = z.input<typeof CreateCourseFormSchema>;
export type UpdateCourseFormInput = z.input<typeof UpdateCourseFormSchema>;
export type CreateCourseRequest = z.output<typeof CreateCourseRequestSchema>;
export type UpdateCourseRequest = z.output<typeof UpdateCourseRequestSchema>;
export type CourseBatchRequest = z.output<typeof CourseBatchRequestSchema>;
export type QueryCourseInput = z.input<typeof QueryCourseSchema>;
export type QueryCourse = z.output<typeof QueryCourseSchema>;
export type CourseSearch = z.input<typeof CourseSearchSchema>;
export type ICourse = z.infer<typeof CourseSchema>;
export type CoursePage = z.infer<typeof CoursePageSchema>;
export type CourseResponse = z.infer<typeof CourseResponseSchema>;
export type NullableCourseResponse = z.infer<
  typeof NullableCourseResponseSchema
>;
export type CoursePageResponse = z.infer<typeof CoursePageResponseSchema>;
export type CourseBatchResponse = z.infer<typeof CourseBatchResponseSchema>;
