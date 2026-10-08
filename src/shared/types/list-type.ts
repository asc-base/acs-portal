import type { z } from "zod";
import { TagGroupSchema, TagSchema } from "@/shared/schema/references";

export type Tag = z.infer<typeof TagSchema>;
export type TagsGroups = z.infer<typeof TagGroupSchema>;
