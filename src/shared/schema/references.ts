import { z } from "zod";

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  tagsGroupsId: z.number(),
});

export const TagGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  tags: z.array(TagSchema),
});

export const NewsCategorySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
});

export type Role = z.infer<typeof RoleSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type TagsGroup = z.infer<typeof TagGroupSchema>;
export type NewsCategory = z.infer<typeof NewsCategorySchema>;
