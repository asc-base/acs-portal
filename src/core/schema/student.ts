import { z } from "zod";
import { CommonUserSchema } from "./user";

const optionalSocialLink = (hostname: RegExp, message: string) =>
    z.string().trim().pipe(
        z.union([
            z.literal(""),
            z.url({ protocol: /^https?$/, hostname, error: message }),
        ], { error: message }),
    ).optional();

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
    prefixID: z.number().nullable().refine((v) => v !== null, { message: "กรุณาเลือกคำนำหน้าชื่อ" }),
    ...CommonUserSchema.shape,
    ...CommonStudentSchema.shape,
    facebook: optionalSocialLink(
        /^(?:[a-z0-9-]+\.)*facebook\.com$/i,
        "กรุณากรอกลิงก์ Facebook ให้ถูกต้อง เช่น https://www.facebook.com/username",
    ),
    instagram: optionalSocialLink(
        /^(?:[a-z0-9-]+\.)*instagram\.com$/i,
        "กรุณากรอกลิงก์ Instagram ให้ถูกต้อง เช่น https://www.instagram.com/username",
    ),
    // otherProjects: z
    //   .array(
    //     z.object({
    //       value: z.string().trim(),
    //     }),
    //   )
    //   .optional(),
});

export const UpdateStudentSchema = z.object({
    prefixID: z.number().nullable().refine((v) => v !== null, { message: "กรุณาเลือกคำนำหน้าชื่อ" }),
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
