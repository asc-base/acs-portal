import { API_URL } from "@/config/config";
import { News } from "@/interface/news";

export const getNews = async (page: number , pageSize : number , category : string): Promise<News[] | Error> => {
  const response = await fetch(`${API_URL}/news?page=${page}&pageSize=${pageSize}&category=${category}`);
  
  if (!response.ok) {
    return new Error("Failed to fetch all news");
  }

  const data = await response.json();
  return data.data.rows;
};

export const deleteNews = async (id: string, token: string): Promise<News | Error> => {
  const response = await fetch(`${API_URL}/news/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  }
  )

  if (!response.ok) {
    return new Error("Failed to delete news");
  }

  const data = await response.json();
  return data.data;
}

