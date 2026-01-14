import { ApiResponse, Pageable } from "@/interface/response";
import {
  INews,
  INewsInformation,
  IUpsertNewsInformation,
} from "../domain/news";

export interface INewsRepository {
  createNews(data: FormData): Promise<ApiResponse<INews>>;
  getNews(
    page: number,
    pageSize: number,
    title?: string,
    category?: string,
  ): Promise<ApiResponse<Pageable<INews>>>;
  getNewsById(id: string): Promise<ApiResponse<INews>>;
  updateNews(id: string, news: Partial<INews>): Promise<ApiResponse<INews>>;
  deleteNews(id: string, token: string): Promise<ApiResponse<INews>>;
  getNewsInformations(
    type: string,
    page: number,
    pageSize: number,
  ): Promise<ApiResponse<INewsInformation[]>>;
  createNewsInformation(
    type: string,
    data: FormData,
  ): Promise<ApiResponse<INewsInformation>>;
  upsertNewsInformation(
    data: FormData,
  ): Promise<ApiResponse<IUpsertNewsInformation>>;
}
