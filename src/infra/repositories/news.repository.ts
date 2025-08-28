import { INewsRepository } from "@/core/ports/news.repository";
import { INews } from "@/core/domain/news";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class NewsRepository implements INewsRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getNews(
    page: number,
    pageSize: number,
  ): Promise<ApiResponse<Pageable<INews>>> {
    const response = await this.http.get<ApiResponse<Pageable<INews>>>(
      `/v1/news?page=${page}&pageSize=${pageSize}`,
    );
    return response;
  }
}
