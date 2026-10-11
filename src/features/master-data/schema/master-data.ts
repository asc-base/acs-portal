import { z } from "zod";
import { UserPrefixSchema } from "@/shared/schema/profile-response";
import {
  NewsCategorySchema,
  RoleSchema,
  TagGroupSchema,
  TagSchema,
} from "@/shared/schema/references";

export const TypeCourseSchema = z.object({
  id: z.number(),
  type: z.string(),
  description: z.string().nullable().optional(),
});

export const MasterDataSchema = z.object({
  roles: z.array(RoleSchema),
  typeCourses: z.array(TypeCourseSchema),
  tagsGroups: z.array(TagGroupSchema),
  tags: z.array(TagSchema),
  prefixes: z.array(UserPrefixSchema),
  newsCategories: z.array(NewsCategorySchema),
});

export type MasterData = z.infer<typeof MasterDataSchema>;
export type TypeCourse = z.infer<typeof TypeCourseSchema>;
