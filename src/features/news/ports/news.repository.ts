import { ApiResponse, Pageable } from "@/shared/types/response";
import { INews } from "@/features/news/domain/news";
import type { NewsBulletin } from "@/features/news/schema/news";

export interface INewsRepository {
  createNews(data: FormData): Promise<ApiResponse<INews>>;
  getNews(
    page: number,
    pageSize: number,
    newsCategoryId?: number,
    orderBy?: string,
    sortBy?: string,
    search?: string,
    searchBy?: string,
  ): Promise<ApiResponse<Pageable<INews>>>;
  getNewsById(id: string): Promise<ApiResponse<INews | null>>;
  updateNews(id: number, news: FormData): Promise<ApiResponse<INews>>;
  deleteNews(id: number): Promise<ApiResponse<INews>>;
  getNewsBulletins(type: "HIGHLIGHT" | "ANNOUNCEMENT"): Promise<ApiResponse<NewsBulletin[]>>;
  setNewsBulletin(id: number, type: "HIGHLIGHT" | "ANNOUNCEMENT", enabled: boolean): Promise<ApiResponse<NewsBulletin | null>>;
}
