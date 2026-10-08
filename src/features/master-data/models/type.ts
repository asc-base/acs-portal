import { Category } from "@/shared/types/type";
import "server-only";
import { getServerApiOrigin } from "@/shared/config/api.server";

export const getCategories = async (
  type: string,
): Promise<Category[] | Error> => {
  const response = await fetch(`${getServerApiOrigin()}/type/list?type=${type}`);

  if (!response.ok) {
    return new Error("Failed to fetch categories");
  }

  const data = await response.json();
  return data.data;
};
