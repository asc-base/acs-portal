import type { z } from "zod";
import { UserPrefixSchema } from "@/shared/schema/profile-response";
import { RoleSchema } from "@/shared/schema/references";

export type { MasterData, TypeCourse } from "@/features/master-data/schema/master-data";
export type Position = z.infer<typeof UserPrefixSchema>;
export type Role = z.infer<typeof RoleSchema>;
