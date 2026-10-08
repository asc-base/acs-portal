import { z } from "zod";
import { CurriculumSchema } from "@/features/curriculum/schema/curriculum";
import { CommonFocalPointSchema } from "@/shared/schema/user";

const queryPageNumber = z
  .union([z.number(), z.string()])
  .transform(Number)
  .pipe(z.number().int().min(1));

const classbookFormFields = {
  classof: z
    .string()
    .min(1, "กรุณากรอกรุ่นการศึกษา")
    .regex(/^[0-9]+$/, "กรุณากรอกแค่ตัวเลข"),
  firstYearAcademic: z
    .string()
    .min(1, "กรุณากรอกปีการศึกษา")
    .regex(/^[0-9]+$/, "กรุณากรอกแค่ตัวเลข")
    .regex(/^\d{4}$/, "กรุณากรอกปีการศึกษาให้ถูกต้อง"),
  curriculumID: z.number().min(1, "กรุณาเลือกหลักสูตร"),
  ...CommonFocalPointSchema.shape,
};

export const createClassbookSchema = z.object(classbookFormFields);
export const updateClassBookSchema = z.object(classbookFormFields);

export const CreateClassbookRequestSchema = createClassbookSchema.extend({
  thumbnailFile: z.file(),
});
export const UpdateClassbookDataSchema = updateClassBookSchema.partial();
export const UpdateClassbookRequestSchema = UpdateClassbookDataSchema.extend({
  thumbnailFile: z.file().optional(),
});

export const ClassBookQuerySchema = z.object({
  page: queryPageNumber.optional(),
  pageSize: queryPageNumber.optional(),
  orderBy: z.string().optional(),
  sortBy: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  searchBy: z.string().optional(),
  curriculumID: queryPageNumber.optional(),
});
export const ClassBookIdSchema = z.number().int().min(1);

export const ClassBookSchema = z.object({
  id: z.number(),
  classof: z.string(),
  firstYearAcademic: z.string(),
  thumbnailURL: z.string(),
  thumbnailContentType: z.string().nullable().optional(),
  imageFocalPointX: z.number().nullable().optional(),
  imageFocalPointY: z.number().nullable().optional(),
  curriculumID: z.number(),
  curriculum: CurriculumSchema,
});

export const ClassBookPageSchema = z.object({
  rows: z.array(ClassBookSchema),
  totalRecords: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const ClassBookResponseSchema = z
  .object({ data: ClassBookSchema })
  .passthrough();
export const NullableClassBookResponseSchema = z
  .object({ data: ClassBookSchema.nullable() })
  .passthrough();
export const ClassBookPageResponseSchema = z
  .object({ data: ClassBookPageSchema })
  .passthrough();

export type CreateClassbookInputs = z.input<typeof createClassbookSchema>;
export type CreateClassbookData = z.output<typeof createClassbookSchema>;
export type UpdateClassbookInputs = z.input<typeof updateClassBookSchema>;
export type UpdateClassbookData = z.output<typeof UpdateClassbookDataSchema>;
export type CreateClassbookRequest = z.output<
  typeof CreateClassbookRequestSchema
>;
export type UpdateClassbookRequest = z.output<
  typeof UpdateClassbookRequestSchema
>;
export type QueryClassBookInput = z.input<typeof ClassBookQuerySchema>;
export type QueryClassBook = z.output<typeof ClassBookQuerySchema>;
export type ClassBookId = z.infer<typeof ClassBookIdSchema>;
export type IClassBook = z.infer<typeof ClassBookSchema>;
export type ClassBookPage = z.infer<typeof ClassBookPageSchema>;
export type ClassBookResponse = z.infer<typeof ClassBookResponseSchema>;
export type NullableClassBookResponse = z.infer<
  typeof NullableClassBookResponseSchema
>;
export type ClassBookPageResponse = z.infer<typeof ClassBookPageResponseSchema>;
