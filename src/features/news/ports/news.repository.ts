import { ApiResponse, Pageable } from "@/shared/types/response";
import { INews, INewsInformation } from "@/features/news/domain/news";
import type { NewsBulletin } from "@/features/news/schema/news";

export interface INewsRepository {
  createNews(data: FormData): Promise<ApiResponse<INews>>;
  getNews(
    page: number,
    pageSize: number,
    tagID?: number,
    orderBy?: string,
    sortBy?: string,
    search?: string,
    searchBy?: string,
  ): Promise<ApiResponse<Pageable<INews>>>;
  getNewsById(id: string): Promise<ApiResponse<INews | null>>;
  updateNews(id: number, news: FormData): Promise<ApiResponse<INews>>;
  deleteNews(id: number): Promise<ApiResponse<INews>>;
  getNewsInformations(
    page: number,
    pageSize: number,
    tagId?: number,
    orderBy?: string,
    sortBy?: string,
  ): Promise<ApiResponse<Pageable<INewsInformation>>>;
  upsertNewsInformation(data: FormData): Promise<ApiResponse<INewsInformation>>;
  getNewsInformationById(id: number): Promise<ApiResponse<INewsInformation>>;
  getNewsBulletins(type: "HIGHLIGHT" | "ANNOUNCEMENT"): Promise<ApiResponse<NewsBulletin[]>>;
  setNewsBulletin(id: number, type: "HIGHLIGHT" | "ANNOUNCEMENT", enabled: boolean): Promise<ApiResponse<NewsBulletin | null>>;
}
