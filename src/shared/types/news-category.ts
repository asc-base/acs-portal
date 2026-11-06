import type { z } from "zod";
import { NewsCategorySchema } from "@/shared/schema/references";

export type NewsCategory = z.infer<typeof NewsCategorySchema>;
