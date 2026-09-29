import z from "zod";

export const CommonFocalPointSchema = z.object({
    imageFocalPointX: z.number().nullable().optional(),
    imageFocalPointY: z.number().nullable().optional(),
});

export const CommonUserSchema = z.object({
    firstNameEn: z.string().trim().regex(/^[a-zA-Z\s]*$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น").optional().or(z.literal("")),
    firstNameTh: z.string().trim().min(1, "กรุณากรอกชื่อภาษาไทย").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
    lastNameEn: z.string().trim().regex(/^[a-zA-Z\s]*$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น").optional().or(z.literal("")),
    lastNameTh: z.string().trim().min(1, "กรุณากรอกนามสกุลภาษาไทย").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
    email: z.string().trim().toLowerCase().email("อีเมลไม่ถูกต้อง"),
    nickName: z.string().trim().optional(),
    ...CommonFocalPointSchema.shape,
});

export type CommonUserInputs = z.infer<typeof CommonUserSchema>;