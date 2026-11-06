import "server-only";
import { ExamplePostSchema } from "@/features/example/schema/example";
import type { IExample } from "@/features/example/types/example";
const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getExampleData = async (): Promise<IExample[] | Error> => {
  const response = await fetch(`${BASE_URL}/posts`);
  if (!response.ok) {
    return new Error("Failed to fetch example data");
  }
  const data: unknown = await response.json();
  return ExamplePostSchema.array().parse(data);
};
