import z from "zod";
import { CommonUserSchema, CommonFocalPointSchema } from "@/shared/schema/user";
import { ProfessorResponseSchema } from "@/shared/schema/profile-response";
import { PageMetadataSchema } from "@/shared/schema/page-metadata";

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

const ProfessorFormSchema = z.object({
  prefixID: z.number().nullable().refine((v) => v !== null, { message: "กรุณาเลือกคำนำหน้าชื่อ" }),
  educations: z.array(z.object({ value: z.string().trim().min(1, "กรุณากรอกข้อมูล"), }),),
  expertFields: z.array(z.object({ value: z.string().trim().min(1, "กรุณากรอกข้อมูล"), }),),
  ...CommonUserSchema.shape,
  ...CommonProfessorSchema.shape,
});

export const CreateProfessorSchema = ProfessorFormSchema;
export const UpdateProfessorSchema = ProfessorFormSchema;

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
}).partial();

const queryNumber = z
  .union([z.number(), z.string()])
  .transform(Number)
  .pipe(z.number());

export const ProfessorQuerySchema = z.object({
  page: queryNumber.optional(),
  pageSize: queryNumber.optional(),
  educations: z.string().optional(),
  expertFields: z.string().optional(),
  majorPosition: z.string().optional(),
  academicPosition: z.string().optional(),
  search: z.string().optional(),
  searchBy: z.string().optional(),
});

export const ProfessorSearchSchema = z.object({
  search: z.string().optional(),
});

export const ProfessorPageSchema = z.object({
  rows: ProfessorResponseSchema.array(),
  ...PageMetadataSchema.shape,
});

export type CreateProfessorInputs = z.input<typeof CreateProfessorSchema>;
export type UpdateProfessorInputs = z.input<typeof UpdateProfessorSchema>;
export type CreateProfessorPayload = z.output<typeof CreateProfessorPayloadSchema>;
export type UpdateProfessorPayload = z.output<typeof UpdateProfessorPayloadSchema>;
export type QueryProfessorInput = z.input<typeof ProfessorQuerySchema>;
export type QueryProfessor = z.infer<typeof ProfessorQuerySchema>;
export type ProfessorSearch = z.infer<typeof ProfessorSearchSchema>;
export type ProfessorPage = z.infer<typeof ProfessorPageSchema>;
