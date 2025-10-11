import { ICurriculumRepository } from "@/core/ports/curriculum.repository";
import { ICurriculum } from "@/core/domain/curriculum";
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
    page: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
  ): Promise<ApiResponse<Pageable<ICurriculum>>> {
    const url =
      `/v1/curriculum?page=${page}&pageSize=${pageSize}` +
      (sortBy ? `&sortBy=${sortBy}` : "") +
      (sortOrder ? `&sortOrder=${sortOrder}` : "");

    const response =
      await this.http.get<ApiResponse<Pageable<ICurriculum>>>(url);
    return response;
  }
}
