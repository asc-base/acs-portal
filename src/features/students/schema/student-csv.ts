import { z } from "zod";

export const CreateStudentCsvSchema = z.object({
  studentCode: z
    .string()
    .trim()
    .length(11, "รหัสนักศึกษาต้องมี 11 หลัก")
    .regex(/^[0-9]+$/, "รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น"),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง"),
  firstNameTh: z.string().trim().min(1, "ข้อมูลชื่อภาษาไทยไม่ถูกต้อง"),
  lastNameTh: z.string().trim().min(1, "ข้อมูลนามสกุลภาษาไทยไม่ถูกต้อง"),
  firstNameEn: z.string().trim().optional(),
  lastNameEn: z.string().trim().optional(),
  nickName: z.string().trim().optional(),
});

export type CreateStudentCsv = z.infer<typeof CreateStudentCsvSchema>;
