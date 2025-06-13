import { IExample } from "@/interface/example";
import { getExampleData } from "@/core/models/example";

export const fetchExampleData = async (): Promise<IExample[] | Error> => {
  const data = await getExampleData();
  if (data instanceof Error) {
    console.error("Error fetching example data:", data);
    return data;
  }
  return data;
};
