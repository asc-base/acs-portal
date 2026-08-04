import { z } from "zod";
import dayjs from "dayjs";

export const CreateNewsSchema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อ"),
  detail: z.string().min(1, "กรุณากรอกรายละเอียด"),
  tagID: z.number().min(1, "กรุณาเลือกหมวดหมู่"),
  startDate: z
    .string()
    .min(1, "กรุณาเลือกวันที่เริ่มต้น")
    .refine((val) => dayjs(val).isValid(), {
      message: "รูปแบบวันที่ไม่ถูกต้อง",
    }),
  dueDate: z.string().optional(),
  thumbnail: z.file().optional(),
  highlight: z.file().optional(),
});

export const UpdateNewsSchema = z.object({
  title: z.string(),
  startDate: z
    .string()
    .min(1, "กรุณาเลือกวันที่เริ่มต้น")
    .refine((val) => dayjs(val).isValid(), {
      message: "รูปแบบวันที่ไม่ถูกต้อง",
    }),
  dueDate: z.string().optional(),
  tag: z.number(),
  detail: z.string().optional(),
  thumbnail: z.union([z.string().trim().min(1), z.file()]),
  highlight: z.union([z.string().trim().min(1), z.file()]),
});

export const UpsertNewsInformationSchema = z.object({
  id: z.number().optional(),
  thumbnail: z.union([z.instanceof(File), z.string().trim().min(1)]).optional(),
  newsID: z.number().min(1, "กรุณาเลือกข่าว"),
  tagID: z.number().min(1, "กรุณาเลือกหมวดหมู่"),
});

export type CreateNewsInputs = z.infer<typeof CreateNewsSchema>;
export type UpdateNewsInputs = z.infer<typeof UpdateNewsSchema>;
export type UpsertNewsInformationInputs = z.infer<typeof UpsertNewsInformationSchema>;