import { News } from "@/interface/news";
const BASE_URL = "http://localhost:8000";


export const getNews = async (): Promise<News[] | Error> => {
  const response = await fetch(`${BASE_URL}/news`);
  
  if (!response.ok) {
    return new Error("Failed to fetch all news");
  }

  const data: News[] = await response.json();
  return data;
};


export const getNewsById = async (id: string): Promise<News| Error> => {
  const response = await fetch(`${BASE_URL}/news/${id}`);
  if (!response.ok) {
      return new Error("Failed to fetch news by ID");
    }
    const data: News = await response.json();
    return data;
};

export const postNews = async (data: News): Promise<true | Error> => {
  const response = await fetch(`${BASE_URL}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return new Error(`Failed to post news: ${response.status} ${response.statusText}`);
  }
  return true; 
};


export const patchNews = async (
  id: string,
  data: Partial<News>
): Promise<true | Error> => {
  const response = await fetch(`${BASE_URL}/news/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return new Error(`Failed to patch news: ${response.status} ${response.statusText}`);
  }

  return true;
};


export const deleteNews = async (id: string): Promise<true | Error> => {
  const response = await fetch(`${BASE_URL}/news/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    return new Error(`Failed to delete news: ${response.status} ${response.statusText}`);
  }

  return true;
};
