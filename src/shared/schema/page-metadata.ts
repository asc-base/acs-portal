import { z } from "zod";

export const PageMetadataSchema = z.object({
  totalRecords: z.number(),
  page: z.number(),
  pageSize: z.number(),
});
