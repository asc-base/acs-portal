import { getNews, createNews, deleteNews } from "@/core/models/news";
import { ICreateNews } from "@/interface/news";

export const fetchNews = async (page: number, pageSize: number) => {
  try {
    const result = await getNews(page, pageSize);
    if (result instanceof Error) throw result;
    return result;
  } catch (error) {
    console.error("Error fetching all news:", error);
    return [];
  }
};
export const CreateNews = async (
  newsData: ICreateNews,
  token: string,
  file: File,
) => {
  try {
    const formData = new FormData();
    formData.append("title", newsData.title);
    formData.append("categoryId", newsData.categoryId.toString());
    formData.append("startDate", new Date(newsData.startDate).toISOString());
    formData.append(
      "dueDate",
      newsData.dueDate ? new Date(newsData.dueDate).toISOString() : "",
    );
    if (file) {
      formData.append("image", file);
    }
    formData.append("detail", newsData.detail);
    const result = await createNews(formData, token);

    console.log(result);

    return result;
  } catch (error) {
    console.error("Error creating news:", error);
    return null;
  }
};

export const useDeleteNews = async (id: string, token: string) => {
  try {
    const result = await deleteNews(id, token);
    if (result instanceof Error) throw result;
    return result;
  } catch (error) {
    console.error("Error deleting news:", error);
  }
};
