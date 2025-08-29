import { Pageable } from "@/interface/response";
import { INews } from "../domain/news";
import { INewsRepository } from "../ports/news.repository";
export class NewsService {
  constructor(private newsRepository: INewsRepository) {}

  async getNews(page: number, pageSize: number): Promise<Pageable<INews>> {
    const response = await this.newsRepository.getNews(page, pageSize);
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
}
