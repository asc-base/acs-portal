import { Pageable } from "@/interface/response";
import { INews } from "../domain/news";
import { INewsRepository } from "../ports/news.repository";
import { INewsMedia } from "../domain/news";
export class NewsService {
  constructor(private newsRepository: INewsRepository) {}

  async getNews(
    page: number,
    pageSize: number,
    title?: string,
    category?: string,
  ): Promise<Pageable<INews>> {
    const response = await this.newsRepository.getNews(
      page,
      pageSize,
      title,
      category,
    );
    return response.data;
  }

  async getNewsById(id: string): Promise<INews> {
    const response = await this.newsRepository.getNewsById(id);
    return response.data;
  }

  async updateNews(id: string, news: Partial<INews>): Promise<INews> {
    const response = await this.newsRepository.updateNews(id, news);
    return response.data;
  }

  async getNewsMedias(
    type: string,
    page: number,
    pageSize: number,
  ): Promise<INewsMedia[]> {
    const response = await this.newsRepository.getNewsMedias(
      type,
      page,
      pageSize,
    );
    return response.data;
  }

  async createNewsMedia(type: string, data: FormData): Promise<INewsMedia> {
    const response = await this.newsRepository.createNewsMedia(
      type,
      data
    );
    return response.data;
  }
}
