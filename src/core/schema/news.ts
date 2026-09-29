import { z } from "zod";
import dayjs from "dayjs";

export const FocalPointSchema = z.object({
  thumbnailFocalPointX: z.number().optional(),
  thumbnailFocalPointY: z.number().optional(),
});

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
  thumbnail: z.file({ message: "กรุณาอัปโหลดภาพหน้าปก" }),
  additionalImages: z
    .array(z.file())
    .min(1, "กรุณาอัปโหลดรูปภาพเพิ่มเติมอย่างน้อย 1 รูป"),
  ...FocalPointSchema.shape,
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
  ...FocalPointSchema.shape,
});

export const UpdateNewsPayloadSchema = z.object({
  title: z.string().optional(),
  tagID: z.number().optional(),
  thumbnail: z.union([z.string().trim().min(1), z.file()]).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  detail: z.string().optional(),
  ...FocalPointSchema.shape,
  newAdditionalImages: z.array(z.file()).optional(),
  deletedAdditionalImagesId: z.array(z.number()).optional(),
});

export const CreateNewsInformationSchema = (type: string) =>
  z.object({
    thumbnail: z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ" }),
    highlight:
      type === "newshighlight"
        ? z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ" })
        : z.instanceof(File).optional(),
    newsID: z.number().min(1, "กรุณาเลือกข่าว"),
  });

export type CreateNewsInputs = z.infer<typeof CreateNewsSchema>;
export type UpdateNewsInputs = z.infer<typeof UpdateNewsSchema>;
export type UpdateNewsPayload = z.infer<typeof UpdateNewsPayloadSchema>;
export type CreateNewsInformationInputs = z.infer<
  ReturnType<typeof CreateNewsInformationSchema>
>;
