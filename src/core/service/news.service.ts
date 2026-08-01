import { Pageable } from "@/interface/response";
import {
  INews,
  ICreateNews,
  IUpdateNews,
  INewsInformation,
  IUpsertNewsFeature,
} from "../domain/news";
import { INewsRepository } from "../ports/news.repository";
export class NewsService {
  constructor(private readonly newsRepository: INewsRepository) {}

async createNews(data: ICreateNews): Promise<INews> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await this.newsRepository.createNews(formData);
  return response.data;
}

  async getNews(
    page: number,
    pageSize: number,
    tagID?: number,
    orderBy: string = "startDate",
    sortBy: string = "desc",
    search?: string,
    searchBy?: string,
  ): Promise<Pageable<INews>> {
    const response = await this.newsRepository.getNews(
      page,
      pageSize,
      tagID,
      orderBy,
      sortBy,
      search,
      searchBy,
    );
    return response.data;
  }

  async getNewsById(id: string): Promise<INews> {
    const response = await this.newsRepository.getNewsById(id);
    return response.data;
  }

  async updateNews(
    id: number,
    data: IUpdateNews,
  ) {
    try {
      const formData = new FormData();
     Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
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
    orderBy?: string,
    sortBy?: string,
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

  async upsertNewsInformation(data: IUpsertNewsFeature): Promise<INewsInformation> {

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await this.newsRepository.upsertNewsInformation(formData);
    return response.data;
  }

  async getNewsInformationById(id: number): Promise<INewsInformation> {
    const response = await this.newsRepository.getNewsInformationById(id);
    return response.data;
  }

  async deleteNews(id: number): Promise<INews> {
    const response = await this.newsRepository.deleteNews(id);
    return response.data;
  }
}
