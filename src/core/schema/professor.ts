import z from "zod";
import { CommonUserSchema, CommonFocalPointSchema } from "./user";

const researchProfileURL = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    if (!/^https?:\/\//i.test(value)) return false;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) && !!url.hostname;
    } catch {
      return false;
    }
  }, "กรุณากรอก URL แบบเต็มที่ขึ้นต้นด้วย http:// หรือ https://");

export const CommonProfessorSchema = z.object({
  phone: z.string().trim().regex(/^0[0-9]{8,9}$/, "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก และขึ้นต้นด้วย 0"),
  profRoom: z.string().trim().min(1, "กรุณากรอกชื่อห้อง"),
  research_profile: researchProfileURL.optional(),
});

export const CreateProfessorSchema = z.object({
  prefixID: z.number().nullable().refine((v) => v !== null, { message: "กรุณาเลือกคำนำหน้าชื่อ" }),
  educations: z.array(z.object({ value: z.string().trim().min(1, "กรุณากรอกข้อมูล"), }),),
  expertFields: z.array(z.object({ value: z.string().trim().min(1, "กรุณากรอกข้อมูล"), }),),
  ...CommonUserSchema.shape,
  ...CommonProfessorSchema.shape,
  ...CommonFocalPointSchema.shape,
});


export const UpdateProfessorSchema = z.object({
  prefixID: z.number().nullable().refine((v) => v !== null, { message: "กรุณาเลือกคำนำหน้าชื่อ" }),
  educations: z.array(z.object({ value: z.string().trim().min(1, "กรุณากรอกข้อมูล"), }),),
  expertFields: z.array(z.object({ value: z.string().trim().min(1, "กรุณากรอกข้อมูล"), }),),
  ...CommonUserSchema.shape,
  ...CommonProfessorSchema.shape,
  ...CommonFocalPointSchema.shape,
});

export const CreateProfessorPayloadSchema = z.object({
  prefixID: z.number(),
  educations: z.string().optional(),
  email: z.string(),
  expertFields: z.string().optional(),
  firstNameEn: z.string().nullable().optional(),
  firstNameTh: z.string(),
  image: z.string().optional(),
  lastNameEn: z.string().nullable().optional(),
  lastNameTh: z.string(),
  phone: z.string(),
  profRoom: z.string(),
  research_profile: z.string().nullable().optional(),
  ...CommonFocalPointSchema.shape,
});

export const UpdateProfessorPayloadSchema = z.object({
  id: z.number(),
  prefixID: z.number(),
  profRoom: z.string(),
  phone: z.string(),
  firstNameTh: z.string(),
  lastNameTh: z.string(),
  firstNameEn: z.string().nullable(),
  lastNameEn: z.string().nullable(),
  email: z.string(),
  expertFields: z.string().optional(),
  educations: z.string().optional(),
  research_profile: z.string().nullable().optional(),
  ...CommonFocalPointSchema.shape,
});

export type CreateProfessorInputs = z.infer<typeof CreateProfessorSchema>;
export type UpdateProfessorInputs = z.infer<typeof UpdateProfessorSchema>;
export type CreateProfessorPayload = z.infer<typeof CreateProfessorPayloadSchema>;
export type UpdateProfessorPayload = z.infer<typeof UpdateProfessorPayloadSchema>;
