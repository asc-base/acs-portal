import { Pageable } from "@/interface/response";
import { INews } from "../domain/news";
import { INewsRepository } from "../ports/news.repository";
import { INewsInformation } from "../domain/news";
export class NewsService {
  constructor(private newsRepository: INewsRepository) {}

  async createNews(data : FormData) : Promise<INews> {
    const response = await this.newsRepository.createNews(data);
    return response.data;
  }

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

  async getNewsInformations(
    type: string,
    page: number,
    pageSize: number,
  ): Promise<INewsInformation[]> {
    const response = await this.newsRepository.getNewsInformations(
      type,
      page,
      pageSize,
    );
    return response.data;
  }

  async createNewsInformation(type:string,data:FormData ):  Promise<INewsInformation> {     
    const response = await this.newsRepository.createNewsInformation(type,data);
      return response.data;   
  }
}
