import { ApiResponse, Pageable } from "@/interface/response";
import { INews, INewsMedia } from "../domain/news";

export interface INewsRepository {
  getNews(
    page: number,
    pageSize: number,
    title?: string,
    category?: string,
  ): Promise<ApiResponse<Pageable<INews>>>;
  getNewsById(id: string): Promise<ApiResponse<INews>>;
  updateNews(id: string, news: Partial<INews>): Promise<ApiResponse<INews>>;
  deleteNews(id: string, token: string): Promise<ApiResponse<INews>>;
  getNewsMedias(type: string,page: number,pageSize: number,): Promise<ApiResponse<INewsMedia[]>>;
}
