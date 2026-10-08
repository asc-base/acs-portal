import { INewsRepository } from "@/features/news/ports/news.repository";
import {
  INews,
  INewsInformation,
} from "@/features/news/domain/news";
import { HttpHelper } from "@/shared/lib/http";
import { ApiResponse, Pageable } from "@/shared/types/response";
import { z } from "zod";
import {
  NewsBulletinsSchema,
  NewsBulletinSchema,
  NewsFeatureResponseSchema,
  NewsInformationsPageSchema,
  NewsPageSchema,
  NewsResponseSchema,
} from "@/features/news/schema/news";
import type { NewsBulletin } from "@/features/news/schema/news";

export class NewsRepository implements INewsRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

  constructor(baseUrl: string, http = new HttpHelper(baseUrl)) {
    this.baseUrl = baseUrl;
    this.http = http;
  }

  async createNews(data: FormData): Promise<ApiResponse<INews>> {
    const response = await this.http.post<ApiResponse<INews>>(`/v1/news`, data);
    return { ...response, data: NewsResponseSchema.parse(response.data) };
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
    return { ...response, data: NewsPageSchema.parse(response.data) };
  }

  async getNewsById(id: string): Promise<ApiResponse<INews | null>> {
    const response = await this.http.get<ApiResponse<INews | null>>(`/v1/news/${id}`);
    return {
      ...response,
      data: response.data === null ? null : NewsResponseSchema.parse(response.data),
    };
  }

  async updateNews(id: number, news: FormData): Promise<ApiResponse<INews>> {
    const response = await this.http.patch<ApiResponse<INews>>(
      `/v1/news/${id}`,
      news,
    );
    return { ...response, data: NewsResponseSchema.parse(response.data) };
  }

  async deleteNews(id: number): Promise<ApiResponse<INews>> {
    const response = await this.http.delete<ApiResponse<INews>>(
      `/v1/news/${id}`,
    );
    return { ...response, data: NewsResponseSchema.parse(response.data) };
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

    return { ...response, data: NewsInformationsPageSchema.parse(response.data) };
  }

  async upsertNewsInformation(
    data: FormData,
  ): Promise<ApiResponse<INewsInformation>> {
    const response = await this.http.put<ApiResponse<INewsInformation>>(
      `/v1/news/news-features/`,
      data,
    );
    return { ...response, data: NewsFeatureResponseSchema.parse(response.data) };
  }

  async getNewsInformationById(
    id: number,
  ): Promise<ApiResponse<INewsInformation>> {
    const response = await this.http.get<ApiResponse<INewsInformation>>(
      `/v1/news/news-features/${id}`,
    );
    return { ...response, data: NewsFeatureResponseSchema.parse(response.data) };
  }

  async getNewsBulletins(type: "HIGHLIGHT" | "ANNOUNCEMENT") {
    const response = await this.http.get<ApiResponse<unknown>>(
      `/v1/news/bulletins?type=${type}`,
    );
    return { ...response, data: NewsBulletinsSchema.parse(response.data) };
  }

  async setNewsBulletin(
    id: number,
    type: "HIGHLIGHT" | "ANNOUNCEMENT",
    enabled: boolean,
  ): Promise<ApiResponse<NewsBulletin | null>> {
    const path = `/v1/news/${id}/bulletins/${type}`;
    if (enabled) {
      const response = await this.http.put<ApiResponse<unknown>>(path, new FormData());
      return { ...response, data: NewsBulletinSchema.parse(response.data) };
    }
    const response = await this.http.delete<ApiResponse<unknown>>(path);
    return { ...response, data: z.null().parse(response.data) };
  }
}
