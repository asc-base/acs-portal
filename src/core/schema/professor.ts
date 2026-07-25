import z from "zod";

export const ProfessorCreateSchema = z.object({
  academicPositionID: z.number().nullable().refine((v) => v !== null, {message: "กรุณากรอกตำแหน่ง",}),
  educations: z.array(z.object({value: z.string().trim().min(1, "กรุณากรอกข้อมูล"),}),),
  expertFields: z.array(z.object({value: z.string().trim().min(1, "กรุณากรอกข้อมูล"),}),),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง"),
  firstNameEn: z.string().trim().regex(/^[a-zA-Z\s]*$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น").optional().or(z.literal("")),
  firstNameTh: z.string().trim().min(1, "กรุณากรอกชื่อภาษาไทย").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
  lastNameEn: z.string().trim().regex(/^[a-zA-Z\s]*$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น").optional().or(z.literal("")),
  lastNameTh: z.string().trim().min(1, "กรุณากรอกนามสกุลภาษาไทย").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
  phone: z.string().trim().regex(/^0[0-9]{8,9}$/, "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก และขึ้นต้นด้วย 0"),
  profRoom: z.string().min(1, "กรุณากรอกชื่อห้อง"),
});


export const ProfessorInfoSchema = z.object({
  firstNameTh: z.string().min(1, "กรุณากรอกชื่อ (ภาษาไทย)").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
  lastNameTh: z.string().min(1, "กรุณากรอกนามสกุล (ภาษาไทย)").regex(/^[ก-๙\s]+$/, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
  firstNameEn: z.string().min(1, "กรุณากรอกชื่อ (ภาษาอังกฤษ)").regex(/^[a-zA-Z\s]+$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น"),
  lastNameEn: z.string().min(1, "กรุณากรอกนามสกุล (ภาษาอังกฤษ)").regex(/^[a-zA-Z\s]+$/, "กรุณากรอกเป็นภาษาอังกฤษเท่านั้น"),
  phone: z.string().regex(/^0[0-9]{8,9}$/, "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก และขึ้นต้นด้วย 0"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  academicPositionID: z.number().min(1, "กรุณากรอกตำแหน่ง"),
  profRoom: z.string().min(1, "กรุณากรอกห้องพักอาจารย์"),
  education: z.array(z.object({value: z.string().trim().min(1, "กรุณากรอกข้อมูล"),}),),
  expertFields: z.array(z.object({value: z.string().trim().min(1, "กรุณากรอกข้อมูล"),}),),
});

export type ProfessorCreateSchemaType = z.infer<typeof ProfessorCreateSchema>;
export type ProfessorInfoSchemaType = z.infer<typeof ProfessorInfoSchema>;