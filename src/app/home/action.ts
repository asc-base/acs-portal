import { fetchNews } from "@/core/viewmodels/news";
import { News } from "@/interface/news";

export const getNews = async (page: number, pageSize: number, category: string): Promise<News[]> => {
    try {
        const data = await fetchNews(page, pageSize, category);
        return data.rows;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};
