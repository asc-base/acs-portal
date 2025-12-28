import { ICurriculumRepository } from "@/core/ports/curriculum.repository";
import { ICurriculum, QueryCurriculum } from "@/core/domain/curriculum";
import { Pageable } from "@/interface/response";
import { HttpHelper } from "@/lib/http";
import { ApiResponse } from "@/interface/response";

export class CurriculumRepository implements ICurriculumRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getCurriculum(
    query: QueryCurriculum,
  ): Promise<ApiResponse<Pageable<ICurriculum>>> {
    const searchParams = new URLSearchParams({
      page: query.page?.toString() || "1",
      pageSize: query.pageSize?.toString() || "10",
    });
    if (query.search) {
      searchParams.append("search", query.search);
    }
    if (query.sortBy) {
      searchParams.append("sortBy", query.sortBy);
    }

    if (query.sortOrder) {
      searchParams.append("sortOrder", query.sortOrder);
    }

    const url = `/v1/curriculum?${searchParams.toString()}`;

    const response =
      await this.http.get<ApiResponse<Pageable<ICurriculum>>>(url);
    return response;
  }

  async getCurriculumById(id: number): Promise<ApiResponse<ICurriculum> | null> {
    const url = `/v1/curriculum/${id}`;
    const response = await this.http.get<ApiResponse<ICurriculum>>(url);
    return response;
  }
  
  async createCurriculum(data: FormData): Promise<ApiResponse<ICurriculum>> {
    const response = await this.http.post<ApiResponse<ICurriculum>>(
      `/v1/curriculum/`,data
    );
    return response;
  }
}
