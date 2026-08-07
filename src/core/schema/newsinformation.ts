import { z } from "zod";

export const CreateNewsInformationSchema = z.object({
  newsID: z.number().min(1, "กรุณาเลือกข่าว"),
  thumbnail: z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ Thumbnail" }),
  highlight: z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ Highlight" }).optional(),
});

export const UpdateNewsInformationSchema = z.object({
  newsID: z.number().min(1, "กรุณาเลือกข่าว"),
  thumbnail: z.union([z.string().trim().min(1), z.instanceof(File)], {
    message: "กรุณาอัปโหลดรูปภาพ Thumbnail",
  }),
  highlight: z.union([z.string().trim().min(1), z.instanceof(File)]).optional(),
});

export type CreateNewsInformationInputs = z.infer<typeof CreateNewsInformationSchema>;
export type UpdateNewsInformationInputs = z.infer<typeof UpdateNewsInformationSchema>;
