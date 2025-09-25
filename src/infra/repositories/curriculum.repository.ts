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

  async getCurriculum(): Promise<ApiResponse<Pageable<ICurriculum>>> {
    const response = await this.http.get<ApiResponse<Pageable<ICurriculum>>>(`/v1/curriculum`);
    return response;
  }
}
