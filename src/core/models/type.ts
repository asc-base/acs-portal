import { Category } from "@/interface/type";

const BASE_URL = "http://localhost:8000";

export const getCategories = async (type:string): Promise<Category[] | Error> => {
  const response = await fetch(`${BASE_URL}/type/list?type=${type}`);
  
  if (!response.ok) {
    return new Error("Failed to fetch categories");
  }

  const data = await response.json();
  return data.data;
};
