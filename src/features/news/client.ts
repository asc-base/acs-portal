import "client-only";
import { NewsRepository } from "@/features/news/repositories/news.repository";
import { NewsService } from "@/features/news/service/news.service";
import { baseUrl } from "@/shared/config/api.client";

export const newsService = new NewsService(new NewsRepository(baseUrl));
