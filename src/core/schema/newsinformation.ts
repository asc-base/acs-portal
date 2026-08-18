import { z } from "zod";

export const UpsertNewsInformationSchema = z.object({
  newsID: z.number().min(1, "กรุณาเลือกข่าว"),
  thumbnail: z.union([z.string().trim().min(1), z.instanceof(File)], {
    message: "กรุณาอัปโหลดรูปภาพ Thumbnail",
  }),
  highlight: z.union([z.string().trim().min(1), z.instanceof(File)]).optional(),
  thumbnailFocalPointX: z.number().optional(),
  thumbnailFocalPointY: z.number().optional(),
  highlightFocalPointX: z.number().optional(),
  highlightFocalPointY: z.number().optional(),
});

export type UpsertNewsInformationInputs = z.infer<typeof UpsertNewsInformationSchema>;
