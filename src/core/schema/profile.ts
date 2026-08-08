import { z } from "zod";

export const profileFormSchema = z.object({
  github: z.string(),
  linkedin: z.string(),
  facebook: z.string(),
  instagram: z.string(),
  projects: z.array(z.object({ title: z.string() })).optional(),
  file: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
  skills: z.array(z.string()),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
