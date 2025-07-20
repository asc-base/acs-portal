import { getNews } from "@/core/models/news"; 

export const fetchNews = async (page: number, pageSize: number, category: string) => {
    try {
        const result = await getNews(page, pageSize, category);
        if (result instanceof Error) throw result;
        return result;
    }
    catch (error) {
        console.error("Error fetching all news:", error);
        return [];
    }
};