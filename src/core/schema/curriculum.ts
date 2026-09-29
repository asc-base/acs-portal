import { z } from "zod";

const documentURLField = z
  .string()
  .trim()
  .min(1, "กรุณาระบุลิงก์ไฟล์หลักสูตร")
  .pipe(z.url("กรุณาระบุลิงก์ที่ถูกต้อง"));

export const CommonCurriculumSchema = z.object({
  title: z.string().trim().min(1, "กรุณาระบุชื่อหลักสูตร"),
  year: z.string().min(1, "กรุณาระบุปีการศึกษา"),
  documentURL: documentURLField,
  description: z.string().trim().min(1, "กรุณาระบุรายละเอียด"),
  thumbnailFocalPointX: z.number().optional(),
  thumbnailFocalPointY: z.number().optional(),
});

export const CreateCurriculumSchema = CommonCurriculumSchema;

export const UpdateCurriculumSchema = CommonCurriculumSchema.partial();

export type CreateCurriculumInputs = z.infer<typeof CreateCurriculumSchema>;
export type UpdateCurriculumInputs = z.infer<typeof UpdateCurriculumSchema>;