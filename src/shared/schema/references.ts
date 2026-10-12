import { z } from "zod";

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const NewsCategorySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
});

export type Role = z.infer<typeof RoleSchema>;
export type NewsCategory = z.infer<typeof NewsCategorySchema>;

export const ProjectLookupSchema = z.object({ id: z.number(), name: z.string() });
export type ProjectLookup = z.infer<typeof ProjectLookupSchema>;
