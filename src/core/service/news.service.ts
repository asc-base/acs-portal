import { Pageable } from "@/interface/response";
import { INews, ICreateNews , IUpdateNews , INewsInformation } from "../domain/news";
import { INewsRepository } from "../ports/news.repository";
export class NewsService {
  constructor(private readonly newsRepository: INewsRepository) { }

  async createNews(data: ICreateNews, image: File): Promise<INews> {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("detail", data.detail);
    formData.append("tagID", String(data.tagID));
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
    tagID?: number,
    orderBy?:string,
    sortBy?:string,
    search?: string,
  ): Promise<Pageable<INews>> {
    const response = await this.newsRepository.getNews(
      page,
      pageSize,
      tagID,
      orderBy,
      sortBy,
      search,
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
    page: number,
    pageSize: number,
    tagId?: number,
    orderBy?:string,
    sortBy?:string,
  ): Promise<Pageable<INewsInformation>> {
    const response = await this.newsRepository.getNewsInformations(
      page,
      pageSize,
      tagId,
      orderBy,
      sortBy,
    );
    return response.data;
  }

  async upsertNewsInformation(data: FormData): Promise<INewsInformation> {
    const response = await this.newsRepository.upsertNewsInformation(data);
    return response.data;
  }

  async getNewsInformationById(id: number): Promise<INewsInformation> {
    const response = await this.newsRepository.getNewsInformationById(id);
    return response.data;
  }

  async deleteNews(id: number):Promise<INews> {
    const response = await this.newsRepository.deleteNews(id)
    return response.data;
  }
}
