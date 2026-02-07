import { ApiResponse, Pageable } from "@/interface/response";
import { INews, INewsInformation} from "../domain/news";

export interface INewsRepository {
  createNews(data: FormData): Promise<ApiResponse<INews>>;
  getNews(
    page: number,
    pageSize: number,
    title?: string,
    category?: string,
  ): Promise<ApiResponse<Pageable<INews>>>;
  getNewsById(id: string): Promise<ApiResponse<INews>>;
  updateNews(id: number, news: FormData): Promise<ApiResponse<INews>>;
  deleteNews(id: number): Promise<ApiResponse<INews>>;
  getNewsInformations(
    type: string,
    page: number,
    pageSize: number,
  ): Promise<ApiResponse<INewsInformation[]>>;
  upsertNewsInformation(data: FormData): Promise<ApiResponse<INewsInformation>>;
  getNewsInformationById(id: number): Promise<ApiResponse<INewsInformation>>;
}
