"use server";

import { News } from "@/interface/news";
import { fetchNewsById, createNews, updateNews, DeleteNews} from "@/core/viewmodels/news";

export async function getNewsById(id: string) {
  try {
    const data = await fetchNewsById(id);
    return data;
  } catch (error) {
    console.error(`Error fetching news with ID ${id}:`, error);
    throw error;
  }
}

export async function postNews(data: News) {
  try {
    await createNews(data);
    const message = "News created successfully.";
    console.log(message);
    return message;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
}

export async function patchNews(id: string, data: Partial<News>) {
  try {
    await updateNews(id, data);
    const message = `News with ID ${id} updated successfully.`;
    console.log(message);
    return message;
  } catch (error) {
    console.error(`Error updating news with ID ${id}:`, error);
    throw error;
  }
}

