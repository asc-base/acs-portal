import { z } from "zod";

export const CommonStudentSchema = z.object({
    studentCode: z.string().trim().max(11, "กรุณากรอกรหัสนักศึกษาให้ครบ 11 หลัก").regex(/^[0-9]+$/, "รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น"),
    facebook: z.string().trim().optional(),
    linkedin: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
    github: z.string().trim().optional(),
});

export const CreateStudentSchema = z.object({
    firstNameTh: z.string().trim().min(1, "กรุณากรอกชื่อภาษาไทย").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
    lastNameTh: z.string().trim().min(1, "กรุณากรอกนามสกุลภาษาไทย").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
    firstNameEn: z.string().trim().min(1, "กรุณากรอกชื่อภาษาอังกฤษ").regex(/^[A-Za-z\s]+$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น"),
    lastNameEn: z.string().trim().min(1, "กรุณากรอกนามสกุลภาษาอังกฤษ").regex(/^[A-Za-z\s]+$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น"),
    nickName: z.string().trim().optional(),
    email: z.string().trim().lowercase().email("อีเมลไม่ถูกต้อง"),
    ...CommonStudentSchema.shape,
    // otherProjects: z
    //   .array(
    //     z.object({
    //       value: z.string().trim(),
    //     }),
    //   )
    //   .optional(),
});

export const UpdateStudentSchema = z.object({
    firstNameTh: z.string().trim().min(1, "กรุณากรอกชื่อภาษาไทย").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
    lastNameTh: z.string().trim().min(1, "กรุณากรอกนามสกุลภาษาไทย").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
    firstNameEn: z.string().trim().min(1, "กรุณากรอกชื่อภาษาอังกฤษ").regex(/^[A-Za-z\s]+$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น"),
    lastNameEn: z.string().trim().min(1, "กรุณากรอกนามสกุลภาษาอังกฤษ").regex(/^[A-Za-z\s]+$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น"),
    nickName: z.string().trim().optional(),
    email: z.string().trim().lowercase().email("อีเมลไม่ถูกต้อง"),
    ...CommonStudentSchema.shape,
    // otherProjects: z
    //   .array(
    //     z.object({
    //       value: z.string().trim(),
    //     }),
    //   )
    //   .optional(),
});

export type CommonStudentInputs = z.infer<typeof CommonStudentSchema>;
export type CreateStudentInputs = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInputs = z.infer<typeof UpdateStudentSchema>;