import { NewsRepository } from "./repositories/news.repository";
import { NewsService } from "@/core/service/news.service";

export const baseUrl = "http://localhost:8000/api";

const newsRepository = new NewsRepository(baseUrl);
export const newsService = new NewsService(newsRepository);
