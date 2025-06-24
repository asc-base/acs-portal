import { Category } from "@/interface/type";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getCategories = async (): Promise<Category[] | Error> => {
  const response = await fetch(`${BASE_URL}/type`);
  
  if (!response.ok) {
    return new Error("Failed to fetch categories");
  }

  const data: Category[] = await response.json();
  return data;
};