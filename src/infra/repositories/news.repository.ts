import { INewsRepository } from "@/core/ports/news.repository";
import {
  INews,
  INewsInformation,
  IUpsertNewsInformation,
} from "@/core/domain/news";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class NewsRepository implements INewsRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async createNews(data: FormData): Promise<ApiResponse<INews>> {
    const response = await this.http.post<ApiResponse<INews>>(`/v1/news`, data);
    return response;
  }

  async getNews(
    page: number,
    pageSize: number,
    title?: string,
    category?: string,
  ): Promise<ApiResponse<Pageable<INews>>> {
    let url = `/v1/news?page=${page}&pageSize=${pageSize}&category=${encodeURIComponent(category || "")}`;

    if (title && title !== "") {
      url += `&title=${encodeURIComponent(title)}`;
    }

    const response = await this.http.get<ApiResponse<Pageable<INews>>>(url);
    return response;
  }

  async getNewsById(id: string): Promise<ApiResponse<INews>> {
    const response = await this.http.get<ApiResponse<INews>>(`/v1/news/${id}`);
    return response;
  }

  async updateNews(
    id: string,
    news: Partial<INews>,
  ): Promise<ApiResponse<INews>> {
    const response = await this.http.put<ApiResponse<INews>>(
      `/v1/news/${id}`,
      news,
    );
    return response;
  }

  async deleteNews(id: string, token: string): Promise<ApiResponse<INews>> {
    const response = await this.http.delete<ApiResponse<INews>>(
      `/v1/news/${id}`,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response;
  }

  async getNewsInformations(
    type: string,
    page: number,
    pageSize: number,
  ): Promise<ApiResponse<INewsInformation[]>> {
    const response = await this.http.get<ApiResponse<INewsInformation[]>>(
      `/v1/news/news-media?type=${type}&page=${page}&pageSize=${pageSize}`,
    );
    return response;
  }

  async createNewsInformation(
    type: string,
    data: FormData,
  ): Promise<ApiResponse<INewsInformation>> {
    const response = await this.http.post<ApiResponse<INewsInformation>>(
      `/v1/news/news-media/${type}`,
      data,
    );
    return response;
  }

  async upsertNewsInformation(
    data: FormData,
  ): Promise<ApiResponse<IUpsertNewsInformation>> {
    const response = await this.http.put<ApiResponse<IUpsertNewsInformation>>(
      `/v1/news/news-media/`,
      data,
    );
    return response;
  }
}
