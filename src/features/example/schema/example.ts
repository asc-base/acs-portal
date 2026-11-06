import { z } from "zod";

export const ExamplePostSchema = z
  .object({
    userId: z.number(),
    id: z.number(),
    title: z.string(),
    body: z.string(),
  })
  .passthrough();

export type IExample = z.infer<typeof ExamplePostSchema>;
