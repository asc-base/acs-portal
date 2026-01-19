import { Pageable } from "@/interface/response";
import { INews, ICreateNews , IUpdateNews , INewsInformation } from "../domain/news";
import { INewsRepository } from "../ports/news.repository";
export class NewsService {
  constructor(private newsRepository: INewsRepository) {}

  async createNews(data: ICreateNews, image: File): Promise<INews> {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("detail", data.detail);
    formData.append("categoryId", String(data.categoryId));
    formData.append("startDate", new Date(data.startDate).toISOString());

    if (data.dueDate) {
      formData.append("dueDate", new Date(data.dueDate).toISOString());
    }

    if (image) {
      formData.append("image", image);
    }
    const response = await this.newsRepository.createNews(formData);
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

  async updateNews(id: number, data:  IUpdateNews , image : File | null) {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() ?? "");
      });

      if (image) {
      formData.append("image", image);
    }

    const response = await this.newsRepository.updateNews(id, formData);
    return response.data;
    } catch (error) {
      console.error("Failed to update news:", error);
      return null;
    }
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

  async upsertNewsInformation(data: FormData): Promise<INewsInformation> {
    const response = await this.newsRepository.upsertNewsInformation(data);
    return response.data;
  }
}
