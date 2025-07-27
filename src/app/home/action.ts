import { fetchNews } from "@/core/viewmodels/news";

export const getNews = async (page: number, pageSize: number, category: string) => {
    try {
        const data = await fetchNews(page, pageSize, category);
        return data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};
