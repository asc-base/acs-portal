import { INewsRepository } from "@/core/ports/news.repository";
import { INews, INewsInformation } from "@/core/domain/news";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class NewsRepository implements INewsRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

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
    tagID?: number,
    orderBy?: string,
    sortBy?: string,
    search?: string,
    searchBy?: string,
  ): Promise<ApiResponse<Pageable<INews>>> {
    let url = `/v1/news/?page=${page}&pageSize=${pageSize}`;

    if (tagID && tagID !== null) {
      url += `&tagID=${encodeURIComponent(tagID)}`;
    }

    if (orderBy && orderBy !== "") {
      url += `&orderBy=${encodeURIComponent(orderBy)}`;
    }

    if (sortBy && sortBy !== "") {
      url += `&sortBy=${encodeURIComponent(sortBy)}`;
    }

    if (search && search !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (searchBy && searchBy !== "") {
      url += `&searchBy=${encodeURIComponent(searchBy)}`;
    }

    const response = await this.http.get<ApiResponse<Pageable<INews>>>(url);
    return response;
  }

  async getNewsById(id: string): Promise<ApiResponse<INews>> {
    const response = await this.http.get<ApiResponse<INews>>(`/v1/news/${id}`);
    return response;
  }

  async updateNews(id: number, news: FormData): Promise<ApiResponse<INews>> {
    const response = await this.http.patch<ApiResponse<INews>>(
      `/v1/news/${id}`,
      news,
    );
    return response;
  }

  async deleteNews(id: number): Promise<ApiResponse<INews>> {
    const response = await this.http.delete<ApiResponse<INews>>(
      `/v1/news/${id}`,
    );
    return response;
  }

  async getNewsInformations(
    page: number,
    pageSize: number,
    tagId?: number,
    orderBy?: string,
    sortBy?: string,
  ): Promise<ApiResponse<Pageable<INewsInformation>>> {
    let url = `/v1/news/news-features/?tagID=${tagId}&page=${page}&pageSize=${pageSize}`;

    if (tagId && tagId !== null) {
      url += `&tagID=${encodeURIComponent(tagId)}`;
    }

    if (orderBy && orderBy !== "") {
      url += `&orderBy=${encodeURIComponent(orderBy)}`;
    }

    if (sortBy && sortBy !== "") {
      url += `&sortBy=${encodeURIComponent(sortBy)}`;
    }

    const response =
      await this.http.get<ApiResponse<Pageable<INewsInformation>>>(url);

    return response;
  }

  async upsertNewsInformation(
    data: FormData,
  ): Promise<ApiResponse<INewsInformation>> {
    const response = await this.http.put<ApiResponse<INewsInformation>>(
      `/v1/news/news-features/`,
      data,
    );
    return response;
  }

  async getNewsInformationById(
    id: number,
  ): Promise<ApiResponse<INewsInformation>> {
    const response = await this.http.get<ApiResponse<INewsInformation>>(
      `/v1/news/news-features/${id}`,
    );
    return response;
  }
}
