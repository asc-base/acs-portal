import { API_URL } from "@/config/config";
import { News } from "@/interface/news";


export const getNews = async (page: number , pageSize : number): Promise<News[] | Error> => {
  const response = await fetch(`${API_URL}/news?page=${page}&pageSize=${pageSize}`);
  
  if (!response.ok) {
    return new Error("Failed to fetch all news");
  }

  const data = await response.json();
  return data.data;
};
