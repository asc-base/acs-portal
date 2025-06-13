import { IExample } from "@/interface/example";
const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getExampleData = async (): Promise<IExample[] | Error> => {
  const response = await fetch(`${BASE_URL}/posts`);
  if (!response.ok) {
    return new Error("Failed to fetch example data");
  }
  const data: IExample[] = await response.json();
  return data;
};
