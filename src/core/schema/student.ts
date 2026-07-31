import { z } from "zod";
import { CommonUserFields } from "./user";

export const CommonStudentField = z.object({
    studentCode: z.string().trim().max(11, "กรุณากรอกรหัสนักศึกษาให้ครบ 11 หลัก").regex(/^[0-9]+$/, "รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น"),
    facebook: z.string().trim().optional(),
    linkedin: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
    github: z.string().trim().optional(),
});

export const CreateStudentSchema = z.object({
    ...CommonUserFields.shape,
    ...CommonStudentField.shape,
    // otherProjects: z
    //   .array(
    //     z.object({
    //       value: z.string().trim(),
    //     }),
    //   )
    //   .optional(),
});

export const UpdateStudentSchema = z.object({
    ...CommonUserFields.shape,
    ...CommonStudentField.shape,
    // otherProjects: z
    //   .array(
    //     z.object({
    //       value: z.string().trim(),
    //     }),
    //   )
    //   .optional(),
});

export type CommonStudentInputs = z.infer<typeof CommonStudentField>;
export type CreateStudentInputs = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInputs = z.infer<typeof UpdateStudentSchema>;