import { Pageable } from "@/interface/response";
import { INews } from "../domain/news";
import { INewsRepository } from "../ports/news.repository";
export class NewsService {
  constructor(private newsRepository: INewsRepository) {}

  async getNews(page: number, pageSize: number): Promise<Pageable<INews>> {
    const response = await this.newsRepository.getNews(page, pageSize);
    return response.data;
  }
}
