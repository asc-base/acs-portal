import "server-only";
import { NewsRepository } from "@/features/news/repositories/news.repository";
import { NewsService } from "@/features/news/service/news.service";
import { createServerHttp } from "@/shared/lib/http.server";

export async function createNewsServerService() {
  const { baseUrl, http } = await createServerHttp();
  return new NewsService(new NewsRepository(baseUrl, http));
}
