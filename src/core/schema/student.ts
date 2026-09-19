import { z } from "zod";
import { CommonUserSchema } from "./user";

export const CommonStudentSchema = z.object({
    studentCode: z.string().trim().max(11, "กรุณากรอกรหัสนักศึกษาให้ครบ 11 หลัก").regex(/^[0-9]+$/, "รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น"),
    facebook: z.string().trim().optional(),
    linkedin: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
    github: z.string().trim().optional(),
    skills: z.array(z.string()).optional(),
    imageFocalPointX: z.number().optional(),
    imageFocalPointY: z.number().optional(),
});

export const CreateStudentSchema = z.object({
    ...CommonUserSchema.shape,
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
    ...CommonUserSchema.shape,
    ...CommonStudentSchema.shape,
    // otherProjects: z
    //   .array(
    //     z.object({
    //       value: z.string().trim(),
    //     }),
    //   )
    //   .optional(),
});

export type CreateStudentInputs = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInputs = z.infer<typeof UpdateStudentSchema>;