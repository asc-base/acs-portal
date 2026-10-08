import { IExample } from "@/features/example/types/example";
import { getExampleData } from "@/features/example/models/example";

export const fetchExampleData = async (): Promise<IExample[] | Error> => {
  const data = await getExampleData();
  if (data instanceof Error) {
    console.error("Error fetching example data:", data);
    return data;
  }
  return data;
};
