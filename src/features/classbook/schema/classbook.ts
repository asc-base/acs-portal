import { z } from "zod";

export const CommonFocalPointSchema = z.object({
  imageFocalPointX: z.number().nullable().optional(),
  imageFocalPointY: z.number().nullable().optional(),
});

export const createClassbookSchema = z.object({
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
});

export const updateClassBookSchema = z.object({
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
});

export type CreateClassbookInputs = z.infer<typeof createClassbookSchema>;
export type UpdateClassbookInputs = z.infer<typeof updateClassBookSchema>;
