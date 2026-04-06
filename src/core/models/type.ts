import { Category } from "@/interface/type";
import { API_URL } from "@/infra/container";

export const getCategories = async (
  type: string,
): Promise<Category[] | Error> => {
  const response = await fetch(`${API_URL}/type/list?type=${type}`);

  if (!response.ok) {
    return new Error("Failed to fetch categories");
  }

  const data = await response.json();
  return data.data;
};
