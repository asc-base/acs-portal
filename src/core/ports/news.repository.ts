import { ApiResponse, Pageable } from "@/interface/response";
import { INews } from "../domain/news";

export interface INewsRepository {
  getNews(
    page: number,
    pageSize: number,
    title?: string,
  ): Promise<ApiResponse<Pageable<INews>>>;
}
