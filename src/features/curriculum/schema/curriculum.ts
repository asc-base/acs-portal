import { z } from "zod";
import { PageMetadataSchema } from "@/shared/schema/page-metadata";

const documentURLField = z
  .string()
  .trim()
  .min(1, "กรุณาระบุลิงก์ไฟล์หลักสูตร")
  .pipe(z.url("กรุณาระบุลิงก์ที่ถูกต้อง"));

const CommonCurriculumSchema = z.object({
  title: z.string().trim().min(1, "กรุณาระบุชื่อหลักสูตร"),
  year: z.string().min(1, "กรุณาระบุปีการศึกษา"),
  documentURL: documentURLField,
  description: z.string().trim().min(1, "กรุณาระบุรายละเอียด"),
  thumbnailFocalPointX: z.number().optional(),
  thumbnailFocalPointY: z.number().optional(),
});

export const CreateCurriculumSchema = CommonCurriculumSchema;
export const CreateCurriculumRequestSchema = CreateCurriculumSchema.extend({
  thumbnailFile: z.file(),
});
export const UpdateCurriculumSchema = CommonCurriculumSchema.partial();
export const UpdateCurriculumRequestSchema = UpdateCurriculumSchema.extend({
  thumbnailFile: z.file().optional(),
});

const queryPageNumber = z
  .union([z.number(), z.string()])
  .transform(Number)
  .pipe(z.number().int().min(1));

export const QueryCurriculumSchema = z.object({
  page: queryPageNumber.optional(),
  pageSize: queryPageNumber.optional(),
  year: z.string().optional(),
  orderBy: z.string().optional(),
  sortBy: z.enum(["asc", "desc"]).optional(),
});
export const CurriculumIdSchema = z.number().int().min(1);

export const CurriculumSchema = z.object({
  id: z.number(),
  year: z.string(),
  title: z.string(),
  documentURL: z.string(),
  description: z.string(),
  thumbnailURL: z.string(),
  thumbnailContentType: z.string().nullable().optional(),
  thumbnailFocalPointX: z.number().nullable().optional(),
  thumbnailFocalPointY: z.number().nullable().optional(),
});

export const CurriculumPageSchema = z.object({
  rows: z.array(CurriculumSchema),
  ...PageMetadataSchema.shape,
});

export const CurriculumResponseSchema = z
  .object({ data: CurriculumSchema })
  .passthrough();
export const NullableCurriculumResponseSchema = z
  .object({ data: CurriculumSchema.nullable() })
  .passthrough();
export const CurriculumPageResponseSchema = z
  .object({ data: CurriculumPageSchema })
  .passthrough();

export type CreateCurriculumInputs = z.input<typeof CreateCurriculumSchema>;
export type CreateCurriculumData = z.output<typeof CreateCurriculumSchema>;
export type CreateCurriculumRequest = z.output<
  typeof CreateCurriculumRequestSchema
>;
export type UpdateCurriculumInputs = z.input<typeof UpdateCurriculumSchema>;
export type UpdateCurriculumData = z.output<typeof UpdateCurriculumSchema>;
export type UpdateCurriculumRequest = z.output<
  typeof UpdateCurriculumRequestSchema
>;
export type QueryCurriculumInput = z.input<typeof QueryCurriculumSchema>;
export type QueryCurriculum = z.output<typeof QueryCurriculumSchema>;
export type CurriculumId = z.infer<typeof CurriculumIdSchema>;
export type ICurriculum = z.infer<typeof CurriculumSchema>;
export type CurriculumPage = z.infer<typeof CurriculumPageSchema>;
export type CurriculumResponse = z.infer<typeof CurriculumResponseSchema>;
export type NullableCurriculumResponse = z.infer<
  typeof NullableCurriculumResponseSchema
>;
export type CurriculumPageResponse = z.infer<
  typeof CurriculumPageResponseSchema
>;
