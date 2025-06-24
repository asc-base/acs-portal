import { News } from "@/interface/news";
import { getNews, getNewsById, postNews, patchNews, deleteNews} from "@/core/models/news"; 

export const fetchNews = async (): Promise<News[] | Error> => {
  const data = await getNews();
  if (data instanceof Error) {
    console.error("Error fetching all news:", data);
    return data;
  }
  return data;
};


export const fetchNewsById = async (id: string): Promise<News | Error> => {
  const data = await getNewsById(id);
  if (data instanceof Error) {
    console.error("Error fetching news by Id:", data);
    return data;
  }
  return data;
};


export const createNews = async (data: News): Promise<true | Error> => {
  const result = await postNews(data);
  if (result instanceof Error) {
    console.error("Error creating news:", result);
    return result;
  }
  return true;
};


export const updateNews = async (
  id: string,
  data: Partial<News>
): Promise<true | Error> => {
  const result = await patchNews(id, data);
  if (result instanceof Error) {
    console.error("Error patching news:", result);
    return result;
  }
  return true;
};

export const DeleteNews = async (id: string): Promise<true | Error> => {
  const result = await deleteNews(id);
  if (result instanceof Error) {
    console.error("Error deleting news:", result);
    return result;
  }
  return true;
};
