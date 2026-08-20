import z from "zod";

export const PositionSchema = z.object({
  id: z.number(),
  sequence: z.number(),
  nameTh: z.string(),
  nameEn: z.string(),
  shortNameTh: z.string(),
  shortNameEn: z.string(),
});

export type PositionResponse = z.infer<typeof PositionSchema>;