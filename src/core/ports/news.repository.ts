import { ApiResponse, Pageable } from "@/interface/response";
import { INews } from "../domain/news";

export interface INewsRepository {
  getNews(
    page: number,
    pageSize: number,
    title?: string,
  ): Promise<ApiResponse<Pageable<INews>>>;
  getNewsById(id: string): Promise<ApiResponse<INews>>;
  updateNews(id: string, news: Partial<INews>): Promise<ApiResponse<INews>>;
  deleteNews(id: string, token: string): Promise<ApiResponse<INews>>;
}
