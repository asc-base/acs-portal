import "server-only";
import { getServerApiOrigin } from "@/shared/config/api.server";
import { INews } from "@/features/news/types/news";
import { Pageable } from "@/shared/types/response";

export const createNews = async (news: FormData, token: string) => {
  const response = await fetch(`${getServerApiOrigin()}/news`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: news,
  });

  const data = await response.json();
  return data;
};

export const getNews = async (
  page: number,
  pageSize: number,
  category: string,
): Promise<Pageable<INews>> => {
  const response = await fetch(
    `${getServerApiOrigin()}/news?page=${page}&pageSize=${pageSize}&category=${category}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch all news");
  }

  const data = await response.json();
  return data.data;
};

export const deleteNews = async (id: string, token: string): Promise<INews> => {
  const response = await fetch(`${getServerApiOrigin()}/news/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete news");
  }

  const data = await response.json();
  return data.data;
};
